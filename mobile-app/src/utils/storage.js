import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = (token) => AsyncStorage.setItem('token', token);
export const getToken = () => AsyncStorage.getItem('token');

export const storeUser = (user) =>
  AsyncStorage.setItem('user', JSON.stringify(user));

export const getUser = async () => {
  const u = await AsyncStorage.getItem('user');
  return u ? JSON.parse(u) : null;
};

export const clearStorage = () => AsyncStorage.clear();
