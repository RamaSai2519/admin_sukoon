import axios from 'axios';

const Raxios = axios.create({
  baseURL: 'https://adminapi.sukoon.love',
  // baseURL: 'http://127.0.0.1:8080',
});

export default Raxios;
