import React, {memo, useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableNativeFeedback,
    View,
    Image,
    InteractionManager, RefreshControl, ToastAndroid, ScrollView,
} from "react-native";
import GridItem from "../../components/GridItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getPostsBySearch} from "../../api/ContentAPI";
import MasonryList from "@react-native-seoul/masonry-list";
import {getUserData} from "../../api/userAPI";
import SplashScreen from "react-native-splash-screen";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons";

const Profile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isUserLoaded, setIsUserLoaded] = useState(false)
    const [isContentLoaded, setIsContentLoaded] = useState(false)
    const [tab, setTab] = useState("arts");
    const [user, setUser] = useState({
        id: '',
        username: "",
        user_background: "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg",
        avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
        email: "",
    });
    const [data, setData] = useState({
        count: null,
        next: null,
        previous: null,
        results: []
    });
    const [refreshing, setRefreshing] = useState(false)

    function updateProfileInfo(){
        async function getUser() {
            return JSON.parse(await AsyncStorage.getItem('user'))
        }

        getUser()
            .then(user => {
                if (user === null) {
                    setIsLoggedIn(false)
                    return
                }
                setIsLoggedIn(true)
                setIsUserLoaded(false)
                getUserData(user.id)
                    .then(data => {
                        setUser(data)
                        setIsUserLoaded(true)
                        setIsContentLoaded(false)
                        getPostsBySearch('', data.id, 1)
                            .then(data => {
                                setData(data)
                                setIsContentLoaded(true)
                            })
                            .catch(e => {
                                setIsContentLoaded(true)
                            })
                    })
                    .catch(e => {
                        setIsUserLoaded(true)
                    })
            })
    }

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
        });

        updateProfileInfo()

    }, []);

    const onRefresh = React.useCallback(() => {

        updateProfileInfo()
        // setRefreshing(true);
        // getPostsBySearch('', '', 1)
        //     .then(data => {
        //         setData(data);
        //         setRefreshing(false);
        //     })
        //     .catch((e) => {
        //         setRefreshing(false);
        //     });
    }, []);

    const onEndReached = () => {
        if (data.next === null) {
            ToastAndroid.show("End reached!", ToastAndroid.SHORT)
            return
        }

        getPostsBySearch('', '', data.next)
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
                console.log('error')
            });
    }


    return (
        <>
            {
                isLoading ?
                    <View>
                        <ActivityIndicator/>
                    </View>
                    :
                    (
                        !isLoggedIn ?
                            <View className='flex-row justify-center items-center h-full'>
                                <Text className='text-lg mr-3'>Log in to see your profile</Text>
                                <FontAwesomeIcon
                                    style={{opacity: 0.7}}
                                    size={20}
                                    icon={faArrowUp}/>
                            </View>
                            :
                            (
                                !isUserLoaded ?
                                    <View className='items-center justify-center h-full'>
                                        <ActivityIndicator size={50}/>
                                    </View>
                                    :
                                    <ScrollView
                                        className="flex-1"
                                        stickyHeaderIndices={[3]}
                                        refreshControl={
                                            <RefreshControl
                                                enabled={true}
                                                refreshing={refreshing}
                                                onRefresh={onRefresh}
                                            />
                                        }
                                    >
                                        <View style={{height: 150}}>
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
                                                        {data.count} arts
                                                    </Text>
                                                </View>
                                            </TouchableNativeFeedback>
                                        </View>

                                        <View className="flex-row py-2 justify-around bg-white">
                                            <TouchableNativeFeedback
                                                onPress={() => setTab("arts")}
                                            >
                                                <View className="p-1 rounded">
                                                    <Text
                                                        className={`text-xl font-cgregular ${tab === "arts" && "underline"} `}>Your
                                                        arts</Text>
                                                </View>
                                            </TouchableNativeFeedback>

                                            <TouchableNativeFeedback
                                                onPress={() => setTab("favorites")}
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
                                            }
                                        </View>

                                    </ScrollView>
                            )

                    )

            }
        </>

    );
};

export default memo(Profile);
