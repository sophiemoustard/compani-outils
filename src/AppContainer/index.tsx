import { useEffect, useState, useRef, useContext, useCallback } from 'react';
import { StatusBar, AppState, View } from 'react-native';
import { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import axiosNotLogged from '../api/axios/notLogged';
import axiosLogged from '../api/axios/logged';
import Version from '../api/Versions';
import { Context as AuthContext } from '../context/AuthContext';
import { ACTIVE_STATE } from '../core/data/constants';
import asyncStorage from '../core/helpers/asyncStorage';
import UpdateAppModal from '../components/modals/UpdateAppModal';
import MaintenanceModal from '../components/modals/MaintenanceModal';
import AppNavigation from '../navigation/AppNavigation';
import { WHITE } from '../styles/colors';
import styles from './styles';

type AppContainerProps = {
  onLayout: () => void,
}

const AppContainer = ({ onLayout }: AppContainerProps) => {
  const [updateAppVisible, setUpdateAppVisible] = useState<boolean>(false);
  const [maintenanceModaleVisible, setMaintenanceModalVisible] = useState<boolean>(false);
  const [axiosInitialized, setAxiosInitialized] = useState<boolean>(false);
  const axiosLoggedRequestInterceptorId = useRef<number | null>(null);
  const axiosLoggedResponseInterceptorId = useRef<number | null>(null);
  const { refreshLoggedUser, companiToken, signOut, refreshCompaniToken } = useContext(AuthContext);

  const handleApiUnavailability = (error: AxiosError) => {
    setMaintenanceModalVisible(true);
    return Promise.reject(error);
  };

  const handleAxiosNotLoggedValidResponse = (response: AxiosResponse) => {
    setMaintenanceModalVisible(false);
    return response;
  };

  const handleAxiosNotLoggedErrorResponse = useCallback(async (error: AxiosError) => {
    const statusCode = error?.response?.status;
    if (statusCode && [502, 503].includes(statusCode)) return handleApiUnavailability(error);
    return Promise.reject(error);
  }, []);

  const initializeAxiosNotLogged = useCallback(() => axiosNotLogged.interceptors
    .response
    .use(handleAxiosNotLoggedValidResponse, handleAxiosNotLoggedErrorResponse),
  [handleAxiosNotLoggedErrorResponse]);

  const shouldUpdate = async (nextState: string) => {
    try {
      if (nextState === ACTIVE_STATE) {
        const { mustUpdate } = await Version.shouldUpdate();
        setUpdateAppVisible(mustUpdate);
      }
    } catch (e) {
      setUpdateAppVisible(false);
      console.error(e);
    }
  };

  useEffect(() => {
    initializeAxiosNotLogged();
    setAxiosInitialized(true);
    shouldUpdate(ACTIVE_STATE);
    const { remove } = AppState.addEventListener('change', shouldUpdate);

    return () => { remove(); };
  }, [initializeAxiosNotLogged]);

  const handleUnauthorizedRequest = useCallback(async (error: AxiosError) => {
    const storedTokens = await asyncStorage.getCompaniToken();
    if (asyncStorage.isTokenValid(storedTokens.companiToken, storedTokens.companiTokenExpireDate)) {
      await signOut();
      return Promise.reject(error);
    } // handle invalid refreshToken reception from api which trigger infinite 401 calls

    await asyncStorage.removeCompaniToken();
    const { refreshToken } = await asyncStorage.getRefreshToken();
    await refreshCompaniToken(refreshToken);

    const refreshedStoredTokens = await asyncStorage.getCompaniToken();

    if (asyncStorage.isTokenValid(refreshedStoredTokens.companiToken, refreshedStoredTokens.companiTokenExpireDate)) {
      const config = { ...error.config };
      if (config.headers) config.headers['x-access-token'] = refreshedStoredTokens.companiToken || '';
      return axiosLogged.request(config);
    }

    await signOut();
    return Promise.reject(error);
  }, [signOut, refreshCompaniToken]);

  const handleAxiosLoggedRequest = useCallback(async (config: AxiosRequestConfig) => {
    const newConfig = { ...config };
    if (newConfig.headers) newConfig.headers['x-access-token'] = companiToken || '';
    return newConfig;
  }, [companiToken]);

  const handleAxiosLoggedErrorResponse = useCallback(async (error: AxiosError) => {
    const statusCode = error?.response?.status;
    if (statusCode === 401) return handleUnauthorizedRequest(error);
    if (statusCode && [502, 503].includes(statusCode)) return handleApiUnavailability(error);
    return Promise.reject(error);
  }, [handleUnauthorizedRequest]);

  const initializeAxiosLogged = useCallback(() => {
    if (axiosLoggedRequestInterceptorId.current !== null) {
      axiosLogged.interceptors.request.eject(axiosLoggedRequestInterceptorId.current);
    }

    axiosLoggedRequestInterceptorId.current = axiosLogged.interceptors
      .request
      .use(handleAxiosLoggedRequest, err => Promise.reject(err));

    if (axiosLoggedResponseInterceptorId.current !== null) {
      axiosLogged.interceptors.response.eject(axiosLoggedResponseInterceptorId.current);
    }

    axiosLoggedResponseInterceptorId.current = axiosLogged.interceptors
      .response
      .use(response => response, handleAxiosLoggedErrorResponse);
  }, [handleAxiosLoggedRequest, handleAxiosLoggedErrorResponse]);

  useEffect(() => {
    const refreshUser = async () => {
      try {
        await refreshLoggedUser();
      } catch (e) {
        console.error(e);
      }
    };

    initializeAxiosLogged();
    if (companiToken) refreshUser();
  }, [refreshLoggedUser, companiToken, initializeAxiosLogged]);

  if (!axiosInitialized) return null;

  if (maintenanceModaleVisible) return <MaintenanceModal />;
  if (updateAppVisible) return <UpdateAppModal />;

  return (
    <>
      <View style={styles().statusBar}>
        <StatusBar translucent barStyle="dark-content" backgroundColor={WHITE} />
      </View>
      <SafeAreaProvider onLayout={onLayout}>
        <AppNavigation />
      </SafeAreaProvider>
    </>
  );
};

export default AppContainer;
