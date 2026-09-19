import React from 'react';
import { Brain, Calendar, Clock, Sparkles, CheckCircle2, Play, Layers } from 'lucide-react';
import { getDueReviewCards, getStageInfo, EBBINGHAUS_INTERVALS_DAYS } from '../utils/ebbinghaus';

export default function EbbinghausView({
  allDecks,
  onStartEbbinghausReview
}) {
  let allCards = [];
  allDecks.forEach(d => {
    allCards.push(...d.cards);
  });

  const dueCards = getDueReviewCards(allCards);

  // Group cards by stage
  const stageCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
  allCards.forEach(c => {
    const s = c.ebbinghausStage || 0;
    if (s > 0) stageCounts[s] = (stageCounts[s] || 0) + 1;
  });

  return (
    <div className="flex-1 bg-mac-content p-8 overflow-y-auto select-none space-y-8">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-600/20 via-purple-600/20 to-blue-600/20 p-6 rounded-2xl border border-amber-500/20 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4 text-amber-400" />
            <span>艾宾浩斯记忆曲线引擎 (1d 起步)</span>
          </div>
          <h2 className="text-2xl font-black text-mac-text">
            智能间隔复习看板
          </h2>
          <p className="text-xs text-mac-subtext mt-1">
            基于艾宾浩斯遗忘曲线：1天 ➔ 2天 ➔ 4天 ➔ 7天 ➔ 15天 ➔ 30天，科学抗遗忘。
          </p>
        </div>

        {dueCards.length > 0 ? (
          <button
            onClick={() => onStartEbbinghausReview(dueCards)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs shadow-lg transition-all animate-pulse"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>开始复习今日待复习 ({dueCards.length} 词)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-xs border border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>今日艾宾浩斯任务已全部完成！</span>
          </div>
        )}
      </div>

      {/* Ebbinghaus Stages Visual Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-mac-text flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          <span>遗忘曲线复习阶段分布 (起始间隔: 1 天)</span>
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {EBBINGHAUS_INTERVALS_DAYS.map((days, idx) => {
            const stage = idx + 1;
            const info = getStageInfo(stage);
            const count = stageCounts[stage] || 0;

            return (
              <div key={stage} className="p-4 rounded-xl bg-mac-header border border-mac-border shadow-sm flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-mac-subtext">
                  <span>第 {stage} 阶段</span>
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                </div>
                <div>
                  <div className={`text-2xl font-black font-mono ${info.color}`}>
                    {count} 词
                  </div>
                  <div className="text-[11px] text-mac-subtext mt-1">
                    {days} 天后复习
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Due Cards List Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-mac-text flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>今日到期需复习词汇清单 ({dueCards.length})</span>
          </h3>

          {dueCards.length > 0 && (
            <button
              onClick={() => onStartEbbinghausReview(dueCards)}
              className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>立即全量复习</span>
              <Play className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="border border-mac-border rounded-xl bg-mac-header overflow-hidden">
          {dueCards.length === 0 ? (
            <div className="p-8 text-center text-xs text-mac-subtext space-y-1">
              <div className="font-semibold text-mac-text">暂无需要复习的词条</div>
              <div>随着您背诵新卡片，符合 1天、2天、4天等间隔的词条将自动在此提醒复习！</div>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-mac-sidebar text-mac-subtext border-b border-mac-border">
                <tr>
                  <th className="p-3">英文单词</th>
                  <th className="p-3">中文释义</th>
                  <th className="p-3">艾宾浩斯当前阶段</th>
                  <th className="p-3">上次复习时间</th>
                  <th className="p-3 text-right pr-4">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mac-border">
                {dueCards.map(card => {
                  const stageInfo = getStageInfo(card.ebbinghausStage);
                  const lastDateStr = card.lastReviewedDate 
                    ? new Date(card.lastReviewedDate).toLocaleDateString()
                    : '尚未背诵';

                  return (
                    <tr key={card.id} className="hover:bg-mac-hover">
                      <td className="p-3 font-semibold text-mac-text font-serif text-sm">
                        {card.english}
                      </td>
                      <td className="p-3 text-mac-text font-medium">
                        {card.chinese}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-mac-pill-bg border border-mac-border ${stageInfo.color}`}>
                          {stageInfo.label}
                        </span>
                      </td>
                      <td className="p-3 text-mac-subtext text-[11px] font-mono">
                        {lastDateStr}
                      </td>
                      <td className="p-3 text-right pr-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-500 border border-amber-500/30">
                          到期需复习
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
