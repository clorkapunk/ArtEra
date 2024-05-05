import React, {useEffect} from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./src/screens/tabs/Home";
import Search from "./src/screens/tabs/Search";
import Post from "./src/screens/tabs/post/Post";
import Chat from "./src/screens/tabs/Chat";
import Profile from "./src/screens/tabs/Profile";
import TabsLayout from "./src/screens/tabs/TabsLayout";
import SignIn from "./src/screens/auth/SignIn";
import AuthLayout from "./src/screens/auth/AuthLayout";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {PermissionsAndroid, Platform} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

async function hasAndroidPermission() {
    const getCheckPermissionPromise = async () => {
        if (Number(Platform.Version) >= 33) {
            const [hasReadMediaImagesPermission, hasReadMediaVideoPermission] = await Promise.all([
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES),
                PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
            ]);
            return hasReadMediaImagesPermission && hasReadMediaVideoPermission;
        } else {
            return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
    };

    const hasPermission = await getCheckPermissionPromise();
    if (hasPermission) {
        return true;
    }
    const getRequestPermissionPromise = async () => {
        if (Number(Platform.Version) >= 33) {
            const statuses = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
            ]);
            return statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
                PermissionsAndroid.RESULTS.GRANTED &&
                statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
                PermissionsAndroid.RESULTS.GRANTED;
        } else {
            const status = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
            return status === PermissionsAndroid.RESULTS.GRANTED;
        }
    };

    return await getRequestPermissionPromise();
}

function App(): React.JSX.Element {

    useEffect(() => {
        hasAndroidPermission().then();
    }, [])

    return (
        <SafeAreaProvider>
            <GestureHandlerRootView>
                <NavigationContainer>
                    <Stack.Navigator
                        screenOptions={{
                            headerShown: false
                        }}
                        initialRouteName={"tabs"}
                    >
                        <Stack.Screen name="tabs" component={TabsLayout}/>
                        <Stack.Screen name="auth" component={AuthLayout}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

export default App;
