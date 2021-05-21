import axiosLogged from './axios/logged';
import Environment from '../../environment';
import { EventTypeEnum } from '../types/EventType';

export default {
  events: async (params: { auxiliary: string, startDate: Date, endDate: Date, type: EventTypeEnum }) => {
    const { baseURL } = Environment.getEnvVars();
    const events = await axiosLogged.get(`${baseURL}/events`, { params });
    return events.data.data.events;
  },
  timeStampEvent: async (id: string, data: object) => {
    const { baseURL } = Environment.getEnvVars();
    await axiosLogged.put(`${baseURL}/events/${id}/timestamping`, data);
  },
};
