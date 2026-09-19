import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Check, 
  X, 
  Volume2, 
  Sparkles, 
  ArrowRight, 
  HelpCircle, 
  RefreshCw, 
  Award,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakText } from '../utils/speech';

export default function SpellingQuizView({
  quizCards,
  groupIndex,
  totalGroups,
  onCompleteQuiz,
  onRepeatQuiz,
  onNextGroup,
  onBackToCards
}) {
  const [queue, setQueue] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, correctAnswer: string } | null
  const [showHint, setShowHint] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [initialTotal, setInitialTotal] = useState(0);
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (quizCards && quizCards.length > 0) {
      setQueue([...quizCards]);
      setInitialTotal(quizCards.length);
      setCurrentIdx(0);
      setCompletedCount(0);
      setInputVal('');
      setFeedback(null);
      setShowHint(false);
    }
  }, [quizCards]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIdx, feedback]);

  const currentCard = queue[currentIdx];

  const handleCheck = useCallback((e) => {
    if (e) e.preventDefault();
    if (!currentCard || feedback) return;

    const userText = inputVal.trim().toLowerCase();
    const targetText = currentCard.english.trim().toLowerCase();
    const isCorrect = userText === targetText;

    speakText(currentCard.english);

    if (isCorrect) {
      setFeedback({ isCorrect: true, text: '拼写正确！🎉' });
      setCompletedCount(prev => prev + 1);

      setTimeout(() => {
        setFeedback(null);
        setInputVal('');
        setShowHint(false);

        if (currentIdx + 1 >= queue.length) {
          // Quiz complete!
          confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
          onCompleteQuiz(queue);
        } else {
          setCurrentIdx(prev => prev + 1);
        }
      }, 1000);
    } else {
      // Incorrect -> Show error & Re-queue word at end
      setFeedback({
        isCorrect: false,
        text: `拼写有误，正确拼写是: "${currentCard.english}"`
      });

      // Append card to end of queue so user encounters it again!
      setQueue(prev => [...prev, currentCard]);

      setTimeout(() => {
        setFeedback(null);
        setInputVal('');
        setShowHint(false);
        setCurrentIdx(prev => prev + 1);
      }, 2200);
    }
  }, [currentCard, feedback, inputVal, currentIdx, queue, onCompleteQuiz]);

  if (!quizCards || quizCards.length === 0) return null;

  // Quiz Finished State
  const isFinished = currentIdx >= queue.length && !feedback;
  if (isFinished) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-mac-content text-center select-none animate-fade-in">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 shadow-lg">
          <Award className="w-10 h-10 animate-bounce" />
        </div>
        <h2 className="text-2xl font-black text-mac-text mb-2">
          🎉 组内拼写测验通关！
        </h2>
        <p className="text-xs text-mac-subtext max-w-md mb-6">
          成功完成了第 {groupIndex + 1} 组 ({initialTotal} 个单词) 的拼写验证，所有单词拼写无误！
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={onRepeatQuiz}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mac-pill-bg hover:bg-mac-hover text-mac-text text-xs font-semibold border border-mac-border transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>重新测验本组</span>
          </button>

          {onNextGroup && (
            <button
              onClick={onNextGroup}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <span>背诵下一组 ({groupIndex + 2}/{totalGroups})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onBackToCards}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-mac-hover text-mac-subtext text-xs font-semibold transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>返回卡片模式</span>
          </button>
        </div>
      </div>
    );
  }

  const progressPercent = Math.min(100, Math.round((completedCount / initialTotal) * 100));

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 bg-mac-content overflow-y-auto select-none">
      {/* Top Header */}
      <div className="w-full max-w-xl flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-mac-subtext font-medium">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[11px] font-semibold border border-emerald-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>拼写验证 • 第 {groupIndex + 1} 组</span>
            </span>
            <span>已通关 {completedCount} / {initialTotal}</span>
          </div>

          <button
            onClick={onBackToCards}
            className="text-xs text-mac-subtext hover:text-mac-text underline"
          >
            退出测验
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-mac-pill-bg rounded-full overflow-hidden border border-mac-border">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Spelling Card Container */}
      <div className="w-full max-w-xl my-6 bg-mac-card-front backdrop-blur-2xl p-8 rounded-2xl border border-mac-card-border shadow-2xl flex flex-col items-center text-center space-y-6">
        {/* Chinese Prompt */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-mac-subtext uppercase tracking-widest bg-mac-pill-bg px-3 py-1 rounded-full border border-mac-border">
            请根据中文提示拼写英文单词
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-mac-text mt-2">
            {currentCard.chinese}
          </h2>

          <div className="flex items-center justify-center gap-3 text-xs text-mac-subtext">
            {currentCard.pos && <span className="text-blue-400 italic font-semibold">{currentCard.pos}</span>}
            {currentCard.phonetic && <span className="font-mono">{currentCard.phonetic}</span>}
            <button
              onClick={() => speakText(currentCard.english)}
              title="按发音提示"
              className="p-1 rounded-full bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Spelling Input Form */}
        <form onSubmit={handleCheck} className="w-full max-w-md space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              autoFocus
              placeholder="请在此输入英文单词 / 词组..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              disabled={!!feedback}
              className={`w-full px-4 py-3 bg-mac-pill-bg border-2 rounded-xl text-center text-lg font-serif tracking-wide text-mac-text focus:outline-none transition-all ${
                feedback
                  ? feedback.isCorrect
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-red-500 bg-red-500/10 text-red-500'
                  : 'border-mac-border focus:border-blue-500'
              }`}
            />

            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              title="提示首字母"
              className="absolute right-3 top-3.5 text-mac-subtext hover:text-mac-text text-xs flex items-center gap-0.5"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
            </button>
          </div>

          {/* Letter Hint Display */}
          {showHint && currentCard && (
            <div className="text-xs font-mono text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 inline-block animate-fade-in">
              首字母提示: {currentCard.english.slice(0, 1)}
              {currentCard.english.slice(1).replace(/[a-zA-Z]/g, ' _')}
            </div>
          )}

          {/* Feedback Banner */}
          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border animate-fade-in ${
              feedback.isCorrect
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                : 'bg-red-500/15 text-red-400 border-red-500/30'
            }`}>
              {feedback.isCorrect ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              <span>{feedback.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!inputVal.trim() || !!feedback}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md transition-all"
          >
            提交拼写验证 (Enter)
          </button>
        </form>
      </div>

      {/* Footer Info */}
      <div className="text-xs text-mac-subtext">
        若拼写错误，单词将自动重新排列至本组末尾，确保组内 100% 正确掌握
      </div>
    </div>
  );
}
