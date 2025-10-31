import type { PerformanceDataPoint } from "../types";

interface Props {
  data: PerformanceDataPoint[] | null;
}

export default function SummaryStats({ data }: Props) {
  if (!data || data.length === 0) {
    return null;
  }

  const portfolioValues = data
    .map((d) => Number(d.netPortfolio))
    .filter((v) => Number.isFinite(v));

  if (portfolioValues.length === 0) {
    return null;
  }

  const currentValue = portfolioValues[portfolioValues.length - 1];
  const startValue = portfolioValues[0];
  const maxValue = Math.max(...portfolioValues);
  const minValue = Math.min(...portfolioValues);
  const avgValue = portfolioValues.reduce((a, b) => a + b, 0) / portfolioValues.length;
  
  const totalReturn = ((currentValue - startValue) / startValue) * 100;
  const returnClass = totalReturn >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div className="bg-white shadow-sm rounded-3xl p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-gray-700">Portfolio Summary</h2>
        <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {portfolioValues.length} data points
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200">
          <div className="text-xs font-medium text-blue-700 mb-1">Current Value</div>
          <div className="text-2xl font-bold text-blue-900">
            ${currentValue.toFixed(2)}
          </div>
          <div className={`text-sm font-medium mt-1 ${returnClass}`}>
            {totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(2)}%
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200">
          <div className="text-xs font-medium text-purple-700 mb-1">Average Value</div>
          <div className="text-2xl font-bold text-purple-900">
            ${avgValue.toFixed(2)}
          </div>
          <div className="text-xs text-purple-600 mt-1">
            Across all periods
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl p-4 border border-green-200">
          <div className="text-xs font-medium text-green-700 mb-1">Peak Value</div>
          <div className="text-2xl font-bold text-green-900">
            ${maxValue.toFixed(2)}
          </div>
          <div className="text-xs text-green-600 mt-1">
            Maximum achieved
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-xl p-4 border border-orange-200">
          <div className="text-xs font-medium text-orange-700 mb-1">Low Value</div>
          <div className="text-2xl font-bold text-orange-900">
            ${minValue.toFixed(2)}
          </div>
          <div className="text-xs text-orange-600 mt-1">
            Minimum recorded
          </div>
        </div>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-xs text-gray-600">
          💡 <span className="font-medium">What you're seeing:</span> This dashboard tracks how the AI trading agent's portfolio value changes over time. The agent autonomously makes trading decisions based on market analysis.
        </div>
      </div>
    </div>
  );
}
