import React, {memo, useState} from "react";
import {Text, View, Image, ToastAndroid, ActivityIndicator, ScrollView, TouchableNativeFeedback} from "react-native";
import {Button} from "@rneui/themed";
import {getUser} from "../../api/userAPI";
import ErrorScreens from "../../components/ErrorScreens";
import {LinearProgress, Slider} from "@rneui/base";
import {getGeneratedImage, getGeneratorStatus} from "../../api/ContentAPI";
import {useNavigation} from "@react-navigation/native";
import Input from './../../components/Input'
import {s} from 'react-native-wind'
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {colors} from "../../consts/colors";
import {faPaperPlane} from "@fortawesome/free-regular-svg-icons";


const loadingGifs = [
    require('../../../assets/generator/generating-loading-1.gif')
]

const errorScreen = require('../../../assets/generator/generator-error.png')


const Generator = () => {
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
        if (first === true) {
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
                    item: {
                        node: {
                            image: {
                                uri: imageUri
                            }
                        }
                    },
                    user: user,
                    aspectRatio: 1
                }
            })
        })


    }

    const componentLoaded = () => {
        if (isLoading) return (
            <View>
                <ActivityIndicator/>
            </View>
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
                                overflow: 'hidden'
                            }}
                            className='rounded border border-generator-image-border justify-center items-center'
                        >
                            {
                                first ?
                                    <Text className='text-lg text-generator-image-text'>You will see the result here</Text>
                                    :
                                    <Image
                                        className='rounded bg-white'
                                        resizeMode={'cover'}
                                        style={{flex: 1, width: '100%', aspectRatio: 1,}}
                                        source={imageUri !== null ? {uri: imageUri} : statusImage}
                                    />
                            }

                        </View>
                        <Text className={`text-red-600 ${errors.image === '' ? 'h-0' : 'h-auto'}`}
                        >{errors.image}</Text>
                        <Text
                            className='text-generator-progress-text text-xl font-averia_r'
                        >{statusMessage}</Text>
                        <LinearProgress
                            color={colors.generator.progress.line.before}
                            trackColor={colors.generator.progress.line.after}
                            style={{
                                ...s`${progress === 0 ? 'h-0' : 'h-auto'} mt-2`
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
                                containerStyle={{}}
                                inputContainerStyle={{...s`border-b`, borderColor: colors.listitem.input.border}}
                                placeholderTextColor={colors.listitem.input.placeholder}
                                inputStyle={{
                                    fontFamily: 'AveriaSerifLibre_Regular',
                                    color: colors.listitem.input.text,
                                    ...s`text-2xl py-0`
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
                                        backgroundColor: colors.generator.slider.thumb,
                                        width: 20
                                    }}
                                    trackStyle={{
                                        height: 5
                                    }}
                                    minimumTrackTintColor={colors.generator.slider.before}
                                    maximumTrackTintColor={colors.generator.slider.after}
                                />
                            </View>
                        </View>

                        <View className='flex-col mb-10'>
                            <View className='flex-row justify-center'>
                                <Button
                                    title={"Generate image"}
                                    titleStyle={{
                                        fontFamily: 'AveriaSerifLibre_Regular',
                                        color: colors.generator.buttons.generate.text,
                                        ...s`text-xl`
                                    }}
                                    onPress={() => onFormSubmit()}
                                    containerStyle={{
                                        marginTop: 40
                                    }}
                                    buttonStyle={{
                                        ...s`border py-2 rounded-md`,
                                        width: 200,
                                        backgroundColor: colors.generator.buttons.generate.bg,
                                        borderColor: colors.generator.buttons.generate.border
                                    }}
                                />
                            </View>
                            <View className='flex-row justify-center'>
                                <Button
                                    title={"Create post"}
                                    onPress={() => navigateToCreate()}
                                    titleStyle={{
                                        fontFamily: 'AveriaSerifLibre_Regular',
                                        color: colors.generator.buttons.create.text,
                                        ...s`text-xl`
                                    }}
                                    containerStyle={{
                                        marginTop: 20
                                    }}
                                    buttonStyle={{
                                        ...s`border py-2 rounded-md`,
                                        width: 200,
                                        backgroundColor: colors.generator.buttons.create.bg,
                                        borderColor: colors.generator.buttons.create.border
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
