import React, {memo, useContext, useEffect} from "react";
import {Text, TouchableNativeFeedback, View} from "react-native";
import {useIsFocused, useNavigation, useRoute} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faBars} from "@fortawesome/free-solid-svg-icons";
import ThemeContext from "../context/ThemeProvider";


const Header = ({title, route, openSideMenu}) => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [user, setUser] = React.useState(null);
    const {theme, colors} = useContext(ThemeContext)

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
            style={{backgroundColor: colors.header, borderColor: colors.main}}
            className={`border-b py-1 flex-row items-center justify-between h-[40px] relative`}
        >

            <Text
                style={{color: colors.main}}
                className={`text-3xl font-averia_l absolute w-full text-center`}
            >
                {title}
            </Text>

            <View className='flex-row items-center'>
                <TouchableNativeFeedback onPress={openSideMenu}>
                    <View className='ml-3 p-0'>
                        <FontAwesomeIcon
                            icon={faBars}
                            size={25}
                            color={colors.main}
                        />
                    </View>
                </TouchableNativeFeedback>
            </View>

        </View>

    );
};


export default memo(Header);
