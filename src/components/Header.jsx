import React, { useEffect } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Button } from "@rneui/themed";
import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "../consts/colors";

const Header = ({ title, route }) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [user, setUser] = React.useState(null);
  const [showDropdown, setShowDropdown] = React.useState(false);



  async function logout(){
    await AsyncStorage.removeItem('user');
    setUser(null)
  }

  useEffect(() => {
    setShowDropdown(false)

    async function set() {
      return JSON.parse(await AsyncStorage.getItem("user"));
    }
    set().then(r => {
      setUser(r)
    });
  }, [isFocused]);

  return (
    <View
      className={`bg-secondary border-b-2 border-b-primary
            px-3 py-1 flex-row items-center justify-between `}

    >
      <Text className={"text-primary font-cgregular text-xl"}>
        {title}
      </Text>
      <View className='h-[45px] flex-row items-center'>
      {
        user === null ?
          <Button
            onPress={() => navigation.navigate("auth", { screens: "sign-in" })}
            title={"Log In / Sign Up"}
            containerStyle={{
              borderRadius: 0,
              borderWidth: 1,
              backgroundColor: "transparent",

            }}
            buttonStyle={{
              backgroundColor: "transparent",
              paddingVertical: 5,
            }}
            titleStyle={{
              color: "black",
            }}
          />
          :
          <>
            <View className='flex-row items-center h-full'>
              <TouchableOpacity onPress={() => setShowDropdown(prevState => !prevState)}>
                <FontAwesomeIcon icon={faCircleUser} size={25}/>
              </TouchableOpacity>
              <View
                className='absolute bg-lightgray'
                style={{top: '100%', right: 0, display: `${showDropdown ? 'block' : 'none'}`}}
              >
                <Button
                  onPress={() => logout()}
                  title={"Log Out"}
                  type={'clear'}
                  buttonStyle={{
                    paddingHorizontal: 20
                  }}
                  titleStyle={{
                    color: 'white',
                    opacity: 0.8
                  }}
                />
              </View>
            </View>

          </>

      }
      </View>


    </View>

  );
};

export default Header;
