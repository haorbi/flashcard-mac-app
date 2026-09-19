/**
 * Ebbinghaus Spaced Repetition SRS Algorithm (1d Base)
 * Stages:
 * Stage 1: 1 day (24h)
 * Stage 2: 2 days (48h)
 * Stage 3: 4 days (96h)
 * Stage 4: 7 days (168h)
 * Stage 5: 15 days (360h)
 * Stage 6: 30 days (720h)
 */

export const EBBINGHAUS_INTERVALS_DAYS = [1, 2, 4, 7, 15, 30];

export const calculateNextReview = (card, isCorrect) => {
  const currentStage = card.ebbinghausStage || 0;
  let nextStage = 1;

  if (isCorrect) {
    nextStage = Math.min(EBBINGHAUS_INTERVALS_DAYS.length, currentStage + 1);
  } else {
    // Reset to stage 1 if forgotten
    nextStage = 1;
  }

  const intervalDays = EBBINGHAUS_INTERVALS_DAYS[nextStage - 1] || 1;
  const now = Date.now();
  const nextReviewDate = now + intervalDays * 24 * 60 * 60 * 1000;

  return {
    ...card,
    mastered: isCorrect && nextStage >= 5,
    ebbinghausStage: nextStage,
    lastReviewedDate: now,
    nextReviewDate,
    reviewCount: (card.reviewCount || 0) + 1
  };
};

/**
 * Filter cards due for Ebbinghaus review today
 */
export const getDueReviewCards = (cards) => {
  const now = Date.now();
  return cards.filter(card => {
    if (!card.nextReviewDate) return false;
    return card.nextReviewDate <= now;
  });
};

/**
 * Stage display info
 */
export const getStageInfo = (stage = 0) => {
  if (stage === 0) return { label: '未激活', days: 0, color: 'text-mac-subtext' };
  if (stage === 1) return { label: '阶段1 (1天后)', days: 1, color: 'text-amber-500' };
  if (stage === 2) return { label: '阶段2 (2天后)', days: 2, color: 'text-amber-400' };
  if (stage === 3) return { label: '阶段3 (4天后)', days: 4, color: 'text-blue-400' };
  if (stage === 4) return { label: '阶段4 (7天后)', days: 7, color: 'text-indigo-400' };
  if (stage === 5) return { label: '阶段5 (15天后)', days: 15, color: 'text-emerald-400' };
  return { label: '阶段6 (30天长期记忆)', days: 30, color: 'text-emerald-500 font-bold' };
};
