import React, {useEffect, useRef, useState} from 'react';
import {Image, ScrollView, ToastAndroid, TouchableOpacity, View} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faCrop} from "@fortawesome/free-solid-svg-icons";
import {useNavigation} from "@react-navigation/native";
import {Button, Input} from "@rneui/themed";
import ImagePicker from 'react-native-image-crop-picker';
import {COLORS} from "../../../consts/colors";
import PostPreviewSheet from "../../../components/PostPreviewSheet";
import {sendPost} from "../../../api/ContentAPI";
import {SafeAreaView} from "react-native-safe-area-context";


const PostCreate = ({route}) => {
    const navigation = useNavigation();
    const {item, user, aspectRatio} = route.params
    const previewSheetRef = useRef(null);
    const [postData, setPostData] = useState({
        title: '',
        description: '',
        picture: item.node.image.uri,
        aspectRatio: aspectRatio,
        username: user.username,
        likes: 0,
        comments: 0,
        published_at: new Date(),
    })

    const [errors, setErrors] = useState({
        title: "",
        description: "",
    });



    function onPostChange(name, value) {
        setPostData(prevState => {
            return {
                ...prevState,
                [name]: value
            }
        });
    }

    function validatePost() {
        let isValid = true;
        let errorsTemp = {
            title: "",
            description: "",
        };
        if (postData.title === '') {
            errorsTemp["title"] = "Enter something";
            isValid = false;
        } else {
            errorsTemp["email"] = "";
        }

        if (postData.description === '') {
            errorsTemp["description"] = "Enter something";
            isValid = false;
        } else {
            errorsTemp["password"] = "";
        }

        setErrors(errorsTemp);

        return isValid;
    }

    function onShowPreview() {
        if (!validatePost()) return
        previewSheetRef.current?.open()
    }

    function onSendPost() {
        if (!validatePost()) return

        const formData = new FormData()
        formData.append('owner', user.id)
        formData.append('title', postData.title)
        formData.append('description', postData.description)
        formData.append("picture", {
            uri: postData.picture,
            name:'post_image.jpg',
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
                                onPostChange('picture',image.path)
                                onPostChange("aspectRatio", image.width / image.height)
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
                            style={{aspectRatio: postData.aspectRatio, width: '100%'}}
                            source={{uri: postData.picture}}
                        />
                    </View>


                    <Input
                        onChangeText={(val) => onPostChange("title", val)}
                        value={postData.title}
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
                        onChangeText={(val) => onPostChange("description", val)}
                        value={postData.description}
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
