import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../../services/api';
import { getToken, getUser, storeToken, storeUser, clearStorage } from '../../utils/storage';
import {
  initAuth,
  restoreSession,
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  logout,
} from './authSlice';

// API calls — co-located with the auth saga
const loginApi = (data) => api.post('/auth/login', data);
const signupApi = (data) => api.post('/auth/signup', data);

// Check AsyncStorage on app start and restore session if token exists
function* handleInitAuth() {
  try {
    const token = yield call(getToken);
    const user = yield call(getUser);
    yield put(restoreSession({ user: user || null, token: token || null }));
  } catch {
    yield put(restoreSession({ user: null, token: null }));
  }
}

function* handleLogin(action) {
  try {
    const { data } = yield call(loginApi, action.payload);
    yield call(storeToken, data.token);
    yield call(storeUser, data.user);
    yield put(loginSuccess({ user: data.user, token: data.token }));
  } catch (error) {
    yield put(loginFailure(error.response?.data?.message || 'Login failed. Please try again.'));
  }
}

function* handleSignup(action) {
  try {
    const { data } = yield call(signupApi, action.payload);
    yield call(storeToken, data.token);
    yield call(storeUser, data.user);
    yield put(signupSuccess({ user: data.user, token: data.token }));
  } catch (error) {
    yield put(signupFailure(error.response?.data?.message || 'Signup failed. Please try again.'));
  }
}

function* handleLogout() {
  yield call(clearStorage);
}

export default function* authSaga() {
  yield takeLatest(initAuth.type, handleInitAuth);
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(signupRequest.type, handleSignup);
  yield takeLatest(logout.type, handleLogout);
}
