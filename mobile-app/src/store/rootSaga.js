import { all } from 'redux-saga/effects';
import authSaga from '../redux/auth/authSaga';
import providerSaga from '../redux/providers/providerSaga';
import progressSaga from '../redux/progress/progressSaga';

export default function* rootSaga() {
  yield all([authSaga(), providerSaga(), progressSaga()]);
}
