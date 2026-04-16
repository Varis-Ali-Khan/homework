import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import {
  fetchLevelRequest, fetchLevelSuccess, fetchLevelFailure,
  fetchAchievementsRequest, fetchAchievementsSuccess, fetchAchievementsFailure,
  fetchBadgesRequest, fetchBadgesSuccess, fetchBadgesFailure,
  fetchXpSummaryRequest, fetchXpSummarySuccess, fetchXpSummaryFailure,
  fetchXpHistoryRequest, fetchXpHistorySuccess, fetchXpHistoryFailure,
  fetchStreakCalendarRequest, fetchStreakCalendarSuccess, fetchStreakCalendarFailure,
  fetchXpCalendarRequest, fetchXpCalendarSuccess, fetchXpCalendarFailure,
  fetchXpDayRequest, fetchXpDaySuccess, fetchXpDayFailure,
} from './progressSlice';

// API calls — co-located with the progress saga
// Token is automatically attached by the axios interceptor in services/api.js
const levelApi = () => api.get('/gamification/overview');
const achievementsApi = () => api.get('/gamification/achievements/catalog?unlockedOnly=false');
const badgesApi = () => api.get('/gamification/badges');
const xpSummaryApi = () => api.get('/gamification/xp/summary');
const xpHistoryApi = (page) => api.get(`/gamification/xp/history?limit=10&page=${page}`);
const streakCalendarApi = (streakType, year, month) =>
  api.get(`/gamification/streaks/calendar?year=${year}&month=${month}&type=${streakType}`);
const xpCalendarApi = (domain, year, month) =>
  domain === 'global'
    ? api.get(`/gamification/xp/calendar?year=${year}&month=${month}`)
    : api.get(`/gamification/xp/calendar/${domain}?year=${year}&month=${month}`);
const xpDayApi = (domain, date) =>
  domain === 'global'
    ? api.get(`/gamification/xp/day?date=${date}`)
    : api.get(`/gamification/xp/day/${domain}?date=${date}`);

// ── Handlers ────────────────────────────────────────────────────────────────

function* handleFetchLevel() {
  try {
    const { data } = yield call(levelApi);
    yield put(fetchLevelSuccess(data));
  } catch (error) {
    yield put(fetchLevelFailure(error.message || 'Failed to fetch level progress'));
  }
}

function* handleFetchAchievements() {
  try {
    const { data } = yield call(achievementsApi);
    yield put(fetchAchievementsSuccess(data));
  } catch (error) {
    yield put(fetchAchievementsFailure(error.message || 'Failed to fetch achievements'));
  }
}

function* handleFetchBadges() {
  try {
    const { data } = yield call(badgesApi);
    yield put(fetchBadgesSuccess(data));
  } catch (error) {
    yield put(fetchBadgesFailure(error.message || 'Failed to fetch badges'));
  }
}

function* handleFetchXpSummary() {
  try {
    const { data } = yield call(xpSummaryApi);
    yield put(fetchXpSummarySuccess(data));
  } catch (error) {
    yield put(fetchXpSummaryFailure(error.message || 'Failed to fetch XP summary'));
  }
}

function* handleFetchXpHistory(action) {
  const { page } = action.payload;
  try {
    const { data: raw } = yield call(xpHistoryApi, page);
    const data = Array.isArray(raw) ? raw : (raw?.data ?? []);
    const meta = raw?.meta ?? { total: data.length, page, limit: 10, totalPages: 1 };
    yield put(fetchXpHistorySuccess({ data, meta }));
  } catch (error) {
    yield put(fetchXpHistoryFailure(error.message || 'Failed to fetch XP history'));
  }
}

function* handleFetchStreakCalendar(action) {
  const { streakType, year, month } = action.payload;
  try {
    const { data } = yield call(streakCalendarApi, streakType, year, month);
    yield put(fetchStreakCalendarSuccess({ streakType, data }));
  } catch (error) {
    yield put(fetchStreakCalendarFailure({
      streakType,
      error: error.message || 'Failed to fetch streak calendar',
    }));
  }
}

function* handleFetchXpCalendar(action) {
  const { domain, year, month } = action.payload;
  try {
    const { data } = yield call(xpCalendarApi, domain, year, month);
    yield put(fetchXpCalendarSuccess({ domain, data }));
  } catch (error) {
    yield put(fetchXpCalendarFailure({
      domain,
      error: error.message || 'Failed to fetch XP calendar',
    }));
  }
}

function* handleFetchXpDay(action) {
  const { domain, date } = action.payload;
  try {
    const { data } = yield call(xpDayApi, domain, date);
    yield put(fetchXpDaySuccess({ domain, data }));
  } catch {
    yield put(fetchXpDayFailure({ domain }));
  }
}

// ── Watcher ─────────────────────────────────────────────────────────────────

export default function* progressSaga() {
  yield takeLatest(fetchLevelRequest.type, handleFetchLevel);
  yield takeLatest(fetchAchievementsRequest.type, handleFetchAchievements);
  yield takeLatest(fetchBadgesRequest.type, handleFetchBadges);
  yield takeLatest(fetchXpSummaryRequest.type, handleFetchXpSummary);
  yield takeLatest(fetchXpHistoryRequest.type, handleFetchXpHistory);
  yield takeEvery(fetchStreakCalendarRequest.type, handleFetchStreakCalendar);
  yield takeEvery(fetchXpCalendarRequest.type, handleFetchXpCalendar);
  yield takeEvery(fetchXpDayRequest.type, handleFetchXpDay);
}
