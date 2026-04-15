import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Level
  level: null,
  loading: false,
  error: null,

  // Achievements
  achievements: null,
  achievementsLoading: false,
  achievementsError: null,

  // Badges
  badges: null,
  badgesLoading: false,
  badgesError: null,

  // XP Summary
  xpSummary: null,
  xpSummaryLoading: false,
  xpSummaryError: null,

  // XP History
  xpHistory: [],
  xpHistoryMeta: null,
  xpHistoryLoading: false,
  xpHistoryError: null,

  // Streak Calendar — keyed by streakType: global | fitness | nutrition
  streakCalendar: { global: null, fitness: null, nutrition: null },
  streakCalendarLoading: { global: false, fitness: false, nutrition: false },
  streakCalendarError: { global: null, fitness: null, nutrition: null },

  // XP Calendar — keyed by domain: global | fitness | nutrition
  xpCalendarGlobal: null,
  xpCalendarFitness: null,
  xpCalendarNutrition: null,
  xpCalendarLoading: { global: false, fitness: false, nutrition: false },
  xpCalendarError: { global: null, fitness: null, nutrition: null },

  // XP Day — keyed by domain
  xpDayGlobal: null,
  xpDayFitness: null,
  xpDayNutrition: null,
  xpDayLoading: { global: false, fitness: false, nutrition: false },
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    // ── Level ──────────────────────────────────────────────
    fetchLevelRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLevelSuccess(state, action) {
      state.loading = false;
      state.level = action.payload;
    },
    fetchLevelFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

    // ── Achievements ───────────────────────────────────────
    fetchAchievementsRequest(state) {
      state.achievementsLoading = true;
      state.achievementsError = null;
    },
    fetchAchievementsSuccess(state, action) {
      state.achievementsLoading = false;
      state.achievements = action.payload;
    },
    fetchAchievementsFailure(state, action) {
      state.achievementsLoading = false;
      state.achievementsError = action.payload;
    },

    // ── Badges ─────────────────────────────────────────────
    fetchBadgesRequest(state) {
      state.badgesLoading = true;
      state.badgesError = null;
    },
    fetchBadgesSuccess(state, action) {
      state.badgesLoading = false;
      state.badges = action.payload;
    },
    fetchBadgesFailure(state, action) {
      state.badgesLoading = false;
      state.badgesError = action.payload;
    },

    // ── XP Summary ─────────────────────────────────────────
    fetchXpSummaryRequest(state) {
      state.xpSummaryLoading = true;
      state.xpSummaryError = null;
    },
    fetchXpSummarySuccess(state, action) {
      state.xpSummaryLoading = false;
      state.xpSummary = action.payload;
    },
    fetchXpSummaryFailure(state, action) {
      state.xpSummaryLoading = false;
      state.xpSummaryError = action.payload;
    },

    // ── XP History ─────────────────────────────────────────
    fetchXpHistoryRequest(state) {
      state.xpHistoryLoading = true;
      state.xpHistoryError = null;
    },
    fetchXpHistorySuccess(state, action) {
      state.xpHistoryLoading = false;
      state.xpHistory = action.payload.data;
      state.xpHistoryMeta = action.payload.meta;
    },
    fetchXpHistoryFailure(state, action) {
      state.xpHistoryLoading = false;
      state.xpHistoryError = action.payload;
    },

    // ── Streak Calendar ────────────────────────────────────
    fetchStreakCalendarRequest(state, action) {
      const { streakType } = action.payload;
      state.streakCalendarLoading[streakType] = true;
      state.streakCalendarError[streakType] = null;
    },
    fetchStreakCalendarSuccess(state, action) {
      const { streakType, data } = action.payload;
      state.streakCalendarLoading[streakType] = false;
      state.streakCalendar[streakType] = data;
    },
    fetchStreakCalendarFailure(state, action) {
      const { streakType, error } = action.payload;
      state.streakCalendarLoading[streakType] = false;
      state.streakCalendarError[streakType] = error;
    },

    // ── XP Calendar ────────────────────────────────────────
    fetchXpCalendarRequest(state, action) {
      const { domain } = action.payload;
      state.xpCalendarLoading[domain] = true;
      state.xpCalendarError[domain] = null;
    },
    fetchXpCalendarSuccess(state, action) {
      const { domain, data } = action.payload;
      state.xpCalendarLoading[domain] = false;
      if (domain === 'global') state.xpCalendarGlobal = data;
      else if (domain === 'fitness') state.xpCalendarFitness = data;
      else state.xpCalendarNutrition = data;
    },
    fetchXpCalendarFailure(state, action) {
      const { domain, error } = action.payload;
      state.xpCalendarLoading[domain] = false;
      state.xpCalendarError[domain] = error;
    },

    // ── XP Day ─────────────────────────────────────────────
    fetchXpDayRequest(state, action) {
      const { domain } = action.payload;
      state.xpDayLoading[domain] = true;
    },
    fetchXpDaySuccess(state, action) {
      const { domain, data } = action.payload;
      state.xpDayLoading[domain] = false;
      if (domain === 'global') state.xpDayGlobal = data;
      else if (domain === 'fitness') state.xpDayFitness = data;
      else state.xpDayNutrition = data;
    },
    fetchXpDayFailure(state, action) {
      const { domain } = action.payload;
      state.xpDayLoading[domain] = false;
    },
  },
});

export const {
  fetchLevelRequest, fetchLevelSuccess, fetchLevelFailure,
  fetchAchievementsRequest, fetchAchievementsSuccess, fetchAchievementsFailure,
  fetchBadgesRequest, fetchBadgesSuccess, fetchBadgesFailure,
  fetchXpSummaryRequest, fetchXpSummarySuccess, fetchXpSummaryFailure,
  fetchXpHistoryRequest, fetchXpHistorySuccess, fetchXpHistoryFailure,
  fetchStreakCalendarRequest, fetchStreakCalendarSuccess, fetchStreakCalendarFailure,
  fetchXpCalendarRequest, fetchXpCalendarSuccess, fetchXpCalendarFailure,
  fetchXpDayRequest, fetchXpDaySuccess, fetchXpDayFailure,
} = progressSlice.actions;

export default progressSlice.reducer;
