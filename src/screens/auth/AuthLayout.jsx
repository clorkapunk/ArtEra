import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import Header from "../../components/Header";

const Stack = createNativeStackNavigator()

const AuthLayout = () => {
    return (
        <>
            <Stack.Navigator
                initialRouteName={'sign-in'}
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen
                    name='sign-in'
                    component={SignIn}
                    options={{
                        animation: 'slide_from_left'
                    }}
                />
                <Stack.Screen
                    name='sign-up'
                    component={SignUp}
                    options={{
                        animation: 'slide_from_left'
                    }}
                />
            </Stack.Navigator>
        </>
    );
};

export default AuthLayout;
