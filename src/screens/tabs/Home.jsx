import React, {memo, useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    InteractionManager,
    RefreshControl,
    View,
    FlatList, ToastAndroid, Text, Animated, TouchableNativeFeedback, Image, ScrollView
} from "react-native";
import {getPosts} from "../../api/ContentAPI";
import ListItem from "../../components/ListItem";
import CommentBottomSheet from "../../components/CommentBottomSheet";
import SplashScreen from "react-native-splash-screen";
import ErrorScreens from "../../components/ErrorScreens";
import LinearGradient from 'react-native-linear-gradient';
import {Skeleton} from "@rneui/themed";
import {s} from "react-native-wind";


const ListItemPlaceholder = memo(() => {

    return (
        <View className='flex-col mb-6'>

            <View className='flex-row items-center px-3 py-2'>
                <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation={'wave'}
                    circle={true}
                    style={{width: '12%', aspectRatio: 1}}
                    skeletonStyle={{backgroundColor: 'red'}}
                />

                <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation={'wave'}
                    style={[s`ml-3`, {flex: 1, height: 25}]}/>
            </View>

            <View className='flex-row mx-3 mb-2'>
                <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation={'wave'}
                    style={{flex: 1, height: 30}}/>
            </View>

            <View className='flex-row mx-3'>
                <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation={'wave'}
                    style={[s`rounded-lg`, {width: '100%', aspectRatio: 1}]}
                />
            </View>

            <View className={'px-3 mt-2 flex-row'}>
                <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation={'wave'}
                    style={{flex: 1, height: 50}}/>
            </View>


            <View className={'flex-row my-1 mx-3'}>

                <View className='px-3 py-2 flex-row items-center justify-end'>
                    <Skeleton
                        LinearGradientComponent={LinearGradient}
                        animation={'wave'}
                        style={[s`ml-2 rounded-full`, {width: 80, height: 25}]}/>
                </View>


                <View className='px-4 flex-row items-center justify-end'>
                    <Skeleton
                        LinearGradientComponent={LinearGradient}
                        animation={'wave'}
                        style={[s`ml-2 rounded-full`, {width: 80, height: 25}]}/>
                </View>


            </View>

            <View className='mx-3 px-3 flex-row'>
                <Skeleton
                    LinearGradientComponent={LinearGradient}
                    animation={'wave'}
                    style={{flex: 1, height: 40}}
                />
            </View>

        </View>
    )
})


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
        setIsContentLoading(true)
        setIsNetworkError(false);
        setData({
            count: null,
            next: null,
            previous: null,
            results: []
        })
        getPosts(1)
            .then(data => {
                setData(data);
                setTimeout(() => {
                    setIsContentLoading(false)
                }, 1000)

            })
            .catch((e) => {
                setIsNetworkError(true);
                setIsContentLoading(false)
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
                setEndReachedLoading(false)
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
            <View className='bg-background'>
                <ActivityIndicator/>
            </View>
        )

        if (isContentLoading) return (
            <ScrollView className='bg-background'>
                <ListItemPlaceholder/>
                <ListItemPlaceholder/>
            </ScrollView>
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
                        <View
                            className={`bg-background`}
                            style={{flex: 1, justifyContent: "flex-end"}}
                        >
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
