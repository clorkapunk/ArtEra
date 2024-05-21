import React, {memo, useContext} from 'react';
import {ActivityIndicator, RefreshControl, ScrollView, Text, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../context/ThemeProvider";

const ErrorScreens = ({type, refreshing, onRefresh}) => {
    const {colors} = useContext(ThemeContext)

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
                    <FontAwesomeIcon
                        icon={faGlobe}
                        size={60}
                        color={colors.main}
                    />
                    <Text
                        style={{color: colors.main}}
                        className="text-center text-lg mt-5 font-averia_r">
                        Read a book, watch a movie, play board games. A world without the Internet
                        is
                        also wonderful!
                    </Text>
                </View>
            </View>
        </ScrollView>
    )

    const loading = (
        <View className='h-full flex-row justify-center items-center'>
            <ActivityIndicator size={50} color={colors.primary}/>
        </View>
    )


    return (
        type === 'network' && networkError
        ||
        type === 'loading' && loading
    );
};

export default memo(ErrorScreens);
