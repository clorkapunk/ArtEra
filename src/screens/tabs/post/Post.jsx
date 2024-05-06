import React, {memo, useCallback, useEffect, useState} from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    InteractionManager,
    RefreshControl,
    Text, ToastAndroid,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {CameraRoll} from "@react-native-camera-roll/camera-roll";
import {Button} from "@rneui/themed";
import {COLORS} from "../../../consts/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";


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


    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let month = ''
    let date = group.date.split(' ')[0]

    if (group.date.split(' ').length > 1) {
        month = months[group.date.split(' ')[1]];
        date += " " + month
    }
    if (group.date.split(' ').length > 2) {
        date += " " + group.date.split(' ')[2]
    }

    return (
        <View className='mx-3 my-4'>
            <Text className='text-2xl font-semibold'>{date}</Text>
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
    const [groupedPhotos, setGroupedPhotos] = useState([]);
    const [sortType, setSortType] = useState('day')
    const [refreshing, setRefreshing] = useState(false);

    function groupPhotosBy(photos, sortParam) {
        const sorted = photos.sort((a, b) => b.node.modificationTimestamp - a.node.modificationTimestamp)
        const temp = {}

        for (let i = 0; i < sorted.length; i++) {
            const date = new Date(sorted[i].node.modificationTimestamp * 1000)

            let dateString = ''
            if (sortParam === 'year') dateString = date.getFullYear()
            if (sortParam === 'month') dateString = date.getFullYear() + " " + date.getMonth()
            if (sortParam === 'day') dateString = date.getFullYear() + " " + date.getMonth() + " " + date.getDate()

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

    function getPhotos(sortType) {
        CameraRoll.getPhotos({
            first: 20,
            assetType: 'Photos',
        })
            .then(r => {
                setGroupedPhotos(groupPhotosBy(r.edges, sortType))
            })
            .catch((err) => {
                //Error Loading Images
            });
    }

    useEffect(() => {
        getPhotos(sortType)
    }, [sortType])

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
            let user = JSON.parse(await AsyncStorage.getItem("user"))
            return user.id
        }

        getId().then(id => {
            navigation.navigate('post-create', {
                item: selected,
                id: id
            })
        })


    }

    const imgUrls = [
        "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
        "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
        "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
        "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
    ];

    const data = [];

    for (let i = 0; i < 20; i++) {
        data.push({
            id: i,
            user: `User ${i}`,
            reactions: Math.round(Math.random() * 100),
            comments: Math.round(Math.random() * 30),
            img: imgUrls[Math.floor(Math.random() * imgUrls.length)],
        });
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


    return (
        <>
            {
                isLoading ?
                    <View>
                        <ActivityIndicator/>
                    </View>
                    :
                    <View className={"flex-1"}>
                        <ScrollView className="flex-1">
                            {header()}
                            <FlatList
                                scrollEnabled={false}
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
                        </ScrollView>
                        <View className={"h-[65px] justify-center px-10"}>
                            <Button
                                onPress={() =>
                                    navigateToCreate()
                                }
                                title="Select"
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
                                    margin: 0,
                                    marginBottom: 0
                                }}
                            />
                        </View>
                    </View>
            }
        </>

    );
};

export default memo(Post);
