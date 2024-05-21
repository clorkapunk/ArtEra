import React, {memo, useCallback, useContext, useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    InteractionManager,
    RefreshControl,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableOpacity,
    View
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {CameraRoll} from "@react-native-camera-roll/camera-roll";
import {Button} from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {useAnimatedStyle, useSharedValue, withRepeat, withTiming} from "react-native-reanimated";
import ThemeContext from "../../../context/ThemeProvider";
import ErrorScreens from "../../../components/ErrorScreens";


const GalleryItem = ({item, status, select, unselect}) => {
    const {colors} = useContext(ThemeContext)

    return (
        <View style={{flexGrow: 0, flexShrink: 0, flexBasis: '32%', aspectRatio: 1, position: 'relative'}}>

            <TouchableOpacity
                onPress={() => {
                    if (status.isSelected) unselect(item)
                    else select(item)
                }}
            >
                <Image
                    style={{width: '100%', aspectRatio: 1}}
                    source={{uri: item.node.image.uri}}
                />
            </TouchableOpacity>


            {
                status.isSelected &&
                <View
                    style={{aspectRatio: 1, height: 30, width: 30, backgroundColor: colors.primary,
                        transform: [{translateX: 5}, {translateY: -5}]}}
                    className='absolute top-0 right-0 rounded-full'
                >
                    <Text
                        style={{color: colors.main_contrast}}
                        className='text-2xl font-averia_r text-center'>
                        {status.index + 1}
                    </Text>
                </View>
            }




        </View>
    )
}

const SectionItem = ({group, selected, select, unselect}) => {
    const {colors} = useContext(ThemeContext)

    return (
        <View className='mx-3 my-4'>
            <Text style={{color: colors.main}}
                  className='text-2xl font-semibold mb-2'>{group.date}</Text>
            <View className='flex-row flex-wrap gap-2' style={{flexBasis: 3}}>
                {
                    group.items.map(item => {
                            let index = selected.indexOf(item)
                            return (
                                <GalleryItem
                                    key={item.node.id}
                                    item={item}
                                    status={{
                                        isSelected: index !== -1,
                                        index: index
                                    }}
                                    select={select}
                                    unselect={unselect}
                                />
                            )
                        }
                    )
                }
            </View>
        </View>
    )
}


const Post = () => {
    const navigation = useNavigation();
    const {colors} = useContext(ThemeContext)
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
        });
    }, []);

    const [selected, setSelected] = useState([]);
    const [gallery, setGallery] = useState({
        edges: [],
        end_cursor: '0',
        has_next_page: false
    })
    const [groupedPhotos, setGroupedPhotos] = useState([]);
    const [sortType, setSortType] = useState('day')
    const [refreshing, setRefreshing] = useState(false);
    const [isContentLoading, setIsContentLoading] = useState(false)


    function groupPhotosBy(photos, sortParam) {
        const sorted = photos.sort((a, b) => b.node.timestamp - a.node.timestamp)
        const temp = {}

        for (let i = 0; i < sorted.length; i++) {
            const date = new Date(sorted[i].node.timestamp * 1000)

            let dateString = ''
            if (sortParam === 'year') {
                dateString = date.toLocaleString('en-GB', {year: 'numeric'})
            }
            if (sortParam === 'month') {
                dateString = date.toLocaleString('en-GB', {month: 'short', year: 'numeric'})
            }
            if (sortParam === 'day') {
                if (date.getFullYear() !== new Date().getFullYear()) {
                    dateString = date.toLocaleString('en-GB', {day: "numeric", month: "short", year: 'numeric'})
                } else {
                    dateString = date.toLocaleString('en-GB', {day: "numeric", month: "short"})
                }

            }

            if (!temp[dateString]) {
                temp[dateString] = [];
            }
            temp[dateString].push(sorted[i]);
        }

        const grouped = []
        Object.keys(temp).forEach(key => {
            grouped.push({
                date: key,
                items: temp[key],
            });
        })

        return grouped
    }

    function getPhotos() {
        setIsContentLoading(true)
        CameraRoll.getPhotos({
            first: 50,
            assetType: 'Photos',
            groupTypes: 'All'
        })
            .then(r => {
                setGallery({
                    edges: r.edges,
                    end_cursor: r.page_info.end_cursor,
                    has_next_page: r.page_info.has_next_page
                })
                setIsContentLoading(false)
            })
            .catch((err) => {
                setIsContentLoading(false)
            });
    }

    useEffect(() => {
        getPhotos()
    }, [])

    useEffect(() => {
        setGroupedPhotos(groupPhotosBy(gallery.edges, sortType))
    }, [gallery, sortType])

    const onRefresh = () => {
        setRefreshing(true);
        setGallery({
            edges: [],
            end_cursor: '0',
            has_next_page: false
        })
        getPhotos(sortType)
        setRefreshing(false)
    }

    function navigateToCreate() {
        if (selected === null) {
            ToastAndroid.show("Select image first!", ToastAndroid.SHORT)
            return
        }

        async function getId() {
            return JSON.parse(await AsyncStorage.getItem("user"))
        }

        getId().then(user => {
            if (user === null) {
                ToastAndroid.show("Log in to make posts", ToastAndroid.SHORT)
            } else {
                navigation.navigate('post-create', {
                    images: selected,
                    user: user,
                })
            }
        })


    }

    function onEndReached() {
        if (!gallery.has_next_page) {
            return
        }

        CameraRoll.getPhotos({
            first: 20,
            after: gallery.end_cursor,
            assetType: 'All',
            groupTypes: 'All'
        })
            .then(r => {
                setGallery(prevState => {
                    return {
                        edges: [
                            ...prevState.edges,
                            ...r.edges
                        ],
                        end_cursor: r.page_info.end_cursor,
                        has_next_page: r.page_info.has_next_page
                    }
                })
                setIsContentLoading(false)
            })
            .catch((err) => {
                setIsContentLoading(false)
            });
    }


    const height = useSharedValue(0);

    const handlePress = () => {
        height.value = withTiming(height.value + 100, {duration: 1000})
    };

    const componentLoaded = () => {
        if (isLoading) return (
            <ErrorScreens type={'loading'} refreshing={refreshing} onRefresh={onRefresh}/>
        )

        if (isContentLoading) return (
            <View className='w-full h-full justify-center items-center'>
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
                    <View className={"flex-1"}>

                        {/*<View>*/}
                        {/*    <Animated.View*/}
                        {/*        className={'w-full border-b border-generator-image-border ' +*/}
                        {/*            'flex-row justify-between items-center px-3'}*/}
                        {/*        style={{height}}*/}
                        {/*    >*/}
                        {/*        <Text className='text-header-menu text-xl'>Selected</Text>*/}
                        {/*        <Text className='text-header-menu text-2xl'>{selected.length}</Text>*/}
                        {/*    </Animated.View>*/}
                        {/*</View>*/}


                        <FlatList
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                            }
                            onEndReached={() => onEndReached()}
                            data={groupedPhotos}
                            renderItem={({item}) =>
                                <SectionItem
                                    group={item}
                                    selected={selected}
                                    select={(item) => {
                                        if (selected.length === 5) {
                                            ToastAndroid.show("No more that 5 images", ToastAndroid.SHORT)
                                            return
                                        }

                                        // if(selected.length === 0){
                                        //     height.value = withTiming(40, {duration: 1000})
                                        // }

                                        setSelected(prevValue => {
                                            return [
                                                ...prevValue,
                                                item
                                            ]
                                        })
                                    }}
                                    unselect={(item) => {
                                        // if(selected.length === 1){
                                        //     height.value = withTiming(0, {duration: 1000})
                                        // }

                                        setSelected(prevValue =>
                                            prevValue.filter(i => i.node.id !== item.node.id))
                                    }}
                                />
                            }
                            keyExtractor={(item, index) => item.date}
                        />

                        <View
                            style={{backgroundColor: colors.background}}
                            className={"h-[65px] items-center justify-between flex-row px-5"}>
                            <Button
                                onPress={() =>
                                    navigateToCreate()
                                }
                                title="Next"
                                buttonStyle={{
                                    backgroundColor: colors.main,
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    fontSize: 20,
                                    color: colors.background
                                }}
                                containerStyle={{
                                    flex: 1,
                                    margin: 0,
                                    marginBottom: 0,
                                    marginLeft: 5
                                }}
                            />
                        </View>
                    </View>
            }
        </>

    );
};

export default memo(Post);
