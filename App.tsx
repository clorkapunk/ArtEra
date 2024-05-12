import React, {useEffect} from "react";
import {NavigationContainer} from "@react-navigation/native";
import TabsLayout from "./src/screens/tabs/TabsLayout";
import AuthLayout from "./src/screens/auth/AuthLayout";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {PermissionsAndroid, Platform} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import PostScreen from "./src/screens/post/PostScreen";
import {createStackNavigator, TransitionPreset, TransitionPresets} from "@react-navigation/stack";
import ProfileEdit from "./src/screens/profile-edit/ProfileEdit";


const Stack = createStackNavigator();

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
                            headerShown: false,
                        }}
                        initialRouteName={"tabs"}
                    >
                        <Stack.Screen
                            name="tabs"
                            component={TabsLayout}
                            options={{
                                ...TransitionPresets.SlideFromRightIOS
                            }}
                        />
                        <Stack.Screen
                            name="auth"
                            component={AuthLayout}
                            options={{
                                ...TransitionPresets.SlideFromRightIOS
                            }}
                        />
                        <Stack.Screen
                            name="post-screen"
                            component={PostScreen}
                            options={{
                                ...TransitionPresets.SlideFromRightIOS
                            }}
                        />
                        <Stack.Screen
                            name="profile-edit"
                            component={ProfileEdit}
                            options={{
                                ...TransitionPresets.SlideFromRightIOS
                            }}
                        />
                    </Stack.Navigator>

                </NavigationContainer>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}

export default App;
