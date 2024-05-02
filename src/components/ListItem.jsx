import React, {forwardRef, memo, useEffect, useImperativeHandle, useState} from "react";
import {ActivityIndicator, View, Text, Image, TouchableOpacity, TextInput, TouchableNativeFeedback} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faComment, faHeart, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {
    getReactionsByPost,
    sendCommentToPost,
    sendLikeToPost,
} from "../api/ContentAPI";
import {COLORS} from "../consts/colors";
import {Input} from "@rneui/themed";

const ListItem = ({item, openCommentSheet, commentSheetState}) => {

    const [reactions, setReactions] = useState({
        likes: 0,
        comments: 0
    })
    const [input, setInput] = useState("");

    function sendComment(postId, text) {
        if (input === "") return;
        sendCommentToPost(postId, text)
            .then(({status, postId}) => {
                if (status === 201) {

                }
                setInput("")
                updateReactionsAmount()
            });
    }


    function setLike() {
        sendLikeToPost(item.id)
            .then(status => {
                if (status === 201) {

                }
                updateReactionsAmount()
            })
    }

    function updateReactionsAmount() {
        getReactionsByPost(item.id)
            .then(response => {
                setReactions({
                    likes: response.like_count,
                    comments: response.comment_count
                })
            })
    }

    useEffect(() => {
        console.log('called', commentSheetState, item.id)
        updateReactionsAmount()
    }, [commentSheetState])


    return (
        <View key={item.id} className='flex-col m-3'>
            <Text className='mb-3 text-gray-400 text-lg'>{item.owner}</Text>
            <Image
                source={{uri: item.picture}}
                style={{width: '100%', flex: 1, aspectRatio: 1}}
                PlaceholderContent={<ActivityIndicator/>}
            />
            <View className={'flex-row my-1'}>
                <TouchableNativeFeedback
                    onPress={() => setLike()}
                >
                    <View className='px-4 py-2 flex-row items-center justify-end'>
                        <FontAwesomeIcon size={20} icon={faHeart}/>
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
    )
        ;
}

export default memo(ListItem);
