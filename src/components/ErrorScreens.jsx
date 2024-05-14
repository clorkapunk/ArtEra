import React, {memo} from 'react';
import {RefreshControl, ScrollView, Text, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import {colors} from "./../consts/colors";

const ErrorScreens = ({type, refreshing, onRefresh}) => {
    const networkError = (
        <ScrollView
            className='bg-background'
            contentContainerStyle={{flexGrow: 1}}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}/>
            }
        >
            <View className="w-full h-full flex-row justify-center items-center">
                <View className="p-10 flex-col justify-center items-center">
                    <FontAwesomeIcon
                        icon={faGlobe}
                        size={60}
                        color={colors.listitem.comment.icon}
                    />
                    <Text className="text-center text-lg mt-5 text-listitem-title font-averia_r">
                        Read a book, watch a movie, play board games. A world without the Internet
                        is
                        also wonderful!
                    </Text>
                </View>
            </View>
        </ScrollView>
    )


    return (
        type === 'network' && networkError
    );
};

export default memo(ErrorScreens);
