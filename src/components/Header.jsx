import React, {memo, useEffect} from "react";
import {Text, TouchableNativeFeedback, View} from "react-native";
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import {colors} from "../consts/colors";


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
            className={`bg-header-bg border-b border-b-header-border
            py-1 flex-row items-center justify-between h-[40px]
            relative
            `}
        >

            <Text
                className='text-3xl font-averia_l text-header-text
                absolute w-full text-center'
            >
                {title}
            </Text>

            <View className='flex-row items-center'>
                <TouchableNativeFeedback onPress={() => openSideMenu()}>
                    <View className='p-2'>
                        <FontAwesomeIcon
                            icon={faBars}
                            size={20}
                            color={colors.header.menu}
                        />
                    </View>
                </TouchableNativeFeedback>
            </View>

        </View>

    );
};


export default memo(Header);
