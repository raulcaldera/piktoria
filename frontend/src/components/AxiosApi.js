import axios from 'axios';

const AxiosApi = axios.create({
    baseURL: `http://localhost:3001/`
  })

export default AxiosApi;