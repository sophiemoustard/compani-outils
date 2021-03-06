import AsyncStorage from '@react-native-async-storage/async-storage';
import CompaniDate from './dates/companiDates';

const isTokenValid = (token: string | null, tokenExpireDate: string | null): boolean =>
  !!token && !!tokenExpireDate && CompaniDate().isBefore(tokenExpireDate);

interface CompaniToken {
  companiToken: string | null,
  companiTokenExpireDate: string | null,
}

const setCompaniToken = async (token: string, tokenExpireDate: string): Promise<void> => {
  await AsyncStorage.setItem('companiToken', token);
  await AsyncStorage.setItem('companiTokenExpireDate', tokenExpireDate);
};

const getCompaniToken = async (): Promise<CompaniToken> => ({
  companiToken: await AsyncStorage.getItem('companiToken'),
  companiTokenExpireDate: await AsyncStorage.getItem('companiTokenExpireDate'),
});

const removeCompaniToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('companiToken');
  await AsyncStorage.removeItem('companiTokenExpireDate');
};

interface RefreshToken {
  refreshToken: string | null,
  refreshTokenExpireDate: string | null,
}

const setRefreshToken = async (token: string): Promise<void> => {
  const refreshTokenExpireDate = CompaniDate().add({ years: 1 }).toISO();
  await AsyncStorage.setItem('refreshToken', token);
  await AsyncStorage.setItem('refreshTokenExpireDate', refreshTokenExpireDate);
};

const getRefreshToken = async (): Promise<RefreshToken> => ({
  refreshToken: await AsyncStorage.getItem('refreshToken'),
  refreshTokenExpireDate: await AsyncStorage.getItem('refreshTokenExpireDate'),
});

const removeRefreshToken = async (): Promise<void> => {
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('refreshTokenExpireDate');
};

const setUserId = async (id: string): Promise<void> => AsyncStorage.setItem('userId', id);

const getUserId = async (): Promise<string|null> => AsyncStorage.getItem('userId');

const removeUserId = async (): Promise<void> => AsyncStorage.removeItem('userId');

export default {
  isTokenValid,
  setCompaniToken,
  getCompaniToken,
  removeCompaniToken,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken,
  setUserId,
  getUserId,
  removeUserId,
};
