import React, { memo, useEffect, useState } from "react";
import { Button, FlatList, Text, View, Image, InteractionManager, ActivityIndicator } from "react-native";
import GridItem from "../../components/GridItem";
import { useNavigation } from "@react-navigation/native";
import { getPosts } from "../../api/ContentAPI";

const Post = () => {
  const navigation = useNavigation();

  const imgUrls = [
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
    "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
    "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
  ];

  const data = [];

  for (let i = 0; i < 20; i++) {
    data.push({
      id: i,
      user: `User ${i}`,
      reactions: Math.round(Math.random() * 100),
      comments: Math.round(Math.random() * 30),
      img: imgUrls[Math.floor(Math.random() * imgUrls.length)],
    });
  }


  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      {
        isLoading ?
          <View>
            <ActivityIndicator />
          </View>
          :
          <View className={"flex-1"}>
            <View className="flex-1">
              <FlatList
                columnWrapperStyle={{
                  justifyContent: "space-between",
                }}
                numColumns={3}
                data={data}
                renderItem={({ item }) => (<GridItem item={item} />)}
                keyExtractor={(item) => item.id}
              />
            </View>
            <View className={"h-[65px]"}>
              <Button
                title="Choose from App "
                onPress={() => getPosts()}
              />
            </View>
          </View>
      }
    </>

  );
};

export default memo(Post);
