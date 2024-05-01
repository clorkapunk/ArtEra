import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator, Image,
  InteractionManager,
  RefreshControl,
  ScrollView,
  Text, TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from "react-native";
import { getCommentsByPost, getPosts } from "../../api/ContentAPI";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEnvelope, faGlobe, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import ListItem from "../../components/ListItem";
import { FlatList } from "react-native-gesture-handler";
import CommentBottomSheet from "../../components/CommentBottomSheet";



const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [isNetworkError, setIsNetworkError] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const commentSheetRef = useRef()


  useEffect(() => {
    getPosts()
      .then(data => {
        setData(data);
      })
      .catch((e) => {
        setIsNetworkError(false);
        // setData(getRandomData());
      });
    setData(getRandomData());
    setIsNetworkError(false);
    InteractionManager.runAfterInteractions(() => {
      setIsLoading(false);
    });
  }, []);

  const imgUrls = [
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
    "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
    "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
  ];

  function getRandomData() {
    let data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        id: i,
        owner: `User ${i}`,
        likes: Math.round(Math.random() * 100),
        comments: Math.round(Math.random() * 30),
        picture: imgUrls[Math.floor(Math.random() * imgUrls.length)],
        description: "My amazing description to this post",
        title: "My amazing title to this post",
        published_at: "2024-04-30T10:47:53.950693Z",
      });
    }
    return data;
  }

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setIsNetworkError(false);
    getPosts()
      .then(data => {
        setData(data);
        setRefreshing(false);
      })
      .catch((e) => {
        setIsNetworkError(true);
        setRefreshing(false);
        // setData(getRandomData());
      });
  }, []);


  return (
    <>
      {isLoading ?
        <View>
          <ActivityIndicator />
        </View>
        :
        (
          isNetworkError ?
            <ScrollView
              contentContainerStyle={{ flexGrow: 1 }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              <View className="w-full h-full flex-row justify-center items-center">
                <View className="p-10 flex-col justify-center items-center">
                  <FontAwesomeIcon icon={faGlobe} size={50} style={{ opacity: 0.8 }} />
                  <Text className="text-center text-base mt-5">
                    Read a book, watch a movie, play board games. A world without the Internet is also wonderful!
                  </Text>
                </View>
              </View>
            </ScrollView>
            :
            <>
              <View style={{ flex: 1, justifyContent: "flex-end" }}>
                <FlatList
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                  data={data}
                  renderItem={({ item }) => (<ListItem
                    openCommentSheet={(id) => commentSheetRef.current?.open(id)}
                    item={item} />)}
                  keyExtractor={(item, index) => item.id}
                />
              </View>

              <CommentBottomSheet  ref={commentSheetRef}/>
            </>

        )
      }
    </>

  )
    ;
};

export default memo(Home);
