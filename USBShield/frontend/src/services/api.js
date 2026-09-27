import axios from 'axios';

const API_BASE = '/api';

export const fetchStatus = async () => {
  const response = await axios.get(`${API_BASE}/status`, { timeout: 15000 });
  return response.data;
};

export const fetchDrives = async () => {
  const response = await axios.get(`${API_BASE}/drives`, { timeout: 15000 });
  return response.data;
};

export const fetchEvents = async () => {
  const response = await axios.get(`${API_BASE}/events`, { timeout: 15000 });
  return response.data;
};

export const triggerScan = async () => {
  const response = await axios.post(`${API_BASE}/scan`, {}, { timeout: 20000 });
  return response.data;
};

export const setDemoMode = async (mode) => {
  const response = await axios.post(`${API_BASE}/demo/mode`, { mode }, { timeout: 15000 });
  return response.data;
};
