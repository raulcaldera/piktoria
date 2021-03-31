import axios from 'axios';

const AxiosApi = axios.create({
    baseURL: `http://localhost:3001/`,
    withCredentials: true
  })

export default AxiosApi;