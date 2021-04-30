import React, { useEffect, useState, useContext } from 'react';
import { AppState } from 'react-native';
import { AxiosRequestConfig } from 'axios';
import axiosNotLogged from '../api/axios/notLogged';
import axiosLogged from '../api/axios/logged';
import Version from '../api/Versions';
import { ACTIVE_STATE } from '../core/data/constants';
import UpdateAppModal from '../components/modals/UpdateAppModal';
import MaintenanceModal from '../components/modals/MaintenanceModal';
import AppNavigation from '../navigation/AppNavigation';
import { Context as AuthContext } from '../context/AuthContext';

const AppContainer = () => {
  const [updateAppVisible, setUpdateAppVisible] = useState<boolean>(false);
  const [maintenanceModaleVisible, setMaintenanceModalVisible] = useState<boolean>(false);
  const [axiosInitialized, setAxiosInitialized] = useState<boolean>(false);
  const [loggedAxiosInterceptorId, setLoggedAxiosInterceptorId] = useState<number | null>(null);
  const { companiToken, refreshLoggedUser } = useContext(AuthContext);

  const initializeNotLoggedAxios = () => {
    axiosNotLogged.interceptors.response.use(
      (response) => {
        setMaintenanceModalVisible(false);
        return response;
      },
      async (error) => {
        if ([502, 503].includes(error.response.status)) setMaintenanceModalVisible(true);
        return Promise.reject(error.response);
      }
    );
  };

  const initializeLoggedAxios = (token: string | null) => {
    if (loggedAxiosInterceptorId !== null) axiosLogged.interceptors.request.eject(loggedAxiosInterceptorId);

    const interceptorId = axiosLogged.interceptors.request.use(
      async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
        const newConfig = { ...config };
        newConfig.headers.common['x-access-token'] = token;
        return newConfig;
      },
      err => Promise.reject(err)
    );

    setLoggedAxiosInterceptorId(interceptorId);
  };

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
    const refreshUser = async () => {
      try {
        await refreshLoggedUser();
      } catch (e) {
        console.error(e);
      }
    };

    initializeLoggedAxios(companiToken);
    if (companiToken) refreshUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companiToken]);

  useEffect(() => {
    initializeNotLoggedAxios();
    setAxiosInitialized(true);
    shouldUpdate(ACTIVE_STATE);
    AppState.addEventListener('change', shouldUpdate);

    return () => { AppState.removeEventListener('change', shouldUpdate); };
  }, []);

  if (!axiosInitialized) return null;

  return (
    <>
      <MaintenanceModal visible={maintenanceModaleVisible} />
      <UpdateAppModal visible={updateAppVisible} />
      <AppNavigation />
    </>
  );
};

export default AppContainer;
