import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";



export const registration = async (email, password, username) => {
  const { data } = await $host.post("api/users/", {
    user: {
      email, password, username,
    },
  })
    .catch(e => console.log(`[${e.code}]`, e.message));
  await AsyncStorage.setItem('user',JSON.stringify(data.user))
  return jwtDecode(data.token)
};

export const login = async (email, password) => {
  const { data } = await $host.post("api/users/login/", {
    user: {
      email,
      password
    }
  })
  return data.user
};
