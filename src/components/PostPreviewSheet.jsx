import React, {forwardRef, memo, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {getCommentsByPost} from "../api/ContentAPI";
import {Portal} from "@gorhom/portal";
import BottomSheet, {BottomSheetFlatList, BottomSheetScrollView} from "@gorhom/bottom-sheet/src";
import {COLORS} from "../consts/colors";
import {ActivityIndicator, Image, Text, TouchableNativeFeedback, View} from "react-native";
import ListItem from "./ListItem";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faComment, faHeart, faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {Input} from "@rneui/themed";

const imgUrls = [
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
    "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
    "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
];

const sampleListItem = (item) => {

    return (
        <View key={item.id} className='flex-col m-3'>
            <Text className='mb-3 text-gray-400 text-lg'>{item.username}</Text>
            <Image
                source={{uri: item.picture}}
                style={{width: '100%', flex: 1, aspectRatio: item.aspectRatio}}
                PlaceholderContent={<ActivityIndicator/>}
            />
            <View className='mt-2'>
                <Text className='text-lg'>{item.title}</Text>
                <Text className='text-base'>{item.description}</Text>
            </View>

            <View className={'flex-row my-1'}>
                <TouchableNativeFeedback>
                    <View className='px-4 py-2 flex-row items-center justify-end'>
                        <FontAwesomeIcon size={20} icon={faHeart}/>
                        <Text className='text-sm ml-2 text-gray-400'>{item.likes}</Text>
                    </View>
                </TouchableNativeFeedback>


                <TouchableNativeFeedback>
                    <View className='px-4 flex-row items-center justify-end'>
                        <FontAwesomeIcon style={{marginBottom: 2}} size={20} icon={faComment}/>
                        <Text className='text-sm ml-2 text-gray-400'>{item.comments}</Text>
                    </View>
                </TouchableNativeFeedback>

            </View>

            <Input
                placeholder={"Write your comment"}
                rightIcon={(
                    <TouchableNativeFeedback>
                        <View className='p-2'>
                            <FontAwesomeIcon
                                size={20}
                                icon={faPaperPlane}
                                color={COLORS.primary}/>
                        </View>
                    </TouchableNativeFeedback>
                )}
                containerStyle={{paddingHorizontal: 0}}
                inputContainerStyle={{
                    paddingLeft: 20, borderRadius: 8,
                    paddingRight: 10,
                    backgroundColor: "white",
                    borderWidth: 1, borderColor: 'black'
                }}
                inputStyle={{color: "black"}}
                labelStyle={{color: "white", marginBottom: 5, fontWeight: "100"}}
                placeholderTextColor={COLORS.lightGrey}
                errorStyle={{margin: 0, height: 0}}
            />
        </View>
    );
}

const post = {
    picture: '',
    aspectRatio: '',
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
            picture: imgUrls[Math.floor(Math.random() * imgUrls.length)],
            description: "Sample amazing description to this post",
            title: "Sample amazing title to this post",
            published_at: new Date(),
            aspectRatio: 1,
            likes: 10,
            comments: 10,
        });
    }
    return data;
}

const PostPreviewSheet = forwardRef(({item}, ref) => {
    const bottomSheetRef = useRef(null);
    const [sheetData, setSheetData] = useState({
        before: getRandomData(1),
        item: item,
        after: getRandomData(1)
    });
    const [sheetIndex, setSheetIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false)

    useImperativeHandle(ref, () => {
        return {
            open() {
                bottomSheetRef.current?.snapToIndex(0);
            },
        };
    }, []);

    useEffect(() => {
        setSheetData({
            before: getRandomData(1),
            item: item,
            after: getRandomData(1)
        })
    }, [item])


    const header = () =>
        <View className='bg-white border-b-2 border-black p-3'>
            <Text className='text-xl'>Preview (drag to hide)</Text>
        </View>


    return (
        <>
            <Portal>
                <BottomSheet
                    backgroundStyle={{
                        backgroundColor: COLORS.darkGrey,
                    }}
                    ref={bottomSheetRef}
                    snapPoints={["100%"]}
                    index={-1}
                    enablePanDownToClose={true}
                    enableDynamicSizing={true}
                    onChange={(index) => setSheetIndex(index)}
                    handleComponent={header}
                >
                    <View className='bg-white' style={{flex: 1}}>
                        <BottomSheetScrollView>
                            {
                                sheetData.before.map(item =>
                                    sampleListItem(item)
                                )
                            }
                            {
                                sampleListItem(item)
                            }
                            {
                                sheetData.before.map(item =>
                                    sampleListItem(item)
                                )
                            }
                        </BottomSheetScrollView>
                    </View>
                </BottomSheet>
            </Portal>
        </>
    );
})

export default PostPreviewSheet;
