import React, { useState } from "react";
import {Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import { Input, Button } from "@rneui/themed";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { COLORS } from "../../consts/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "../../api/userAPI";
import { useNavigation, useRoute } from "@react-navigation/native";


const SignIn = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });


  function onFormChange(name, value) {
    setForm({ ...form, [name]: value });
  }

  function onFormSubmit() {
    if (!validateForm()) return;
    setLoading(true);

    login(
      form.email,
      form.password,
    )
      .then(async (data) => {
        await AsyncStorage.setItem("user", JSON.stringify(data));
        setForm({
          email: "",
          password: "",
        });
        setLoading(false);
        navigation.navigate("tabs", { screens: "home" });
      })
      .catch(({response}) => {
        setErrors({
          'email': response.data.non_field_errors === undefined ? '' : response.data.non_field_errors
        })
        setLoading(false);
      });

  }


  function validateForm() {
    let isValid = true;
    let errorsTemp = {
      email: "",
      password: "",
    };

    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordMinLength = 8;
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/;

    if (!emailRegex.test(String(form.email).toLowerCase())) {
      errorsTemp["email"] = "Invalid email address";
      isValid = false;
    } else {
      errorsTemp["email"] = "";

    }

    if (form.password.length < passwordMinLength) {
      errorsTemp["password"] = "Password must be at least 8 characters";
      isValid = false;
    } else if (!passwordRegex.test(form.password)) {
      console.log("here");
      errorsTemp["password"] = "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
      isValid = false;
    } else {
      errorsTemp["password"] = "";
    }

    setErrors(errorsTemp);

    return isValid;
  }


  return (
    <View className={"bg-darkgray h-full p-4 justify-start"}>
      <View className="mt-10">
        <TouchableOpacity className="mb-7" onPress={() => navigation.navigate("tabs", { screens: "home" })}>
          <View>
            <FontAwesomeIcon defaultProps={{}} icon={faArrowLeft} color={"white"} size={20} />
          </View>
        </TouchableOpacity>
        <Text className="text-3xl mb-2  text-white font-semibold">Log in to your account</Text>
        <Text className="text-lg  text-gray-500 mb-6">Welcome back! Please enter your details.</Text>
        <Input
          onChangeText={(value) => onFormChange("email", value)}
          value={form.email}
          inputMode={'email'}
          leftIcon={<FontAwesomeIcon size={20} icon={faEnvelope} color={COLORS.lightGrey} />}
          placeholder={"Enter your email"}
          label={"Email"}
          errorMessage={errors.email}
          leftIconContainerStyle={{ padding: 10, paddingRight: 10 }}
          containerStyle={{ paddingHorizontal: 0 }}
          inputContainerStyle={{
            paddingHorizontal: 5, borderRadius: 7, backgroundColor: "#272728", borderBottomWidth: 0,
          }}
          inputStyle={{ color: "white" }}
          labelStyle={{ color: "white", marginBottom: 5, fontWeight: "100" }}
          placeholderTextColor={COLORS.lightGrey}
          errorStyle={{ color: "crimson" }}
        />

        <Input
          onChangeText={(value) => onFormChange("password", value)}
          value={form.password}
          leftIcon={<FontAwesomeIcon size={20} icon={faLock} color={COLORS.lightGrey} />}
          placeholder={"Enter your password"}
          label={"Password"}

          errorMessage={errors.password}
          leftIconContainerStyle={{ padding: 10, paddingRight: 10 }}
          containerStyle={{ paddingHorizontal: 0, marginTop: 5 }}
          inputContainerStyle={{
            paddingHorizontal: 5, borderRadius: 7, backgroundColor: "#272728", borderBottomWidth: 0,
          }}
          inputStyle={{ color: "white" }}
          labelStyle={{ color: "white", marginBottom: 5, fontWeight: "100" }}
          placeholderTextColor={COLORS.lightGrey}
          errorStyle={{ color: "crimson" }}
          secureTextEntry={true}
        />

        <Button
          onPress={() => onFormSubmit()}
          loading={loading}
          title="Log In"
          buttonStyle={{
            backgroundColor: "#ba4954",
            padding: 10,
            borderRadius: 10,
          }}
          titleStyle={{ fontSize: 20 }}
          containerStyle={{
            marginTop: 20,
          }}
        />

        <View className="justify-center flex-row items-center mt-2">
          <Text className={"text-gray-500 text-sm"}>
            Don't have an account? {" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("sign-up")}>
            <Text className="text-white text-sm">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
