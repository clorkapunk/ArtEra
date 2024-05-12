import React, {useCallback, useMemo, useRef, useState} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "./Home";
import {View, Text} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import Header from "../../components/Header";
import {faHome, faMessage, faSearch, faSquarePlus, faSquareXmark, faUser} from "@fortawesome/free-solid-svg-icons";
import Search from "./Search";
import Profile from "./Profile";
import {PortalProvider} from "@gorhom/portal";
import PostLayout from "./post/PostLayout";
import SideMenuLayout from "../../components/SideMenuLayout";
import MenuDrawer from 'react-native-side-drawer'
import Generator from "./Generator";
import {colors} from '../../consts/colors'


const Tab = createBottomTabNavigator();

const TabIcon = ({icon, color, name, focused, size = 20, style}) => {
    return (
        <View style={{
            justifyContent: "center",
            alignItems: "center",
        }}>
            <FontAwesomeIcon
                color={color}
                icon={icon}
                size={focused ? 20: size}
                style={style}
            />

            {
                focused &&
                <Text style={{color: color, fontFamily: 'AveriaSerifLibre_Bold'}}>
                    {name}
                </Text>
            }
        </View>
    );
};

const TabsLayout = () => {

    const [sideMenuOpen, setSideMenuOpen] = useState(false);

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
                position={'left'}
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
                            tabBarActiveTintColor: colors.tabbar.tab.active,
                            tabBarInactiveTintColor: colors.tabbar.tab.inactive,
                            tabBarStyle: {
                                backgroundColor: colors.tabbar.bg,
                                height: 45,
                                borderTopWidth: 0,
                                borderTopColor: colors.tabbar.border,
                            },
                            freezeOnBlur: true,
                        }}
                        initialRouteName="home"
                    >
                        <Tab.Screen
                            name="home"
                            options={{
                                tabBarHideOnKeyboard: true,
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
                                        icon={faSquareXmark}
                                        color={colors.tabbar.tab.center}
                                        size={30}
                                        name="Post"
                                        focused={focused}
                                        style={{transform: [{rotateZ: '45deg'}]}}
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
                            name="generator"
                            options={{
                                tabBarHideOnKeyboard: true,
                                tabBarIcon: ({color, focused}) => (
                                    <TabIcon
                                        icon={faMessage}
                                        color={color}
                                        name="Generate"
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
                    </Tab.Navigator>
                </PortalProvider>
            </MenuDrawer>
        </>
    );
};

export default TabsLayout;
