import { QuotaUsage } from '../types';

const QUOTA_STORAGE_KEY = 'nepali_tts_quota_usage_v1';
export const DEFAULT_DAILY_LIMIT = 50000; // 50,000 characters per day

function getTodayKey(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

export function getQuotaUsage(): QuotaUsage {
  const today = getTodayKey();
  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    if (raw) {
      const parsed: QuotaUsage = JSON.parse(raw);
      // If same day, return it
      if (parsed.lastResetDate === today) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse quota usage:', err);
  }

  // New day or first time
  const fresh: QuotaUsage = {
    dailyCharLimit: DEFAULT_DAILY_LIMIT,
    usedCharsToday: 0,
    remainingChars: DEFAULT_DAILY_LIMIT,
    requestsCountToday: 0,
    totalAudioSecondsGenerated: 0,
    lastResetDate: today,
  };
  saveQuotaUsage(fresh);
  return fresh;
}

export function saveQuotaUsage(quota: QuotaUsage): void {
  try {
    localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(quota));
  } catch (err) {
    console.error('Failed to save quota usage:', err);
  }
}

export function recordUsage(charsUsed: number, durationSec = 0): QuotaUsage {
  const current = getQuotaUsage();
  const updatedUsed = current.usedCharsToday + charsUsed;
  const updatedRemaining = Math.max(0, current.dailyCharLimit - updatedUsed);

  const updated: QuotaUsage = {
    ...current,
    usedCharsToday: updatedUsed,
    remainingChars: updatedRemaining,
    requestsCountToday: current.requestsCountToday + 1,
    totalAudioSecondsGenerated: current.totalAudioSecondsGenerated + Math.round(durationSec),
  };

  saveQuotaUsage(updated);
  return updated;
}

export function resetQuotaUsage(): QuotaUsage {
  const fresh: QuotaUsage = {
    dailyCharLimit: DEFAULT_DAILY_LIMIT,
    usedCharsToday: 0,
    remainingChars: DEFAULT_DAILY_LIMIT,
    requestsCountToday: 0,
    totalAudioSecondsGenerated: 0,
    lastResetDate: getTodayKey(),
  };
  saveQuotaUsage(fresh);
  return fresh;
}
