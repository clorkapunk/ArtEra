import {$authHost, $host} from "./index";
import {jwtDecode} from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const registration = async (email, password, username) => {
    const {data} = await $host.post("api/users/", {
        email, password, username,
    })
    await AsyncStorage.setItem('user', JSON.stringify(data))
    return jwtDecode(data.token)
};

export const login = async (email, password) => {
    const {data} = await $host.post("api/users/login/", {
        email,
        password
    })
    return data
};

export const getUserData = async (userId) => {
    const {data} = await $host.get("api/users/" + userId)
    return data
}

export const editUserData = async (userId, formData) => {

    console.log(formData)
    const {data} = await  $host.put(`api/users/${userId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
    return data
}

export async function getUser() {
    return JSON.parse(await AsyncStorage.getItem('user'))
}
