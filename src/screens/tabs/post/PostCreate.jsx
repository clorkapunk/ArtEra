import React, {useEffect} from 'react';
import {Image, Text, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";
import {useNavigation} from "@react-navigation/native";
import {Button} from "@rneui/themed";

const PostCreate = ({route}) => {
    const navigation = useNavigation();

    const {item} = route.params

    return (
        <View className='px-4 pt-10'>
            <View className=''>
                <TouchableOpacity className="mb-7" onPress={() => navigation.navigate("post")}>
                    <View>
                        <FontAwesomeIcon defaultProps={{}} icon={faArrowLeft} color={"black"} size={20}/>
                    </View>
                </TouchableOpacity>
                <Image
                    style={{width: '100%', aspectRatio: 1}}
                    source={{uri: item.node.image.uri}}
                />

            </View>
        </View>
    );
};

export default PostCreate;
