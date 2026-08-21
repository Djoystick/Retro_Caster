import React from 'react';
import { Package, Play, Square, X, Trash2 } from 'lucide-react';
import { QueueItem } from '../types/queue';

interface QueueViewProps {
  queue: QueueItem[];
  isQueueRunning: boolean;
  onStartQueue: () => void;
  onStopQueue: () => void;
  onRemoveItem: (id: string) => void;
}

export function QueueView({ queue, isQueueRunning, onStartQueue, onStopQueue, onRemoveItem }: QueueViewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col">
      <h2 className="text-pixel-cyan text-xl mb-4 uppercase tracking-widest border-b border-pixel-blue/30 pb-2 flex items-center gap-2">
        <Package size={20} />
        Очередь задач
      </h2>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {queue.length === 0 ? (
          <div className="text-pixel-light-dim text-center mt-10 text-xs">Очередь пуста</div>
        ) : (
          queue.map((item, index) => (
            <div key={item.id} className="p-3 bg-pixel-darkblue/30 border border-pixel-blue/40 rounded flex items-center justify-between">
              <div className="flex-1 overflow-hidden pr-4">
                <div className="text-pixel-light text-sm truncate">{index + 1}. {item.title || item.url}</div>
                <div className="flex gap-3 mt-1 text-[9px] text-pixel-light-dim">
                  <span>YT: {item.config.useYt ? 'Да' : 'Нет'}</span>
                  <span>VK: {item.config.useVk ? 'Да' : 'Нет'}</span>
                  <span>TG: {item.config.useTg ? 'Да' : 'Нет'}</span>
                  <span className="text-pixel-amber">Статус: {item.status}</span>
                </div>
              </div>
              <button onClick={() => onRemoveItem(item.id)} className="text-pixel-red hover:text-white p-1 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-pixel-blue/30 flex justify-end gap-4 shrink-0">
        {isQueueRunning ? (
          <button onClick={onStopQueue} className="pixel-btn text-pixel-red border-pixel-red hover:bg-pixel-red/20 flex items-center gap-2">
            <Square size={14} /> ОСТАНОВИТЬ
          </button>
        ) : (
          <button onClick={onStartQueue} disabled={queue.length === 0 || queue.every(q => q.status === 'completed')} className="pixel-btn pixel-btn-success flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Play size={14} /> ЗАПУСТИТЬ ОЧЕРЕДЬ
          </button>
        )}
      </div>
    </div>
  );
}