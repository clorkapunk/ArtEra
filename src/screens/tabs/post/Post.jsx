import React, {memo, useCallback, useEffect, useState} from "react";
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
import {COLORS} from "../../../consts/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorScreens from "../../../components/ErrorScreens";


const GalleryItem = ({item, isSelected, select}) => {


    return (
        <View style={{width: '32%'}}
              className={`mt-2 ${isSelected && 'border-2 p-1 rounded'}`}>
            <TouchableOpacity
                onPress={() => select(item)}
            >
                <Image
                    style={{width: '100%', aspectRatio: 1}}
                    source={{uri: item.node.image.uri}}
                />
            </TouchableOpacity>
        </View>
    )
}

const SectionItem = ({group, selected, setSelected}) => {


    // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    // let month = ''
    // let date = group.date.split(' ')[0]
    //
    // if (group.date.split(' ').length > 1) {
    //     month = months[group.date.split(' ')[1]];
    //     date += " " + month
    // }
    // if (group.date.split(' ').length > 2) {
    //     date += " " + group.date.split(' ')[2]
    // }

    return (
        <View className='mx-3 my-4'>
            <Text className='text-2xl font-semibold'>{group.date}</Text>
            <View className='flex-row flex-wrap justify-between'>
                {
                    group.items.map(item => {
                            return (
                                <GalleryItem
                                    key={item.node.id}
                                    item={item}
                                    isSelected={selected !== null ? (item.node.id === selected.node.id) : false}
                                    select={(item) => setSelected(item)}
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

    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
        });
    }, []);

    const [selected, setSelected] = useState(null);
    const [rawPhotos, setRawPhotos] = useState([])
    const [groupedPhotos, setGroupedPhotos] = useState([]);
    const [sortType, setSortType] = useState('day')
    const [refreshing, setRefreshing] = useState(false);
    const [aspectRatio, setAspectRatio] = useState(1);
    const [isContentLoading, setIsContentLoading] = useState(false)


    if (selected !== null) {
        Image.getSize(selected.node.image.uri, (width, height) => {
            setAspectRatio(width / height)
        })
    }

    function groupPhotosBy(photos, sortParam) {
        const sorted = photos.sort((a, b) => b.node.timestamp - a.node.timestamp)
        const temp = {}

        for (let i = 0; i < sorted.length; i++) {
            const date = new Date(sorted[i].node.modificationTimestamp * 1000)

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
            assetType: 'All',
        })
            .then(r => {
                setRawPhotos(r.edges)
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
        setGroupedPhotos(groupPhotosBy(rawPhotos, sortType))
    }, [rawPhotos, sortType])

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        getPhotos(sortType)
        setRefreshing(false)
    }, []);

    function navigateToCreate() {
        if (selected === null) {
            ToastAndroid.show("Select image first!", ToastAndroid.SHORT)
            return
        }

        async function getId() {
            return JSON.parse(await AsyncStorage.getItem("user"))
        }

        getId().then(user => {
            navigation.navigate('post-create', {
                item: selected,
                user: user,
                aspectRatio: aspectRatio
            })
        })


    }

    const header = () => {
        return (
            <View className='flex-row justify-center'>
                <Button
                    containerStyle={{flex: 1}}
                    buttonStyle={{backgroundColor: sortType === 'day' ? COLORS.primary : 'gray'}}
                    onPress={() => setSortType('day')}
                    title={'day'}/>
                <Button
                    containerStyle={{flex: 1}}
                    buttonStyle={{backgroundColor: sortType === 'month' ? COLORS.primary : 'gray'}}
                    onPress={() => setSortType('month')}
                    title={'month'}/>
                <Button
                    containerStyle={{flex: 1}}
                    buttonStyle={{backgroundColor: sortType === 'year' ? COLORS.primary : 'gray'}}
                    onPress={() => setSortType('year')}
                    title={'year'}/>
            </View>
        )
    }

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

        return true
    }

    return (
        <>
            {
                componentLoaded() !== true ?
                    componentLoaded()
                    :
                    <View className={"flex-1"}>

                        <FlatList
                            refreshControl={
                                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
                            }
                            data={groupedPhotos}
                            renderItem={({item}) =>
                                <SectionItem
                                    group={item}
                                    selected={selected}
                                    setSelected={(item) => setSelected(item)}
                                />
                            }
                            keyExtractor={(item, index) => item.date}
                        />

                        <View className={"h-[65px] items-center justify-between flex-row px-5"}>
                            <Button
                                onPress={() =>
                                    navigateToCreate()
                                }
                                title="Next"
                                buttonStyle={{
                                    backgroundColor: COLORS.secondary,
                                    padding: 10,
                                    borderRadius: 10,
                                }}
                                titleStyle={{
                                    fontSize: 20,
                                    color: COLORS.primary
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
