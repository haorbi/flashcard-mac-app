import React, { useState } from 'react';
import { X, Upload, Download, FileText, Check, AlertCircle, FileSpreadsheet, FileJson } from 'lucide-react';
import { parseImportContent, exportCardsFile } from '../utils/fileParser';

export default function ImportExportModal({
  isOpen,
  onClose,
  activeDeck,
  allDecks,
  onImportCards
}) {
  const [activeTab, setActiveTab] = useState('import'); // 'import' | 'export'
  
  // Import States
  const [rawText, setRawText] = useState('');
  const [importTarget, setImportTarget] = useState('active'); // 'active' | 'new'
  const [newDeckName, setNewDeckName] = useState('');
  const [parsedPreview, setParsedPreview] = useState([]);
  const [fileName, setFileName] = useState('');
  const [importError, setImportError] = useState('');

  // Export States
  const [exportDeckId, setExportDeckId] = useState(activeDeck ? activeDeck.id : (allDecks[0]?.id || ''));
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' | 'json' | 'txt'

  if (!isOpen) return null;

  // File Upload Handler
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    const ext = file.name.split('.').pop().toLowerCase();

    reader.onload = (event) => {
      const content = event.target.result;
      setRawText(content);
      parseContent(content, ext);
    };

    reader.readAsText(file);
  };

  // Text Area Change Handler
  const handleTextChange = (e) => {
    const text = e.target.value;
    setRawText(text);
    parseContent(text, 'csv');
  };

  const parseContent = (text, formatHint) => {
    setImportError('');
    if (!text.trim()) {
      setParsedPreview([]);
      return;
    }
    const cards = parseImportContent(text, formatHint);
    if (cards.length === 0) {
      setImportError('未能成功识别有效的词条，请检查分隔符是否为逗号、制表符(\\t)或减号(-)。');
    }
    setParsedPreview(cards);
  };

  // Confirm Import
  const handleConfirmImport = () => {
    if (parsedPreview.length === 0) {
      setImportError('请输入或上传有效的词条列表');
      return;
    }

    if (importTarget === 'new' && !newDeckName.trim()) {
      setImportError('请输入新词库的名称');
      return;
    }

    onImportCards({
      cards: parsedPreview,
      targetType: importTarget,
      targetDeckId: activeDeck ? activeDeck.id : allDecks[0]?.id,
      newDeckName: newDeckName.trim()
    });

    onClose();
  };

  // Handle Export
  const handleConfirmExport = () => {
    const targetDeck = allDecks.find(d => d.id === exportDeckId);
    if (!targetDeck || !targetDeck.cards || targetDeck.cards.length === 0) {
      alert('选中的词库为空，无法导出');
      return;
    }

    exportCardsFile(targetDeck.name, targetDeck.cards, exportFormat);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-mac-content border border-mac-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-mac-border flex items-center justify-between bg-mac-header">
          <div className="flex items-center gap-2">
            <div className="flex bg-mac-pill-bg p-1 rounded-lg border border-mac-border">
              <button
                onClick={() => setActiveTab('import')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'import' ? 'bg-mac-accent text-white shadow-sm' : 'text-mac-subtext hover:text-mac-text'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>批量导入</span>
              </button>
              <button
                onClick={() => setActiveTab('export')}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                  activeTab === 'export' ? 'bg-mac-accent text-white shadow-sm' : 'text-mac-subtext hover:text-mac-text'
                }`}
              >
                <Download className="w-3.5 h-3.5" />
                <span>批量导出</span>
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-mac-subtext hover:text-mac-text hover:bg-mac-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {activeTab === 'import' ? (
            <>
              {/* Import Target Deck */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-mac-text uppercase tracking-wider">
                  1. 选择导入目标词库
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setImportTarget('active')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      importTarget === 'active'
                        ? 'border-blue-500 bg-blue-500/10 text-mac-text font-semibold'
                        : 'border-mac-border bg-mac-pill-bg text-mac-subtext hover:border-mac-text'
                    }`}
                  >
                    <div className="font-medium text-mac-text">导入到当前词库</div>
                    <div className="text-[11px] opacity-75 truncate">{activeDeck?.name || '默认词库'}</div>
                  </button>

                  <button
                    onClick={() => setImportTarget('new')}
                    className={`p-3 rounded-xl border text-left text-xs transition-all ${
                      importTarget === 'new'
                        ? 'border-blue-500 bg-blue-500/10 text-mac-text font-semibold'
                        : 'border-mac-border bg-mac-pill-bg text-mac-subtext hover:border-mac-text'
                    }`}
                  >
                    <div className="font-medium text-mac-text">+ 创建新自定义词库</div>
                    <div className="text-[11px] opacity-75">导入内容将生成独立词库</div>
                  </button>
                </div>

                {importTarget === 'new' && (
                  <input
                    type="text"
                    placeholder="请输入新词库名称（例如：商务词汇、GRE必背）"
                    value={newDeckName}
                    onChange={(e) => setNewDeckName(e.target.value)}
                    className="w-full mt-2 px-3 py-2 bg-mac-pill-bg border border-mac-border rounded-lg text-xs text-mac-text focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>

              {/* Upload Dropzone & Text Area */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-mac-text uppercase tracking-wider">
                  2. 上传文件或直接粘贴文本
                </label>

                <div className="flex gap-3">
                  <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-mac-border hover:border-blue-500/50 rounded-xl cursor-pointer bg-mac-pill-bg/50 transition-all text-center">
                    <Upload className="w-5 h-5 text-blue-500 mb-1" />
                    <span className="text-xs font-medium text-mac-text">
                      {fileName ? `已选文件: ${fileName}` : '点击或拖拽上传 CSV / TXT / JSON 文件'}
                    </span>
                    <span className="text-[10px] text-mac-subtext mt-0.5">
                      支持格式：CSV, TXT(TAB/逗号分隔), JSON
                    </span>
                    <input
                      type="file"
                      accept=".csv,.txt,.json,.tsv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="relative">
                  <textarea
                    rows={4}
                    placeholder={`或者在此处直接粘贴文本，例如：\nabandon\t放弃，抛弃\nabundant\t丰富的\nresilient\t有强韧适应力的`}
                    value={rawText}
                    onChange={handleTextChange}
                    className="w-full p-3 bg-mac-pill-bg border border-mac-border rounded-xl text-xs font-mono text-mac-text focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Error Message */}
              {importError && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 text-red-500 text-xs border border-red-500/20">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Live Preview */}
              {parsedPreview.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-mac-text">
                    <span>3. 解析预览 (共成功识别 {parsedPreview.length} 个单词)</span>
                  </div>

                  <div className="max-h-40 overflow-y-auto border border-mac-border rounded-xl bg-mac-pill-bg/50">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-mac-header text-mac-subtext sticky top-0 border-b border-mac-border">
                        <tr>
                          <th className="p-2 pl-3">英文 (English)</th>
                          <th className="p-2">中文翻译 (Chinese)</th>
                          <th className="p-2 pr-3">音标 / 词性</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-mac-border">
                        {parsedPreview.slice(0, 10).map((card, i) => (
                          <tr key={i} className="hover:bg-mac-hover">
                            <td className="p-2 pl-3 font-semibold text-mac-text font-serif">{card.english}</td>
                            <td className="p-2 text-mac-text">{card.chinese}</td>
                            <td className="p-2 pr-3 text-mac-subtext text-[11px]">{card.phonetic || '-'} {card.pos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {parsedPreview.length > 10 && (
                      <div className="p-2 text-center text-[11px] text-mac-subtext border-t border-mac-border">
                        仅预览前 10 条，剩余 {parsedPreview.length - 10} 条将在导入时自动处理
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* EXPORT TAB */
            <div className="space-y-6">
              {/* Select Deck to Export */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-mac-text uppercase tracking-wider">
                  选择导出的目标词库
                </label>
                <select
                  value={exportDeckId}
                  onChange={(e) => setExportDeckId(e.target.value)}
                  className="w-full p-2.5 bg-mac-pill-bg border border-mac-border rounded-xl text-xs text-mac-text focus:outline-none focus:border-blue-500"
                >
                  {allDecks.map(deck => (
                    <option key={deck.id} value={deck.id}>
                      {deck.name} ({deck.cards.length} 卡片)
                    </option>
                  ))}
                </select>
              </div>

              {/* Select Format */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-mac-text uppercase tracking-wider">
                  选择导出文件格式
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setExportFormat('csv')}
                    className={`flex flex-col items-center p-3 rounded-xl border text-xs transition-all ${
                      exportFormat === 'csv'
                        ? 'border-blue-500 bg-blue-500/10 text-mac-text font-semibold'
                        : 'border-mac-border bg-mac-pill-bg text-mac-subtext hover:border-mac-text'
                    }`}
                  >
                    <FileSpreadsheet className="w-5 h-5 text-emerald-500 mb-1" />
                    <span>CSV 表格</span>
                    <span className="text-[10px] opacity-75">适合 Excel / Numbers</span>
                  </button>

                  <button
                    onClick={() => setExportFormat('json')}
                    className={`flex flex-col items-center p-3 rounded-xl border text-xs transition-all ${
                      exportFormat === 'json'
                        ? 'border-blue-500 bg-blue-500/10 text-mac-text font-semibold'
                        : 'border-mac-border bg-mac-pill-bg text-mac-subtext hover:border-mac-text'
                    }`}
                  >
                    <FileJson className="w-5 h-5 text-amber-500 mb-1" />
                    <span>JSON 数据</span>
                    <span className="text-[10px] opacity-75">包含全部完整字段</span>
                  </button>

                  <button
                    onClick={() => setExportFormat('txt')}
                    className={`flex flex-col items-center p-3 rounded-xl border text-xs transition-all ${
                      exportFormat === 'txt'
                        ? 'border-blue-500 bg-blue-500/10 text-mac-text font-semibold'
                        : 'border-mac-border bg-mac-pill-bg text-mac-subtext hover:border-mac-text'
                    }`}
                  >
                    <FileText className="w-5 h-5 text-indigo-500 mb-1" />
                    <span>TXT 纯文本</span>
                    <span className="text-[10px] opacity-75">制表符 TAB 分隔</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-mac-border bg-mac-header flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-mac-subtext hover:bg-mac-hover transition-colors"
          >
            取消
          </button>

          {activeTab === 'import' ? (
            <button
              onClick={handleConfirmImport}
              disabled={parsedPreview.length === 0}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Check className="w-4 h-4" />
              <span>确认导入 ({parsedPreview.length} 词)</span>
            </button>
          ) : (
            <button
              onClick={handleConfirmExport}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md transition-all"
            >
              <Download className="w-4 h-4" />
              <span>导出文件</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
