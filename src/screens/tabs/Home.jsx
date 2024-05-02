import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {
    ActivityIndicator, Image,
    InteractionManager,
    RefreshControl,
    ScrollView,
    Text, TouchableNativeFeedback,
    TouchableOpacity,
    View,
    FlatList, ToastAndroid
} from "react-native";
import {getCommentsByPost, getPosts} from "../../api/ContentAPI";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faEnvelope, faGlobe, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import ListItem from "../../components/ListItem";
import CommentBottomSheet from "../../components/CommentBottomSheet";
import {Button} from "@rneui/themed";


const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({
        count: null,
        next: null,
        previous: null,
        results: []
    });
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [endReachedLoading, setEndReachedLoading] = useState(false);
    const [commentSheetState, setCommentSheetState] = useState(false)
    const commentSheetRef = useRef()


    useEffect(() => {
        getPosts(1)
            .then(response => {
                setData(response);
            })
            .catch((e) => {
                setIsNetworkError(false);
            });

        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
        });
    }, []);

    const imgUrls = [
        "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
        "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
        "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
        "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
    ];

    function getRandomData() {
        let data = [];
        for (let i = 0; i < 20; i++) {
            data.push({
                id: i,
                owner: `User ${i}`,
                likes: Math.round(Math.random() * 100),
                comments: Math.round(Math.random() * 30),
                picture: imgUrls[Math.floor(Math.random() * imgUrls.length)],
                description: "My amazing description to this post",
                title: "My amazing title to this post",
                published_at: "2024-04-30T10:47:53.950693Z",
            });
        }
        return data;
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setIsNetworkError(false);
        getPosts(1)
            .then(data => {
                setData(data);
                setRefreshing(false);
            })
            .catch((e) => {
                setIsNetworkError(true);
                setRefreshing(false);
                // setData(getRandomData());
            });
    }, []);

    const onEndReached = () => {
        if (data.next === null) {
            ToastAndroid.show("End reached!", ToastAndroid.SHORT)
            return
        }
        console.log('called for page = ' + data.next)
        setEndReachedLoading(true)

        getPosts(data.next)
            .then(data => {
                setData(prevState => {
                    return {
                        next: data.next,
                        previous: data.previous,
                        count: data.count,
                        results: prevState.results.concat(data.results)
                    }
                });
                setEndReachedLoading(false)
            })
            .catch((e) => {
                console.log('error')
                setEndReachedLoading(false)
                // setData(getRandomData());
            });
    }

    const _renderitem = ({item}) =>
        <ListItem
            commentSheetState={commentSheetState}
            openCommentSheet={(id) => {
                commentSheetRef.current?.open(id)
                setCommentSheetState(true)
            }}
            item={item}
        />;

    // const _renderitem = ({item}) =>
    //     <Text className='text-center p-20 mb-5 bg-amber-100 text-2xl font-bold'>{item.owner}</Text>;

    return (
        <>
            {isLoading ?
                <View>
                    <ActivityIndicator/>
                </View>
                :
                (
                    isNetworkError ?
                        <ScrollView
                            contentContainerStyle={{flexGrow: 1}}
                            refreshControl={
                                <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}/>
                            }
                        >
                            <View className="w-full h-full flex-row justify-center items-center">
                                <View className="p-10 flex-col justify-center items-center">
                                    <FontAwesomeIcon icon={faGlobe} size={50} style={{opacity: 0.8}}/>
                                    <Text className="text-center text-base mt-5">
                                        Read a book, watch a movie, play board games. A world without the Internet is
                                        also wonderful!
                                    </Text>
                                </View>
                            </View>
                        </ScrollView>
                        :
                        <>
                            <View style={{flex: 1, justifyContent: "flex-end"}}>
                                <Button title={"aaa"} onPress={() => {

                                }}/>
                                <FlatList
                                    disableVirtualization={true}
                                    initialNumToRender={5}
                                    refreshControl={
                                        <RefreshControl
                                            enabled={true}
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                        />
                                    }
                                    onEndReached={() => onEndReached()}
                                    onEndReachedThreshold={0.5}
                                    data={data.results}
                                    renderItem={_renderitem}
                                    keyExtractor={(item, index) => item.id}
                                />
                            </View>
                            {/*{*/}
                            {/*    endReachedLoading &&*/}
                            {/*    <ActivityIndicator size={30} style={{}}/>*/}
                            {/*}*/}


                            <CommentBottomSheet
                                onClose={() => setCommentSheetState(false)}
                                ref={commentSheetRef}/>
                        </>

                )
            }
        </>

    )
        ;
};

export default memo(Home);
