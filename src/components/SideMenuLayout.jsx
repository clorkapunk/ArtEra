import React, {memo, useContext, useEffect, useState} from 'react';
import {

    Text,
    Image,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity, Appearance
} from "react-native";
import {getUser, getUserData} from "../api/userAPI";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faArrowRightFromBracket,
    faChevronRight, faGear, faMoon,
    faSun,
    faUserGear,
    faX
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused, useNavigation} from "@react-navigation/native";
import ThemeContext from "../context/ThemeProvider";
import Animated, {
    interpolateColor,
    runOnJS,
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withRepeat, withSequence,
    withSpring,
    withTiming
} from "react-native-reanimated";
import {colors as initialColors} from './../consts/colors'


const SideMenuLayout = ({onClose, logOut}) => {
    const navigation = useNavigation()
    const [user, setUser] = useState({
        id: '',
        username: "",
        user_background: "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg",
        avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
        email: "",
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isNetworkError, setIsNetworkError] = useState(false);
    const isFocused = useIsFocused()
    const {theme, colors, toggleTheme} = useContext(ThemeContext)
    const rotation = useSharedValue(theme === 'dark' ? 0 : 180)
    const distance = useSharedValue(120)
    const progress = useSharedValue(theme === 'dark' ? 1 : 0)

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{rotate: rotation.value + 'deg'}, {translateY: 0}],
    }));

    const animatedDistance = useAnimatedStyle(() => ({
        height: distance.value
    }))

    const animatedColor = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [initialColors.light.secondary, initialColors.dark.secondary]
        ),
    }))


    function changeTheme(type) {
        if (type === 'dark') {
            distance.value =withSequence(
                withTiming(150, {duration: 500}),
                withTiming(120, {duration: 500})
            )

            rotation.value = withSpring(0, {
                duration: 1000,
                dampingRatio: 1.5,
                stiffness: 100
            }, () => {
                progress.value = withTiming(1, {duration: 500}, () => {
                    runOnJS(toggleTheme)('dark')
                })
            })



        } else if (type === 'light') {

            distance.value =withSequence(
                withTiming(150, {duration: 500}),
                withTiming(120, {duration: 500})
            )
            rotation.value = withSpring(180, {
                duration: 1000,
                dampingRatio: 1.5,
                stiffness: 100
            }, () => {
                progress.value = withTiming(0, {duration: 500}, () => {
                    runOnJS(toggleTheme)('light')
                })
            })


        }
    }


    function onLogIn() {
        navigation.navigate("auth", {screen: "sign-in"})
        onClose()
    }

    async function onLogOut() {
        await AsyncStorage.removeItem('user')
        setUser({
            id: '',
            username: "",
            user_background: "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg",
            avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
            email: "",
        })
        setIsLoggedIn(false)
        onClose()
    }

    function onEditProfile() {
        onClose()
        navigation.navigate('profile-edit')
    }

    useEffect(() => {
        getUser()
            .then(user => {
                setIsLoggedIn(true)
                getUserData(user.id)
                    .then(data => {
                        setUser(data)
                        setIsNetworkError(false)
                    })
                    .catch(e => {
                        setIsNetworkError(true)
                    })
            })
            .catch(e => {
                setIsLoggedIn(false)
            })
    }, [isFocused])

    return (
        <View>
            <TouchableWithoutFeedback>
                <Animated.View className={`h-full w-full`} style={[{}, animatedColor]}>
                    <View className='flex-row justify-end'>
                        <TouchableOpacity onPress={onClose}>
                            <View className='pt-3 pr-3'>
                                <FontAwesomeIcon
                                    style={{opacity: 0.8}}
                                    color={colors.main_contrast}
                                    size={20}
                                    icon={faX}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        isLoggedIn &&
                        <>
                            <TouchableNativeFeedback
                                onPress={() => {
                                    onClose()
                                    navigation.navigate('profile')
                                }}
                                background={TouchableNativeFeedback.Ripple("black", false)}
                            >
                                <View className='flex-row items-center justify-between p-3 mt-3'>
                                    <View className='flex-row items-center'>
                                        <Image
                                            source={{uri: user.avatar}}
                                            style={{
                                                width: '25%',
                                                aspectRatio: 1
                                            }}
                                            className="rounded-full bg-white"
                                        />
                                        <View className='ml-4'>
                                            <Text
                                                style={{color: colors.main_contrast}}
                                                className={`font-averia_b text-2xl`}>{user.username}</Text>
                                            <Text
                                                style={{color: colors.main_contrast}}
                                                className={`font-averia_r text-lg`}>{user.email}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <FontAwesomeIcon
                                            size={20}
                                            icon={faChevronRight}
                                            color={colors.main_contrast}
                                        />
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    }

                    <View className='mt-6 flex-col flex-1 mb-6'>
                        <View>
                            <TouchableNativeFeedback
                                onPress={() => onEditProfile()}
                                background={TouchableNativeFeedback.Ripple("white", false)}
                            >
                                <View className='p-3 py-5 flex-row items-center justify-between'>
                                    <View className='flex-row items-center'>
                                        <FontAwesomeIcon size={25} color={colors.main_contrast} icon={faUserGear}/>
                                        <Text
                                            style={{color: colors.main_contrast}}
                                            className={`ml-4 font-averia_r text-2xl`}
                                        >Edit profile</Text>
                                    </View>
                                    <FontAwesomeIcon size={20} icon={faChevronRight} color={colors.main_contrast}/>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple("black", false)}
                            >
                                <View className='p-3 py-5 flex-row items-center justify-between'>
                                    <View className='flex-row items-center'>
                                        <FontAwesomeIcon size={25} color={colors.main_contrast} icon={faGear}/>
                                        <Text
                                            style={{color: colors.main_contrast}}
                                            className={`ml-4 font-averia_r text-2xl`}>Settings</Text>
                                    </View>
                                    <FontAwesomeIcon size={20} icon={faChevronRight} color={colors.main_contrast}/>
                                </View>
                            </TouchableNativeFeedback>
                        </View>

                        {
                            isLoggedIn ?
                                <TouchableNativeFeedback
                                    onPress={() => onLogOut()}
                                    background={TouchableNativeFeedback.Ripple("black", false)}
                                >
                                    <View className='p-3 py-5 flex-row items-center justify-between'>
                                        <View className='flex-row items-center'>
                                            <FontAwesomeIcon size={25} color={colors.main_contrast}
                                                             icon={faArrowRightFromBracket}/>
                                            <Text
                                                style={{color: colors.main_contrast}}
                                                className={`ml-4 font-averia_r text-2xl`}
                                            >Log out</Text>
                                        </View>
                                        <FontAwesomeIcon size={20} icon={faChevronRight} color={colors.main_contrast}/>
                                    </View>
                                </TouchableNativeFeedback>
                                :
                                <TouchableNativeFeedback
                                    onPress={() => onLogIn()}
                                    background={TouchableNativeFeedback.Ripple("black", false)}
                                >
                                    <View className='p-3 py-5 flex-row items-center justify-between'>
                                        <View className='flex-row items-center'>
                                            <FontAwesomeIcon size={25} color={colors.main_contrast}
                                                             icon={faArrowRightFromBracket}/>
                                            <Text
                                                style={{color: colors.main_contrast}}
                                                className={`ml-4 font-averia_r text-2xl`}
                                            >Log In / Sign Up</Text>
                                        </View>
                                        <FontAwesomeIcon size={20} icon={faChevronRight} color={colors.main_contrast}/>
                                    </View>
                                </TouchableNativeFeedback>
                        }

                    </View>

                    <View style={{transform: [{translateY: 140}]}}>
                        <Animated.View className='flex-col w-full justify-center items-center'
                                       style={[{
                                           transformOrigin: 'center'
                                       }, animatedStyles]}>
                            <TouchableOpacity onPress={() => {
                                changeTheme('light')
                            }}>
                                <View>
                                    <FontAwesomeIcon icon={faSun} size={40} color={colors.main_contrast}/>
                                </View>
                            </TouchableOpacity>
                            <Animated.View style={[{}, animatedDistance]}/>
                            <TouchableOpacity onPress={() => changeTheme('dark')}>
                                <View style={{transform: [{rotate: '180deg'}]}}>
                                    <FontAwesomeIcon icon={faMoon} size={40} color={colors.main_contrast}/>
                                </View>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                </Animated.View>


            </TouchableWithoutFeedback>
        </View>
    );
};

export default memo(SideMenuLayout);
