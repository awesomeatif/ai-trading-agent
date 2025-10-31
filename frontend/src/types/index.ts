export interface PerformanceDataPoint {
  id: string;
  modelId: string;
  netPortfolio: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  model?: {
    name: string;
  };
}

export interface ToolCall {
  id: string;
  invocationId: string;
  toolCallType: 'CREATE_POSITION' | 'CLOSE_POSITION';
  metadata: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface Invocation {
  id: string;
  modelId: string;
  response: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  model?: {
    name: string;
  };
  toolCalls?: ToolCall[];
}

export interface ChartDataPoint {
  t: number;
  [key: string]: number;
}
