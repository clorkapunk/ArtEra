import React, { memo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableNativeFeedback,
  View,
  Image,
  InteractionManager, RefreshControl, ToastAndroid,
} from "react-native";
import GridItem from "../../components/GridItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {getPostsBySearch} from "../../api/ContentAPI";
import MasonryList from "@react-native-seoul/masonry-list";
import {getUserData} from "../../api/userAPI";
import SplashScreen from "react-native-splash-screen";

const Profile = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(false)
  const [tab, setTab] = useState("arts");
  const [user, setUser] = useState({
    id: '',
    username: "",
    user_background: "https://unblast.com/wp-content/uploads/2021/01/Space-Background-Images.jpg",
    avatar: 'https://www.clevelanddentalhc.com/wp-content/uploads/2018/03/sample-avatar.jpg',
    email: "",
  });
  const [data, setData] = useState({
    count: null,
    next: null,
    previous: null,
    results: []
  });
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsLoading(false);
    });
  }, []);


  useEffect(() => {
    async function getUser(){
      return JSON.parse(await AsyncStorage.getItem('user'))
    }

    getUser()
        .then(user => {
          getUserData(user.id).then(data => {
            setUser(data)
            console.log(`user is ${user.id}`)
            getPostsBySearch('', data.id, 1)
                .then(data => {
                  setData(data)
                  console.log(user)
                })
                .catch(e => console.log(e.response.data))
          })
              .catch(e => console.log(e.response.data))
        })

  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    getPostsBySearch('','', 1)
        .then(data => {
          setData(data);
          setRefreshing(false);
        })
        .catch((e) => {
          setRefreshing(false);
        });
  }, []);

  const onEndReached = () => {
    if (data.next === null) {
      ToastAndroid.show("End reached!", ToastAndroid.SHORT)
      return
    }

    getPostsBySearch('', '',data.next)
        .then(data => {
          setData(prevState => {
            return {
              next: data.next,
              previous: data.previous,
              count: data.count,
              results: prevState.results.concat(data.results)
            }
          });
        })
        .catch((e) => {
          console.log('error')
        });
  }


  return (
    <>
      {
        isLoading ?
          <View>
            <ActivityIndicator />
          </View>
          :
          <View className="flex-1">
            <View style={{flex: 1, position: 'relative'}}>
              <Image
                  source={{uri:  user.user_background}}
                  style={{ flex: 1 }}
                  resizeMode={"cover"}
                  PlaceholderContent={<ActivityIndicator />}
              />
            </View>

            <View style={{ flex: 3 }} className="m-3">
              <View className='flex-row justify-between items-center mb-2'>
                <Text className="text-2xl font-cgbold mb-2">{user.username}</Text>
                <Image
                    source={{uri:  user.avatar}}
                    className="rounded-full"
                    style={{ width: "28%", aspectRatio: 1 }}
                    resizeMode={"cover"}
                    PlaceholderContent={<ActivityIndicator />}
                />
              </View>

              <View className="flex-row mb-6">
                <View className="mr-10">
                  <TouchableNativeFeedback
                    onPress={() => alert("Coming soon")}
                  >
                    <View className="p-1 rounded">
                      <Text className={`text-xl font-cgregular underline `}>
                        0 followers
                      </Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
                <TouchableNativeFeedback
                  onPress={() => alert("list of arts (maybe not)")}
                >
                  <View className="p-1 rounded">
                    <Text className={`text-xl font-cgregular underline `}>
                      {data.count} arts
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
                {
                  isSearchLoading ?
                      <ActivityIndicator size={30} className='mb-2'/>
                      :
                      <MasonryList
                          refreshControl={
                            <RefreshControl
                                enabled={true}
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                          }
                          onEndReached={() => onEndReached()}
                          columnWrapperStyle={{
                            justifyContent: "space-between",
                          }}
                          numColumns={2}
                          data={data.results}
                          renderItem={({item}) => (<GridItem item={item}/>)}
                          keyExtractor={(item, index) => item.id}
                      />
                }
              </View>
            </View>


          </View>
      }
    </>

  );
};

export default memo(Profile);
