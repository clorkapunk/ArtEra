import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button} from "@rneui/themed";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { registration } from "../../api/userAPI";
import Input from './../../components/Input'

const SignUp = () => {
  const navigation = useNavigation();
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    passwordRepeat: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    passwordRepeat: "",
  });


  function onFormChange(name, value) {
    setForm({ ...form, [name]: value });
  }

  function onFormSubmit() {
    if (!validateForm()) return;

    registration(
      form.email,
      form.password,
      form.username
    )
      .then( async (data) => {

        setForm({
          email: "",
          password: "",
        });
        navigation.navigate("tabs", { screens: "home" });
      })
        .catch(({response}) => {
          setErrors({
            "email": response.data.email === undefined ? "" : response.data.email,
            "username": response.data.username === undefined ? "" : response.data.username,
            "password": response.data.password === undefined ? "" : response.data.password,
          })
        })
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


    if (form.username === "") {
      errorsTemp["username"] = "Invalid nick name";
    } else {
      errorsTemp["username"] = "";
    }


    if (form.password.length < passwordMinLength) {
      errorsTemp["password"] = "Password must be at least 8 characters";
      isValid = false;
    } else if (!passwordRegex.test(form.password)) {
      errorsTemp["password"] = "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
      isValid = false;
    } else {
      errorsTemp["password"] = "";
    }

    if (form.password !== form.passwordRepeat) {
      errorsTemp["passwordError"] = "Password mismatch!";
    } else {
      errorsTemp["passwordError"] = "";
    }

    setErrors(errorsTemp);

    return isValid;
  }

  return (
    <View className={"bg-darkgray h-full p-4 justify-start"}>
      <ScrollView className="mt-10">
        <TouchableOpacity className='mb-7' onPress={() => navigation.navigate("tabs", {screens: 'home'})}>
          <View>
            <FontAwesomeIcon icon={faArrowLeft} color={"white"} size={20} />
          </View>
        </TouchableOpacity>
        <Text className="text-3xl mb-2  text-white font-semibold">Create an account</Text>
        <Text className="text-lg  text-gray-500 mb-6">Welcome! Please enter your details.</Text>
        <Input
          onChangeText={(value) => onFormChange("email", value)}
          value={form.email}
          leftIcon={<FontAwesomeIcon size={20} icon={faEnvelope}
                                     color={'#ffffff'} />}
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
          placeholderTextColor={'#ffffff'}
          errorStyle={{ color: "crimson" }}
        />


        <Input
          onChangeText={(value) => onFormChange("username", value)}
          value={form.username}
          leftIcon={<FontAwesomeIcon size={20} icon={faUser}
                                     color={'#ffffff'} />}
          placeholder={"Enter your username"}
          label={"Username"}
          errorMessage={errors.username}
          leftIconContainerStyle={{ padding: 10, paddingRight: 10 }}
          containerStyle={{ paddingHorizontal: 0, marginTop: 5 }}
          inputContainerStyle={{
            paddingHorizontal: 5, borderRadius: 7, backgroundColor: "#272728", borderBottomWidth: 0,
          }}
          inputStyle={{ color: "white" }}
          labelStyle={{ color: "white", marginBottom: 5, fontWeight: "100" }}
          placeholderTextColor={"#ffffff"}
          errorStyle={{ color: "crimson" }}
        />

        <Input
          onChangeText={(value) => onFormChange("password", value)}
          value={form.password}
          leftIcon={<FontAwesomeIcon size={20} icon={faLock}
                                     color={'#ffffff'} />}
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
          placeholderTextColor={'#ffffff'}
          errorStyle={{ color: "crimson" }}
          textInputProps={{
            secureTextEntry: true
          }}

        />

        <Input
          onChangeText={(value) => onFormChange("passwordRepeat", value)}
          value={form.passwordRepeat}
          leftIcon={<FontAwesomeIcon size={20} icon={faLock}
                                     color={'#ffffff'} />}
          placeholder={"Repeat your password"}
          label={"Password repeat"}
          errorMessage={errors.passwordRepeat}
          leftIconContainerStyle={{ padding: 10, paddingRight: 10 }}
          containerStyle={{ paddingHorizontal: 0, marginTop: 5 }}
          inputContainerStyle={{
            paddingHorizontal: 5, borderRadius: 7, backgroundColor: "#272728", borderBottomWidth: 0,
          }}
          inputStyle={{ color: "white" }}
          labelStyle={{ color: "white", marginBottom: 5, fontWeight: "100" }}
          placeholderTextColor={"#ffffff"}
          errorStyle={{ color: "crimson" }}
          textInputProps={{
            secureTextEntry: true
          }}
        />

        <Button
          title="Sign Up"
          buttonStyle={{
            backgroundColor: "#ba4954",
            padding: 10,
            borderRadius: 10,
          }}
          titleStyle={{ fontSize: 20 }}
          containerStyle={{
            marginTop: 20,
          }}
          onPress={() => onFormSubmit()}
        />

        <View className="justify-center flex-row items-center mt-2">
          <Text className={"text-gray-500 text-sm"}>
            Already have an account? {" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("sign-in")}>
            <Text className="text-white text-sm">
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
