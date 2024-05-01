import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/screens/tabs/Home";
import Search from "./src/screens/tabs/Search";
import Post from "./src/screens/tabs/Post";
import Chat from "./src/screens/tabs/Chat";
import Profile from "./src/screens/tabs/Profile";
import TabsLayout from "./src/screens/tabs/TabsLayout";
import SignIn from "./src/screens/auth/SignIn";
import AuthLayout from "./src/screens/auth/AuthLayout";
import { GestureHandlerRootView } from "react-native-gesture-handler";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


function App(): React.JSX.Element {
  return (
    <>
      <GestureHandlerRootView>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
            initialRouteName={"tabs"}
          >
            <Stack.Screen name="tabs" component={TabsLayout} />
            <Stack.Screen name="auth" component={AuthLayout} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </>
  );
}

export default App;
