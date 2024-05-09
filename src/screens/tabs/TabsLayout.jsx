import React, {useCallback, useMemo, useRef, useState} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "./Home";
import {View, Text} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Header from "../../components/Header";
import {faHome, faMessage, faSearch, faSquarePlus, faUser} from "@fortawesome/free-solid-svg-icons";
import Search from "./Search";
import Chat from "./Generator";
import Profile from "./Profile";
import {PortalProvider} from "@gorhom/portal";
import PostLayout from "./post/PostLayout";
import {createDrawerNavigator} from '@react-navigation/drawer';
import SideMenuLayout from "../../components/SideMenuLayout";
import MenuDrawer from 'react-native-side-drawer'
import AsyncStorage from "@react-native-async-storage/async-storage";
import Generator from "./Generator";

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

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
    const [sideMenuOpen, setSideMenuOpen] = useState(false);

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

            <MenuDrawer
                open={sideMenuOpen}
                position={'right'}
                drawerContent={<SideMenuLayout
                    onClose={() => setSideMenuOpen(false)}
                />}
                drawerPercentage={100}
                animationTime={250}
                overlay={true}
                opacity={0.4}
            >
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
                                header: () => <Header
                                    openSideMenu={() => setSideMenuOpen(true)}
                                    title={"Home"}/>,
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
                                header: () => <Header
                                    openSideMenu={() => setSideMenuOpen(true)}
                                    title={"Search"}/>,
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
                                header: () => <Header
                                    openSideMenu={() => setSideMenuOpen(true)}
                                    title={"Post"}/>,
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
                                header: () => <Header
                                    openSideMenu={() => setSideMenuOpen(true)}
                                    title={"Generator"}/>,
                            }}
                        >
                            {() => <Generator/>}
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
                                header: () => <Header
                                    openSideMenu={() => setSideMenuOpen(true)}
                                    title={"Profile"}/>,
                            }}
                        >
                            {() => <Profile/>}
                        </Tab.Screen>
                        {/*<Stack.Screen*/}
                        {/*    name='post-screen'*/}
                        {/*    component={PostScreen}*/}
                        {/*    options={{*/}
                        {/*        tabBarStyle: {*/}
                        {/*            display: 'none'*/}
                        {/*        },*/}
                        {/*        headerShown: false,*/}
                        {/*        tabBarItemStyle: {*/}
                        {/*            display: "none"*/}
                        {/*        }*/}
                        {/*    }}*/}
                        {/*/>*/}
                    </Tab.Navigator>
                </PortalProvider>
            </MenuDrawer>
        </>
    );
};

export default TabsLayout;
