import React from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  MessageSquare,
  Trash2,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Volume2,
  Clock
} from 'lucide-react';
import { useChat } from '../context/ChatContext.jsx';

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const {
    conversations,
    conversationId,
    selectConversation,
    startNewConversation,
    deleteConversation,
    clearAllConversations,
    systemHealth
  } = useChat();

  const isGnaniConfigured = Boolean(
    systemHealth?.services?.gnaniPrisma?.configured &&
    systemHealth?.services?.gnaniTimbre?.configured
  );

  return (
    <aside
      className={`h-full bg-white border-r border-purple-100 flex flex-col transition-all duration-300 ease-in-out relative ${
        isCollapsed ? 'w-20' : 'w-72 lg:w-80'
      }`}
    >
      {/* Top Header */}
      <div className="p-4 border-b border-purple-100 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg text-gray-900 tracking-tight">
              Conversations
            </span>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
              {conversations.length}
            </span>
          </div>
        )}

        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-purple-50 transition-colors mx-auto"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5 text-purple-600" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* New Conversation Button */}
      <div className="p-3">
        <button
          onClick={startNewConversation}
          className={`w-full flex items-center justify-center gap-2.5 py-3 px-3.5 rounded-xl font-medium text-white bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 shadow-sm shadow-purple-500/20 transition-all hover:shadow group ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="Start New Conversation"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          {!isCollapsed && <span className="text-sm font-semibold">New Conversation</span>}
        </button>
      </div>

      {/* Conversation List / History */}
      <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
        {!isCollapsed && (
          <div className="px-3 py-1 flex items-center justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span>Recent</span>
            {conversations.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all conversation history?')) {
                    clearAllConversations();
                  }
                }}
                className="text-gray-400 hover:text-red-500 flex items-center gap-1 normal-case font-normal text-[11px]"
                title="Clear all conversations"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear All</span>
              </button>
            )}
          </div>
        )}

        {conversations.length === 0 ? (
          <div className="text-center py-8 px-4 text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto text-purple-200 mb-2" />
            {!isCollapsed && (
              <p className="text-xs text-gray-500">
                No past conversations yet. Speak or type to begin!
              </p>
            )}
          </div>
        ) : (
          conversations.map((conv) => {
            const isActive = conversationId === conv.conversationId;
            return (
              <div
                key={conv.conversationId}
                className={`group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-violet-50 text-violet-900 font-medium border border-violet-200/70'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => selectConversation(conv.conversationId)}
              >
                <div className="flex items-center gap-2.5 truncate flex-1 min-w-0">
                  <MessageSquare
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-600'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate text-xs sm:text-sm">
                      {conv.title || 'Untitled Conversation'}
                    </span>
                  )}
                </div>

                {!isCollapsed && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.conversationId);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-opacity"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-3 border-t border-purple-100 space-y-1 bg-gray-50/50">
        <Link
          to="/settings"
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm text-gray-600 hover:text-gray-900 hover:bg-white transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-gray-500 shrink-0" />
          {!isCollapsed && <span>Settings & API</span>}
        </Link>

        {!isCollapsed && (
          <div className="px-3 pt-2 text-[11px] text-gray-400 flex items-center justify-between border-t border-gray-100 mt-2">
            <span>Powered by Gnani AI</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isGnaniConfigured ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
              title={isGnaniConfigured ? 'Prisma & Timbre Online' : 'Credentials pending'}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
