import React, {forwardRef, memo, useEffect, useImperativeHandle, useRef, useState} from "react";
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetFlatList,
    BottomSheetFooter,
    BottomSheetTextInput, useBottomSheet,
} from "@gorhom/bottom-sheet/src";
import {COLORS} from "../consts/colors";
import {
    ActivityIndicator,
    Image,
    Keyboard, KeyboardAvoidingView, RefreshControl,
    Text,
    TouchableNativeFeedback,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";
import {Portal} from "@gorhom/portal";
import {Input} from "@rneui/themed";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {getCommentsByPost, getPosts, sendCommentToPost, sendLikeToPost} from "../api/ContentAPI";
import {getUserData, login} from "../api/userAPI";


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

const CommentSheetFooter = ({animatedFooterPosition, bottomSheetRef, postId, updateComments}) => {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);


    function sendComment(postId, text) {
        if (input === "") return;
        sendCommentToPost(postId, text).then(({status, postId}) => {
            if (status === 201) {

            }
            updateComments()
        });
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
                ref={inputRef}
                value={input}
                onPress={() => {
                }}
                onFocus={() => {
                    // bottomSheetRef.current?.expand()

                }}
                placeholder={"Write your comment"}
                rightIcon={(
                    <TouchableOpacity onPress={() => {
                        sendComment(postId, input);
                    }}>
                        <FontAwesomeIcon size={20} icon={faPaperPlane} color={COLORS.primary}/>
                    </TouchableOpacity>
                )}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={{
                    paddingHorizontal: 20, borderRadius: 0, backgroundColor: "#272728", borderBottomWidth: 0,
                }}
                inputStyle={{color: "white"}}
                labelStyle={{color: "white", marginBottom: 5, fontWeight: "100"}}
                placeholderTextColor={COLORS.lightGrey}
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


const avatars = [
    "https://toppng.com/uploads/preview/free-png-happy-black-person-png-images-transparent-black-man-thumbs-up-11563648491mkncpzrjrf.png",
    "https://t4.ftcdn.net/jpg/03/83/25/83/360_F_383258331_D8imaEMl8Q3lf7EKU2Pi78Cn0R7KkW9o.jpg",
    "https://www.dmarge.com/wp-content/uploads/2021/01/dwayne-the-rock-.jpg",
    "https://t3.ftcdn.net/jpg/03/02/88/46/360_F_302884605_actpipOdPOQHDTnFtp4zg4RtlWzhOASp.jpg",
    "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
];


const CommentBottomSheet = forwardRef(({onClose}, ref) => {
    const bottomSheetRef = useRef(null);
    const [commentSheetData, setCommentSheetData] = useState({
        id: null,
        comments: ["huy"],
    });
    const [isCommentsLoading, setIsCommentsLoading] = useState(false);
    const [sheetIndex, setSheetIndex] = useState(-1);
    const [refreshing, setRefreshing] = useState(false);

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
        getCommentsByPost(commentSheetData.id).then(data =>
            setCommentSheetData(prevState => {
                return {...prevState, comments: data};
            }),
        ).finally(() =>
            setIsCommentsLoading(false),
        );
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
                        backgroundColor: COLORS.darkGrey,
                    }}
                    ref={bottomSheetRef}
                    snapPoints={["75%", "100%"]}
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
