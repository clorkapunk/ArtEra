import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    ToastAndroid,
    TouchableNativeFeedback,
    TouchableOpacity,
    View
} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faBars, faCrop, faEdit} from "@fortawesome/free-solid-svg-icons";
import {useNavigation} from "@react-navigation/native";
import {Button} from "@rneui/themed";
import ImagePicker from 'react-native-image-crop-picker';
import PostPreviewSheet from "../../../components/PostPreviewSheet";
import {sendPost} from "../../../api/ContentAPI";
import {SafeAreaView} from "react-native-safe-area-context";
import Input from "../../../components/Input";
import Swiper from "react-native-swiper";
import {s} from "react-native-wind";
import ThemeContext from "../../../context/ThemeProvider";
import ImageSize from "react-native-image-size";


const PostCreate = ({route}) => {
    const navigation = useNavigation();
    const {colors} = useContext(ThemeContext)
    const {images, user} = route.params
    const previewSheetRef = useRef(null);
    const [postData, setPostData] = useState({
        title: '',
        description: '',
        username: user.username,
        images: images.map(i => {
            return {
                id: i.node.id,
                image: i.node.image.uri
            }
        }),
        likes: 0,
        comments: 0,
        published_at: new Date(),
        avatar: null,
        swiperAspectRatio: 0.75,
        previewAspectRatio: 0.75
    })
    const [errors, setErrors] = useState({
        title: "",
        description: "",
    });


    async function minAspectRatio(images) {
        let swiper = 1000
        let preview = 1000

        for (let i = 0; i < images.length; i++) {
            let {width, height} = await ImageSize.getSize(images[i].image)
            if ((width / height) < swiper) {
                swiper = (width / height) < 0.75 ? 0.75 : ((width) / height)
                preview = (width / height) < 0.75 ? 0.75 : ((width + width * 0.055) / height)
            }
        }
        onPostChange('swiperAspectRatio', swiper)
        onPostChange('previewAspectRatio', preview)
    }

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

    function onImagesChange(id, path, aspectRatio) {
        setPostData(prevState => {
            let temp = postData.images.map(i => {
                if (i.id !== id) return i
                else {
                    i.image = path
                    return i
                }
            })
            return {
                ...prevState,
                images: temp
            }
        });

        minAspectRatio(postData.images)
    }

    useEffect(() => {
        minAspectRatio(images.map(i => {
            return {
                id: i.node.id,
                image: i.node.image.uri
            }
        }))
    }, [images])

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
        for (let i = 0; i < postData.images.length; i++) {
            formData.append("images", {
                uri: postData.images[i].image,
                name: `post_image${i}.jpg`,
                type: 'image/jpg'
            })
        }


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

    function addAlpha(color, opacity) {
        let _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
        return color + _opacity.toString(16).toUpperCase();
    }

    return (
        <>
            <ScrollView
                stickyHeaderIndices={[0]}
                stickyHeaderHiddenOnScroll={true}
            >
                <SafeAreaView>
                    <View
                        style={{backgroundColor: colors.header, borderColor: colors.main}}
                        className={`border-b py-1 flex-row items-center justify-between h-[40px] relative`}
                    >
                        <Text
                            style={{color: colors.main}}
                            className='text-3xl font-averia_l  absolute w-full text-center'
                        >
                            Post
                        </Text>

                        <TouchableOpacity
                            className="p-2" onPress={() => navigation.navigate('post')}>
                            <View className='ml-3 items-center'>
                                <FontAwesomeIcon icon={faArrowLeft} color={colors.main} size={20}/>
                            </View>
                        </TouchableOpacity>

                    </View>

                </SafeAreaView>

                <View className='mb-10 mx-3 mt-3'>
                    <View style={{
                        marginBottom: 40, borderColor: colors.main,
                        width: '100%', aspectRatio: postData.swiperAspectRatio
                    }}
                          className=' overflow-hidden rounded-lg'>

                        <Swiper
                            containerStyle={{
                                width: '100%',
                                height: '100%'
                            }}
                            loop={false}
                        >

                            {
                                postData.images.map(i => {
                                        let initialImage = images.find(j => j.node.id === i.id)
                                        return (
                                            <View
                                                style={{backgroundColor: addAlpha(colors.main, 0.2), overflow: 'hidden'}}
                                                className=' h-full flex-row items-center relative' key={i.id}>
                                                <Image
                                                    resizeMode={'contain'}
                                                    style={{width: '100%', height: '100%'}}
                                                    source={{uri: i.image}}
                                                    PlaceholderContent={<ActivityIndicator/>}
                                                />

                                                <View className='absolute h-full w-full flex-row justify-end p-3'>
                                                    <TouchableOpacity
                                                        onPress={() => {
                                                            ImagePicker.openCropper({
                                                                path: initialImage.node.image.uri,
                                                                freeStyleCropEnabled: true
                                                            }).then(image => {
                                                                onImagesChange(i.id, image.path, image.width / image.height)
                                                                // onPostChange('picture', image.path)
                                                                // onPostChange("aspectRatio", image.width / image.height)
                                                            });
                                                        }}
                                                    >
                                                        <View>
                                                            <FontAwesomeIcon color={'white'} size={30} icon={faCrop}/>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>

                                            </View>)
                                    }
                                )
                            }

                        </Swiper>
                    </View>

                    <Input
                        onChangeText={(val) => onPostChange("title", val)}
                        value={postData.title}
                        errorMessage={errors.title}
                        placeholder={"Title"}
                        containerStyle={{marginBottom: 20}}
                        inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                        placeholderTextColor={colors.placeholder}
                        inputStyle={{
                            fontFamily: 'AveriaSansLibre_Regular',
                            color: colors.main,
                            ...s`text-2xl py-0`
                        }}
                        errorStyle={{
                            fontFamily: 'AveriaSansLibre_Regular',
                            color: colors.errorRed
                        }}
                        iconContainerStyle={{}}
                    />

                    <Input
                        onChangeText={(val) => onPostChange("description", val)}
                        value={postData.description}
                        placeholder={"Description"}
                        errorMessage={errors.description}
                        containerStyle={{}}
                        inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                        placeholderTextColor={colors.placeholder}
                        inputStyle={{
                            fontFamily: 'AveriaSansLibre_Regular',
                            color: colors.main,
                            ...s`text-2xl py-0`
                        }}
                        errorStyle={{
                            fontFamily: 'AveriaSansLibre_Regular',
                            color: colors.errorRed
                        }}
                        iconContainerStyle={{}}
                        textInputProps={{multiline: true}}
                    />


                    <View className='flex-row justify-between'>


                        <Button
                            title="See preview"
                            onPress={() => onShowPreview()}
                            buttonStyle={{
                                backgroundColor: colors.buttons.preview,
                                padding: 10,
                                borderRadius: 10,
                               }}
                            titleStyle={{
                                fontFamily: 'AveriaSansLibre_Regular',
                                fontSize: 20,
                                color: colors.background,
                            }}
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
                                backgroundColor: colors.buttons.post,
                                padding: 10,
                                borderRadius: 10,

                            }}
                            titleStyle={{
                                fontFamily: 'AveriaSansLibre_Regular',
                                fontSize: 20,
                                color: colors.background,
                            }}
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
