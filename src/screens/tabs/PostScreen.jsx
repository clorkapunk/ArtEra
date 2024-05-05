import React, {memo, useEffect, useState} from 'react';
import {ActivityIndicator, FlatList, Image, ScrollView, Text, TouchableNativeFeedback, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faComment, faHeart, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {Input} from "@rneui/themed";
import {COLORS} from "../../consts/colors";
import {getCommentsByPost, getReactionsByPost, sendCommentToPost, sendLikeToPost} from "../../api/ContentAPI";
import {getUserData} from "../../api/userAPI";
import {BottomSheetFlatList} from "@gorhom/bottom-sheet/src";


const Comment = memo(({ item }) => {

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
            <View className="flex-row px-3 pt-4 pb-1" style={{ flex: 1 }}>
                <View style={{ flex: 1 }} className="mr-3 mt-1">
                    <Image
                        className="rounded-full "
                        style={{ aspectRatio: 1 }}
                        source={{ uri: user.avatar }}
                    />
                </View>
                <View style={{ flex: 7 }}>
                    <Text className="text-black opacity-80 text-base">{user.username}</Text>
                    <Text className="text-black text-base my-0.5">{item.text}</Text>
                    <Text className="text-black text-sm opacity-50">{parseDate(item.published_at)}</Text>
                </View>
            </View>
        </TouchableNativeFeedback>
    );
})

const PostScreen = ({route}) => {
    const {item} = route.params

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
        comments: 0
    })
    const [input, setInput] = useState("");
    const [isCommentsLoading, setIsCommentsLoading] = useState(false)
    const [commentsData, setCommentsData] = useState([])

    Image.getSize(item.picture, (width, height) => {
        setAspectRatio(width / height)
    })

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
            .catch(e => {
                setReactions({
                    likes: 0,
                    comments: 0
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

        getCommentsByPost(item.id)
            .then(data => {
                setCommentsData(data)
            })
    }, [item])

    return (
        <ScrollView>
            <View key={item.id} className='flex-col m-3'>

                <Image
                    source={{uri: item.picture}}
                    style={{width: '100%', aspectRatio: aspectRatio}}
                    PlaceholderContent={<ActivityIndicator/>}
                />
                <View className='mt-3'>
                    <Text className='mb-1 text-gray-400 text-lg'>{owner.username}</Text>
                    <Text className='text-lg'>{item.title}</Text>
                    <Text className='text-base'>{item.description}</Text>
                </View>

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

            <View className="" style={{ flex: 1 }}>
                {
                    isCommentsLoading ?
                        <ActivityIndicator
                            className="mt-10" size={50} />
                        :
                        <FlatList
                            style={{ marginBottom: 50 }}
                            data={commentsData}
                            keyExtractor={(item, index) => item.id}
                            renderItem={({ item }) => <Comment
                                key={item.id}
                                item={item}
                            />}
                        />
                }

            </View>

        </ScrollView>
    );
};

export default PostScreen;
