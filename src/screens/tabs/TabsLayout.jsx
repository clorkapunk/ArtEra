import React, {useCallback, useMemo, useRef, useState} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "./Home";
import {View, Text} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Header from "../../components/Header";
import {faHome, faMessage, faSearch, faSquarePlus, faUser} from "@fortawesome/free-solid-svg-icons";
import Search from "./Search";
import Post from "./post/Post";
import Chat from "./Chat";
import Profile from "./Profile";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {PortalProvider} from "@gorhom/portal";
import PostLayout from "./post/PostLayout";
import PostScreen from "./PostScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabIcon = ({icon, color, name, focused}) => {
    return (
        <View style={{
            justifyContent: "center",
            alignItems: "center",
        }}>
            <FontAwesomeIcon
                color={color}
                icon={icon}
                size={20}
            />

            {
                focused &&
                <Text style={{color: color, fontWeight: "bold"}}>
                    {name}
                </Text>
            }
        </View>
    );
};


const TabsLayout = () => {
    const bottomSheetRef = useRef(null);
    const [bottomSheetData, setBottomSheetData] = useState({
        id: null,
        comments: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
    });
    const snapPoints = useMemo(() => ["75%", "100%"], []);

    const handleSheetChanges = useCallback((index) => {

    }, []);

    const renderItem = useCallback(
        ({item}) => (
            <View className="p-4 bg-amber-950 my-1 rounded">
                <Text className="text-white text-center">{item}</Text>
            </View>
        ),
        [],
    );


    return (
        <>

            <PortalProvider>
                <Tab.Navigator
                    screenOptions={{
                        tabBarShowLabel: false,
                        tabBarActiveTintColor: "#5BC0BE",
                        tabBarInactiveTintColor: "#3A506B",
                        tabBarStyle: {
                            backgroundColor: "#0B132B",
                            height: 55,
                            borderTopWidth: 2,
                            borderTopColor: "#5BC0BE",
                        },
                        freezeOnBlur: true,
                    }}
                    initialRouteName="home"
                >
                    <Tab.Screen
                        name="home"
                        options={{
                            tabBarIcon: ({color, focused}) => (
                                <TabIcon
                                    icon={faHome}
                                    color={color}
                                    name="Home"
                                    focused={focused}
                                />
                            ),
                            header: () => <Header title={"Home"}/>,
                        }}
                    >
                        {() => <Home/>}
                    </Tab.Screen>

                    <Tab.Screen
                        name="search"
                        options={{
                            tabBarHideOnKeyboard: true,
                            tabBarIcon: ({color, focused}) => (
                                <TabIcon
                                    icon={faSearch}
                                    color={color}
                                    name="Search"
                                    focused={focused}
                                />
                            ),
                            header: () => <Header title={"Search"}/>,
                        }}
                    >
                        {() => <Search/>}
                    </Tab.Screen>


                    <Tab.Screen
                        name="post-layout"
                        options={{
                            headerShown: false,
                            tabBarHideOnKeyboard: true,
                            tabBarIcon: ({color, focused}) => (
                                <TabIcon
                                    icon={faSquarePlus}
                                    color={color}
                                    name="Post"
                                    focused={focused}
                                />
                            ),
                            header: () => <Header title={"Post"}/>,
                        }}
                    >
                        {() => <PostLayout/>}
                    </Tab.Screen>


                    <Tab.Screen
                        name="chat"
                        options={{
                            tabBarIcon: ({color, focused}) => (
                                <TabIcon
                                    icon={faMessage}
                                    color={color}
                                    name="Chat"
                                    focused={focused}
                                />
                            ),
                            header: () => <Header title={"Chat"}/>,
                        }}
                    >
                        {() => <Chat/>}
                    </Tab.Screen>

                    <Tab.Screen
                        name="profile"
                        options={{
                            tabBarIcon: ({color, focused}) => (
                                <TabIcon
                                    icon={faUser}
                                    color={color}
                                    name="Profile"
                                    focused={focused}
                                />
                            ),
                            header: () => <Header title={"Profile"}/>,
                        }}
                    >
                        {() => <Profile/>}
                    </Tab.Screen>
                    <Stack.Screen
                        name='post-screen'
                        component={PostScreen}
                        options={{
                            headerShown: false,
                            tabBarItemStyle:{
                                display: "none"
                            }
                        }}
                    />
                </Tab.Navigator>
            </PortalProvider>

        </>
    );
};

export default TabsLayout;
