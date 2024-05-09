import React, {memo, useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    InteractionManager,
    RefreshControl,
    View,
    FlatList, ToastAndroid
} from "react-native";
import { getPosts} from "../../api/ContentAPI";
import ListItem from "../../components/ListItem";
import CommentBottomSheet from "../../components/CommentBottomSheet";
import SplashScreen from "react-native-splash-screen";
import ErrorScreens from "../../components/ErrorScreens";


const Home = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState({
        count: null,
        next: null,
        previous: null,
        results: []
    });
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [endReachedLoading, setEndReachedLoading] = useState(false);
    const [commentSheetState, setCommentSheetState] = useState({
        id: null,
        status: false
    })
    const commentSheetRef = useRef()



    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
            SplashScreen.hide()
        });

        setIsContentLoading(true)
        getPosts(1)
            .then(response => {
                setData(response);
                setIsContentLoading(false)
            })
            .catch((e) => {
                setIsNetworkError(true);
                setIsContentLoading(false)
            });


    }, []);

    const onRefresh = () => {
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
            });
    }

    const onEndReached = () => {
        if (data.next === null) {
            ToastAndroid.show("End reached!", ToastAndroid.SHORT)
            return
        }

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
                })
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
            commentSheetState={item.id === commentSheetState.id ? commentSheetState.status : false}
            openCommentSheet={(id) => {
                commentSheetRef.current?.open(id)
                setCommentSheetState({
                    id: id,
                    status: true
                })
            }}
            item={item}
        />;

    const componentLoaded = () => {
        if (isLoading) return (
            <View>
                <ActivityIndicator/>
            </View>
        )

        if(isContentLoading) return (
            <View className='w-full h-full justify-center items-center'>
                <ActivityIndicator size={50}/>
            </View>
        )

        if (isNetworkError) return (
            <ErrorScreens type={'network'} refreshing={refreshing} onRefresh={onRefresh}/>
        )

        return true
    }

    return (

        <>
            {
                componentLoaded() !== true ?
                    componentLoaded()
                    :
                    <>
                        <View style={{flex: 1, justifyContent: "flex-end"}}>
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
                                onEndReachedThreshold={0.2}
                                data={data.results}
                                renderItem={_renderitem}
                                keyExtractor={(item, index) => item.id}
                            />
                        </View>

                        <CommentBottomSheet
                            onClose={() => setCommentSheetState(false)}
                            ref={commentSheetRef}/>

                    </>
            }
        </>

    );
};

export default memo(Home);
