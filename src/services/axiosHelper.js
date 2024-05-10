import axios from 'axios';

const Raxios = axios.create({
  baseURL: 'https://adminapi.sukoon.love',
});

export default Raxios;
