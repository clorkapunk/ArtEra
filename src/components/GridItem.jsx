import React, {memo, useState} from "react";
import {ActivityIndicator, View, Image, TouchableOpacity} from "react-native";
import {useNavigation} from "@react-navigation/native";
import Animated from "react-native-reanimated";

const GridItem = ({item}) => {
    const navigation = useNavigation()
    const [aspectRatio, setAspectRatio] = useState(1)


    Image.getSize(item.picture, (width, height) => {
        setAspectRatio(width / height)
    })

    function openPostScreen(){
        navigation.navigate('post-screen', {
            item: item,
            aspectRatio: aspectRatio
        })
    }

    return (
        <TouchableOpacity onPress={() => openPostScreen()}>
            <View key={item.id} className='flex-col my-0.5 mx-0.5' style={{flex: 1, flexGrow: 1}}>
                <Image
                    source={{uri: item.picture}}
                    style={{width: '100%', flex: 1, aspectRatio: aspectRatio}}
                    PlaceholderContent={<ActivityIndicator/>}
                />
            </View>
        </TouchableOpacity>
    );
};

export default memo(GridItem);
