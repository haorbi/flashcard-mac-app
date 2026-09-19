import React from 'react';
import { 
  GraduationCap, 
  Award, 
  Code2, 
  MessageSquare, 
  BookOpen, 
  FolderPlus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Layers,
  Sparkles
} from 'lucide-react';

const ICON_MAP = {
  GraduationCap: GraduationCap,
  Award: Award,
  Code2: Code2,
  MessageSquare: MessageSquare
};

export default function Sidebar({
  decks,
  activeDeckId,
  setActiveDeckId,
  filterMode,
  setFilterMode,
  onNewDeck,
  onDeleteDeck
}) {
  const presetDecks = decks.filter(d => d.isPreset);
  const customDecks = decks.filter(d => !d.isPreset);

  const activeDeck = decks.find(d => d.id === activeDeckId) || decks[0];
  const totalCards = activeDeck ? activeDeck.cards.length : 0;
  const masteredCards = activeDeck ? activeDeck.cards.filter(c => c.mastered).length : 0;
  const learningCards = totalCards - masteredCards;

  return (
    <aside className="w-64 mac-sidebar bg-mac-sidebar border-r border-mac-border flex flex-col justify-between select-none p-3 overflow-y-auto">
      <div className="space-y-6">
        {/* Preset Decks Section */}
        <div>
          <div className="px-2 mb-2 text-[11px] font-bold tracking-wider text-mac-subtext uppercase flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-500" />
            <span>内置精选词库</span>
          </div>
          <div className="space-y-0.5">
            {presetDecks.map(deck => {
              const IconComp = ICON_MAP[deck.icon] || BookOpen;
              const isActive = deck.id === activeDeckId;
              const mastered = deck.cards.filter(c => c.mastered).length;
              return (
                <button
                  key={deck.id}
                  onClick={() => setActiveDeckId(deck.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'bg-mac-accent text-white shadow-sm font-medium'
                      : 'text-mac-text hover:bg-mac-hover'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <IconComp className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-500'}`} />
                    <span className="truncate">{deck.name}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-mac-pill-bg text-mac-subtext'
                  }`}>
                    {mastered}/{deck.cards.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Decks Section */}
        <div>
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider text-mac-subtext uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>我的自定义词库</span>
            </span>
            <button
              onClick={onNewDeck}
              title="新建自选词库"
              className="p-1 rounded text-mac-subtext hover:text-mac-text hover:bg-mac-hover transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-blue-500" />
            </button>
          </div>

          {customDecks.length === 0 ? (
            <div className="px-3 py-3 rounded-lg border border-dashed border-mac-border text-center text-xs text-mac-subtext">
              暂无自定义词库<br />
              <button
                onClick={onNewDeck}
                className="mt-1 text-blue-500 font-medium hover:underline cursor-pointer"
              >
                + 立即创建/导入
              </button>
            </div>
          ) : (
            <div className="space-y-0.5">
              {customDecks.map(deck => {
                const isActive = deck.id === activeDeckId;
                const mastered = deck.cards.filter(c => c.mastered).length;
                return (
                  <div
                    key={deck.id}
                    className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-all cursor-pointer ${
                      isActive
                        ? 'bg-mac-accent text-white shadow-sm font-medium'
                        : 'text-mac-text hover:bg-mac-hover'
                    }`}
                    onClick={() => setActiveDeckId(deck.id)}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <BookOpen className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-amber-500'}`} />
                      <span className="truncate">{deck.name}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isActive ? 'bg-white/20 text-white' : 'bg-mac-pill-bg text-mac-subtext'
                      }`}>
                        {mastered}/{deck.cards.length}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDeck(deck.id);
                        }}
                        title="删除该词库"
                        className={`p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 transition-all ${
                          isActive ? 'text-white/80 hover:text-white' : 'text-mac-subtext'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Filter Cards Status */}
        <div className="pt-2 border-t border-mac-border">
          <div className="px-2 mb-2 text-[11px] font-bold tracking-wider text-mac-subtext uppercase">
            状态筛选
          </div>
          <div className="space-y-0.5">
            <button
              onClick={() => setFilterMode('all')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                filterMode === 'all'
                  ? 'bg-mac-hover font-semibold text-mac-text'
                  : 'text-mac-subtext hover:text-mac-text'
              }`}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                <span>全部卡片</span>
              </div>
              <span className="font-mono text-[10px]">{totalCards}</span>
            </button>

            <button
              onClick={() => setFilterMode('learning')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                filterMode === 'learning'
                  ? 'bg-mac-hover font-semibold text-mac-text'
                  : 'text-mac-subtext hover:text-mac-text'
              }`}
            >
              <div className="flex items-center gap-2">
                <Circle className="w-3.5 h-3.5 text-amber-400" />
                <span>背诵中</span>
              </div>
              <span className="font-mono text-[10px] text-amber-500 font-semibold">{learningCards}</span>
            </button>

            <button
              onClick={() => setFilterMode('mastered')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                filterMode === 'mastered'
                  ? 'bg-mac-hover font-semibold text-mac-text'
                  : 'text-mac-subtext hover:text-mac-text'
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>已掌握</span>
              </div>
              <span className="font-mono text-[10px] text-emerald-500 font-semibold">{masteredCards}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer shortcut tips */}
      <div className="mt-4 p-2.5 rounded-lg bg-mac-pill-bg border border-mac-border text-[11px] text-mac-subtext space-y-1">
        <div className="font-medium text-mac-text flex items-center justify-between">
          <span>快捷键提示</span>
          <span className="text-[10px] bg-mac-hover px-1 rounded border border-mac-border">macOS</span>
        </div>
        <div className="flex justify-between">
          <span>翻面</span>
          <kbd className="font-mono bg-mac-hover px-1 rounded text-[10px]">Space</kbd>
        </div>
        <div className="flex justify-between">
          <span>发音</span>
          <kbd className="font-mono bg-mac-hover px-1 rounded text-[10px]">R</kbd>
        </div>
        <div className="flex justify-between">
          <span>未掌握 / 已掌握</span>
          <kbd className="font-mono bg-mac-hover px-1 rounded text-[10px]">← / →</kbd>
        </div>
      </div>
    </aside>
  );
}
