import React, { memo, useEffect, useState } from "react";
import { View, Text, ScrollView, FlatList, InteractionManager, ActivityIndicator } from "react-native";
import { SearchBar } from "react-native-screens";
import GridItem from "../../components/GridItem";


const SearchTag = ({ item }) => {
  return (
    <View className="bg-white mr-2 px-2 py-1 rounded-full border">
      <Text>
        {item}
      </Text>
    </View>
  );
};

const Search = memo(() => {


  const [search, setSearch] = useState("");
  const tags = ["TAG 1", "TAG 2", "TAG 3", "TAG 4", "TAG 5", "TAG 6", "TAG 7", "TAG 8", "TAG 9"];
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

  const updateSearch = (search) => {
    setSearch(search);
  };

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
          <View className={"flex-col flex-1"}>
            <View className={"mx-5 my-4"}>
              <SearchBar
                placeholder="Search..."
                onChangeText={updateSearch}
                value={search}
                containerStyle={{
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                  paddingVertical: 0,
                  paddingHorizontal: 0,
                }}
                inputContainerStyle={{
                  backgroundColor: "white",
                  borderColor: "#0b132b",
                  borderWidth: 1,
                  borderBottomWidth: 1,
                  borderRadius: 2,
                  display: "flex",
                  flexDirection: "row-reverse",

                }}
                inputStyle={{
                  marginLeft: 0,
                  fontSize: 20,
                  marginStart: 10,
                }}
                leftIconContainerStyle={{
                  marginEnd: 20,
                }}
              />
            </View>

            <View className="ml-3 mb-4">
              <ScrollView horizontal={true}>
                {
                  tags.map(item => {
                    return <SearchTag key={item} item={item} />;
                  })
                }
              </ScrollView>
            </View>
            <View className="flex-1">
              <FlatList
                columnWrapperStyle={{
                  justifyContent: "space-between",
                }}
                numColumns={2}
                data={data}
                renderItem={({ item }) => (<GridItem item={item} />)}
                keyExtractor={(item, index) => item.id}
              />
            </View>


          </View>
      }
    </>

  );
});

export default memo(Search);
