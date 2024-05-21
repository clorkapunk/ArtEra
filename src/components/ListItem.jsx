import React, {memo, useContext, useEffect, useState} from "react";
import {
    ActivityIndicator,
    View,
    Text,
    Image,
    TouchableNativeFeedback,
    ToastAndroid, Dimensions
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {getReactionsByPost, sendCommentToPost, sendLikeToPost,} from "../api/ContentAPI";
import {getUser, getUserData} from "../api/userAPI";
import Input from "./Input";
import {useNavigation} from "@react-navigation/native";
import {faComment, faHeart, faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {faHeart as faHeartFull} from "@fortawesome/free-solid-svg-icons";
import {s} from 'react-native-wind'
import SkeletonView from "./SkeletonView";
import Swiper from 'react-native-swiper'
import ImageSize from 'react-native-image-size'
import ThemeContext from "../context/ThemeProvider";

const ListItem = ({item, openCommentSheet, commentSheetState}) => {
    const navigation = useNavigation()
    const {theme, colors} = useContext(ThemeContext)
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
    const [isUserLoaded, setIsUserLoaded] = useState(false)
    const [isImageReady, setIsImageReady] = useState(false)
    const [swiperAspectRatio, setSwiperAspectRatio] = useState(0.75)

    async function minAspectRatio(images) {
        setIsImageReady(false)
        let swiper = 1000

        for (let i = 0; i < images.length; i++) {
            let {width, height} = await ImageSize.getSize(images[i].image)
            if ((width / height) < swiper) swiper = (width / height) < 0.75 ? 0.75 :
                ((width + width * 0.055 ) / height)
        }
        setSwiperAspectRatio(swiper)
        setTimeout(() => {
            setIsImageReady(true)
        }, 200)
    }

    useEffect(() => {
        minAspectRatio(item.image_details)
    }, [])

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
        setIsUserLoaded(false)
        getUserData(item.owner)
            .then(data => {
                setOwner(data)
                setTimeout(() => {
                    setIsUserLoaded(true)
                }, 200)
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

    function addAlpha(color, opacity) {
        let _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    return (
        <View key={item.id} className='flex-col mb-6'>
            <TouchableNativeFeedback
                onPress={() => {
                    if (!isUserLoaded) return
                    navigation.navigate('profile-user', {
                        user: owner
                    })
                }}
            >

                <View className='flex-row items-center px-3 py-2'>
                    {
                        !isUserLoaded ?
                            <>
                                <SkeletonView
                                    circle={true}
                                    style={{width: '12%', aspectRatio: 1}}
                                />

                                <SkeletonView
                                    style={[s`ml-3`, {flex: 1, height: 25}]}/>
                            </>
                            :
                            <>
                                <Image
                                    style={{width: '12%', aspectRatio: 1}}
                                    className='rounded-full bg-white'
                                    source={{uri: owner.avatar}}
                                />

                                <Text
                                    style={{color: colors.main}}
                                    className={`ml-3  font-averia_b text-xl`}
                                >{owner.username}</Text>
                            </>
                    }

                </View>

            </TouchableNativeFeedback>

            <View className={'mx-3 mb-2 flex-row'}>
                <Text
                    style={{color: colors.main}}
                    className={`text-3xl font-averia_r`}
                >{item.title}</Text>
            </View>


            <View>
                {
                    !isImageReady ?
                        <View className='flex-row mx-3'>
                            <SkeletonView
                                style={[s`rounded-lg`, {width: '100%', aspectRatio: 1}]}
                            />
                        </View>
                        :
                        <View style={{width: '100%', aspectRatio: swiperAspectRatio}}>
                            <Swiper
                                containerStyle={{
                                    width: '100%',
                                    height: '100%'
                                }}
                                loop={false}
                            >
                                {
                                    item.image_details.map(i =>
                                        <View
                                            style={{backgroundColor: addAlpha(colors.main, 0.2), overflow: 'hidden'}}
                                            className='mx-3 h-full flex-row items-center rounded-lg ' key={i.id}>
                                            <Image
                                                resizeMode={'contain'}
                                                style={{width: '100%', height: '100%'}}
                                                source={{uri: i.image}}
                                                PlaceholderContent={<ActivityIndicator/>}
                                            />
                                        </View>
                                    )
                                }
                            </Swiper>
                        </View>
                }
            </View>

            <View className={'px-3 mt-2'}>
                <Text
                    numberOfLines={!showDescription ? 2 : 0}
                    onPress={() => setShowDescription(prevState => !prevState)}
                    style={{color: colors.main}}
                    className={`px-3 text-xl font-averia_r`}
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
                            color={reactions.isLiked ? colors.primary : colors.main}
                        />
                        <Text
                            style={{color: colors.main}}
                            className={`text-xl font-averia_b ml-2`}
                        >{reactions.likes}</Text>
                    </View>
                </TouchableNativeFeedback>


                <TouchableNativeFeedback onPress={() => {
                    openCommentSheet(item.id)
                }}
                >
                    <View className='px-4 flex-row items-center justify-end'>
                        <FontAwesomeIcon
                            color={colors.main}
                            style={{marginBottom: 2}}
                            size={25}
                            icon={faComment}/>
                        <Text
                            style={{color: colors.main}}
                            className={`text-xl font-averia_b ml-2`}
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
                                    color={colors.main}
                                    icon={faPaperPlane}
                                />
                            </View>
                        </TouchableNativeFeedback>
                    )}
                    iconPosition="right"
                    containerStyle={{}}
                    inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                    placeholderTextColor={colors.placeholder}
                    inputStyle={{
                        fontFamily: 'AveriaSerifLibre_Regular',
                        color: colors.main,
                        ...s`text-lg py-0`
                    }}

                    iconContainerStyle={{}}
                    textInputProps={{multiline: true}}
                />
            </View>

        </View>
    )
        ;
}

export default memo(ListItem);
