using System.Text.Json;
using FoodstoreApi.Usecase.Interfaces;
using StackExchange.Redis;

namespace FoodstoreApi.Infrastructure.Caching;

public class RedisService : IRedisService
{
    private readonly IConnectionMultiplexer _redis;
    private readonly IDatabase _db;
    private static readonly JsonSerializerOptions JsonOptions = new JsonSerializerOptions
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public RedisService(IConnectionMultiplexer redis)
    {
        _redis = redis;
        _db = _redis.GetDatabase();
    }

    // ==========================================
    // Standard Key-Value Operations
    // ==========================================
    public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
    {
        var json = JsonSerializer.Serialize(value, JsonOptions);
        await _db.StringSetAsync(key, json, expiry);
    }

    public async Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        var value = await _db.StringGetAsync(key);
        if (value.IsNullOrEmpty) return default;

        return JsonSerializer.Deserialize<T>(value.ToString(), JsonOptions);
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        await _db.KeyDeleteAsync(key);
    }

    // ==========================================
    // Token Blacklist & Session Revocation
    // ==========================================
    public async Task BlacklistTokenAsync(string tokenJti, TimeSpan expiry, CancellationToken cancellationToken = default)
    {
        var key = $"auth:blacklist:{tokenJti}";
        await _db.StringSetAsync(key, "1", expiry);
    }

    public async Task<bool> IsTokenBlacklistedAsync(string tokenJti, CancellationToken cancellationToken = default)
    {
        var key = $"auth:blacklist:{tokenJti}";
        return await _db.KeyExistsAsync(key);
    }

    // ==========================================
    // Realtime Leaderboard (Redis Sorted Sets)
    // ==========================================
    public async Task AddLeaderboardScoreAsync(string key, string memberId, double score, CancellationToken cancellationToken = default)
    {
        await _db.SortedSetAddAsync(key, memberId, score);
    }

    public async Task<List<(string MemberId, double Score)>> GetTopLeaderboardAsync(string key, int count = 100, CancellationToken cancellationToken = default)
    {
        var entries = await _db.SortedSetRangeByRankWithScoresAsync(key, start: 0, stop: count - 1, order: Order.Descending);
        var result = new List<(string MemberId, double Score)>();

        foreach (var entry in entries)
        {
            if (!entry.Element.IsNullOrEmpty)
            {
                result.Add((entry.Element.ToString(), entry.Score));
            }
        }

        return result;
    }

    public async Task<long?> GetLeaderboardRankAsync(string key, string memberId, CancellationToken cancellationToken = default)
    {
        var rank = await _db.SortedSetRankAsync(key, memberId, Order.Descending);
        return rank.HasValue ? rank.Value + 1 : null;
    }

    // ==========================================
    // Redis 8.10 Compact Hashes (HIMPORT & Fallback)
    // ==========================================
    public async Task HImportPrepareAsync(string schemaAlias, string[] fields, CancellationToken cancellationToken = default)
    {
        try
        {
            var args = new List<object> { "PREPARE", schemaAlias };
            args.AddRange(fields);
            await _db.ExecuteAsync("HIMPORT", args.ToArray());
        }
        catch
        {
            // Fallback for non-compact hash environment
        }
    }

    public async Task HImportSetAsync(string key, string schemaAlias, string[] values, TimeSpan? expiry = null, CancellationToken cancellationToken = default)
    {
        try
        {
            var args = new List<object> { "SET", key, schemaAlias };
            args.AddRange(values);
            await _db.ExecuteAsync("HIMPORT", args.ToArray());

            if (expiry.HasValue)
            {
                await _db.KeyExpireAsync(key, expiry);
            }
        }
        catch
        {
            // Fallback: standard Hash
            var hashEntries = new List<HashEntry>();
            for (int i = 0; i < values.Length; i++)
            {
                hashEntries.Add(new HashEntry($"field_{i}", values[i]));
            }
            await _db.HashSetAsync(key, hashEntries.ToArray());
            if (expiry.HasValue) await _db.KeyExpireAsync(key, expiry);
        }
    }

    public async Task<Dictionary<string, string>?> GetCompactHashAsync(string key, string[] fields, CancellationToken cancellationToken = default)
    {
        var entries = await _db.HashGetAllAsync(key);
        if (entries.Length == 0) return null;

        var result = new Dictionary<string, string>();
        foreach (var entry in entries)
        {
            result[entry.Name.ToString()] = entry.Value.ToString();
        }
        return result;
    }

    // ==========================================
    // Atomic Counters (High-concurrency stock & stats)
    // ==========================================
    public async Task<long> IncrementAsync(string key, long value = 1, CancellationToken cancellationToken = default)
    {
        return await _db.StringIncrementAsync(key, value);
    }

    public async Task<long> DecrementAsync(string key, long value = 1, CancellationToken cancellationToken = default)
    {
        return await _db.StringDecrementAsync(key, value);
    }
}
