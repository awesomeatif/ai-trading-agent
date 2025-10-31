import { useEffect, useState } from "react";
import PerformanceChart from "./components/PerformanceChart";
import RecentInvocations from "./components/RecentInvocations";
import SummaryStats from "./components/SummaryStats";
import type { PerformanceDataPoint, Invocation } from "./types";

const BACKEND_URL = "http://localhost:3000";

function ChartSkeleton() {
  return (
    <div className="lg:col-span-2 bg-white shadow-sm rounded-3xl p-6 border border-gray-100">
      <div className="h-6 w-1/3 rounded-md bg-gray-200 animate-pulse mb-4" />
      <div className="w-full h-[56vh] rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 animate-pulse" />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="bg-white shadow-sm rounded-3xl p-6 border border-gray-100">
      <div className="h-6 w-1/2 rounded-md bg-gray-200 animate-pulse mb-4" />
      <div className="space-y-4 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-36 rounded bg-gray-200 animate-pulse" />
              <div className="h-3 w-24 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="h-3 w-full rounded bg-gray-200 animate-pulse mb-2" />
            <div className="h-3 w-5/6 rounded bg-gray-200 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const [performanceData, setPerformanceData] = useState<PerformanceDataPoint[] | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [invocationsData, setInvocationsData] = useState<Invocation[] | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const perfRes = await fetch(`${BACKEND_URL}/performance`);
        const perfData = await perfRes.json();
        setPerformanceData(perfData.data);
        setLastUpdated(perfData.lastUpdated);

        const invocRes = await fetch(`${BACKEND_URL}/invocations?limit=30`);
        const invocData = await invocRes.json();
        setInvocationsData(invocData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    }
    fetchData();
  }, []);

  const loading = !performanceData || !invocationsData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 flex flex-col items-center px-6 py-10 font-[system-ui]">
      <header className="w-full max-w-7xl mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <h1 className="text-4xl font-bold tracking-tight mb-2">🤖 AI Trading Agent Dashboard</h1>
          <p className="text-blue-100 text-base">
            Monitor your autonomous AI trading agent's performance, decisions, and portfolio value in real-time
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="font-semibold mb-1">📊 Live Performance</div>
              <div className="text-blue-100 text-xs">Track portfolio value changes over time</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="font-semibold mb-1">🧠 AI Decisions</div>
              <div className="text-blue-100 text-xs">View reasoning behind each trade</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
              <div className="font-semibold mb-1">📈 Trade History</div>
              <div className="text-blue-100 text-xs">Complete log of all trading actions</div>
            </div>
          </div>
        </div>
      </header>

      {loading && (
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <ChartSkeleton />
          <ListSkeleton />
        </div>
      )}

      {!loading && (
        <div className="w-full max-w-7xl space-y-8">
          {/* Summary Stats */}
          <SummaryStats data={performanceData} />
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 transition-all duration-500">
            <div className="lg:col-span-2 bg-white shadow-sm rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-medium mb-4 text-gray-700">Performance Metrics</h2>
              <PerformanceChart data={performanceData} />
            </div>

            <div className="bg-white shadow-sm rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <h2 className="text-xl font-medium mb-4 text-gray-700">Recent Invocations</h2>
              <RecentInvocations data={invocationsData} />
            </div>
          </div>
        </div>
      )}

      {lastUpdated && (
        <div className="mt-8 text-sm text-gray-500">
          Last updated:{" "}
          <span className="font-medium text-gray-700">{new Date(lastUpdated).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
