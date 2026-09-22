"use client"

import dynamic from "next/dynamic"

const AreaChart = dynamic(() => import("recharts").then((m) => m.AreaChart), { ssr: false })
const Area = dynamic(() => import("recharts").then((m) => m.Area), { ssr: false })
const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), { ssr: false })
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false })
const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), { ssr: false })
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), { ssr: false })
const LineChart = dynamic(() => import("recharts").then((m) => m.LineChart), { ssr: false })
const Line = dynamic(() => import("recharts").then((m) => m.Line), { ssr: false })
const CartesianGrid = dynamic(() => import("recharts").then((m) => m.CartesianGrid), { ssr: false })
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false })
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false })
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false })
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), { ssr: false })
const ResponsiveContainer = dynamic(() => import("recharts").then((m) => m.ResponsiveContainer), { ssr: false })

export {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  ResponsiveContainer,
}
