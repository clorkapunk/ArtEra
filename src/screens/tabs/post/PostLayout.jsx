import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SignIn from "../../auth/SignIn";
import Post from "./Post";
import Header from "../../../components/Header";
import PostCreate from "./PostCreate";
import {useNavigation} from "@react-navigation/native";

const Stack = createNativeStackNavigator()

const PostLayout = () => {
    const navigation = useNavigation();

    return (
        <>
            <Stack.Navigator
                screenOptions={{
                    headerShown: true,
                }}
            >
                <Stack.Screen
                    name="post"
                    component={Post}
                    options={{
                        header: () => <Header title={"Post"}/>,
                    }}
                />
                <Stack.Screen
                    name="post-create"
                    component={PostCreate}
                    options={{
                        headerShown: false
                    }}
                />
            </Stack.Navigator>

        </>
    );
};

export default PostLayout;
