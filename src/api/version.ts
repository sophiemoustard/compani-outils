import axios from 'axios';
import Constants from 'expo-constants';
import getEnvVars from '../../environment';
import { ERP } from '../data/constants';

export default {
  shouldUpdate: async () => {
    const { baseURL } = getEnvVars();
    const params = { mobileVersion: Constants.manifest.version, appName: ERP };

    const response = await axios.get(`${baseURL}/version/should-update`, { params });
    return response.data.data;
  },
};
