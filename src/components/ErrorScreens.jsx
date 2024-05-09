import React, {memo} from 'react';
import {RefreshControl, ScrollView, Text, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";

const ErrorScreens = ({type, refreshing, onRefresh}) => {
    const networkError = (
        <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}/>
            }
        >
            <View className="w-full h-full flex-row justify-center items-center">
                <View className="p-10 flex-col justify-center items-center">
                    <FontAwesomeIcon icon={faGlobe} size={50} style={{opacity: 0.8}}/>
                    <Text className="text-center text-base mt-5">
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
