import {$generatorHost, $host} from "./index";
import RNFS from 'react-native-fs';
import {ToastAndroid} from "react-native";


export const getPosts = async (page_number) => {
  const { data } = await $host.get("api/posts/?page=" + page_number);
  return data;
};

export const getPostsBySearch = async (searchString, userId, page) => {
  const {data} = await $host.get(`api/posts/?search=${searchString}&page=${page}&owner=${userId} `)
  return data
}

export const getLikedPosts = async (userId) => {
  const {data} = await $host.get(`api/reactions/likedposts/${userId}`)
  return data
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


export const getCommentsByPost = async (postId) => {
  const { data } = await $host.get(`api/commnets/?search=${postId}`);
  return data;
};

export const sendCommentToPost = async (postId, userId, text) => {
  const response = await $host.post("api/commnets/", {
    owner_id: userId, post_id: postId, text
  });
  return response.status
};

export const sendLikeToPost = async (postId, userId) => {
  const response = await $host.post("api/reactions/safelike/", {
    owner_id: userId, post_id: postId
  });
  return response.status
}

export const getReactionsByPost = async (postId, userId) => {
  const {data} = await $host.get(`api/reactions/count/?post_id=${postId}&owner_id=${userId}`);
  return data
}


export const getGeneratedImage = async (prompt, steps) => {
  const {data} = await $generatorHost.post('api/generate_image/', {
    prompt,
    steps
  })

  const file_path = RNFS.DownloadDirectoryPath + `/generated-image-${new Date().getTime()}.jpg`

  RNFS.writeFile(file_path, data, 'base64')
      .catch((error) => {
        ToastAndroid.show('Save error', ToastAndroid.SHORT)
      });

  return file_path
}

