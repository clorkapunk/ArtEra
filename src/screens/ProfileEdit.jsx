import React, {memo, useContext, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    InteractionManager, RefreshControl,
    ScrollView,
    Text, ToastAndroid,
    TouchableNativeFeedback, TouchableOpacity,
    View
} from "react-native";
import {editUserData, getUser, getUserData} from "../api/userAPI";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faArrowUp, faEnvelope, faPen} from "@fortawesome/free-solid-svg-icons";
import ErrorScreens from "../components/ErrorScreens";
import SplashScreen from "react-native-splash-screen";
import {useNavigation} from "@react-navigation/native";
import {Button} from "@rneui/themed";
import ImagePicker from "react-native-image-crop-picker";
import Input from '../components/Input'
import ThemeContext from "../context/ThemeProvider";
import {SafeAreaView} from "react-native-safe-area-context";
import {s} from "react-native-wind";

const ProfileEdit = () => {
    const [user, setUser] = useState({
        id: '',
        username: "",
        user_background: "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg",
        avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
        email: "",
    });
    const {colors} = useContext(ThemeContext)
    const [isNetworkError, setIsNetworkError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isUserLoaded, setIsUserLoaded] = useState(false)
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false)
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        user_background: "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg",
        avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
        username: "",
        email: "",
    });
    const [errors, setErrors] = useState({
        username: "",
        email: "",
    });

    function validateForm() {
        let isValid = true;
        let errorsTemp = {
            email: "",
            username: "",
        };

        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!emailRegex.test(String(form.email).toLowerCase())) {
            errorsTemp["email"] = "Invalid email address";
            isValid = false;
        } else {
            errorsTemp["email"] = "";
        }

        if (form.username === '') {
            errorsTemp['username'] = 'Username must not be empty'
            isValid = false;
        } else {
            errorsTemp["username"] = "";
        }

        setErrors(errorsTemp);

        return isValid;
    }

    function onFormChange(name, value) {
        setForm({...form, [name]: value});
    }

    function onFormSubmit() {
        if (!validateForm()) return


        const formData = new FormData()
        formData.append('username', form.username)
        formData.append('email', form.email)

        if (user.avatar !== form.avatar) {
            formData.append("avatar", {
                uri: form.avatar,
                name: 'avatar.jpg',
                type: 'image/jpg'
            })
        }

        if (user.user_background !== form.user_background) {
            formData.append("user_background", {
                uri: form.user_background,
                name: 'user_background.jpg',
                type: 'image/jpg'
            })
        }


        editUserData(user.id, formData)
            .then(data => {
                ToastAndroid.show("Success", ToastAndroid.SHORT)
                setUser(data)
            })
            .catch(e => {
                ToastAndroid.show("Error", ToastAndroid.SHORT)
            })

    }

    const onRefresh = () => {
        getUser()
            .then(user => {
                if (!isLoggedIn) {
                    return
                }
                setIsLoggedIn(true)
                setIsNetworkError(false)
                getUserData(user.id)
                    .then(data => {
                        setUser(data)
                        setForm({
                            avatar: data.avatar,
                            user_background: data.user_background,
                            email: data.email,
                            username: data.username
                        })
                    })
                    .catch(e => {
                        setIsNetworkError(true)
                    })
            })
            .catch(e => {
                setIsLoggedIn(false)
            })
    }

    useEffect(() => {
        InteractionManager.runAfterInteractions(() => {
            setIsLoading(false);
        });
    }, [])

    useEffect(() => {
        SplashScreen.hide()

        getUser()
            .then(user => {
                setIsLoggedIn(true)
                getUserData(user.id)
                    .then(data => {
                        setIsNetworkError(false)
                        setUser(data)
                        setForm({
                            avatar: data.avatar,
                            user_background: data.user_background,
                            email: data.email,
                            username: data.username
                        })
                        setIsUserLoaded(true)
                    })
                    .catch(e => {
                        setIsUserLoaded(true)
                    })
            })
            .catch(e => {
                setIsLoggedIn(false)
            })
    }, [])

    const componentLoaded = () => {
        if (isLoading) return (
            <ErrorScreens type={'loading'} refreshing={refreshing} onRefresh={onRefresh}/>
        )

        if (!isLoggedIn) return (
            <View className='flex-row justify-center items-center h-full'>
                <Text className='text-lg mr-3'>Log in to see your profile</Text>
                <FontAwesomeIcon
                    style={{opacity: 0.7}}
                    size={20}
                    icon={faArrowUp}/>
            </View>
        )

        if (isNetworkError) return (
            <ErrorScreens type={'network'} refreshing={refreshing} onRefresh={onRefresh}/>
        )

        if (!isUserLoaded) return (
            <View className='items-center justify-center h-full'>
                <ActivityIndicator size={50}/>
            </View>
        )
        return true
    }


    return (
        <>
            {
                !componentLoaded() ?
                    componentLoaded()
                    :
                    <ScrollView
                        className="flex-1"
                        stickyHeaderIndices={[0]}
                    >
                        <SafeAreaView>
                            <View
                                style={{backgroundColor: colors.header, borderColor: colors.main}}
                                className={`border-b py-1 flex-row items-center justify-between h-[40px] relative`}
                            >
                                <Text
                                    style={{color: colors.main}}
                                    className='text-2xl font-averia_l  absolute w-full text-center'
                                >
                                    Personal Information
                                </Text>

                                <TouchableOpacity
                                    className="p-2" onPress={() => navigation.goBack()}>
                                    <View className='ml-3 items-center'>
                                        <FontAwesomeIcon icon={faArrowLeft} color={colors.main} size={20}/>
                                    </View>
                                </TouchableOpacity>

                            </View>

                        </SafeAreaView>

                        <View className='mt-4'>
                            <View className='px-3'>
                                <View className='items-center relative'>
                                    <Image
                                        style={{width: "40%", aspectRatio: 1}}
                                        source={{uri: form.avatar}}
                                        className='rounded-full bg-white'
                                    />
                                    <View className='absolute ' style={{bottom: -20}}>
                                        <TouchableOpacity onPress={() => {
                                            ImagePicker.openPicker({
                                                width: 500,
                                                height: 500,
                                                mediaType: 'photo',
                                                multiple: false,
                                                cropping: true,
                                                cropperCircleOverlay: true,
                                                freeStyleCropEnabled: false
                                            }).then(image => {
                                                onFormChange("avatar", image.path)
                                            })
                                                .catch(e => {

                                                })
                                        }}
                                        >
                                            <View
                                                style={{backgroundColor: colors.buttons.image_edit}}
                                                className=' rounded-full p-3'>
                                                <FontAwesomeIcon color={"white"} icon={faPen}/>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={{marginTop: 60, marginBottom: 50}}>
                                    <View style={{marginBottom: 20}}>
                                        <Input
                                            onChangeText={(val) => onFormChange('username', val)}
                                            value={form.username}
                                            errorMessage={errors.username}
                                            placeholder={"Username"}
                                            inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                                            placeholderTextColor={colors.placeholder}
                                            inputStyle={{
                                                fontFamily: 'AveriaSerifLibre_Regular',
                                                color: colors.main,
                                                ...s`text-2xl py-0`
                                            }}
                                            errorStyle={{
                                                color: colors.errorRed
                                            }}
                                            iconContainerStyle={{}}
                                            textInputProps={{multiline: true}}
                                        />
                                    </View>
                                    <View>
                                        <Input
                                            onChangeText={(val) => onFormChange('email', val)}
                                            value={form.email}
                                            errorMessage={errors.email}
                                            placeholder={"Email"}
                                            inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                                            placeholderTextColor={colors.placeholder}
                                            inputStyle={{
                                                fontFamily: 'AveriaSerifLibre_Regular',
                                                color: colors.main,
                                                ...s`text-2xl py-0`
                                            }}
                                            errorStyle={{
                                                color: colors.errorRed
                                            }}
                                            iconContainerStyle={{}}
                                            textInputProps={{multiline: true}}
                                        />
                                    </View>
                                </View>




                                <View>
                                    <TouchableOpacity onPress={() => {
                                        ImagePicker.openPicker({
                                            width: 1920,
                                            height: 1080,
                                            mediaType: 'photo',
                                            multiple: false,
                                            cropping: true,
                                            freeStyleCropEnabled: false
                                        }).then(image => {
                                            onFormChange("user_background", image.path)
                                        })
                                            .catch(e => {

                                            })
                                    }}
                                    >
                                        <View
                                            style={{borderColor: colors.main}}
                                            className='p-1 border rounded'>
                                            <Image
                                                style={{
                                                    width: '100%',
                                                    aspectRatio: 16 / 9,
                                                }}
                                                className='rounded'
                                                source={{uri: form.user_background}}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            </View>
                            <View style={{marginTop: 50}} className='px-3 items-center'>
                                <Button
                                    onPress={() => onFormSubmit()}
                                    loading={loading}
                                    title="Confirm changes"
                                    buttonStyle={{
                                        backgroundColor: colors.buttons.confirm,
                                        padding: 10,
                                        width: 250,
                                        borderRadius: 5,
                                    }}
                                    titleStyle={{
                                        fontFamily: 'AveriaSerifLibre_Regular',
                                        fontSize: 20,
                                        color: colors.main
                                }}
                                    containerStyle={{
                                    }}
                                />
                            </View>
                        </View>

                    </ScrollView>
            }
        </>

    );
};

export default memo(ProfileEdit);
