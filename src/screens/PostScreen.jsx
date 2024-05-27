import React, {memo, useContext, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image, InteractionManager, RefreshControl,
    ScrollView,
    Text, ToastAndroid,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faComment, faHeart, faPaperPlane} from "@fortawesome/free-regular-svg-icons";
import {faHeart as faHeartFull, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {getCommentsByPost, getReactionsByPost, sendCommentToPost, sendLikeToPost} from "../api/ContentAPI";
import {getUser, getUserData} from "../api/userAPI";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import Input from '../components/Input'
import Swiper from "react-native-swiper";
import ImageSize from "react-native-image-size";
import SkeletonView from "../components/SkeletonView";
import {s} from "react-native-wind";
import ThemeContext from "../context/ThemeProvider";
import ErrorScreens from "../components/ErrorScreens";
import Animated, {
    Easing,
    ReduceMotion,
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming
} from "react-native-reanimated";

const CommentSheetFooter = ({postId, update}) => {
    const [input, setInput] = useState("");
    const {colors} = useContext(ThemeContext)



    function sendComment(postId, text) {
        if (input === "") return;

        getUser()
            .then(user => {
                sendCommentToPost(postId, user.id, text)
                    .then(() => {
                        setInput('')
                        update()
                    })
                    .catch(e => {
                        ToastAndroid.show("Error", ToastAndroid.SHORT)
                    })
            })
            .catch(e => {
                ToastAndroid.show("Log in to comment", ToastAndroid.SHORT)
            })
    }


    return (
        <View
            style={{
                top: 0,
            }}
            bottomInset={0}

        >
            <View
                style={{backgroundColor: colors.main}}
                className="w-fit h-[0.5px] opacity-80 mx-2"/>
            <Input
                onChangeText={(value) => setInput(value)}
                value={input}
                placeholder={"Write your comment"}
                rightIcon={(
                    <TouchableOpacity onPress={() => {
                        sendComment(postId, input);
                    }}>
                        <FontAwesomeIcon
                            size={20}
                            icon={faPaperPlane}
                            color={colors.main}
                        />
                    </TouchableOpacity>
                )}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={{
                    paddingHorizontal: 20, borderRadius: 0,
                    backgroundColor: colors.background, borderBottomWidth: 0,
                }}
                inputStyle={{
                    color: colors.main,
                    fontFamily: 'AveriaSansLibre_Regular',
                    ...s`text-base`
                }}

                placeholderTextColor={colors.placeholder}
                errorStyle={{margin: 0, height: 0}}
            />
        </View>
    );
}

const Comment = ({item}) => {
    const {colors} = useContext(ThemeContext)
    const [isUserLoaded, setIsUserLoaded] = useState(false)
    const navigation = useNavigation()
    const [user, setUser] = useState({
        id: null,
        email: null,
        username: '',
        avatar: 'https://m.media-amazon.com/images/S/pv-target-images/16627900db04b76fae3b64266ca161511422059cd24062fb5d900971003a0b70.jpg',
        user_background: ''
    })

    function parseDate(dateStr) {
        const date = new Date(dateStr);
        const today = new Date();

        const year = date.getFullYear();
        const month = date.getMonth(); // Months are zero-indexed

        const day = date.getDate();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        if (date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()) {
            return `Today at ${hours}:${minutes}`;
        } else if (date.getDate() === today.getDate() - 1 &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()) {
            return `Yesterday at ${hours}:${minutes}`;
        } else {
            return `${day} ${monthNames[month]} at ${hours}:${minutes}`;
        }
    }

    useEffect(() => {
        getUserData(item.owner_id)
            .then(data => {
                setUser(data)
                setTimeout(() => {
                    setIsUserLoaded(true)
                }, 200)

            })
            .catch(e => {
                setIsUserLoaded(true)
            })
    }, [])

    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("white", false)}
            onPress={() => {
                if (!isUserLoaded) return
                navigation.navigate('profile-user', {
                    user: user
                })
            }}>
            <View className="flex-row px-3 pt-4 pb-2" style={{flex: 1}}>
                <View style={{flex: 1}} className="mr-3 mt-1">
                    {
                        !isUserLoaded ?
                            <View className={'flex-row'}>
                                <SkeletonView
                                    circle={true}
                                    style={{aspectRatio: 1}}
                                />
                            </View>
                            :
                            <Image
                                className="rounded-full bg-white"
                                style={{aspectRatio: 1}}
                                source={{uri: user.avatar}}
                            />
                    }

                </View>
                <View style={{flex: 7}}>
                    {
                        !isUserLoaded ?
                            <View className={'flex-row'}>
                                <SkeletonView
                                    style={{height: 23}}
                                />
                            </View>
                            :
                            <Text
                                style={{color: colors.main}}
                                className=" opacity-80 font-averia_b text-base">{user.username}</Text>
                    }

                    <Text
                        style={{color: colors.main}}
                        className=" text-base font-averia_r my-1">{item.text}</Text>
                    <Text
                        style={{color: colors.main}}
                        className=" text-sm font-averia_r opacity-50 mt-1">{parseDate(item.published_at)}</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
}

