import Papa from 'papaparse';

/**
 * Parse uploaded content into flashcard array
 * @param {string} fileContent Raw text content from file
 * @param {string} fileType 'csv' | 'json' | 'txt'
 */
export const parseImportContent = (fileContent, fileType = 'csv') => {
  const cards = [];
  const text = fileContent.trim();

  if (!text) return cards;

  if (fileType === 'json' || text.startsWith('[') || (text.startsWith('{') && text.includes('cards'))) {
    try {
      const parsed = JSON.parse(text);
      const list = Array.isArray(parsed) ? parsed : (parsed.cards || []);
      
      list.forEach((item, idx) => {
        if (typeof item === 'string') {
          const parts = item.split(/[\t,|—\-:]+/);
          if (parts.length >= 2) {
            cards.push(createCardObj(parts[0], parts[1], '', '', '', ''));
          }
        } else if (typeof item === 'object' && item !== null) {
          const en = item.english || item.word || item.term || item.front || '';
          const zh = item.chinese || item.translation || item.definition || item.back || '';
          if (en && zh) {
            cards.push(createCardObj(
              en,
              zh,
              item.phonetic || '',
              item.pos || '',
              item.exampleEn || item.example || '',
              item.exampleZh || ''
            ));
          }
        }
      });
      return cards;
    } catch (e) {
      console.warn('JSON parse fallback to CSV/line mode', e);
    }
  }

  // Handle CSV / TSV / TXT line parsing
  if (fileType === 'csv' || fileType === 'txt') {
    const csvResult = Papa.parse(text, { skipEmptyLines: true, header: false });
    if (csvResult.data && csvResult.data.length > 0) {
      csvResult.data.forEach((row) => {
        if (!row || row.length === 0) return;
        
        // If single text string with delimiter
        if (row.length === 1 && typeof row[0] === 'string') {
          const line = row[0].trim();
          // Skip headers like "English,Chinese"
          if (line.toLowerCase().startsWith('english,chinese') || line.toLowerCase().startsWith('词汇,翻译')) return;

          const parts = line.split(/[\t|—\-:]+/);
          if (parts.length >= 2) {
            cards.push(createCardObj(parts[0], parts[1], '', '', '', ''));
          }
        } else if (row.length >= 2) {
          const col0 = String(row[0]).trim();
          const col1 = String(row[1]).trim();
          // Skip header row
          if (col0.toLowerCase() === 'english' || col0.toLowerCase() === 'word' || col0 === '英语' || col0 === '单词') return;

          cards.push(createCardObj(
            col0,
            col1,
            row[2] ? String(row[2]).trim() : '',
            row[3] ? String(row[3]).trim() : '',
            row[4] ? String(row[4]).trim() : '',
            row[5] ? String(row[5]).trim() : ''
          ));
        }
      });
    }
  }

  return cards;
};

const createCardObj = (english, chinese, phonetic = '', pos = '', exampleEn = '', exampleZh = '') => {
  return {
    id: 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    english: english.trim(),
    chinese: chinese.trim(),
    phonetic: phonetic.trim(),
    pos: pos.trim(),
    exampleEn: exampleEn.trim(),
    exampleZh: exampleZh.trim(),
    mastered: false,
    reviewCount: 0
  };
};

/**
 * Generate export data download for cards
 */
export const exportCardsFile = (deckName, cards, format = 'csv') => {
  const filename = `${deckName || '闪卡词库'}_${new Date().toISOString().slice(0, 10)}`;

  if (format === 'json') {
    const jsonStr = JSON.stringify({ deckName, exportDate: new Date().toISOString(), cards }, null, 2);
    downloadBlob(jsonStr, `${filename}.json`, 'application/json');
  } else if (format === 'txt') {
    const txtLines = cards.map(c => `${c.english}\t${c.chinese}${c.phonetic ? '\t' + c.phonetic : ''}`);
    const txtStr = txtLines.join('\n');
    downloadBlob(txtStr, `${filename}.txt`, 'text/plain;charset=utf-8');
  } else {
    // CSV export
    const data = cards.map(c => ({
      English: c.english,
      Chinese: c.chinese,
      Phonetic: c.phonetic || '',
      POS: c.pos || '',
      Example_EN: c.exampleEn || '',
      Example_ZH: c.exampleZh || ''
    }));
    const csvStr = Papa.unparse(data);
    downloadBlob(csvStr, `${filename}.csv`, 'text/csv;charset=utf-8');
  }
};

const downloadBlob = (content, fileName, mimeType) => {
  const blob = new Blob(['\ufeff' + content], { type: mimeType }); // Add UTF-8 BOM for Excel compatibility
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
