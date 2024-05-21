import React, {forwardRef, memo, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {getCommentsByPost} from "../api/ContentAPI";
import {Portal} from "@gorhom/portal";
import BottomSheet, {BottomSheetFlatList, BottomSheetScrollView} from "@gorhom/bottom-sheet/src";
import {ActivityIndicator, Image, Text, TouchableNativeFeedback, View} from "react-native";
import ListItem from "./ListItem";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faComment, faHeart as faHeartFull, faHeart, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import Input from './Input'
import SkeletonView from "./SkeletonView";
import {s} from "react-native-wind";
import Swiper from "react-native-swiper";
import {colors} from "../consts/colors";
import ThemeContext from "../context/ThemeProvider";

const imgUrls = [
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
    "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
    "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
];

const sampleListItem = (item) => {
    const defaultAvatar = require('./../../assets/images/default_avatar.png')
    const {colors} = useContext(ThemeContext)

    return (
        <View key={item.id} className='flex-col mb-6'>

            <View className='flex-row items-center px-3 py-2'>

                <Image
                    style={{width: '12%', aspectRatio: 1}}
                    className='rounded-full bg-white'
                    source={item.avatar !== null ? {uri: item.avatar} : defaultAvatar}
                />

                <Text
                    style={{color: colors.main}}
                    className='ml-3 font-averia_b text-xl'>{item.username}</Text>

            </View>


            <View className={'mx-3 mb-2 flex-row'}>
                <Text
                    style={{color: colors.main}}
                    className='text-3xl font-averia_r'
                >{item.title}</Text>
            </View>


            <View className='flex-1'>
                <View style={{width: '100%', aspectRatio: item.previewAspectRatio}}>
                    <Swiper
                        containerStyle={{
                            width: '100%',
                            height: '100%'
                        }}
                        showsButtons={true}
                        loop={false}
                    >

                        {
                            item.images.map(i =>
                                <View
                                    style={{backgroundColor: 'rgba(0,0,0,0.2)', overflow: 'hidden'}}
                                    className='mx-3 h-full flex-row items-center rounded-lg ' key={i.id}>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{width: '100%', height: '100%'}}
                                        source={{uri: i.image}}
                                        PlaceholderContent={<ActivityIndicator/>}
                                    />
                                </View>
                            )
                        }

                    </Swiper>
                </View>
            </View>

            <View className={'px-3 mt-2'}>
                <Text
                    style={{color: colors.main}}
                    className='px-3 text-xl font-averia_r'
                >{item.description}</Text>
            </View>


            <View className={'flex-row my-1 mx-3'}>
                <TouchableNativeFeedback
                    onPress={() => {
                    }}
                >
                    <View className='px-3 py-2 flex-row items-center justify-end'>
                        <FontAwesomeIcon
                            size={25}
                            icon={faHeart}
                            color={colors.main}
                        />
                        <Text
                            style={{color: colors.main}}
                            className='text-xl font-averia_b ml-2'>{item.likes}</Text>
                    </View>
                </TouchableNativeFeedback>


                <TouchableNativeFeedback onPress={() => {

                }}
                >
                    <View className='px-4 flex-row items-center justify-end'>
                        <FontAwesomeIcon
                            color={colors.main}
                            style={{marginBottom: 2}}
                            size={25}
                            icon={faComment}/>
                        <Text
                            style={{color: colors.main}}
                            className='text-xl font-averia_b ml-2 '
                        >{item.comments}</Text>
                    </View>
                </TouchableNativeFeedback>

            </View>

            <View className='mx-3 px-3'>
                <Input
                    placeholder={'Add a comment'}
                    rightIcon={(
                        <TouchableNativeFeedback onPress={() => {

                        }}>
                            <View className='p-2'>
                                <FontAwesomeIcon
                                    size={20}
                                    color={colors.main}
                                    icon={faPaperPlane}
                                />
                            </View>
                        </TouchableNativeFeedback>
                    )}
                    iconPosition="right"
                    containerStyle={{}}
                    inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                    placeholderTextColor={colors.placeholder}
                    inputStyle={{
                        fontFamily: 'AveriaSerifLibre_Regular',
                        color: colors.main,
                        ...s`text-lg py-0`
                    }}

                    iconContainerStyle={{}}
                    textInputProps={{multiline: true}}
                />
            </View>

        </View>
    );
}

const post = {
    images: [],
    swiperAspectRatio: '',
    username: '',
    description: '',
    title: '',
    likes: '',
    comments: ''
}


function getRandomData(number) {
    let data = [];
    for (let i = 0; i < number; i++) {
        data.push({
            id: i,
            username: "Username",
            images: [{
                id: i,
                image: imgUrls[Math.floor(Math.random() * imgUrls.length)]
            }],
            avatar: imgUrls[Math.floor(Math.random() * imgUrls.length)],
            description: "Sample amazing description to this post",
            title: "Sample amazing title to this post",
            published_at: new Date(),
            swiperAspectRatio: 1,
            likes: 10,
            comments: 10,
        });
    }
    return data;
}

const PostPreviewSheet = forwardRef(({item}, ref) => {
    const {colors} = useContext(ThemeContext)
    const bottomSheetRef = useRef(null)
    useImperativeHandle(ref, () => {
        return {
            open() {
                bottomSheetRef.current?.snapToIndex(0);
            }
        };
    }, []);

    const header = () =>
        <View
            style={{backgroundColor: colors.header, borderColor: colors.main}}
            className=' border-b p-3'>
            <Text
                style={{color: colors.main}}
                className='text-center text-xl font-averia_r'>Preview (drag to hide)</Text>
        </View>


    return (
        <>
            <Portal>
                <BottomSheet
                    backgroundStyle={{
                        backgroundColor: colors.background,
                    }}
                    ref={bottomSheetRef}
                    snapPoints={["100%"]}
                    index={-1}
                    enablePanDownToClose={true}
                    enableDynamicSizing={true}
                    handleComponent={header}
                >
                    <View style={{flex: 1, backgroundColor: colors.background}}>
                        <BottomSheetScrollView scrollEnabled={true}>
                            {
                                sampleListItem(item)
                            }
                        </BottomSheetScrollView>
                    </View>
                </BottomSheet>
            </Portal>
        </>
    );
})

export default PostPreviewSheet;
