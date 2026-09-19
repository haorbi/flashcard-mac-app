import React from 'react';
import { Layers, List, BarChart3, Upload, Plus, Moon, Sun, Volume2, VolumeX, Sparkles, Brain, ArrowLeftRight } from 'lucide-react';

export default function TitleBar({
  activeView,
  setActiveView,
  activeDeck,
  darkMode,
  setDarkMode,
  autoAudio,
  setAutoAudio,
  cardOrder,
  setCardOrder,
  dueCount,
  onOpenImportExport,
  onOpenAddCard
}) {
  return (
    <header className="mac-titlebar flex items-center justify-between px-4 py-3 select-none border-b border-mac-border bg-mac-header backdrop-blur-xl">
      {/* macOS Traffic Lights Window Controls */}
      <div className="flex items-center gap-3 w-1/4">
        <div className="flex items-center gap-2 group">
          <div className="w-3 h-3 rounded-full bg-mac-red hover:bg-red-600 transition-colors shadow-sm flex items-center justify-center cursor-pointer">
            <span className="text-[8px] opacity-0 group-hover:opacity-100 text-black font-bold">×</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-mac-yellow hover:bg-yellow-500 transition-colors shadow-sm flex items-center justify-center cursor-pointer">
            <span className="text-[8px] opacity-0 group-hover:opacity-100 text-black font-bold">-</span>
          </div>
          <div className="w-3 h-3 rounded-full bg-mac-green hover:bg-green-600 transition-colors shadow-sm flex items-center justify-center cursor-pointer">
            <span className="text-[8px] opacity-0 group-hover:opacity-100 text-black font-bold">+</span>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-center gap-2 text-xs font-semibold text-mac-subtext">
          <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
          <span className="truncate max-w-[140px] hidden sm:inline">
            {activeDeck ? activeDeck.name : 'FlashLearn Studio'}
          </span>
        </div>
      </div>

      {/* View Switcher Pills */}
      <div className="flex items-center bg-mac-pill-bg p-1 rounded-lg border border-mac-border shadow-inner">
        <button
          onClick={() => setActiveView('cards')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            activeView === 'cards' || activeView === 'quiz'
              ? 'bg-mac-accent text-white shadow-sm'
              : 'text-mac-subtext hover:text-mac-text hover:bg-mac-hover'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>闪卡背词</span>
        </button>

        <button
          onClick={() => setActiveView('ebbinghaus')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            activeView === 'ebbinghaus'
              ? 'bg-amber-500 text-black font-bold shadow-sm'
              : 'text-mac-subtext hover:text-mac-text hover:bg-mac-hover'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>艾宾浩斯复习</span>
          {dueCount > 0 && (
            <span className="ml-0.5 px-1.5 py-0.2 text-[10px] rounded-full bg-red-500 text-white font-mono font-bold">
              {dueCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveView('manage')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            activeView === 'manage'
              ? 'bg-mac-accent text-white shadow-sm'
              : 'text-mac-subtext hover:text-mac-text hover:bg-mac-hover'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>词库管理</span>
        </button>

        <button
          onClick={() => setActiveView('stats')}
          className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
            activeView === 'stats'
              ? 'bg-mac-accent text-white shadow-sm'
              : 'text-mac-subtext hover:text-mac-text hover:bg-mac-hover'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>学习统计</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center justify-end gap-2 w-1/4">
        {/* Toggle Front/Back Order (English -> Chinese vs Chinese -> English) */}
        <button
          onClick={() => setCardOrder(cardOrder === 'en-zh' ? 'zh-en' : 'en-zh')}
          title={cardOrder === 'en-zh' ? '当前：正面英文 ➔ 背面中文 (点击切换为正面中文)' : '当前：正面中文 ➔ 背面英文 (点击切换为正面英文)'}
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-purple-500/15 text-purple-400 border border-purple-500/30 hover:bg-purple-500 hover:text-white transition-all"
        >
          <ArrowLeftRight className="w-3.5 h-3.5" />
          <span>{cardOrder === 'en-zh' ? '英 ➔ 中' : '中 ➔ 英'}</span>
        </button>

        {/* Add Card Quick Button */}
        <button
          onClick={onOpenAddCard}
          title="添加新单词"
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white transition-all border border-blue-500/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden md:inline">加单词</span>
        </button>

        {/* Batch Import/Export Button */}
        <button
          onClick={onOpenImportExport}
          title="批量导入 / 导出"
          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md bg-mac-hover text-mac-text hover:bg-mac-border transition-all border border-mac-border"
        >
          <Upload className="w-3.5 h-3.5 text-mac-subtext" />
          <span className="hidden md:inline">导入/导出</span>
        </button>

        {/* Auto Audio Toggle */}
        <button
          onClick={() => setAutoAudio(!autoAudio)}
          title={autoAudio ? '已开启翻卡自动发音' : '已关闭翻卡自动发音'}
          className={`p-1.5 rounded-md text-xs transition-all border border-mac-border ${
            autoAudio ? 'bg-amber-500/15 text-amber-500 border-amber-500/30' : 'bg-mac-hover text-mac-subtext'
          }`}
        >
          {autoAudio ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? '切换浅色模式' : '切换深色模式'}
          className="p-1.5 rounded-md text-xs bg-mac-hover text-mac-subtext hover:text-mac-text transition-all border border-mac-border"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-400" />}
        </button>
      </div>
    </header>
  );
}
