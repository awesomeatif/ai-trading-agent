import type { Invocation } from "../types";

type Props = {
  data: Invocation[] | null;
};

// Helper function to parse and format metadata
function formatMetadata(metadata: string): { symbol?: string; side?: string; price?: string; size?: string } {
  try {
    const parsed = JSON.parse(metadata);
    // Validate that parsed is an object
    if (typeof parsed !== 'object' || parsed === null) {
      return {};
    }
    return {
      symbol: typeof parsed.symbol === 'string' ? parsed.symbol : undefined,
      side: typeof parsed.side === 'string' ? parsed.side : undefined,
      price: typeof parsed.price === 'string' || typeof parsed.price === 'number' ? String(parsed.price) : undefined,
      size: typeof parsed.size === 'string' || typeof parsed.size === 'number' ? String(parsed.size) : undefined,
    };
  } catch {
    return {};
  }
}

// Helper to get human-readable action description
function getActionDescription(type: string, metadata: string): string {
  const parsed = formatMetadata(metadata);
  
  if (type === 'CREATE_POSITION') {
    const side = parsed.side || 'unknown';
    const symbol = parsed.symbol || 'unknown asset';
    return `${side === 'long' ? '📈 Opened Long Position' : '📉 Opened Short Position'} on ${symbol}`;
  } else if (type === 'CLOSE_POSITION') {
    return `✅ Closed Position`;
  }
  return type;
}

export default function RecentInvocations({ data }: Props) {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500 font-medium animate-pulse">
        Loading recent invocations...
      </div>
    );
  }

  const items = data.map((inv) => ({
    id: inv.id,
    modelName: inv.model?.name ?? "Unknown Model",
    createdAt: new Date(inv.createdAt),
    response: inv.response,
    toolCalls: (inv.toolCalls ?? []).map((tc) => ({
      type: tc.toolCallType,
      createdAt: tc.createdAt instanceof Date ? tc.createdAt : new Date(tc.createdAt),
      metadata: tc.metadata,
    })),
  }));

  return (
    <div className="h-[1800px] overflow-y-auto px-6 py-4 bg-gradient-to-b from-[#f9fafb] to-[#f0f2f5] text-[#111827] backdrop-blur-xl">
      <h2 className="text-2xl font-semibold mb-2 text-gray-900 tracking-tight">
        Recent Invocations
      </h2>
      <p className="text-xs text-gray-600 mb-4 p-2 bg-blue-50 rounded-lg border border-blue-200">
        🤖 <span className="font-medium">AI Decision Log:</span> Each entry shows when the AI agent was invoked, what trading actions it took, and its reasoning.
      </p>

      <div className="flex flex-col gap-6">
        {items.map((it) => (
          <details
            key={it.id}
            className="group rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-md shadow-sm hover:shadow-lg transition-all duration-300"
          >
            <summary className="flex justify-between items-center cursor-pointer select-none list-none p-4 sm:p-5">
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-gray-800 group-open:text-black">
                  {it.modelName}
                </span>
                <span className="text-xs text-gray-500">
                  {it.createdAt.toLocaleString()}
                </span>
              </div>
              <span className="text-gray-400 text-sm group-open:rotate-90 transform transition-transform duration-300">
                ▶
              </span>
            </summary>

            <div className="px-5 pb-5 border-t border-gray-100">
              {/* Tool Calls */}
              {it.toolCalls && it.toolCalls.length > 0 && (
                <div className="mb-4 mt-3">
                  <div className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span>🔧 Trading Actions</span>
                    <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {it.toolCalls.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {it.toolCalls.map((tc, idx) => {
                      const parsed = formatMetadata(tc.metadata);
                      const actionDesc = getActionDescription(tc.type, tc.metadata);
                      
                      return (
                        <div
                          key={idx}
                          className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 shadow-sm"
                        >
                          <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-gray-800">
                              {actionDesc}
                            </span>
                            <span className="text-xs text-gray-500">
                              {tc.createdAt.toLocaleTimeString()}
                            </span>
                          </div>
                          
                          {parsed.symbol && (
                            <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                              <div className="bg-white px-2 py-1 rounded border border-gray-200">
                                <span className="text-gray-500">Symbol:</span>{" "}
                                <span className="font-medium text-gray-800">{parsed.symbol}</span>
                              </div>
                              {parsed.side && (
                                <div className="bg-white px-2 py-1 rounded border border-gray-200">
                                  <span className="text-gray-500">Side:</span>{" "}
                                  <span className={`font-medium ${parsed.side === 'long' ? 'text-green-700' : 'text-red-700'}`}>
                                    {parsed.side}
                                  </span>
                                </div>
                              )}
                              {parsed.price && (
                                <div className="bg-white px-2 py-1 rounded border border-gray-200">
                                  <span className="text-gray-500">Price:</span>{" "}
                                  <span className="font-medium text-gray-800">${parsed.price}</span>
                                </div>
                              )}
                              {parsed.size && (
                                <div className="bg-white px-2 py-1 rounded border border-gray-200">
                                  <span className="text-gray-500">Size:</span>{" "}
                                  <span className="font-medium text-gray-800">{parsed.size}</span>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <details className="text-xs">
                            <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                              View raw metadata
                            </summary>
                            <pre className="mt-2 text-[11px] text-gray-600 font-mono whitespace-pre-wrap leading-snug bg-white p-2 rounded border border-gray-200">
                              {tc.metadata}
                            </pre>
                          </details>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Response */}
              <div>
                <div className="font-semibold text-gray-800 mb-2">💭 AI Reasoning</div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 shadow-sm">
                  <pre className="text-[13px] text-gray-700 font-mono whitespace-pre-wrap leading-snug">
                    {it.response}
                  </pre>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
