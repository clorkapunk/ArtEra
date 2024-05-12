import React, {memo, useEffect, useState} from "react";
import {
    ActivityIndicator,
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    ToastAndroid
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {getReactionsByPost, sendCommentToPost, sendLikeToPost,} from "../api/ContentAPI";
import {getUser, getUserData} from "../api/userAPI";
import Input from "./Input";
import {useNavigation} from "@react-navigation/native";
import {faComment, faHeart, faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {faHeart as faHeartFull} from "@fortawesome/free-solid-svg-icons";
import {colors} from '../consts/colors'
import {s} from 'react-native-wind'

const ListItem = ({item, openCommentSheet, commentSheetState}) => {
    const navigation = useNavigation()
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
    const [showDescription, setShowDescription] = useState(false)

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
        <View key={item.id} className='flex-col mb-6'>
            <TouchableNativeFeedback
                onPress={() => {
                    navigation.navigate('profile-user', {
                        user: owner
                    })
                }}
            >
                <View className='flex-row items-center px-3 py-2'>
                    <Image
                        style={{width: '12%', aspectRatio: 1}}
                        className='rounded-full bg-white'
                        source={{uri: owner.avatar}}
                    />
                    <Text className='ml-3 text-listitem-title
                    font-averia_b text-xl'>{owner.username}</Text>
                </View>
            </TouchableNativeFeedback>

            <Text className='text-3xl text-listitem-title font-averia_r mx-3 mb-2'>{item.title}</Text>

            <View className='mx-3'>
                <Image
                    source={{uri: item.picture}}
                    className='rounded-lg'
                    style={{width: '100%', flex: 1, aspectRatio: aspectRatio}}
                    PlaceholderContent={<ActivityIndicator/>}
                />
            </View>

            <View className={'px-3 mt-2'}>
                <Text
                    numberOfLines={!showDescription ? 2 : 0}
                    onPress={() => setShowDescription(prevState => !prevState)}
                    className='px-3 text-xl font-averia_r text-listitem-description'
                >{item.description}</Text>
            </View>


            <View className={'flex-row my-1 mx-3'}>
                <TouchableNativeFeedback
                    onPress={() => setLike()}
                >
                    <View className='px-3 py-2 flex-row items-center justify-end'>
                        <FontAwesomeIcon
                            size={25}
                            icon={reactions.isLiked ? faHeartFull : faHeart}
                            color={reactions.isLiked ? colors.listitem.like.active : colors.listitem.like.inactive}
                        />
                        <Text className='text-xl font-averia_b
                        ml-2 text-listitem-like-text'>{reactions.likes}</Text>
                    </View>
                </TouchableNativeFeedback>


                <TouchableNativeFeedback onPress={() => {
                    openCommentSheet(item.id)
                }}
                >
                    <View className='px-4 flex-row items-center justify-end'>
                        <FontAwesomeIcon
                            color={colors.listitem.comment.icon}
                            style={{marginBottom: 2}}
                            size={25}
                            icon={faComment}/>
                        <Text
                            className='text-xl font-averia_b
                             ml-2 text-listitem-comment-text'
                        >{reactions.comments}</Text>
                    </View>
                </TouchableNativeFeedback>

            </View>

            <View className='mx-3 px-3'>
                <Input
                    onChangeText={(val) => setInput(val)}
                    value={input}
                    placeholder={'Add a comment'}
                    rightIcon={(
                        <TouchableNativeFeedback onPress={() => {
                            sendComment(item.id, input);
                        }}>
                            <View className='p-2'>
                                <FontAwesomeIcon
                                    size={20}
                                    color={colors.listitem.input.icon}
                                    icon={faPaperPlane}
                                />
                            </View>
                        </TouchableNativeFeedback>
                    )}
                    iconPosition="right"
                    containerStyle={{}}
                    inputContainerStyle={{...s`border-b`, borderColor: colors.listitem.input.border}}
                    placeholderTextColor={colors.listitem.input.placeholder}
                    inputStyle={{
                        fontFamily: 'AveriaSerifLibre_Regular',
                        color: colors.listitem.input.text,
                        ...s`text-lg py-0`
                }}

                    iconContainerStyle={{}}
                    textInputProps={{multiline: true}}
                />
            </View>

        </View>
    );
}

export default memo(ListItem);
