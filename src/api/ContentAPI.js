import { $authHost, $host } from "./index";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const getPosts = async (page_number) => {
  const { data } = await $host.get("api/posts/?page=" + page_number);
  return data;
};

export const getCommentsByPost = async (postId) => {
  const { data } = await $host.get(`api/commnets/?search=${postId}`);
  return data;
};

export const sendCommentToPost = async (postId, text) => {
  let { token } = JSON.parse(await AsyncStorage.getItem("user"))
  const id = jwtDecode(token.substring(2, token.length - 1)).id
  const response = await $host.post("api/commnets/", {
    owner_id: id, post_id: postId, text
  });
  return response.status
};

export const sendLikeToPost = async (postId) => {
  let { token } = JSON.parse(await AsyncStorage.getItem("user"))
  const id = jwtDecode(token.substring(2, token.length - 1)).id
  const response = await $host.post("api/likes/", {
    owner_id: id, post_id: postId
  });
  return response.status
}

export const getReactionsByPost = async (postId) => {
  const response = await $host.get("api/reactions/count/" + postId);
  return response.data
}


export const sendPost = async (formData) => {
  // let { token } = JSON.parse(await AsyncStorage.getItem("user"))
  // const id = jwtDecode(token.substring(2, token.length - 1)).id
  // console.log("form here", formData)
  const response = await $host.post("api/posts/", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
      .catch(e => console.log(e.response.data));
  console.log('data', response.data)
  return response.status
}

export const getPostsBySearch = async (searchString, userId, page) => {
  const {data} = await $host.get(`api/posts/?search=${searchString}&page=${page}&owner=${userId} `)
  return data
}
