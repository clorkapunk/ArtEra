import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
const REACT_APP_API_URL = 'http://10.0.2.2:8000/'


const $host = axios.create({
  baseURL: REACT_APP_API_URL,
  timeout: 5000
})

const $authHost = axios.create({
  baseURL: REACT_APP_API_URL,
  timeout: 5000
})

const authInterceptor = config => {
  config.headers.authorization = `Bearer ${async () => { return await AsyncStorage.getItem("token")}}`
  return config
}

$authHost.interceptors.request.use(authInterceptor)

export {
  $host,
  $authHost
}
