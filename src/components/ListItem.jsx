import React, {forwardRef, memo, useEffect, useImperativeHandle, useState} from "react";
import {
    ActivityIndicator,
    View,
    Text,
    Image,
    TouchableOpacity,
    TextInput,
    TouchableNativeFeedback,
    ToastAndroid
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faComment, faHeart, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {
    getReactionsByPost,
    sendCommentToPost,
    sendLikeToPost,
} from "../api/ContentAPI";
import {COLORS} from "../consts/colors";
import {Input} from "@rneui/themed";
import {getUser, getUserData} from "../api/userAPI";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ListItem = ({item, openCommentSheet, commentSheetState}) => {

    const [aspectRatio, setAspectRatio] = useState(1)
    const [owner, setOwner] = useState({
        id: '',
        email: '',
        username: '',
        avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
        user_background: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg'
    });
    const [reactions, setReactions] = useState({
        likes: 0,
        comments: 0,
        isLiked: false
    })
    const [input, setInput] = useState("");

    Image.getSize(item.picture, (width, height) => {
        setAspectRatio(width / height)
    })

    function sendComment(postId, text) {
        if (input === "") return;

        getUser()
            .then(user => {
                sendCommentToPost(postId, user.id, text)
                    .then(() => {
                        setInput('')
                        updateReactionsAmount()
                    })
                    .catch(e => {
                        ToastAndroid.show("Error", ToastAndroid.SHORT)
                    })
            })
            .catch(e => {
                ToastAndroid.show("Log in to comment", ToastAndroid.SHORT)
            })
    }


    function setLike() {
        getUser()
            .then(user => {
                sendLikeToPost(item.id, user.id)
                    .then(status => {
                        updateReactionsAmount()
                    })
            })
            .catch(e => {
                ToastAndroid.show("Log in to like", ToastAndroid.SHORT)
            })

    }

    function updateReactionsAmount() {

        getUser()
            .then(user => {
                getReactionsByPost(item.id, user.id)
                    .then(response => {
                        setReactions({
                            likes: response.like_count,
                            comments: response.comment_count,
                            isLiked: response.is_liked
                        })
                    })
                    .catch(e => {
                        setReactions({
                            likes: 0,
                            comments: 0,
                            isLiked: false
                        })
                    })
            })
            .catch(e => {
                getReactionsByPost(item.id, '')
                    .then(response => {
                        setReactions({
                            likes: response.like_count,
                            comments: response.comment_count,
                            isLiked: response.is_liked
                        })
                    })
                    .catch(e => {
                        setReactions({
                            likes: 0,
                            comments: 0,
                            isLiked: false
                        })
                    })
            })

    }

    useEffect(() => {
        updateReactionsAmount()
        getUserData(item.owner)
            .then(data => {
                setOwner(data)
            })
            .catch(e => {
                setOwner({
                    id: -1,
                    username: 'sample user',
                    email: 'sample email',
                    avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
                    user_background: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg'
                })
            })
    }, [commentSheetState])


    return (
        <View key={item.id} className='flex-col m-3'>
            <Text className='mb-3 text-gray-600 font-averia_b text-xl'>{owner.username}</Text>
            <Image
                source={{uri: item.picture}}
                style={{width: '100%', flex: 1, aspectRatio: aspectRatio}}
                PlaceholderContent={<ActivityIndicator/>}
            />
            <View className='mt-2'>
                <Text className='text-xl font-averia_bi'>{item.title}</Text>
                <Text className='text-lg font-averia_i'>{item.description}</Text>
            </View>

            <View className={'flex-row my-1'}>
                <TouchableNativeFeedback
                    onPress={() => setLike()}
                >
                    <View className='px-4 py-2 flex-row items-center justify-end'>
                        <FontAwesomeIcon
                            size={20}
                            icon={faHeart}
                            color={reactions.isLiked ? 'red' : "black"}
                        />
                        <Text className='text-sm ml-2 text-gray-400'>{reactions.likes}</Text>
                    </View>
                </TouchableNativeFeedback>


                <TouchableNativeFeedback onPress={() => {
                    openCommentSheet(item.id)
                }}
                >
                    <View className='px-4 flex-row items-center justify-end'>
                        <FontAwesomeIcon style={{marginBottom: 2}} size={20} icon={faComment}/>
                        <Text className='text-sm ml-2 text-gray-400'>{reactions.comments}</Text>
                    </View>
                </TouchableNativeFeedback>

            </View>

            <Input
                onChangeText={(value) => setInput(value)}
                value={input}
                placeholder={"Write your comment"}
                rightIcon={(
                    <TouchableNativeFeedback onPress={() => {
                        sendComment(item.id, input);
                    }}>
                        <View className='p-2'>
                            <FontAwesomeIcon
                                size={20}
                                icon={faPaperPlane}
                                color={COLORS.primary}/>
                        </View>
                    </TouchableNativeFeedback>
                )}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={{
                    paddingLeft: 20, borderRadius: 8,
                    paddingRight: 10,
                    backgroundColor: "white",
                    borderWidth: 1, borderColor: 'black'
                }}
                inputStyle={{color: "black"}}
                labelStyle={{color: "white", marginBottom: 5, fontWeight: "100"}}
                placeholderTextColor={COLORS.lightGrey}
                errorStyle={{margin: 0, height: 0}}
            />
        </View>
    );
}

export default memo(ListItem);
