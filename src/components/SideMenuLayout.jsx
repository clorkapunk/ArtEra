import React, {memo, useEffect, useState} from 'react';
import {
    Animated,
    Text,
    Image,
    TouchableNativeFeedback,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity
} from "react-native";
import {getUser, getUserData} from "../api/userAPI";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {
    faArrowLeft,
    faArrowRightFromBracket,
    faChevronRight, faGear,
    faGears,
    faUser, faUserGear,
    faX
} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useIsFocused, useNavigation} from "@react-navigation/native";


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



    function onLogIn(){
        navigation.navigate("auth", { screens: "sign-in" })
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

    function onEditProfile(){
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
                <View className="h-full w-full bg-gray-800">
                    <View className='flex-row justify-end'>
                        <TouchableOpacity onPress={onClose}>
                            <View className='pt-3 pr-3'>
                                <FontAwesomeIcon
                                    style={{opacity: 0.8}}
                                    color={'white'}
                                    size={20}
                                    icon={faX}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {
                        isLoggedIn &&
                        <>
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple("black", false)}
                            >
                                <View className='flex-row items-center justify-between p-3 mt-3'>
                                    <View className='flex-row items-center'>
                                        <Image
                                            source={{uri: user.avatar}}
                                            style={{width: '25%', aspectRatio: 1, borderWidth: 1, borderColor: 'white'}}
                                            className="rounded-full bg-white"
                                        />
                                        <View className='ml-4'>
                                            <Text className={'text-white text-xl'}>{user.username}</Text>
                                            <Text className={'text-gray-400 text-lg'}>{user.email}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <FontAwesomeIcon icon={faChevronRight} color={'white'}/>
                                    </View>
                                </View>
                            </TouchableNativeFeedback>
                        </>
                    }

                    <View className='mt-6 flex-col flex-1 mb-6'>
                        <View>
                            <TouchableNativeFeedback
                                onPress={() => onEditProfile()}
                                background={TouchableNativeFeedback.Ripple("black", false)}
                            >
                                <View className='p-3 py-5 flex-row items-center justify-between'>
                                    <View className='flex-row items-center'>
                                        <FontAwesomeIcon size={20} color={'white'} icon={faUserGear}/>
                                        <Text className=' ml-4 text-white text-xl'>Edit profile</Text>
                                    </View>
                                    <FontAwesomeIcon icon={faChevronRight} color={'white'}/>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback
                                background={TouchableNativeFeedback.Ripple("black", false)}
                            >
                                <View className='p-3 py-5 flex-row items-center justify-between'>
                                    <View className='flex-row items-center'>
                                        <FontAwesomeIcon size={20} color={'white'} icon={faGear}/>
                                        <Text className=' ml-4 text-white text-xl'>Settings</Text>
                                    </View>
                                    <FontAwesomeIcon icon={faChevronRight} color={'white'}/>
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
                                            <FontAwesomeIcon size={20} color={'white'} icon={faArrowRightFromBracket}/>
                                            <Text className=' ml-4 text-white text-xl'>Log out</Text>
                                        </View>
                                        <FontAwesomeIcon icon={faChevronRight} color={'white'}/>
                                    </View>
                                </TouchableNativeFeedback>
                                :
                                <TouchableNativeFeedback
                                    onPress={() => onLogIn()}
                                    background={TouchableNativeFeedback.Ripple("black", false)}
                                >
                                    <View className='p-3 py-5 flex-row items-center justify-between'>
                                        <View className='flex-row items-center'>
                                            <FontAwesomeIcon size={20} color={'white'} icon={faArrowRightFromBracket}/>
                                            <Text className=' ml-4 text-white text-xl'>Log In / Sign Up</Text>
                                        </View>
                                        <FontAwesomeIcon icon={faChevronRight} color={'white'}/>
                                    </View>
                                </TouchableNativeFeedback>
                        }

                    </View>
                </View>

            </TouchableWithoutFeedback>
        </View>
    );
};

export default memo(SideMenuLayout);
