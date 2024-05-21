import React, {forwardRef, memo, useContext, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetFooter,
} from "@gorhom/bottom-sheet/src";
import {
    ActivityIndicator,
    Image,
    Text, ToastAndroid,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from "react-native";
import {Portal} from "@gorhom/portal";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {getCommentsByPost, sendCommentToPost} from "../api/ContentAPI";
import {getUser, getUserData} from "../api/userAPI";
import Input from './../components/Input'
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import ThemeContext from "../context/ThemeProvider";
import SkeletonView from "./SkeletonView";
import {s} from "react-native-wind";


const CommentSheetBackdrop = memo(({animatedIndex, animatedPosition, style}) => {
    const {colors} = useContext(ThemeContext)

    return (

        <BottomSheetBackdrop
            opacity={0.6}
            appearsOnIndex={0}
            disappearsOnIndex={-1}
            // style={containerStyle}
            style={{...style}}
            animatedIndex={animatedIndex}
            animatedPosition={animatedPosition}
        >
        </BottomSheetBackdrop>

    );
})

const CommentSheetFooter = memo(({animatedFooterPosition, postId, updateComments}) => {
    const {colors} = useContext(ThemeContext)
    const [input, setInput] = useState("");
    const {bottom: bottomSafeArea} = useSafeAreaInsets();


    function sendComment(postId, text) {
        if (input === "") return;
        getUser()
            .then(user => {
                sendCommentToPost(postId, user.id, text)
                    .then(() => {
                        updateComments()
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
        <BottomSheetFooter
            animatedFooterPosition={animatedFooterPosition}
            bottomInset={bottomSafeArea}
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
                    fontFamily: 'AveriaSerifLibre_Regular',
                    ...s`text-base`
            }}

                placeholderTextColor={colors.placeholder}
                errorStyle={{margin: 0, height: 0}}
            />

        </BottomSheetFooter>
    );
})

const CommentSheetHeader = memo(() => {
    const {colors} = useContext(ThemeContext)
    return (
        <View className="rounded-t-lg bg-red-300">
            <View className='my-2'>
                <Text
                    style={{color: colors.main}}
                    className="text-2xl font-averia_r text-center opacity-80">Comments</Text>

            </View>
            <View
                style={{backgroundColor: colors.main}}
                className="w-fit h-[0.5px] opacity-80 mx-2"/>
        </View>
    );
})

const Comment = ({item}) => {
    const {colors} = useContext(ThemeContext)
    const [isUserLoaded, setIsUserLoaded] = useState(false)
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
            onPress={() => alert("good")}>
            <View className="flex-row px-3 pt-4 pb-1" style={{flex: 1}}>
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


const CommentBottomSheet = forwardRef(({onClose}, ref) => {
    const {colors} = useContext(ThemeContext)
    const bottomSheetRef = useRef(null);
    const [commentSheetData, setCommentSheetData] = useState({
        id: null,
        comments: [],
    });
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [sheetIndex, setSheetIndex] = useState(-1);
    const [refreshing, setRefreshing] = useState(false);
    const snapPoints = useMemo(() => ["75%", "100%"], []);

    const onRefresh = () => {
        setCommentSheetData(prevState => {
            return {
                ...prevState,
                comments: []
            }
        })
        getCommentsByPost(commentSheetData.id).then(data => {
            setCommentSheetData(prevState => {
                return {...prevState, comments: data}
            })
        })
    }

    useImperativeHandle(ref, () => {
        return {
            open(postId) {
                bottomSheetRef.current?.snapToIndex(0);
                setIsCommentsLoading(true);
                setCommentSheetData({
                    id: postId,
                    comments: [],
                });
            },
        };
    }, []);

    function updateComments() {
        getCommentsByPost(commentSheetData.id)
            .then(data =>
                setCommentSheetData(prevState => {
                    return {...prevState, comments: data};
                }),
            )
            .finally(() =>
                setIsCommentsLoading(false),
            )
            .catch(e => {
                setIsCommentsLoading(false)
            })
    }


    useEffect(() => {
        if (sheetIndex === 0) {
            updateComments()
        } else if (sheetIndex === -1) {
            onClose()
            setCommentSheetData({
                id: null,
                comments: [],
            });
        }

    }, [sheetIndex]);

    return (
        <>
            <Portal>
                <BottomSheet
                    backgroundStyle={{
                        backgroundColor: colors.header,
                    }}
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    index={-1}
                    enablePanDownToClose={true}
                    enableDynamicSizing={true}
                    handleStyle={{
                        marginBottom: 0,
                        padding: 0,
                        paddingBottom: 0,
                        borderBottomWidth: 0,
                    }}

                    onChange={(index) => setSheetIndex(index)}
                    handleComponent={() =>
                        <CommentSheetHeader/>
                    }
                    footerComponent={
                        ({animatedFooterPosition}) => {
                            return (
                                <CommentSheetFooter
                                    animatedFooterPosition={animatedFooterPosition}
                                    postId={commentSheetData.id}
                                    updateComments={updateComments}
                                />)
                        }

                    }
                    backdropComponent={(props) => <CommentSheetBackdrop {...props} />}

                >
                    <View style={{flex: 1, backgroundColor: colors.background}}>
                        {
                            isCommentsLoading ?
                                <View className='flex-1'>
                                    <ActivityIndicator
                                        size={50}/>
                                </View>
                                :
                                <BottomSheetFlatList
                                    refreshing={false}
                                    onRefresh={() => onRefresh()}
                                    style={{marginBottom: 50}}
                                    data={commentSheetData.comments}
                                    keyExtractor={(item, index) => index}
                                    renderItem={({item}) => <Comment item={item}/>}
                                />
                        }

                    </View>
                </BottomSheet>
            </Portal>
        </>
    );
});

export default memo(CommentBottomSheet)
