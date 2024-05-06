import React, {useEffect, useRef, useState} from 'react';
import {Image, ScrollView, ToastAndroid, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faCrop} from "@fortawesome/free-solid-svg-icons";
import {useNavigation} from "@react-navigation/native";
import {Button, Input} from "@rneui/themed";
import ImagePicker from 'react-native-image-crop-picker';
import {COLORS} from "../../../consts/colors";
import RNFS, {readFile} from 'react-native-fs'
import PostPreviewSheet from "../../../components/PostPreviewSheet";
import {sendPost} from "../../../api/ContentAPI";
import {SafeAreaView} from "react-native-safe-area-context";


const PostCreate = ({route}) => {
    const navigation = useNavigation();
    const {item, id} = route.params
    const [aspectRatio, setAspectRatio] = useState(1)
    const [imageUri, setImageUri] = useState(item.node.image.uri)
    const [form, setForm] = useState({
        title: "",
        description: "",
    });

    const [errors, setErrors] = useState({
        title: "",
        description: "",
    });
    const [postData, setPostData] = useState({
        picture: imageUri,
        title: '',
        description: '',
        owner: id,
        published_at: new Date(),
    })

    const previewSheetRef = useRef(null);

    function onFormChange(name, value) {
        setForm({...form, [name]: value});
    }

    function validateForm() {
        let isValid = true;
        let errorsTemp = {
            title: "",
            description: "",
        };
        if (form.title === '') {
            errorsTemp["title"] = "Enter something";
            isValid = false;
        } else {
            errorsTemp["email"] = "";
        }

        if (form.description === '') {
            errorsTemp["description"] = "Enter something";
            isValid = false;
        } else {
            errorsTemp["password"] = "";
        }

        setErrors(errorsTemp);

        return isValid;
    }


    useEffect(() => {
        Image.getSize(item.node.image.uri, (width, height) => {
            setAspectRatio(width / height)
        })

    }, [item])

    function onShowPreview() {
        if (!validateForm()) return

        setPostData(prevState => {
            return {
                ...prevState,
                picture: imageUri,
                title: form.title,
                description: form.description,
                published_at: new Date(),
            }
        })
        previewSheetRef.current?.open()
    }


    function onSendPost() {
        if (!validateForm()) return

        const formData = new FormData()
        formData.append('title', form.title)
        formData.append('description', form.description)
        formData.append('owner', postData.owner)
        formData.append("picture", {
            uri:imageUri,
            name:'userProfile.jpg',
            type:'image/jpg'
        })

        sendPost(formData)
            .then(r => {
                if (r === 201) {
                    ToastAndroid.show("Success", ToastAndroid.SHORT)
                    navigation.goBack()
                }
            })
            .catch(e => {
                ToastAndroid.show("Error", ToastAndroid.SHORT)
            })

    }


    return (
        <>
            <ScrollView

                stickyHeaderIndices={[0]}
                stickyHeaderHiddenOnScroll={true}
            >
                <SafeAreaView className='flex-row justify-between items-center mb-3 py-2 px-3 bg-white border-b border-black'>
                    <TouchableOpacity
                        className="p-2" onPress={() => navigation.navigate("post")}>
                        <View className='items-center'>
                            <FontAwesomeIcon icon={faArrowLeft} color={"black"} size={25}/>
                        </View>
                    </TouchableOpacity>
                    <Button
                        onPress={() => {
                            ImagePicker.openCropper({
                                path: item.node.image.uri,
                                freeStyleCropEnabled: true
                            }).then(image => {
                                setImageUri(image.path)
                                setAspectRatio(image.width / image.height)
                            });
                        }}
                        buttonStyle={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            alignItems: 'center',
                            borderWidth: 2,
                            borderColor: 'black'
                        }}
                        titleStyle={{
                            fontSize: 16,
                            color: 'black'
                        }}
                    >
                        <FontAwesomeIcon
                            style={{marginRight: 10}}
                            size={20}
                            icon={faCrop}
                            color={'black'}
                        />
                        Edit image
                    </Button>
                </SafeAreaView>

                <View className='mb-10 mx-4'>
                    <View className='mb-5 border-2 rounded border-black'>
                        <Image
                            style={{aspectRatio: aspectRatio, width: '100%'}}
                            source={{uri: imageUri}}
                        />
                    </View>


                    <Input
                        onChangeText={(val) => onFormChange("title", val)}
                        value={form.title}
                        placeholder={"Write description of your image"}
                        label={'Title'}
                        errorMessage={errors.title}
                        containerStyle={{paddingHorizontal: 0}}
                        inputContainerStyle={{
                            paddingHorizontal: 5, borderRadius: 5,
                            borderWidth: 1, borderColor: 'black'
                        }}
                        inputStyle={{color: "black"}}
                        labelStyle={{
                            fontSize: 20,
                            color: "black",
                            marginBottom: 5,
                            fontWeight: "100"
                        }}
                        placeholderTextColor={COLORS.lightGrey}
                        errorStyle={{color: "crimson"}}
                    />

                    <Input
                        multiline={true}
                        onChangeText={(val) => onFormChange("description", val)}
                        value={form.description}
                        placeholder={"Write description of your image"}
                        label={'Description'}
                        errorMessage={errors.description}
                        numberOfLines={5}
                        textAlignVertical={'top'}
                        containerStyle={{paddingHorizontal: 0}}
                        inputContainerStyle={{
                            paddingHorizontal: 5, borderRadius: 5,
                            borderWidth: 1, borderColor: 'black'
                        }}
                        inputStyle={{color: "black"}}
                        labelStyle={{
                            fontSize: 20,
                            color: "black",
                            marginBottom: 5,
                            fontWeight: "100"
                        }}
                        placeholderTextColor={COLORS.lightGrey}
                        errorStyle={{color: "crimson"}}
                    />

                    <View className='flex-row justify-between'>


                        <Button
                            title="See preview"
                            onPress={() => onShowPreview()}
                            buttonStyle={{

                                backgroundColor: COLORS.primary,
                                padding: 10,
                                borderRadius: 10,
                            }}
                            titleStyle={{fontSize: 20}}
                            containerStyle={{
                                flex: 1,
                                marginVertical: 20,
                                marginRight: 10,
                            }}
                        />

                        <Button
                            title="Post"
                            onPress={() => onSendPost()}
                            buttonStyle={{
                                backgroundColor: "orange",
                                padding: 10,
                                borderRadius: 10,
                            }}
                            titleStyle={{fontSize: 20}}
                            containerStyle={{
                                flex: 1,
                                marginVertical: 20,
                                marginLeft: 10
                            }}
                        />
                    </View>
                </View>
            </ScrollView>

            <PostPreviewSheet
                item={postData}
                ref={previewSheetRef}
            />
        </>
    );
};

export default PostCreate;
