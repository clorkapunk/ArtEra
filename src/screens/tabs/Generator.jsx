import React, {memo, useContext, useState} from "react";
import {Text, View, Image, ToastAndroid, ActivityIndicator, ScrollView, TouchableNativeFeedback} from "react-native";
import {Button} from "@rneui/themed";
import {getUser} from "../../api/userAPI";
import ErrorScreens from "../../components/ErrorScreens";
import {LinearProgress, Slider} from "@rneui/base";
import {getGeneratedImage, getGeneratorStatus} from "../../api/ContentAPI";
import {useNavigation} from "@react-navigation/native";
import Input from './../../components/Input'
import {s} from 'react-native-wind'
import ThemeContext from "../../context/ThemeProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";


const loadingGifs = [
    require('../../../assets/generator/generating-loading-1.gif')
]

const errorScreen = require('../../../assets/generator/generator-error.png')


const Generator = () => {
    const {theme, colors} = useContext(ThemeContext)
    const [first, setFirst] = useState(true)
    const [isLoading, setIsLoading] = useState(true);
    const [isNetworkError, setIsNetworkError] = useState(false)
    const [imageUri, setImageUri] = useState(null);
    const [statusImage, setStatusImage] = useState(randomLoadingGif());
    const [form, setForm] = useState({
        prompt: '',
        steps: 50
    });
    const [errors, setErrors] = useState({
        image: '',
        prompt: '',
        steps: ''
    });
    const [statusMessage, setStatusMessage] = useState('')
    const [progress, setProgress] = useState(0)
    const navigation = useNavigation()

    function validateForm() {
        let isValid = true;
        let errorsTemp = {
            prompt: "",
            steps: "",
        };

        if (form.prompt === '') {
            errorsTemp['prompt'] = 'Prompt must not be empty'
            isValid = false;
        } else if (form.prompt.trim().replace(/ +(?= )/g, '').split(' ').length >= 75) {
            errorsTemp['prompt'] = 'Prompt length must not be more than 75'
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

    function randomLoadingGif() {
        return loadingGifs[Math.floor(Math.random() * loadingGifs.length)];
    }

    async function onFormSubmit() {
        if (!validateForm()) return

        setFirst(false)
        setImageUri(null)
        setStatusImage(randomLoadingGif());

        const status = await getGeneratorStatus()
            .catch(e => {
                setImageUri(null)
                setStatusImage(errorScreen)
                setErrors(prevState => {
                    return {
                        ...prevState,
                        image: 'Something went wrong. Please try again later!'
                    }
                })
            })

        if (status === undefined) return

        if (status.job_count !== 0) {
            ToastAndroid.show("Generator is busy now, try again later")
            return
        }

        const statusInterval = setInterval(async () => {
            const status = await getGeneratorStatus()
                .catch(e => {
                    setImageUri(null)
                    setStatusImage(errorScreen)
                    setErrors(prevState => {
                        return {
                            ...prevState,
                            image: 'Something went wrong. Please try again later!'
                        }
                    })
                })
            setStatusMessage(`Progress: ${parseFloat(status.progress).toFixed(2) * 100}%`)
            setProgress(status.progress)
        }, 3000)

        getGeneratedImage(form.prompt, form.steps)
            .then(path => {
                clearInterval(statusInterval)
                setStatusMessage(`Progress: done`)
                setProgress(1)
                setImageUri(`file://${path}`)
            })
            .catch(e => {
                clearInterval(statusInterval)
                setImageUri(null)
                setStatusImage(errorScreen)
                setErrors(prevState => {
                    return {
                        ...prevState,
                        image: 'Something went wrong. Please try again later!'
                    }
                })
            })
    }

    function navigateToCreate() {
        if (first === true || imageUri === null) {
            ToastAndroid.show("Generate image first!", ToastAndroid.SHORT)
            return
        }

        getUser().then(user => {
            if (user === null) {
                ToastAndroid.show("Log in to create post", ToastAndroid.SHORT)
                return
            }

            navigation.navigate('post-layout', {
                screen: 'post-create', params: {
                    images: [{
                        node: {
                            image: {
                                uri: imageUri
                            }
                        }
                    }],
                    user: user,
                }
            })
        })


    }

    const componentLoaded = () => {
        if (isLoading) return (
            <ErrorScreens type={'loading'}/>
        )

        if (isNetworkError) return (
            <ErrorScreens type={'network'} refreshing={refreshing} onRefresh={onRefresh}/>
        )

        return true
    }

    return (
        <>
            {
                !componentLoaded() ?
                    componentLoaded()
                    :
                    <ScrollView className='flex-1 px-3 py-3'>

                        <View
                            style={{
                                width: '100%',
                                aspectRatio: 1,
                                overflow: 'hidden',
                                backgroundColor: colors.tertiary,
                                borderWidth: 1,
                                borderColor: colors.main
                            }}
                            className='rounded justify-center items-center'
                        >
                            {
                                first ?
                                    <Text
                                        style={{color: colors.main}}
                                        className='text-2xl font-averia_r'
                                    >You will see the result here</Text>
                                    :
                                    <Image
                                        resizeMode={'cover'}
                                        style={{flex: 1, width: '100%', aspectRatio: 1,
                                            backgroundColor: colors.background}}
                                        source={imageUri !== null ? {uri: imageUri} : statusImage}
                                    />
                            }

                        </View>
                        <Text
                            style={{color: colors.errorRed}}
                            className={`font-averia_r text-center
                        ${errors.image === '' ? 'h-0 mt-0' : 'h-auto mt-2'}`}
                        >{errors.image}</Text>
                        <Text
                            style={{color: colors.main}}
                            className=' text-xl font-averia_r'
                        >{statusMessage}</Text>

                        <LinearProgress
                            color={colors.primary}
                            trackColor={colors.main}
                            style={{
                                ...s`${progress === 0 ? 'h-0 mt-0' : 'h-auto mt-2'} `
                            }}
                            value={progress}
                            variant="determinate"
                        />

                        <View className='mt-5'>
                            <Input
                                onChangeText={(val) => onFormChange('prompt', val)}
                                value={form.prompt}
                                errorMessage={errors.prompt}
                                placeholder={"What you want to create?"}
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
                            <View className='mt-5'>
                                <Text
                                    className={'text-2xl font-averia_b ml-2 text-generator-slider-text'}
                                >Number of steps: {form.steps}</Text>
                                <Slider
                                    value={form.steps}
                                    onValueChange={(val) => onFormChange('steps', val)}
                                    maximumValue={100}
                                    minimumValue={1}
                                    step={1}
                                    orientation="horizontal"
                                    thumbStyle={{
                                        height: 20,
                                        backgroundColor: colors.primary,
                                        width: 20
                                    }}
                                    trackStyle={{
                                        height: 5
                                    }}
                                    minimumTrackTintColor={colors.main}
                                    maximumTrackTintColor={colors.main}
                                />
                            </View>
                        </View>

                        <View className='flex-row items-center mt-10 mb-5'>
                            <View className='flex-1'>
                                <Button
                                    title={"Generate image"}
                                    titleStyle={{
                                        fontFamily: 'AveriaSerifLibre_Regular',
                                        color: colors.background,
                                        ...s`text-xl`
                                    }}
                                    onPress={() => onFormSubmit()}
                                    buttonStyle={{
                                        ...s`py-2 rounded-md`,
                                        backgroundColor: colors.buttons.generate,
                                    }}
                                />
                            </View>
                            <View className='mx-2'/>
                            <View className='flex-1'>
                                <Button
                                    title={"Create post"}
                                    onPress={() => navigateToCreate()}
                                    titleStyle={{
                                        fontFamily: 'AveriaSerifLibre_Regular',
                                        color: colors.background,
                                        ...s`text-xl`
                                    }}

                                    buttonStyle={{
                                        ...s`py-2 rounded-md`,
                                        backgroundColor: colors.buttons.create,
                                    }}
                                />
                            </View>
                        </View>


                    </ScrollView>
            }
        </>

    );
}

export default memo(Generator);