const PostScreen = ({route}) => {
    const {item} = route.params
    const {colors} = useContext(ThemeContext)
    const [isLoading, setIsLoading] = useState(true);
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
    const [isCommentsLoading, setIsCommentsLoading] = useState(false)
    const [commentsData, setCommentsData] = useState([])
    const navigation = useNavigation()
    const [isImageReady, setIsImageReady] = useState(true)
    const [isUserLoaded, setIsUserLoaded] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [swiperAspectRatio, setSwiperAspectRatio] = useState(0.75)
    const likeScale = useSharedValue(1)

    const animatedLike = useAnimatedStyle(() => ({
        transform: [{scale: likeScale.value}]
    }))

    async function minAspectRatio(images) {
        setIsImageReady(false)
        let swiper = 1000

        for (let i = 0; i < images.length; i++) {
            let {width, height} = await ImageSize.getSize(images[i].image)
            if ((width / height) < swiper) swiper = (width / height) < 0.75 ? 0.75 :
                ((width + width * 0.055) / height)
        }
        setSwiperAspectRatio(swiper)
        setTimeout(() => {
            setIsImageReady(true)
        }, 200)
    }

    function setLike() {
        likeScale.value = withSequence(
            withTiming(1.5, {
                duration: 200,
                easing: Easing.inOut(Easing.back(3)),
                reduceMotion: ReduceMotion.System,
            }),
            withTiming(1, {
                duration: 700,
                easing: Easing.inOut(Easing.back(3)),
                reduceMotion: ReduceMotion.System,
            }),
        )

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

    function updateComments() {
        setIsCommentsLoading(true)
        getCommentsByPost(item.id)
            .then(data => {
                setCommentsData(data)
                setIsCommentsLoading(false)
            })
            .catch(e => {
                setIsCommentsLoading(false)
            })
    }

    function onRefresh() {
        setRefreshing(true)
        updateComments()
        updateReactionsAmount()
        setRefreshing(false)
    }

    function addAlpha(color, opacity) {
        let _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
        });


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

        updateReactionsAmount()
        updateComments()
        minAspectRatio(item.image_details)
    }, [item])

    return (
        <>
            {
                isLoading ?
                    <ErrorScreens type={'loading'} refreshing={refreshing} onRefresh={onRefresh}/>
                    :

                    <>
                        <ScrollView
                            stickyHeaderIndices={[0]}
                            stickyHeaderHiddenOnScroll={true}
                            refreshControl={
                                <RefreshControl
                                    enabled={true}
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                />
                            }
                        >
                            <SafeAreaView>
                                <View
                                    style={{backgroundColor: colors.header, borderColor: colors.main}}
                                    className={`border-b py-1 flex-row items-center justify-between h-[40px] relative`}
                                >
                                    <Text
                                        style={{color: colors.main}}
                                        className='text-2xl font-averia_l  absolute w-full text-center'
                                    >
                                        {`${owner.username}'s post`}
                                    </Text>

                                    <TouchableOpacity
                                        className="p-2" onPress={() => navigation.goBack()}>
                                        <View className='ml-3 items-center'>
                                            <FontAwesomeIcon icon={faArrowLeft} color={colors.main} size={20}/>
                                        </View>
                                    </TouchableOpacity>

                                </View>

                            </SafeAreaView>

                            <View key={item.id} className='flex-col'>
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
                                                                style={{backgroundColor: addAlpha(colors.main, 0.2),
                                                                    overflow: 'hidden'
                                                                }}
                                                                className='mx-3 h-full flex-row items-center rounded-lg '
                                                                key={i.id}>
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
                                        style={{color: colors.main}}
                                        className={`px-3 text-xl font-averia_r`}
                                    >{item.description}</Text>
                                </View>


                                <View className={'flex-row my-1 mx-3'}>
                                    <TouchableNativeFeedback
                                        onPress={() => setLike()}
                                    >
                                        <View className='px-3 py-2 flex-row items-center justify-end'>
                                            <Animated.View style={[animatedLike]}>
                                                <FontAwesomeIcon
                                                    size={25}
                                                    icon={reactions.isLiked ? faHeartFull : faHeart}
                                                    color={reactions.isLiked ? colors.primary : colors.main}
                                                />
                                            </Animated.View>

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

                            </View>

                            <View
                                style={{backgroundColor: colors.main}}
                                className="w-fit h-[0.5px] opacity-80 mx-2"/>

                            <View style={{flex: 1}}>
                                {
                                    isCommentsLoading ?
                                        <ActivityIndicator
                                            className="mt-10" size={50}/>
                                        :
                                        (
                                            commentsData.length === 0 ?
                                                <View className='m-3'>
                                                    <Text
                                                        style={{color: colors.main}}
                                                        className='text-center text-lg font-averia_r'>No comments</Text>
                                                </View>
                                                :
                                                <FlatList
                                                    scrollEnabled={false}
                                                    style={{marginBottom: 10}}
                                                    data={commentsData}
                                                    keyExtractor={(item, index) => index}
                                                    renderItem={({item}) => <Comment
                                                        key={item.id}
                                                        item={item}
                                                    />}
                                                />
                                        )
                                }

                            </View>

                        </ScrollView>

                        <CommentSheetFooter
                            postId={item.id}
                            update={() => {
                                updateComments()
                                updateReactionsAmount()
                            }}
                        />
                    </>
            }
        </>
    );
};

export default memo(PostScreen);
