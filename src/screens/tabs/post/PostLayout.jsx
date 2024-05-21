import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Post from "./Post";
import Header from "../../../components/Header";
import PostCreate from "./PostCreate";
import {TransitionPresets} from "@react-navigation/stack";

const Stack = createNativeStackNavigator()

const PostLayout = ({openSideMenu}) => {

    return (
        <>
            <Stack.Navigator
                initialRouteName='post'
                screenOptions={{
                    headerShown: true,
                }}
            >
                <Stack.Screen
                    name="post"
                    component={Post}
                    options={{
                        header: () => <Header
                            openSideMenu={openSideMenu}
                            title={"Post"}/>,
                        ...TransitionPresets.SlideFromRightIOS
                    }}
                />
                <Stack.Screen
                    name="post-create"
                    component={PostCreate}
                    options={{
                        headerShown: false,
                        ...TransitionPresets.SlideFromRightIOS
                    }}
                />
            </Stack.Navigator>

        </>
    );
};

export default PostLayout;
