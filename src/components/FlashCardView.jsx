import React, { useState, useEffect, useCallback } from 'react';
import { 
  Volume2, 
  RotateCw, 
  CheckCircle, 
  XCircle, 
  Shuffle, 
  RefreshCcw, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../utils/speech';

export default function FlashCardView({
  cards,
  activeDeckName,
  autoAudio,
  onUpdateCardMastery,
  onResetDeck
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Reset index when cards list changes or deck switches
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards.length, activeDeckName]);

  const currentCard = cards[currentIndex];

  // Speak word using SpeechSynthesis
  const handleSpeak = useCallback((textToSpeak, e) => {
    if (e) e.stopPropagation();
    if (textToSpeak) {
      speakText(textToSpeak);
    }
  }, []);

  // Handle card flipping
  const toggleFlip = useCallback(() => {
    const nextFlipped = !isFlipped;
    setIsFlipped(nextFlipped);

    // Auto audio on reveal back or front if enabled
    if (autoAudio && currentCard && !isFlipped) {
      speakText(currentCard.english);
    }
  }, [isFlipped, autoAudio, currentCard]);

  // Next / Previous navigation
  const nextCard = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  }, [cards.length]);

  const prevCard = useCallback(() => {
    if (cards.length === 0) return;
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  }, [cards.length]);

  // Mark as Mastered (Know)
  const handleMarkMastered = useCallback((mastered, e) => {
    if (e) e.stopPropagation();
    if (!currentCard) return;

    onUpdateCardMastery(currentCard.id, mastered);

    // Check if user mastered all cards in deck
    const updatedMasteredCount = cards.filter(c => c.id === currentCard.id ? mastered : c.mastered).length;
    if (mastered && updatedMasteredCount === cards.length) {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    nextCard();
  }, [currentCard, onUpdateCardMastery, cards, nextCard]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is inside an input/textarea
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
          该筛选条件或词库中没有匹配的卡片，你可以切换侧边栏状态筛选，或批量导入单词。
        </p>
      </div>
    );
  }

  const masteredCount = cards.filter(c => c.mastered).length;
  const progressPercent = Math.round(((currentIndex + 1) / cards.length) * 100);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-mac-content overflow-y-auto select-none">
      {/* Header Info & Progress Bar */}
      <div className="w-full max-w-xl flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-mac-subtext font-medium">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-mac-pill-bg border border-mac-border font-mono text-[11px] text-mac-text">
              {activeDeckName}
            </span>
            <span>当前卡片 {currentIndex + 1} / {cards.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-semibold">已掌握: {masteredCount}</span>
            <span>•</span>
            <span className="text-amber-500 font-semibold">未掌握: {cards.length - masteredCount}</span>
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
          {/* FRONT SIDE (English) */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-mac-card-front backdrop-blur-2xl p-8 flex flex-col justify-between backface-hidden border border-white/10 shadow-lg">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-blue-500/10 text-blue-500 border border-blue-500/20">
                正面 • 英文
              </span>
              {currentCard.mastered && (
                <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] bg-emerald-500/15 text-emerald-500 font-medium border border-emerald-500/30">
                  <CheckCircle className="w-3 h-3" /> 已掌握
                </span>
              )}
            </div>

            {/* Word Center Display */}
            <div className="flex flex-col items-center justify-center text-center my-auto space-y-3">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-mac-text font-serif">
                {currentCard.english}
              </h2>

              <div className="flex items-center gap-3">
                {currentCard.phonetic && (
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

            {/* Bottom Flip Hint */}
            <div className="flex items-center justify-center gap-1 text-xs text-mac-subtext font-medium opacity-75">
              <RotateCw className="w-3.5 h-3.5 animate-spin-slow" />
              <span>点击卡片或按空格键翻面查看中文翻译</span>
            </div>
          </div>

          {/* BACK SIDE (Chinese & Example) */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-mac-card-back backdrop-blur-2xl p-8 flex flex-col justify-between backface-hidden rotate-y-180 border border-white/10 shadow-lg">
            {/* Top Badge */}
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                背面 • 中文释义
              </span>
              <span className="text-xs font-mono text-mac-subtext font-semibold">
                {currentCard.english}
              </span>
            </div>

            {/* Chinese Definition Center */}
            <div className="flex flex-col items-center justify-center text-center my-auto space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-mac-text tracking-wide leading-snug">
                {currentCard.chinese}
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

            {/* Bottom Flip Hint */}
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
            <span>还不熟 (←)</span>
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

        {/* Footer Card Navigation Toolbar */}
        <div className="flex items-center justify-between w-full text-xs text-mac-subtext px-1">
          <button
            onClick={prevCard}
            className="flex items-center gap-1 hover:text-mac-text transition-colors p-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>上一张</span>
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={onResetDeck}
              className="flex items-center gap-1 hover:text-mac-text transition-colors"
              title="重置本词库所有卡片掌握状态"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>重置进度</span>
            </button>
          </div>

          <button
            onClick={nextCard}
            className="flex items-center gap-1 hover:text-mac-text transition-colors p-1"
          >
            <span>下一张</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
