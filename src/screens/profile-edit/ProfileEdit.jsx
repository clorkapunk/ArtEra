import React, {memo, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    InteractionManager, RefreshControl,
    ScrollView,
    Text, ToastAndroid,
    TouchableNativeFeedback, TouchableOpacity,
    View
} from "react-native";
import {editUserData, getUser, getUserData} from "../../api/userAPI";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faArrowUp, faEnvelope, faPen} from "@fortawesome/free-solid-svg-icons";
import ErrorScreens from "../../components/ErrorScreens";
import SplashScreen from "react-native-splash-screen";
import {useNavigation} from "@react-navigation/native";
import {Button, Input} from "@rneui/themed";
import {COLORS} from "../../consts/colors";
import ImagePicker from "react-native-image-crop-picker";
import {getPostsBySearch, sendPost} from "../../api/ContentAPI";

const ProfileEdit = () => {
    const [user, setUser] = useState({
        id: '',
        username: "",
        user_background: "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg",
        avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
        email: "",
    });
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

        if(user.avatar !== form.avatar){
            formData.append("avatar", {
                uri: form.avatar,
                name: 'avatar.jpg',
                type: 'image/jpg'
            })
        }

        if(user.user_background !== form.user_background){
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
                        setIsUserLoaded(true)
                        setUser(data)
                        setForm({
                            avatar: data.avatar,
                            user_background: data.user_background,
                            email: data.email,
                            username: data.username
                        })
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
            <View>
                <ActivityIndicator/>
            </View>
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
                    <View className='h-full w-full'>
                        <View>
                            <View className='flex-row items-center mt-3'>
                                <TouchableNativeFeedback onPress={() => {
                                    navigation.navigate('tabs')
                                }}>
                                    <View className='p-3'>
                                        <FontAwesomeIcon size={20} icon={faArrowLeft}/>
                                    </View>
                                </TouchableNativeFeedback>
                                <Text className={'text-2xl text-black ml-3'}>Personal Information</Text>
                            </View>
                            <View className='mt-4'>
                                <ScrollView
                                    className=''
                                    refreshControl={
                                        <RefreshControl
                                            enabled={true}
                                            refreshing={refreshing}
                                            onRefresh={onRefresh}
                                        />
                                    }

                                >
                                    <View className='flex-col items-center px-3'>
                                        <View className='items-center mb-5 relative'>
                                            <Image
                                                style={{width: 120, aspectRatio: 1}}
                                                source={{uri: form.avatar}}
                                                className='rounded-full bg-white'
                                            />
                                            <View className='absolute bottom-[-15]'>
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
                                                }}
                                                >
                                                    <View className='bg-blue-500 rounded-full p-1.5'>
                                                        <FontAwesomeIcon color={"white"} icon={faPen}/>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        </View>


                                        <Input
                                            onChangeText={(val) => onFormChange('username', val)}
                                            value={form.username}
                                            errorMessage={errors.username}
                                            inputMode={'text'}
                                            placeholder={"Enter your username"}
                                            label={"Username"}
                                            leftIconContainerStyle={{padding: 10, paddingRight: 10}}
                                            containerStyle={{paddingHorizontal: 0}}
                                            inputContainerStyle={{
                                                paddingHorizontal: 5, borderRadius: 7, backgroundColor: "white",
                                                borderWidth: 1
                                            }}
                                            inputStyle={{color: "black"}}
                                            labelStyle={{
                                                color: "black",
                                                marginBottom: 5,
                                                fontWeight: "100",
                                                fontSize: 20
                                            }}
                                            placeholderTextColor={COLORS.lightGrey}
                                            errorStyle={{color: "crimson"}}
                                        />

                                        <Input
                                            onChangeText={(val) => onFormChange('email', val)}
                                            value={form.email}
                                            errorMessage={errors.email}
                                            inputMode={'email'}
                                            placeholder={"Enter your email"}
                                            label={"Email"}
                                            leftIconContainerStyle={{padding: 10, paddingRight: 10}}
                                            containerStyle={{paddingHorizontal: 0}}
                                            inputContainerStyle={{
                                                paddingHorizontal: 5, borderRadius: 7, backgroundColor: "white",
                                                borderWidth: 1
                                            }}
                                            inputStyle={{color: "black"}}
                                            labelStyle={{
                                                color: "black",
                                                marginBottom: 5,
                                                fontWeight: "100",
                                                fontSize: 20
                                            }}
                                            placeholderTextColor={COLORS.lightGrey}
                                            errorStyle={{color: "crimson"}}
                                        />

                                        <View>
                                            <Text className='text-xl text-black mb-2'>Background image</Text>

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
                                            }}
                                            >
                                                <View className='p-1 border rounded'>
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
                                    <View className='px-3 items-center'>
                                        <Button
                                            onPress={() => onFormSubmit()}
                                            loading={loading}
                                            title="Save Changes"
                                            buttonStyle={{
                                                backgroundColor: "#e43190",
                                                padding: 10,
                                                width: 250,
                                                borderRadius: 10,
                                            }}
                                            titleStyle={{fontSize: 20}}
                                            containerStyle={{
                                                marginTop: 20,
                                            }}
                                        />
                                    </View>
                                </ScrollView>
                            </View>

                        </View>
                    </View>
            }
        </>

    );
};

export default memo(ProfileEdit);
