import React, {memo, useEffect} from "react";
import {Text, TouchableNativeFeedback, View} from "react-native";
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import { styled } from "nativewind";
import StyledFontAwesomeIcon from "./StyledFontAwesomeIcon";


const Header = ({title, route, openSideMenu}) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [user, setUser] = React.useState(null);
    const [showDropdown, setShowDropdown] = React.useState(false);


    async function logout() {
        await AsyncStorage.removeItem('user');
        setUser(null)
    }


    useEffect(() => {

        async function set() {
            return JSON.parse(await AsyncStorage.getItem("user"));
        }

        set().then(r => {
            setUser(r)
        });
    }, [isFocused]);

    return (
        <View
            className={`bg-header-bg border-b-2 border-b-header-border
            px-3 py-1 flex-row items-center justify-between `}
        >
            <Text
                className='text-2xl font-averia_l text-header-text'
            >
                {title}
            </Text>
            <View className='h-[45px] flex-row items-center'>
                <TouchableNativeFeedback onPress={() => openSideMenu()}>
                    <View className='p-2'>
                        <StyledFontAwesomeIcon
                            className='text-header-menu'
                            icon={faBars}
                            size={20}
                        />
                    </View>
                </TouchableNativeFeedback>
            </View>


        </View>

    );
};



export default memo(Header);
