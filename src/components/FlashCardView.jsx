import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Volume2, 
  RotateCw, 
  CheckCircle, 
  XCircle, 
  RefreshCcw, 
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Edit3,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../utils/speech';

export default function FlashCardView({
  cards,
  activeDeckName,
  autoAudio,
  cardOrder,
  groupSize,
  setGroupSize,
  onUpdateCardMastery,
  onResetDeck,
  onStartGroupQuiz
}) {
  const [currentGroupIdx, setCurrentGroupIdx] = useState(0);
  const [groupQueue, setGroupQueue] = useState([]);
  const [cardIdxInGroup, setCardIdxInGroup] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Divide all cards into groups of `groupSize`
  const totalGroups = Math.max(1, Math.ceil(cards.length / groupSize));

  // Track previous deck name, group index, and group size to avoid resetting index when card metadata updates
  const prevContextRef = useRef({ activeDeckName, currentGroupIdx, groupSize });

  // Initialize group queue only when deck, group index, or group size actually changes
  useEffect(() => {
    const prev = prevContextRef.current;
    const isContextChanged = 
      prev.activeDeckName !== activeDeckName || 
      prev.currentGroupIdx !== currentGroupIdx || 
      prev.groupSize !== groupSize;

    if (cards && cards.length > 0) {
      const start = currentGroupIdx * groupSize;
      const end = start + groupSize;
      const groupCards = cards.slice(start, end);

      if (isContextChanged || groupQueue.length === 0) {
        setGroupQueue(groupCards);
        setCardIdxInGroup(0);
        setIsFlipped(false);
        prevContextRef.current = { activeDeckName, currentGroupIdx, groupSize };
      }
    } else {
      setGroupQueue([]);
    }
  }, [cards, groupSize, currentGroupIdx, activeDeckName, groupQueue.length]);

  const currentCard = groupQueue[cardIdxInGroup];

  // Speak word audio
  const handleSpeak = useCallback((textToSpeak, e) => {
    if (e) e.stopPropagation();
    if (textToSpeak) {
      speakText(textToSpeak);
    }
  }, []);

  // Card flipping
  const toggleFlip = useCallback(() => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    if (autoAudio && currentCard && !isFlipped) {
      speakText(currentCard.english);
    }
  }, [isFlipped, autoAudio, currentCard]);

  // Next & Prev Card Navigation
  const handleNextCard = useCallback((e) => {
    if (e) e.stopPropagation();
    setIsFlipped(false);
    setCardIdxInGroup(prev => prev + 1);
  }, []);

  const handlePrevCard = useCallback((e) => {
    if (e) e.stopPropagation();
    if (cardIdxInGroup > 0) {
      setIsFlipped(false);
      setCardIdxInGroup(prev => prev - 1);
    }
  }, [cardIdxInGroup]);

  // Mark card as Mastered or Unmastered
  const handleMarkMastered = useCallback((mastered, e) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;

    onUpdateCardMastery(currentCard.id, mastered);

    if (!mastered) {
      // Unmastered -> Re-queue card at end of group queue so it repeats!
      setGroupQueue(prev => [...prev, currentCard]);
    }

    setIsFlipped(false);
    setCardIdxInGroup(prev => prev + 1);

    if (cardIdxInGroup + 1 >= groupQueue.length && mastered) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    }
  }, [currentCard, onUpdateCardMastery, cardIdxInGroup, groupQueue.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleFlip();
      } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        e.preventDefault();
        handleMarkMastered(true);
      } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        e.preventDefault();
        handleMarkMastered(false);
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        if (currentCard) speakText(currentCard.english);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFlip, handleMarkMastered, currentCard]);

  if (!cards || cards.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-mac-content">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 mb-4 border border-blue-500/20">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-mac-text mb-1">词库暂无卡片</h3>
        <p className="text-xs text-mac-subtext max-w-sm mb-4">
          该词库中没有匹配的卡片，您可以切换侧边栏，或批量导入单词。
        </p>
      </div>
    );
  }

  // Check if current group is finished
  const isGroupFinished = cardIdxInGroup >= groupQueue.length;

  if (isGroupFinished) {
    const startIdx = currentGroupIdx * groupSize;
    const currentGroupOriginalCards = cards.slice(startIdx, startIdx + groupSize);

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-mac-content text-center select-none animate-fade-in space-y-6">
        <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 mb-2 shadow-lg">
          <Sparkles className="w-10 h-10 animate-bounce" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black text-mac-text">
            第 {currentGroupIdx + 1} / {totalGroups} 组卡片阅读完毕！
          </h2>
          <p className="text-xs text-mac-subtext max-w-md">
            您已完成本组 ({currentGroupOriginalCards.length} 个单词) 的翻卡背诵，不熟悉的卡片已完成组内重复学习。
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onStartGroupQuiz(currentGroupOriginalCards, currentGroupIdx, totalGroups)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all active:scale-95"
          >
            <Edit3 className="w-4 h-4" />
            <span>进入本组【拼写验证测验】✍️</span>
          </button>

          {currentGroupIdx + 1 < totalGroups && (
            <button
              onClick={() => setCurrentGroupIdx(prev => prev + 1)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-mac-pill-bg hover:bg-mac-hover text-mac-text text-xs font-semibold border border-mac-border transition-all"
            >
              <span>背诵下一组 ({currentGroupIdx + 2}/{totalGroups})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={() => {
              setCardIdxInGroup(0);
              const start = currentGroupIdx * groupSize;
              setGroupQueue(cards.slice(start, start + groupSize));
            }}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-mac-hover text-mac-subtext text-xs font-semibold transition-all"
          >
            <RefreshCcw className="w-3.5 h-3.5" />
            <span>重背本组卡片</span>
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round(((cardIdxInGroup + 1) / groupQueue.length) * 100));

  // Front & Back content depending on `cardOrder` ('en-zh' or 'zh-en')
  const frontTitle = cardOrder === 'en-zh' ? currentCard.english : currentCard.chinese;
  const backTitle = cardOrder === 'en-zh' ? currentCard.chinese : currentCard.english;

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-mac-content overflow-y-auto select-none">
      {/* Header Toolbar: Group Selector & Progress */}
      <div className="w-full max-w-xl flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-mac-subtext font-medium">
          {/* Group Switcher & Size */}
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-blue-500/15 text-blue-400 font-mono text-[11px] font-bold border border-blue-500/30">
              第 {currentGroupIdx + 1} / {totalGroups} 组
            </span>

            {/* Group Size Selector */}
            <div className="flex items-center gap-1 text-[11px] bg-mac-pill-bg px-2 py-0.5 rounded border border-mac-border">
              <span>每组:</span>
              <select
                value={groupSize}
                onChange={(e) => setGroupSize(Number(e.target.value))}
                className="bg-transparent text-mac-text font-bold focus:outline-none"
              >
                <option value={5}>5 词</option>
                <option value={10}>10 词</option>
                <option value={15}>15 词</option>
                <option value={20}>20 词</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-mac-subtext">组内进度: {cardIdxInGroup + 1} / {groupQueue.length}</span>
            {groupQueue.length > groupSize && (
              <span className="text-amber-500 text-[11px] font-semibold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                错词循环中
              </span>
            )}
          </div>
        </div>

        {/* Progress track */}
        <div className="w-full h-1.5 bg-mac-pill-bg rounded-full overflow-hidden border border-mac-border">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* 3D Flip Card Container */}
      <div className="w-full max-w-xl my-6 perspective-1000 min-h-[340px] flex items-center justify-center">
        <div
          onClick={toggleFlip}
          className={`relative w-full h-80 rounded-2xl cursor-pointer transition-transform duration-500 transform-style-3d shadow-2xl border border-mac-card-border ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT SIDE */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-mac-card-front backdrop-blur-2xl p-8 flex flex-col justify-between backface-hidden border border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                {cardOrder === 'en-zh' ? '正面 • 英文' : '正面 • 中文'}
              </span>
              {currentCard.mastered && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-500 font-medium border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3" /> 已掌握
                </span>
              )}
            </div>

            <div className="flex flex-col items-center justify-center text-center my-auto space-y-3">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-mac-text font-serif">
                {frontTitle}
              </h2>

              <div className="flex items-center gap-3">
                {cardOrder === 'en-zh' && currentCard.phonetic && (
                  <span className="text-sm font-mono text-mac-subtext tracking-wide bg-mac-pill-bg px-3 py-1 rounded-md border border-mac-border">
                    {currentCard.phonetic}
                  </span>
                )}
                {currentCard.pos && (
                  <span className="text-xs font-semibold italic text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md">
                    {currentCard.pos}
                  </span>
                )}
                <button
                  onClick={(e) => handleSpeak(currentCard.english, e)}
                  title="朗读英语"
                  className="p-2 rounded-full bg-blue-500/15 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-sm"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-mac-subtext font-medium opacity-75">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>点击卡片或按空格键翻面查看翻译</span>
            </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-mac-card-back backdrop-blur-2xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 border border-white/10 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {cardOrder === 'en-zh' ? '背面 • 中文释义' : '背面 • 英文拼写'}
              </span>
              <span className="text-xs font-mono text-mac-subtext font-semibold">
                {currentCard.english}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center text-center my-auto space-y-4">
              <h3 className="text-2xl sm:text-4xl font-bold text-mac-text tracking-wide leading-snug">
                {backTitle}
              </h3>

              {currentCard.exampleEn && (
                <div className="w-full bg-mac-pill-bg/80 border border-mac-border p-3.5 rounded-xl text-left text-xs space-y-1 shadow-inner">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-mac-text text-sm">
                      "{currentCard.exampleEn}"
                    </p>
                    <button
                      onClick={(e) => handleSpeak(currentCard.exampleEn, e)}
                      title="朗读例句"
                      className="p-1.5 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {currentCard.exampleZh && (
                    <p className="text-mac-subtext text-xs">
                      {currentCard.exampleZh}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1 text-xs text-mac-subtext font-medium opacity-75">
              <RotateCw className="w-3.5 h-3.5" />
              <span>点击翻回正面</span>
            </div>
          </div>
        </div>
      </div>

      {/* Control Action Buttons */}
      <div className="w-full max-w-xl flex flex-col items-center gap-3">
        <div className="w-full flex items-center justify-between gap-3">
          {/* Don't Know / Need Review Button */}
          <button
            onClick={(e) => handleMarkMastered(false, e)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 font-semibold text-sm transition-all border border-red-500/30 shadow-sm active:scale-95"
          >
            <XCircle className="w-4 h-4" />
            <span>还不熟 (组内重复 ←)</span>
          </button>

          {/* Audio Speaker Button */}
          <button
            onClick={(e) => handleSpeak(currentCard.english, e)}
            title="发音 (按 R)"
            className="p-3 rounded-xl bg-mac-pill-bg hover:bg-mac-hover text-mac-text transition-all border border-mac-border active:scale-95 shadow-sm"
          >
            <Volume2 className="w-5 h-5 text-blue-500" />
          </button>

          {/* Mastered / Know Button */}
          <button
            onClick={(e) => handleMarkMastered(true, e)}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-semibold text-sm transition-all border border-emerald-500/30 shadow-sm active:scale-95"
          >
            <CheckCircle className="w-4 h-4" />
            <span>记住了 (→)</span>
          </button>
        </div>

        {/* Group Navigation Controls */}
        <div className="flex items-center justify-between w-full text-xs text-mac-subtext px-1">
          <div className="flex items-center gap-2">
            <button
              disabled={cardIdxInGroup === 0}
              onClick={handlePrevCard}
              className="flex items-center gap-1 hover:text-mac-text disabled:opacity-30 transition-colors p-1"
              title="查看上一个单词"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>上一张</span>
            </button>

            <button
              onClick={handleNextCard}
              className="flex items-center gap-1 hover:text-mac-text transition-colors p-1"
              title="查看下一个单词"
            >
              <span>下一张</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={onResetDeck}
            className="flex items-center gap-1 hover:text-mac-text transition-colors"
            title="重置本词库所有卡片掌握状态"
          >
            <RefreshCcw className="w-3 h-3" />
            <span>重置进度</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              disabled={currentGroupIdx === 0}
              onClick={() => setCurrentGroupIdx(prev => Math.max(0, prev - 1))}
              className="flex items-center gap-1 hover:text-mac-text disabled:opacity-30 transition-colors p-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>上一组</span>
            </button>

            <button
              disabled={currentGroupIdx + 1 >= totalGroups}
              onClick={() => setCurrentGroupIdx(prev => Math.min(totalGroups - 1, prev + 1))}
              className="flex items-center gap-1 hover:text-mac-text disabled:opacity-30 transition-colors p-1"
            >
              <span>下一组</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
