import axios from 'axios';

var api = axios.create({
    baseURL: 'http://localhost:5000',
    timeout: 5000, //Tempo limite para as requisições
});

export default api;
