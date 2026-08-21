export type QueueStatus = 'pending' | 'downloading' | 'uploading' | 'completed' | 'error';

export interface TrimConfig {
  start: string;
  end: string;
}

export interface QueueConfig {
  useYt: boolean;
  ytTrim?: TrimConfig;
  useVk: boolean;
  vkTrim?: TrimConfig;
  useTg: boolean;
  tgTrim?: TrimConfig;
  autoDelete: boolean;
}

export interface QueueItem {
  id: string;
  url: string;
  title: string;
  config: QueueConfig;
  status: QueueStatus;
  progressPercent?: number;
  statusMessage?: string;
  errorMessage?: string;
}