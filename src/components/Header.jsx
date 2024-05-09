import React, {memo, useEffect} from "react";
import {Image, Text, TouchableNativeFeedback, TouchableOpacity, View} from "react-native";
import {Button} from "@rneui/themed";
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBars, faCircleUser} from "@fortawesome/free-solid-svg-icons";
import {COLORS} from "../consts/colors";

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
            className={`bg-secondary border-b-2 border-b-primary
            px-3 py-1 flex-row items-center justify-between `}
        >
            <Text className={"text-primary font-cgregular text-xl"}>
                {title}
            </Text>
            <View className='h-[45px] flex-row items-center'>
                <TouchableNativeFeedback onPress={() => openSideMenu()}>
                    <View className='p-2'>
                        <FontAwesomeIcon icon={faBars} size={20}/>
                    </View>
                </TouchableNativeFeedback>
            </View>


        </View>

    );
};

export default memo(Header);
