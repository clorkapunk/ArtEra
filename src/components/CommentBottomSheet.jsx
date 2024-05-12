import React, {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
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


const CommentSheetBackdrop = memo(({animatedIndex, animatedPosition, style}) => {


    // const adjustedAnimatedIndex = useSharedValue(0);
    // useAnimatedReaction(
    //   () => animatedIndex.value,
    //   (prepared, pre) => {
    //     if (pre === null) {
    //       // initial state
    //       adjustedAnimatedIndex.value = prepared;
    //       return;
    //     }
    //
    //     const jumpForward = prepared - pre === 1;
    //     const jumpBackward = pre - prepared === 1;
    //
    //     if (pre !== prepared && !jumpBackward && !jumpForward) {
    //       adjustedAnimatedIndex.value = prepared;
    //     }
    //   },
    // );


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

const CommentSheetFooter = ({animatedFooterPosition, postId, updateComments}) => {
    const [input, setInput] = useState("");


    function sendComment(postId, text) {
        if (input === "") return;
        getUser()
            .then(user => {
                sendCommentToPost(postId, user.id, text)
                    .then(({status, postId}) => {
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
            style={{
                top: 0,
            }}
            bottomInset={0}
            animatedFooterPosition={animatedFooterPosition}
        >
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
                        />
                    </TouchableOpacity>
                )}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={{
                    paddingHorizontal: 20, borderRadius: 0, backgroundColor: "#272728", borderBottomWidth: 0,
                }}
                inputStyle={{color: "white"}}
                labelStyle={{color: "white", marginBottom: 5, fontWeight: "100"}}
                placeholderTextColor={'#FFFFFF'}
                errorStyle={{margin: 0, height: 0}}
            />
        </BottomSheetFooter>
    );
}

const CommentSheetHeader = memo(() => {
    return (
        <View className="bg-darkgray rounded-t-lg">
            <Text className="text-2xl text-white opacity-80 m-3">Comments</Text>
            <View className="w-fit bg-white h-[0.5px] opacity-80 mx-2"/>
        </View>
    );
})

const Comment = ({item}) => {

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
            })
            .catch(e => {

            })
    }, [])

    return (
        <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple("white", false)}
            onPress={() => alert("good")}>
            <View className="flex-row px-3 pt-4 pb-1" style={{flex: 1}}>
                <View style={{flex: 1}} className="mr-3 mt-1">
                    <Image
                        className="rounded-full "
                        style={{aspectRatio: 1}}
                        source={{uri: user.avatar}}
                    />
                </View>
                <View style={{flex: 7}}>
                    <Text className="text-white opacity-80 text-base">{user.username}</Text>
                    <Text className="text-white text-base my-0.5">{item.text}</Text>
                    <Text className="text-white text-sm opacity-50">{parseDate(item.published_at)}</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
}


const CommentBottomSheet = forwardRef(({onClose}, ref) => {
    const bottomSheetRef = useRef(null);
    const [commentSheetData, setCommentSheetData] = useState({
        id: null,
        comments: ["huy"],
    });
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [sheetIndex, setSheetIndex] = useState(-1);
    const [refreshing, setRefreshing] = useState(false);
    const snapPoints = useMemo(() => ["75%", "100%"], []);

    const onRefresh = () => {
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
                        backgroundColor: '#ffffff',
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
                        borderColor: "red",
                        borderBottomWidth: 0,
                    }}

                    onChange={(index) => setSheetIndex(index)}
                    handleComponent={() =>
                        <CommentSheetHeader/>
                    }
                    footerComponent={
                        ({animatedFooterPosition}) =>
                            <CommentSheetFooter
                                animatedFooterPosition={animatedFooterPosition}
                                bottomSheetRef={bottomSheetRef}
                                postId={commentSheetData.id}
                                updateComments={updateComments}
                            />
                    }
                    backdropComponent={(props) => <CommentSheetBackdrop {...props} />}

                >
                    <View className="bg-darkgray" style={{flex: 1}}>
                        {
                            isCommentsLoading ?
                                <ActivityIndicator
                                    className="mt-10" size={50}/>
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
