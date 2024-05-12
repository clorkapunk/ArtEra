import React, {memo, useState} from "react";
import {Text, View, Image, ToastAndroid, ActivityIndicator, ScrollView} from "react-native";
import {Button} from "@rneui/themed";
import {getUser} from "../../api/userAPI";
import ErrorScreens from "../../components/ErrorScreens";
import {LinearProgress, Slider} from "@rneui/base";
import {getGeneratedImage, getGeneratorStatus} from "../../api/ContentAPI";
import {useNavigation} from "@react-navigation/native";
import Input from './../../components/Input'
import {s} from 'react-native-wind'


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

        if(status === undefined) return

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
            setStatusMessage(`Progress: ${parseFloat(status.progress).toFixed(2)} / 1.00`)
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
                            style={{width: '100%', aspectRatio: 1}}
                            className='rounded border border-black justify-center items-center'
                        >
                            {
                                first ?
                                    <Text className='text-lg text-black'>You will see the result here</Text>
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
                        <Text className='text-black text-lg'>{statusMessage}</Text>
                        <LinearProgress
                            style={s`${progress === 0 ? 'h-0' : 'h-auto'}`}
                            value={progress}
                            variant="determinate"
                        />
                        <View className='mt-3'>
                            <Input
                                onChangeText={(val) => onFormChange('prompt', val)}
                                value={form.prompt}
                                errorMessage={errors.prompt}
                                placeholder={"Enter your prompt"}
                                label={"Prompt"}
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
                                errorStyle={{color: "crimson"}}
                                textInputProps={{
                                    inputMode: 'text',
                                    multiline: true
                                }}

                            />
                            <View>
                                <Text className='text-lg text-black'>Steps: {form.steps}</Text>
                                <Slider
                                    value={form.steps}
                                    onValueChange={(val) => onFormChange('steps', val)}
                                    maximumValue={100}
                                    minimumValue={1}
                                    step={1}
                                    orientation="horizontal"
                                    thumbStyle={{height: 20, width: 20}}
                                />
                            </View>
                        </View>

                        <View className='flex-col'>
                            <Button
                                title={"generate"}
                                onPress={() => onFormSubmit()}
                            />

                            <Button
                                title={"creat post"}
                                onPress={() => navigateToCreate()}
                            />
                        </View>


                    </ScrollView>
            }
        </>

    );
}

export default memo(Generator);
