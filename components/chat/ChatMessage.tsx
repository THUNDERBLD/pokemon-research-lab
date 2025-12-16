import { cn } from '@/lib/utils/cn';
import { ChatMessage as ChatMessageType } from '@/store/uiStore';

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.type === 'user';

  return (
    <div
      className={cn(
        'flex gap-3 mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}

      {/* Message Content */}
      <div
        className={cn(
          'max-w-xs px-4 py-2 rounded-lg',
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-900'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        <p
          className={cn(
            'text-xs mt-1',
            isUser ? 'text-blue-100' : 'text-gray-500'
          )}
        >
          {new Date(message.timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="shrink-0 w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}