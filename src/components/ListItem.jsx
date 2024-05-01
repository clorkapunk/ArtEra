import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment, faHeart, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import {
  getCommentsByPost,
  getLikesByPost,
  getPostCommentsAmount,
  getPostLikesAmount, sendCommentToPost,
  sendLikeToPost,
} from "../api/ContentAPI";
import { COLORS } from "../consts/colors";
import { Input } from "@rneui/themed";

const ListItem = ({item, openCommentSheet}) => {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [input, setInput] = useState("");

  function sendComment(postId, text) {
    if (input === "") return;
    sendCommentToPost(postId, text).then(({status, postId}) => {
      if (status === 201) {

      }
      setInput("")
      updateCommentsAmount()
    });
  }

  function updateLikesAmount(){
    getPostLikesAmount(item.id)
      .then(data => {
        setLikes(data)
      })
  }

  function updateCommentsAmount(){
    getPostCommentsAmount(item.id)
      .then(data => {
        setComments(data)
      })
  }

  function setLike(){
    sendLikeToPost(item.id)
      .then(status => {
        if(status === 201){

        }
        updateLikesAmount()
      })
  }

  useEffect(() => {
    updateLikesAmount()
    updateCommentsAmount()
  }, [])


  return (
    <View key={item.id} className='flex-col m-3'>
      <Text className='mb-3 text-gray-400 text-lg'>{item.owner}</Text>
      <Image
        source={{ uri: item.picture }}
        style={{width: '100%', flex: 1, aspectRatio: 1}}
        PlaceholderContent={<ActivityIndicator />}
      />
      <View className={'flex-row mx-4 my-3'}>
        <View className='flex-row items-end mr-6'>
          <TouchableOpacity onPress={() => setLike()}>
            <FontAwesomeIcon size={20}  icon={faHeart}/>
          </TouchableOpacity>

          <Text className='text-sm ml-1 text-gray-400'>{likes}</Text>
        </View>
        <View className='flex-row items-end justify-end'>
          <TouchableOpacity onPress={() => openCommentSheet(item.id)}>
            <FontAwesomeIcon size={20}  icon={faComment}/>
          </TouchableOpacity>
          <Text className='text-sm ml-1 text-gray-400'>{comments}</Text>
        </View>
      </View>

      <Input
        onChangeText={(value) => setInput(value)}
        value={input}
        placeholder={"Write your comment"}
        rightIcon={(
          <TouchableOpacity onPress={() => {
            sendComment(item.id, input);
          }}>
            <FontAwesomeIcon size={20} icon={faPaperPlane} color={COLORS.primary} />
          </TouchableOpacity>
        )}
        containerStyle={{ paddingHorizontal: 0 }}
        inputContainerStyle={{
          paddingHorizontal: 20, borderRadius: 8,
          backgroundColor: "white",
          borderWidth: 1, borderColor: 'black'
        }}
        inputStyle={{ color: "black" }}
        labelStyle={{ color: "white", marginBottom: 5, fontWeight: "100" }}
        placeholderTextColor={COLORS.lightGrey}
        errorStyle={{ margin: 0, height: 0 }}
      />
    </View>
  );
};

export default ListItem;
