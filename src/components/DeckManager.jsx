import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Volume2, 
  CheckCircle, 
  Circle, 
  Upload, 
  BookOpen,
  Filter
} from 'lucide-react';
import { speakText } from '../utils/speech';

export default function DeckManager({
  activeDeck,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDeleteMultipleCards,
  onToggleMastery,
  onOpenImportModal
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'learning' | 'mastered'

  if (!activeDeck) return null;

  const cards = activeDeck.cards || [];

  // Filter cards by search & status
  const filteredCards = cards.filter(card => {
    const matchesSearch = 
      card.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.chinese.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.phonetic && card.phonetic.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'mastered') return card.mastered;
    if (filterStatus === 'learning') return !card.mastered;
    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredCards.map(c => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`确定要删除选中的 ${selectedIds.length} 个单词卡片吗？`)) {
      onDeleteMultipleCards(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-mac-content overflow-hidden p-6 select-none space-y-4">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-mac-text flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            <span>{activeDeck.name}</span>
            <span className="text-xs font-mono font-normal text-mac-subtext bg-mac-pill-bg px-2 py-0.5 rounded-full border border-mac-border">
              {cards.length} 词
            </span>
          </h2>
          <p className="text-xs text-mac-subtext mt-0.5">
            {activeDeck.description || '管理词库词条，支持搜索、添加、修改与批量操作'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>删除选中 ({selectedIds.length})</span>
            </button>
          )}

          <button
            onClick={onOpenImportModal}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-mac-hover text-mac-text hover:bg-mac-border border border-mac-border text-xs font-semibold transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>批量导入</span>
          </button>

          <button
            onClick={onAddCard}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>添加新单词</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-mac-header p-3 rounded-xl border border-mac-border">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-mac-subtext" />
          <input
            type="text"
            placeholder="搜索英文单词、中文释义或音标..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-mac-pill-bg border border-mac-border rounded-lg text-xs text-mac-text focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-mac-subtext mr-1">
            <Filter className="w-3 h-3" />
            <span>筛选:</span>
          </div>
          <div className="flex bg-mac-pill-bg p-1 rounded-lg border border-mac-border text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                filterStatus === 'all' ? 'bg-mac-accent text-white font-medium' : 'text-mac-subtext hover:text-mac-text'
              }`}
            >
              全部 ({cards.length})
            </button>
            <button
              onClick={() => setFilterStatus('learning')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                filterStatus === 'learning' ? 'bg-mac-accent text-white font-medium' : 'text-mac-subtext hover:text-mac-text'
              }`}
            >
              未掌握 ({cards.filter(c => !c.mastered).length})
            </button>
            <button
              onClick={() => setFilterStatus('mastered')}
              className={`px-2.5 py-0.5 rounded-md transition-all ${
                filterStatus === 'mastered' ? 'bg-mac-accent text-white font-medium' : 'text-mac-subtext hover:text-mac-text'
              }`}
            >
              已掌握 ({cards.filter(c => c.mastered).length})
            </button>
          </div>
        </div>
      </div>

      {/* Cards Table */}
      <div className="flex-1 overflow-y-auto border border-mac-border rounded-xl bg-mac-header">
        {filteredCards.length === 0 ? (
          <div className="p-8 text-center text-xs text-mac-subtext">
            没有找到匹配的词卡记录
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-mac-sidebar text-mac-subtext sticky top-0 border-b border-mac-border">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.length > 0 && selectedIds.length === filteredCards.length}
                    onChange={handleSelectAll}
                    className="rounded border-mac-border"
                  />
                </th>
                <th className="p-3">英文单词 (English)</th>
                <th className="p-3">音标 / 词性</th>
                <th className="p-3">中文翻译 (Chinese)</th>
                <th className="p-3">例句 preview</th>
                <th className="p-3 text-center">掌握状态</th>
                <th className="p-3 text-right pr-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-mac-border">
              {filteredCards.map((card) => {
                const isSelected = selectedIds.includes(card.id);
                return (
                  <tr
                    key={card.id}
                    className={`hover:bg-mac-hover transition-colors ${
                      isSelected ? 'bg-blue-500/10' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(card.id)}
                        className="rounded border-mac-border"
                      />
                    </td>

                    <td className="p-3 font-semibold text-mac-text font-serif text-sm">
                      <div className="flex items-center gap-2">
                        <span>{card.english}</span>
                        <button
                          onClick={() => speakText(card.english)}
                          title="发音"
                          className="p-1 rounded text-mac-subtext hover:text-blue-500 hover:bg-blue-500/10 transition-colors"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    <td className="p-3 text-mac-subtext text-[11px] font-mono">
                      {card.phonetic && <span className="mr-1.5">{card.phonetic}</span>}
                      {card.pos && <span className="text-blue-400 italic">{card.pos}</span>}
                    </td>

                    <td className="p-3 text-mac-text font-medium">
                      {card.chinese}
                    </td>

                    <td className="p-3 text-mac-subtext text-[11px] max-w-xs truncate">
                      {card.exampleEn ? `"${card.exampleEn}"` : '-'}
                    </td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() => onToggleMastery(card.id)}
                        title={card.mastered ? '标记为未掌握' : '标记为已掌握'}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                          card.mastered
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                        }`}
                      >
                        {card.mastered ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> 已掌握
                          </>
                        ) : (
                          <>
                            <Circle className="w-3 h-3" /> 背诵中
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3 text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEditCard(card)}
                          title="编辑词条"
                          className="p-1.5 rounded-lg text-mac-subtext hover:text-mac-text hover:bg-mac-hover transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteCard(card.id)}
                          title="删除词条"
                          className="p-1.5 rounded-lg text-mac-subtext hover:text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
