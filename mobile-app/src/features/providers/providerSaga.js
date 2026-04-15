import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from '../../services/api';
import { storeUser } from '../../utils/storage';
import { profileSetupDone } from '../auth/authSlice';
import {
  fetchProvidersRequest,
  fetchProvidersSuccess,
  fetchProvidersFailure,
  setupProfileRequest,
  setupProfileSuccess,
  setupProfileFailure,
} from './providerSlice';

// API calls — co-located with the providers saga
const fetchProvidersApi = (search = '') =>
  api.get(search ? `/providers?service=${search}` : '/providers');
const setupProfileApi = (data) => api.post('/providers/profile', data);

function* handleFetchProviders(action) {
  try {
    const { data } = yield call(fetchProvidersApi, action.payload?.search);
    yield put(fetchProvidersSuccess(data));
  } catch (error) {
    yield put(fetchProvidersFailure(error.message || 'Failed to fetch providers.'));
  }
}

function* handleSetupProfile(action) {
  try {
    yield call(setupProfileApi, action.payload);
    yield put(setupProfileSuccess());

    // Mark profileComplete in auth state and persist updated user to storage
    yield put(profileSetupDone());
    const updatedUser = yield select((state) => state.auth.user);
    yield call(storeUser, updatedUser);
  } catch (error) {
    yield put(setupProfileFailure(error.response?.data?.message || 'Failed to save profile.'));
  }
}

export default function* providerSaga() {
  yield takeLatest(fetchProvidersRequest.type, handleFetchProviders);
  yield takeLatest(setupProfileRequest.type, handleSetupProfile);
}
