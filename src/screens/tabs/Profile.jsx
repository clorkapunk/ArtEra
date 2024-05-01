import React, { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableNativeFeedback,
  View,
  Image,
  InteractionManager,
} from "react-native";
import GridItem from "../../components/GridItem";

const Profile = () => {


  const imgUrls = [
    "https://letsenhance.io/static/8f5e523ee6b2479e26ecc91b9c25261e/1015f/MainAfter.jpg",
    "https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg",
    "https://cdn.pixabay.com/photo/2016/05/05/02/37/sunset-1373171_1280.jpg",
    "https://media.macphun.com/img/uploads/customer/how-to/608/15542038745ca344e267fb80.28757312.jpg?q=85&w=1340",
  ];


  function getPosts() {
    let data = [];
    for (let i = 0; i < 20; i++) {
      data.push({
        id: i,
        user: `User ${i}`,
        reactions: Math.round(Math.random() * 100),
        comments: Math.round(Math.random() * 30),
        img: imgUrls[Math.floor(Math.random() * imgUrls.length)],
      });
    }
    return data;
  }

  const [tab, setTab] = useState("arts");

  const [user, setUser] = useState({
    nickname: "Die young",
    profileImg: "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg",
    followers: 500,
    artsAmount: 31,
    arts: [],
    favorites: [],
  });

  useEffect(() => {
    setUser({
      nickname: "Die young",
      followers: 500,
      artsAmount: 31,
      profileImg: "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg",
      arts: getPosts(),
      favorites: getPosts(),
    });
  }, []);

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
          <View className="flex-1">
            <Image
              source={{ uri: user.profileImg }}
              style={{ flex: 1 }}
              resizeMode={"cover"}
              PlaceholderContent={<ActivityIndicator />}
            />
            <View style={{ flex: 3 }} className="m-3">
              <Text className="text-2xl font-cgbold mb-2">{user.nickname}</Text>
              <View className="flex-row mb-6">
                <View className="mr-10">
                  <TouchableNativeFeedback
                    onPress={() => alert("list of followers")}
                  >
                    <View className="p-1 rounded">
                      <Text className={`text-xl font-cgregular underline `}>
                        {user.followers} followers
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
                <TouchableNativeFeedback
                  onPress={() => alert("list of arts (maybe not)")}
                >
                  <View className="p-1 rounded">
                    <Text className={`text-xl font-cgregular underline `}>
                      {user.artsAmount} arts
                    </Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
              <View className="flex-row justify-around">
                <TouchableNativeFeedback
                  onPress={() => setTab("arts")}
                >
                  <View className="p-1 rounded">
                    <Text className={`text-xl font-cgregular ${tab === "arts" && "underline"} `}>Your arts</Text>
                  </View>
                </TouchableNativeFeedback>

                <TouchableNativeFeedback
                  onPress={() => setTab("favorites")}
                >
                  <View className="p-1 rounded">
                    <Text className={`text-xl font-cgregular ${tab === "favorites" && "underline"} `}>Favorites</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>

              <View style={{ flex: 1 }}>
                <FlatList
                  columnWrapperStyle={{
                    justifyContent: "space-between",
                  }}
                  numColumns={2}
                  data={user[tab]}
                  renderItem={({ item }) => (<GridItem item={item} />)}
                  keyExtractor={(item, index) => item.id}
                />
              </View>
            </View>


          </View>
      }
    </>

  );
};

export default memo(Profile);
