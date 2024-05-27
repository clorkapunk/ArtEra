import React, {memo, useContext, useEffect, useRef, useState} from "react";
import {
    ActivityIndicator,
    InteractionManager,
    RefreshControl,
    View,
    FlatList,
    ToastAndroid,
    ScrollView
} from "react-native";
import {getPosts} from "../../api/ContentAPI";
import ListItem from "../../components/ListItem";
import CommentBottomSheet from "../../components/CommentBottomSheet";
import SplashScreen from "react-native-splash-screen";
import ErrorScreens from "../../components/ErrorScreens";
import {s} from "react-native-wind";
import SkeletonView from "../../components/SkeletonView";
import ThemeContext from "../../context/ThemeProvider";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";


const ListItemPlaceholder = memo(() => {

    return (
        <View className='flex-col mb-6'>

            <View className='flex-row items-center px-3 py-2'>
                <SkeletonView
                    circle={true}
                    style={{width: '12%', aspectRatio: 1}}
                />

                <SkeletonView
                    style={[s`ml-3`, {flex: 1, height: 25}]}/>
            </View>

            <View className='flex-row mx-3 mb-2'>
                <SkeletonView
                    style={{flex: 1, height: 30}}/>
            </View>

            <View className='flex-row mx-3'>
                <SkeletonView
                    style={[s`rounded-lg`, {width: '100%', aspectRatio: 1}]}
                />
            </View>

            <View className={'px-3 mt-2 flex-row'}>
                <SkeletonView
                    style={{flex: 1, height: 50}}/>
            </View>


            <View className={'flex-row my-1 mx-3'}>

                <View className='px-3 py-2 flex-row items-center justify-end'>
                    <SkeletonView
                        style={[s`ml-2 rounded-full`, {width: 80, height: 25}]}/>
                </View>


                <View className='px-4 flex-row items-center justify-end'>
                    <SkeletonView
                        style={[s`ml-2 rounded-full`, {width: 80, height: 25}]}/>
                </View>


            </View>

            <View className='mx-3 px-3 flex-row'>
                <SkeletonView
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
    const {colors} = useContext(ThemeContext)
    const loadingOffset = useSharedValue(50)

    const animatedLoading = useAnimatedStyle(() => ({
        transform: [{translateY: loadingOffset.value}]
    }))


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

        if (endReachedLoading) return;

        loadingOffset.value = withTiming(0, {duration: 200})

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
                loadingOffset.value = withTiming(50, {duration: 200})
            })
            .catch((e) => {
                setEndReachedLoading(false)
                loadingOffset.value = withTiming(50, {duration: 200})
            });
    }


    const _renderitem = ({item}) => {

        return (
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
                images={item.image_details}
            />
        )
    }


    const componentLoaded = () => {
        if (isLoading) return (
            <ErrorScreens type={'loading'} refreshing={refreshing} onRefresh={onRefresh}/>
        )

        if (isContentLoading) return (
            <ScrollView className=''>
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

                            style={{flex: 1, justifyContent: "flex-end", position: 'relative'}}
                        >
                            <FlatList
                                disableVirtualization={true}
                                // initialNumToRender={5}
                                onEndReachedThreshold={0.2}
                                refreshControl={
                                    <RefreshControl
                                        enabled={true}
                                        refreshing={refreshing}
                                        onRefresh={onRefresh}
                                    />
                                }
                                onEndReached={() => {
                                    setEndReachedLoading(true)
                                    onEndReached()
                                }}
                                data={data.results}
                                renderItem={_renderitem}
                                keyExtractor={(item) => item.id}
                            />

                            {
                                endReachedLoading &&
                                <Animated.View className='flex-row justify-center w-full items-center absolute'
                                               style={[animatedLoading, {
                                                   backgroundColor: 'transparent',
                                                   bottom: 0
                                               }]}>
                                    <ActivityIndicator
                                        className='rounded-full'
                                        style={{
                                            aspectRatio: 1,
                                            height: 'auto',
                                            backgroundColor: colors.secondary,
                                            borderWidth: 1,
                                            borderColor: colors.primary,
                                            padding: 5
                                        }}
                                        size={35}
                                        color={colors.primary}
                                    />
                                </Animated.View>
                            }



                        </View>

                        <CommentBottomSheet
                            onClose={() => setCommentSheetState({id: null, status: false})}
                            ref={commentSheetRef}/>

                    </>
            }
        </>

    );
};

export default memo(Home);
