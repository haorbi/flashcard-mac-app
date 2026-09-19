import React from 'react';
import { Award, CheckCircle2, Circle, Layers, Flame, BookOpen, Sparkles, TrendingUp } from 'lucide-react';

export default function StatsView({ decks }) {
  let totalCards = 0;
  let masteredCards = 0;

  decks.forEach(deck => {
    totalCards += deck.cards.length;
    masteredCards += deck.cards.filter(c => c.mastered).length;
  });

  const learningCards = totalCards - masteredCards;
  const overallRate = totalCards > 0 ? Math.round((masteredCards / totalCards) * 100) : 0;

  return (
    <div className="flex-1 bg-mac-content p-8 overflow-y-auto select-none space-y-8">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 p-6 rounded-2xl border border-blue-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
            <span>学习进度看板</span>
          </div>
          <h2 className="text-2xl font-black text-mac-text">
            词汇积累与背诵统计
          </h2>
          <p className="text-xs text-mac-subtext mt-1">
            “日拱一卒，功不唐捐” — 坚持每日背单词，打造流利英语基石。
          </p>
        </div>

        <div className="flex items-center gap-3 bg-mac-header p-3 px-4 rounded-xl border border-mac-border shadow-sm">
          <Flame className="w-8 h-8 text-amber-500 animate-bounce" />
          <div>
            <div className="text-lg font-black text-mac-text">7 天</div>
            <div className="text-[10px] text-mac-subtext font-medium">打卡连续学习</div>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Cards */}
        <div className="p-5 rounded-2xl bg-mac-header border border-mac-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-mac-subtext">
            <span className="text-xs font-semibold">总存储词条</span>
            <Layers className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-mac-text font-mono">{totalCards}</div>
            <div className="text-[11px] text-mac-subtext mt-1">跨 {decks.length} 个词库</div>
          </div>
        </div>

        {/* Mastered */}
        <div className="p-5 rounded-2xl bg-mac-header border border-mac-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-mac-subtext">
            <span className="text-xs font-semibold">已熟练掌握</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-emerald-400 font-mono">{masteredCards}</div>
            <div className="text-[11px] text-mac-subtext mt-1">无需复习词汇</div>
          </div>
        </div>

        {/* Learning */}
        <div className="p-5 rounded-2xl bg-mac-header border border-mac-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-mac-subtext">
            <span className="text-xs font-semibold">待背诵复习</span>
            <Circle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-amber-400 font-mono">{learningCards}</div>
            <div className="text-[11px] text-mac-subtext mt-1">需加强记忆</div>
          </div>
        </div>

        {/* Overall Rate */}
        <div className="p-5 rounded-2xl bg-mac-header border border-mac-border shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-mac-subtext">
            <span className="text-xs font-semibold">总体掌握率</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-indigo-400 font-mono">{overallRate}%</div>
            <div className="w-full h-1.5 bg-mac-pill-bg rounded-full mt-2 overflow-hidden border border-mac-border">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                style={{ width: `${overallRate}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Deck Breakdown */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-mac-text flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-blue-500" />
          <span>各词库学习进度细分</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {decks.map(deck => {
            const dTotal = deck.cards.length;
            const dMastered = deck.cards.filter(c => c.mastered).length;
            const dRate = dTotal > 0 ? Math.round((dMastered / dTotal) * 100) : 0;

            return (
              <div key={deck.id} className="p-4 rounded-xl bg-mac-header border border-mac-border shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-mac-text truncate">{deck.name}</div>
                  <span className="text-xs font-mono font-semibold text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full">
                    {dRate}% 掌握
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-mac-subtext">
                  <span>总词数: {dTotal}</span>
                  <span className="text-emerald-400">已掌握: {dMastered}</span>
                  <span className="text-amber-400">背诵中: {dTotal - dMastered}</span>
                </div>

                <div className="w-full h-2 bg-mac-pill-bg rounded-full overflow-hidden border border-mac-border">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${dRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
