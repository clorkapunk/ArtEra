import React, {memo, useContext, useState} from "react";
import {ActivityIndicator, View, Image, TouchableOpacity, Text} from "react-native";
import {useNavigation, useRoute} from "@react-navigation/native";
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faTrash, faX} from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../context/ThemeProvider";
import {deletePost} from "../api/ContentAPI";

const GridItem = ({item, type, update}) => {
    const navigation = useNavigation()
    const [aspectRatio, setAspectRatio] = useState(1)
    const route = useRoute();
    const {colors} = useContext(ThemeContext)
    const menuHeight = 40
    const menuOffset = useSharedValue(-menuHeight);

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{translateY: menuOffset.value}],
    }));

    Image.getSize(item.image_details[0].image, (width, height) => {
        setAspectRatio(width / height)
    })

    function openPostScreen() {
        navigation.navigate('post-screen', {
            item: item,
            aspectRatio: aspectRatio
        })
    }

    function onLongPress() {
        if(route.name !== 'profile') return
        if(type === 'favorites') return
        if (menuOffset.value === 0) menuOffset.value = withTiming(-menuHeight, {duration: 1000})
        else menuOffset.value = withTiming(0, {duration: 1000})
    }

    function onDelete(){
        deletePost(item.id)
            .then(data => {
                update()
            })
    }

    return (
        <View className={'relative overflow-hidden'}>
            <TouchableOpacity onPress={() => openPostScreen()} onLongPress={() => onLongPress()}>
                <View key={item.id} className='flex-col my-0.5 mx-0.5' style={{flex: 1, flexGrow: 1}}>
                    <Image
                        source={{uri: item.image_details[0].image}}
                        style={{width: '100%', flex: 1, aspectRatio: aspectRatio}}
                        PlaceholderContent={<ActivityIndicator/>}
                    />
                </View>
            </TouchableOpacity>


            <Animated.View style={[{backgroundColor: colors.secondary, height: menuHeight}, animatedStyles]}
                           className=' mx-0.5 absolute flex-row items-center justify-center'>
                <View className='w-full flex-row justify-between'>
                    <View>
                        <TouchableOpacity onPress={() => {
                            menuOffset.value = withTiming(-menuHeight, {duration: 1000})
                        }}>
                            <View className='p-3'>
                                <FontAwesomeIcon icon={faX} color={colors.main_contrast}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View>
                        <TouchableOpacity onPress={() => onDelete()}>
                            <View className='p-3'>
                                <FontAwesomeIcon icon={faTrash} color={colors.errorRed}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>


        </View>
    );
};

export default memo(GridItem);
