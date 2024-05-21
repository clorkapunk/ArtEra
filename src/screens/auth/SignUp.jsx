import React, {useContext, useState} from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Button} from "@rneui/themed";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faEnvelope, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";
import { registration } from "../../api/userAPI";
import Input from './../../components/Input'
import ThemeContext from "../../context/ThemeProvider";
import {s} from "react-native-wind";

const SignUp = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const {colors} = useContext(ThemeContext)
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

    setLoading(true)
    registration(
      form.email,
      form.password,
      form.username
    )
      .then( async (data) => {
        setLoading(false)
        setForm({
          email: "",
          password: "",
        });
        navigation.navigate("tabs", { screens: "home" });
      })
        .catch(({response}) => {
          setLoading(false)
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
      username: "",
      password: "",
      passwordRepeat: "",
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
    <View className={"h-full p-4 justify-start"}>
      <ScrollView>
        <View className='mb-10'>
          <TouchableOpacity onPress={() => navigation.navigate("tabs", {screens: 'home'})}>
            <View>
              <FontAwesomeIcon icon={faArrowLeft} color={"white"} size={20} />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={{color: colors.main}} className="text-3xl mb-2 font-averia_r">Create an account</Text>
        <Text style={{color: colors.main, opacity: 0.8}} className="text-lg font-averia_r mb-6">Welcome! Please enter your details.</Text>

        <View style={{marginTop: 40}}>
          <View style={{marginBottom: 30}}>
            <Input
                onChangeText={(value) => onFormChange("email", value)}
                value={form.email}
                errorMessage={errors.email}
                placeholder={"Enter your email"}
                inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                placeholderTextColor={colors.placeholder}
                inputStyle={{
                  fontFamily: 'AveriaSerifLibre_Regular',
                  color: colors.main,
                  ...s`text-2xl py-0`
                }}
                errorStyle={{
                  color: colors.errorRed
                }}
                iconContainerStyle={{}}
                textInputProps={{
                  inputMode: 'email'
                }}
            />
          </View>
          <View style={{marginBottom: 30}}>
            <Input
                onChangeText={(value) => onFormChange("username", value)}
                value={form.username}
                errorMessage={errors.username}
                placeholder={"Enter your username"}
                inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                placeholderTextColor={colors.placeholder}
                inputStyle={{
                  fontFamily: 'AveriaSerifLibre_Regular',
                  color: colors.main,
                  ...s`text-2xl py-0`
                }}
                errorStyle={{
                  color: colors.errorRed
                }}
                iconContainerStyle={{}}

            />
          </View>
          <View style={{marginBottom: 30}}>
            <Input
                onChangeText={(value) => onFormChange("password", value)}
                value={form.password}
                errorMessage={errors.password}
                placeholder={"Enter your password"}
                inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                placeholderTextColor={colors.placeholder}
                inputStyle={{
                  fontFamily: 'AveriaSerifLibre_Regular',
                  color: colors.main,
                  ...s`text-2xl py-0`
                }}
                errorStyle={{
                  color: colors.errorRed
                }}
                iconContainerStyle={{}}
                textInputProps={{
                  secureTextEntry: true
                }}
            />
          </View>
          <View style={{marginBottom: 30}}>
            <Input
                onChangeText={(value) => onFormChange("passwordRepeat", value)}
                value={form.passwordRepeat}
                errorMessage={errors.passwordRepeat}
                placeholder={"Repeat your password"}
                inputContainerStyle={{...s`border-b`, borderColor: colors.main}}
                placeholderTextColor={colors.placeholder}
                inputStyle={{
                  fontFamily: 'AveriaSerifLibre_Regular',
                  color: colors.main,
                  ...s`text-2xl py-0`
                }}
                errorStyle={{
                  color: colors.errorRed
                }}
                iconContainerStyle={{}}
                textInputProps={{
                  secureTextEntry: true
                }}
            />
          </View>
        </View>

        <View style={{marginTop: 50}} className='px-3 items-center'>
          <Button
              onPress={() => onFormSubmit()}
              loading={loading}
              title="Sign up"
              buttonStyle={{
                backgroundColor: colors.buttons.signup,
                padding: 10,
                width: 250,
                borderRadius: 5,
              }}
              titleStyle={{
                fontFamily: 'AveriaSerifLibre_Regular',
                fontSize: 20,
                color: colors.main
              }}
              containerStyle={{}}
          />
        </View>

        <View className="justify-center flex-row items-center mt-3">
          <Text style={{color: colors.main}} className={"text-base font-averia_r"}>
            Already have an account? {" "}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("sign-in")}>
            <Text style={{color: colors.main}} className="text-base font-averia_b">
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default SignUp;
