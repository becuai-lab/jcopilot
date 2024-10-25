import axios from 'axios';

import { BASE_URL, BASE_PORT, BASE_URL_PORT } from './API_URL';

axios.defaults.withCredentials = true;
axios.defaults.headers.common['Content-Security-Policy'] = "font-src 'self'; script-src 'self'; img-src 'self'; style-src 'self'; object-src 'none'";
axios.defaults.headers.common['X-XSS-Protection'] = '1; mode = block';
axios.defaults.headers.common['X-Frame-Options'] = 'DENY';
axios.defaults.headers.common['Feature-Policy'] =
  "accelerometer 'none'; ambient-light-sensor 'none'; autoplay 'none'; camera 'none'; encrypted-media 'none'; fullscreen 'self'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; midi 'none'; payment 'none'; picture-in-picture 'none'; speaker 'none'; sync-xhr 'none'; usb 'none'; vr 'none';";
axios.defaults.headers.common['Referrer-Policy'] = 'no-referrer';
axios.defaults.headers.common['Cache-Control'] = 'no-cache, max-age=60000';

export const AxiosInstance = axios.create({
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT',
  },
  method: 'POST',
  baseURL: BASE_URL_PORT,
  proxy: { host: BASE_URL, port: BASE_PORT, protocol: BASE_PORT === 443 ? 'https' : 'http' },
});

export const AxiosInstanceFileDownload = axios.create({
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'POST',
  },
  responseType: 'blob',
  method: 'POST',
  baseURL: BASE_URL_PORT,
  proxy: { host: BASE_URL, port: BASE_PORT, protocol: BASE_PORT === 443 ? 'https' : 'http' },
});

export const AxiosInstanceDelete = axios.create({
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'DELETE',
  },
  method: 'DELETE',
  baseURL: BASE_URL_PORT,
  proxy: { host: BASE_URL, port: BASE_PORT, protocol: BASE_PORT === 443 ? 'https' : 'http' },
});

export const AxiosInstanceNotBaseURL = axios.create({
  withCredentials: false,
  headers: {
    'Access-Control-Allow-Credentials': true,
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET,POST',
  },
  method: 'POST',
});
