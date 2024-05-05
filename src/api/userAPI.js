import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const registration = async (email, password, username) => {
    const {data} = await $host.post("api/users/", {

        email, password, username,

    })
        .catch(e => console.log(`[${e.code}]`, e.message));
    await AsyncStorage.setItem('user', JSON.stringify(data))
    return jwtDecode(data.token)
};

export const login = async (email, password) => {
    const {data} = await $host.post("api/users/login/", {
        email,
        password
    })

    console.log(data)

    return data
};

export const getUserData = async (userId) => {
    const {data} = await $host.get("api/users/" + userId)
    return data
}
