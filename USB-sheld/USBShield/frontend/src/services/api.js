import axios from 'axios';

const API_BASE = '/api';

export const fetchStatus = async () => {
  const response = await axios.get(`${API_BASE}/status`, { timeout: 4000 });
  return response.data;
};

export const fetchDrives = async () => {
  const response = await axios.get(`${API_BASE}/drives`, { timeout: 4000 });
  return response.data;
};

export const fetchEvents = async () => {
  const response = await axios.get(`${API_BASE}/events`, { timeout: 4000 });
  return response.data;
};

export const triggerScan = async () => {
  const response = await axios.post(`${API_BASE}/scan`, {}, { timeout: 8000 });
  return response.data;
};

export const setDemoMode = async (mode) => {
  const response = await axios.post(`${API_BASE}/demo/mode`, { mode }, { timeout: 4000 });
  return response.data;
};
