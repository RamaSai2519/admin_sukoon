import axios from 'axios';

const Raxios = axios.create({
  baseURL: 'http://adminapi.sukoon.love',
});

export default Raxios;
