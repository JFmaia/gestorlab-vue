import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'https://gestorlab-api.onrender.com/gestorlab',
  // outras configurações do Axios
});

export default axiosInstance;