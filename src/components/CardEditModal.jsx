import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export default function CardEditModal({
  isOpen,
  onClose,
  card,
  onSave
}) {
  const [english, setEnglish] = useState('');
  const [chinese, setChinese] = useState('');
  const [phonetic, setPhonetic] = useState('');
  const [pos, setPos] = useState('');
  const [exampleEn, setExampleEn] = useState('');
  const [exampleZh, setExampleZh] = useState('');

  useEffect(() => {
    if (card) {
      setEnglish(card.english || '');
      setChinese(card.chinese || '');
      setPhonetic(card.phonetic || '');
      setPos(card.pos || '');
      setExampleEn(card.exampleEn || '');
      setExampleZh(card.exampleZh || '');
    } else {
      setEnglish('');
      setChinese('');
      setPhonetic('');
      setPos('');
      setExampleEn('');
      setExampleZh('');
    }
  }, [card, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!english.trim() || !chinese.trim()) {
      alert('请填写英文单词和中文翻译！');
      return;
    }

    onSave({
      id: card ? card.id : 'card_' + Date.now(),
      english: english.trim(),
      chinese: chinese.trim(),
      phonetic: phonetic.trim(),
      pos: pos.trim(),
      exampleEn: exampleEn.trim(),
      exampleZh: exampleZh.trim(),
      mastered: card ? card.mastered : false,
      reviewCount: card ? card.reviewCount : 0
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-mac-content border border-mac-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-mac-border flex items-center justify-between bg-mac-header">
          <h3 className="text-sm font-bold text-mac-text">
            {card ? '编辑闪卡单词' : '新增闪卡单词'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-mac-subtext hover:text-mac-text hover:bg-mac-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-mac-text mb-1">
                英文单词 / 表达式 *
              </label>
              <input
                type="text"
                required
                placeholder="例如: resilient"
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                className="w-full px-3 py-2 bg-mac-pill-bg border border-mac-border rounded-lg text-xs text-mac-text focus:outline-none focus:border-blue-500 font-serif text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-mac-text mb-1">
                中文释义 / 翻译 *
              </label>
              <input
                type="text"
                required
                placeholder="例如: 有强韧适应力的"
                value={chinese}
                onChange={(e) => setChinese(e.target.value)}
                className="w-full px-3 py-2 bg-mac-pill-bg border border-mac-border rounded-lg text-xs text-mac-text focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-mac-subtext mb-1">
                国际音标 (选填)
              </label>
              <input
                type="text"
                placeholder="例如: /rɪˈzɪliənt/"
                value={phonetic}
                onChange={(e) => setPhonetic(e.target.value)}
                className="w-full px-3 py-2 bg-mac-pill-bg border border-mac-border rounded-lg text-xs text-mac-text focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-mac-subtext mb-1">
                词性 POS (选填)
              </label>
              <input
                type="text"
                placeholder="例如: adj. / v. / n."
                value={pos}
                onChange={(e) => setPos(e.target.value)}
                className="w-full px-3 py-2 bg-mac-pill-bg border border-mac-border rounded-lg text-xs text-mac-text focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-mac-subtext mb-1">
              英文例句 (选填)
            </label>
            <textarea
              rows={2}
              placeholder="例如: Children are remarkably resilient to change."
              value={exampleEn}
              onChange={(e) => setExampleEn(e.target.value)}
              className="w-full px-3 py-2 bg-mac-pill-bg border border-mac-border rounded-lg text-xs text-mac-text focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-mac-subtext mb-1">
              例句中文翻译 (选填)
            </label>
            <input
              type="text"
              placeholder="例如: 孩子们对变化的适应能力惊人地强。"
              value={exampleZh}
              onChange={(e) => setExampleZh(e.target.value)}
              className="w-full px-3 py-2 bg-mac-pill-bg border border-mac-border rounded-lg text-xs text-mac-text focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Footer */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-mac-subtext hover:bg-mac-hover transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex items-center gap-1 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>保存卡片</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
