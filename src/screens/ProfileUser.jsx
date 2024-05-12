import React, {memo, useEffect, useState} from 'react';
import {getUser, getUserData} from "../api/userAPI";
import {getLikedPosts, getPostsBySearch} from "../api/ContentAPI";
import {
    ActivityIndicator, Image,
    InteractionManager,
    RefreshControl,
    ScrollView,
    Text,
    ToastAndroid, TouchableNativeFeedback, TouchableOpacity,
    View
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faArrowUp, faCrop} from "@fortawesome/free-solid-svg-icons";
import {Button} from "@rneui/themed";
import ErrorScreens from "../components/ErrorScreens";
import MasonryList from "@react-native-seoul/masonry-list";
import GridItem from "../components/GridItem";
import ImagePicker from "react-native-image-crop-picker";
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";

const ProfileUser = ({route}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState(route.params.user)
    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoaded, setIsUserLoaded] = useState(false)
    const [isContentLoaded, setIsContentLoaded] = useState(false)
    const [tab, setTab] = useState("arts");
    const [artsCount, setArtsCount] = useState(0)
    const [data, setData] = useState({
        count: null,
        next: null,
        previous: null,
        results: []
    });
    const [refreshing, setRefreshing] = useState(false)
    const [isNetworkError, setIsNetworkError] = useState(false);

    function updateProfileInfo() {
        setIsNetworkError(false)
        getUserData(user.id)
            .then(data => {
                setUser(data)
                setIsUserLoaded(true)
                setIsContentLoaded(false)

                if (tab === 'arts') {
                    getPostsBySearch('', data.id, 1)
                        .then(data => {
                            setData(data)
                            setArtsCount(data.count)
                            setIsContentLoaded(true)
                        })
                        .catch(e => {
                            setIsNetworkError(true)
                            setIsContentLoaded(true)
                        })
                } else if (tab === 'favorites') {
                    getLikedPosts(user.id)
                        .then(data => {
                            setData({
                                count: null,
                                next: null,
                                previous: null,
                                results: data
                            })
                            setIsContentLoaded(true)

                        })
                        .catch(e => {
                            setIsNetworkError(true)
                            setIsContentLoaded(true)
                        })
                    getPostsBySearch('', data.id, 1)
                        .then(data => {
                            setArtsCount(data.count)
                            setIsContentLoaded(true)
                        })
                        .catch(e => {
                            setIsNetworkError(true)
                            setIsContentLoaded(true)
                        })
                }

            })
            .catch(e => {
                setIsNetworkError(true)
                setIsContentLoaded(true)
                setIsUserLoaded(true)
            })

    }

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
        });

        updateProfileInfo()
    }, [route.params.user]);

    const onRefresh = () => {
        updateProfileInfo()
    }

    const onEndReached = () => {
        if (data.next === null) {
            ToastAndroid.show("End reached!", ToastAndroid.SHORT)
            return
        }

        setIsNetworkError(false)
        getPostsBySearch('', user.id, data.next)
            .then(data => {
                setData(prevState => {
                    return {
                        next: data.next,
                        previous: data.previous,
                        count: data.count,
                        results: prevState.results.concat(data.results)
                    }
                });
            })
            .catch((e) => {
                setIsNetworkError(true)
            });
    }

    function onTabChange(tab) {
        setTab(tab)
        setIsContentLoaded(false)
        setIsNetworkError(false)
        if (tab === 'favorites') {
            getLikedPosts(user.id)
                .then(data => {
                    setData({
                        count: null,
                        next: null,
                        previous: null,
                        results: data
                    })
                    setIsContentLoaded(true)
                })
                .catch(e => {
                    setIsNetworkError(true)
                    setIsContentLoaded(true)
                })
        } else if (tab === 'arts') {
            getPostsBySearch('', user.id, 1)
                .then(data => {
                    setData(data)
                    setIsContentLoaded(true)
                })
                .catch(e => {
                    setIsNetworkError(true)
                    setIsContentLoaded(true)
                })
        }
    }

    function isCloseToBottom({layoutMeasurement, contentOffset, contentSize}) {
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }

    const componentLoaded = () => {
        if (isLoading) return (
            <View>
                <ActivityIndicator/>
            </View>
        )


        if (isNetworkError) return (
            <ErrorScreens type={'network'} refreshing={refreshing} onRefresh={onRefresh}/>
        )

        if (!isUserLoaded) return (
            <View className='items-center justify-center h-full'>
                <ActivityIndicator size={50}/>
            </View>
        )

        return true
    }

    return (
        <>
            {
                componentLoaded() !== true ?
                    componentLoaded()
                    :
                    <ScrollView
                        onScroll={({nativeEvent}) => {
                            if (isCloseToBottom(nativeEvent) && tab === 'arts') {
                                onEndReached()
                            }
                        }}
                        className="flex-1"
                        stickyHeaderIndices={[0, 4]}
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
                                className='flex-row justify-between items-center py-2 px-3 bg-white border-b border-black'>
                                <TouchableOpacity
                                    className="p-2" onPress={() => navigation.goBack()}>
                                    <View className='items-center'>
                                        <FontAwesomeIcon icon={faArrowLeft} color={"black"} size={25}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                        <View style={{width: '100%', aspectRatio: 16 / 9}}>
                            <Image
                                source={{uri: user.user_background}}
                                style={{flex: 1}}
                                resizeMode={"cover"}
                                PlaceholderContent={<ActivityIndicator/>}
                            />
                        </View>

                        <View className='flex-row justify-between items-center my-2 mx-3'>
                            <Text className="text-2xl font-cgbold mb-2">{user.username}</Text>
                            <Image
                                source={{uri: user.avatar}}
                                className="rounded-full"
                                style={{width: "28%", aspectRatio: 1}}
                                resizeMode={"cover"}
                                PlaceholderContent={<ActivityIndicator/>}
                            />
                        </View>

                        <View className="flex-row mb-4 mx-3">
                            <View className="mr-10">
                                <TouchableNativeFeedback
                                    onPress={() => alert("Coming soon")}
                                >
                                    <View className="p-1 rounded">
                                        <Text className={`text-xl font-cgregular underline `}>
                                            0 followers
                                        </Text>
                                    </View>
                                </TouchableNativeFeedback>
                            </View>
                            <TouchableNativeFeedback
                                onPress={() => alert("list of arts (maybe not)")}
                            >
                                <View className="p-1 rounded">
                                    <Text className={`text-xl font-cgregular underline `}>
                                        {artsCount} arts
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>

                        <View className="flex-row py-2 justify-around bg-white">
                            <TouchableNativeFeedback
                                onPress={() => onTabChange('arts')}
                            >
                                <View className="p-1 rounded">
                                    <Text
                                        className={`text-xl font-cgregular ${tab === "arts" && "underline"} `}>Your
                                        arts</Text>
                                </View>
                            </TouchableNativeFeedback>

                            <TouchableNativeFeedback
                                onPress={() => onTabChange('favorites')}
                            >
                                <View className="p-1 rounded">
                                    <Text
                                        className={`text-xl font-cgregular ${tab === "favorites" && "underline"} `}>Favorites</Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>

                        <View style={{flex: 1}} className='mx-3'>
                            {
                                !isContentLoaded ?
                                    <ActivityIndicator size={30} className='mb-2'/>
                                    :
                                    (
                                        data.results.length === 0 ?
                                            <View className={'flex-col justify-center items-center mt-5'}>
                                                <Text>Nothing here...</Text>
                                            </View>
                                            :
                                            <MasonryList
                                                onEndReached={() => onEndReached()}
                                                columnWrapperStyle={{
                                                    justifyContent: "space-between",
                                                }}
                                                numColumns={2}
                                                data={data.results}
                                                renderItem={({item}) => (<GridItem item={item}/>)}
                                                keyExtractor={(item, index) => item.id}
                                            />
                                    )

                            }
                        </View>

                    </ScrollView>
            }
        </>
    );
};

export default memo(ProfileUser);
