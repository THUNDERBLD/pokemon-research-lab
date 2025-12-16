'use client';

import { useEffect, useRef, useState } from 'react';
import { useUiStore } from '@/store/uiStore';
import { useCommandParser } from '@/hooks/useCommandParser';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { COMMAND_EXAMPLES } from '@/lib/constants';

export function ChatOverlay() {
  const { isChatOpen, toggleChat, chatMessages, addChatMessage, clearChatMessages } = useUiStore();
  const { executeFromString, isExecuting } = useCommandParser();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showHelp, setShowHelp] = useState(false);
  // const messageIdRef = useRef(Date.now());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Show welcome message on first open
  useEffect(() => {
    if (isChatOpen && chatMessages.length === 0) {
      addChatMessage({
        id: Date.now().toString(),
        type: 'system',
        content: 'Hi! I can help you edit Pokemon data using natural language commands. Try typing a command or click "Show Examples" below.',
        timestamp: new Date(),
      });
    }
  }, [isChatOpen]);

  const handleSendMessage = async (message: string) => {
    // Add user message
    addChatMessage({
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Execute command
    const result = await executeFromString(message);

    // Add system response
    addChatMessage({
      id: (Date.now() + 1).toString(),
      type: 'system',
      content: result.success
        ? `✓ ${result.message}`
        : `✗ ${result.message}`,
      timestamp: new Date(),
    });
  };

  const handleShowExamples = () => {
    setShowHelp(!showHelp);
  };

  const handleUseExample = (example: string) => {
    handleSendMessage(example);
    setShowHelp(false);
  };

  const handleClearChat = () => {
    clearChatMessages();
    addChatMessage({
      id: Date.now().toString(),
      type: 'system',
      content: 'Chat cleared. Ready for new commands!',
      timestamp: new Date(),
    });
  };

  if (!isChatOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 z-50 flex items-center justify-center"
        title="Open AI Assistant"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          <h3 className="font-semibold">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleClearChat}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
            title="Clear chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-blue-700 rounded transition-colors"
            title="Close chat"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {chatMessages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Help Section */}
      {showHelp && (
        <div className="px-4 py-3 bg-blue-50 border-t border-blue-200 max-h-48 overflow-y-auto">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Example Commands:</h4>
          <div className="space-y-2">
            {COMMAND_EXAMPLES.map((example, index) => (
              <button
                key={index}
                onClick={() => handleUseExample(example.command)}
                className="w-full text-left p-2 bg-white rounded border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-xs"
              >
                <p className="font-mono text-blue-900">{example.command}</p>
                <p className="text-gray-600 mt-1">{example.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
        <div className="mb-2">
          <button
            onClick={handleShowExamples}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {showHelp ? '− Hide Examples' : '+ Show Examples'}
          </button>
        </div>
        <ChatInput
          onSend={handleSendMessage}
          isProcessing={isExecuting}
          placeholder="e.g., set hp to 100 for all pokemon of type 'grass'"
        />
      </div>
    </div>
  );
}