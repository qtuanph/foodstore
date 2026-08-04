namespace FoodstoreApi.Usecase.Interfaces;

public interface IRedisService
{
    // Standard Key-Value Operations
    Task SetAsync<T>(string key, T value, TimeSpan? expiry = null, CancellationToken cancellationToken = default);
    Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default);
    Task RemoveAsync(string key, CancellationToken cancellationToken = default);

    // Token Blacklist & Session Revocation
    Task BlacklistTokenAsync(string tokenJti, TimeSpan expiry, CancellationToken cancellationToken = default);
    Task<bool> IsTokenBlacklistedAsync(string tokenJti, CancellationToken cancellationToken = default);

    // Realtime Leaderboard (Redis Sorted Sets)
    Task AddLeaderboardScoreAsync(string key, string memberId, double score, CancellationToken cancellationToken = default);
    Task<List<(string MemberId, double Score)>> GetTopLeaderboardAsync(string key, int count = 100, CancellationToken cancellationToken = default);
    Task<long?> GetLeaderboardRankAsync(string key, string memberId, CancellationToken cancellationToken = default);

    // Redis 8.10 Compact Hashes (HIMPORT) & Hash Operations
    Task HImportPrepareAsync(string schemaAlias, string[] fields, CancellationToken cancellationToken = default);
    Task HImportSetAsync(string key, string schemaAlias, string[] values, TimeSpan? expiry = null, CancellationToken cancellationToken = default);
    Task<Dictionary<string, string>?> GetCompactHashAsync(string key, string[] fields, CancellationToken cancellationToken = default);

    // Atomic Counters (High-concurrency stock & stats)
    Task<long> IncrementAsync(string key, long value = 1, CancellationToken cancellationToken = default);
    Task<long> DecrementAsync(string key, long value = 1, CancellationToken cancellationToken = default);
}
