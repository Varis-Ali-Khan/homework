import { all } from 'redux-saga/effects';
import authSaga from '../features/auth/authSaga';
import providerSaga from '../features/providers/providerSaga';
import progressSaga from '../features/progress/progressSaga';

export default function* rootSaga() {
  yield all([authSaga(), providerSaga(), progressSaga()]);
}
