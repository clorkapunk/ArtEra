import React, {memo, useEffect, useMemo, useState} from "react";
import {Text, View, Image, ToastAndroid, ActivityIndicator, ScrollView} from "react-native";
import {Button, Input} from "@rneui/themed";
import {COLORS} from "../../consts/colors";
import {editUserData} from "../../api/userAPI";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowUp} from "@fortawesome/free-solid-svg-icons";
import ErrorScreens from "../../components/ErrorScreens";
import {Slider} from "@rneui/base";
import {getGeneratedImage} from "../../api/ContentAPI";
import RNFS from "react-native-fs";
import {err} from "react-native-svg";


const loadingGifs = [
    require('../../assets/generator/generating-loading-1.gif')
]

const errorScreen = require('../../assets/generator/generator-error.png')


const Generator = () => {
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

    function randomLoadingGif(){
        return loadingGifs[Math.floor(Math.random()*loadingGifs.length)];
    }

    function onFormSubmit() {
        if (!validateForm()) return

        setImageUri(null)
        setStatusImage(randomLoadingGif());
        getGeneratedImage(form.prompt, form.steps)
            .then(path => {
                setImageUri(`file://${path}`)
            })
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
                            className='rounded border border-black'
                        >
                            <Image
                                className='rounded'
                                resizeMode={'cover'}
                                style={{flex: 1, width: '100%', aspectRatio: 1, }}
                                source={imageUri !== null ? {uri: imageUri} : statusImage}
                            />
                        </View>
                        <Text className='text-red-600'>{errors.image}</Text>
                        <View className='mt-3'>
                            <Input
                                multiline={true}
                                onChangeText={(val) => onFormChange('prompt', val)}
                                value={form.prompt}
                                errorMessage={errors.prompt}
                                inputMode={'text'}
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
                                placeholderTextColor={COLORS.lightGrey}
                                errorStyle={{color: "crimson"}}
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

                        <Button
                            title={"generate"}
                            onPress={() => onFormSubmit()}
                        />


                    </ScrollView>
            }
        </>

    );
}

export default memo(Generator);
