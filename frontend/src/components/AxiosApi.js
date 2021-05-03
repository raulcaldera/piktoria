import axios from 'axios';

const AxiosApi = axios.create({
	baseURL: process.env.BACKEND_URL,
	withCredentials: true
})

export default AxiosApi;