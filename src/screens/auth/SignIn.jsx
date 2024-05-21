import React, {useContext, useState} from "react";
import {Text, TextInput, ToastAndroid, TouchableOpacity, View} from "react-native";
import {Button} from "@rneui/themed";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faArrowLeft, faEnvelope, faLock} from "@fortawesome/free-solid-svg-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {login} from "../../api/userAPI";
import {useNavigation} from "@react-navigation/native";
import Input from './../../components/Input'
import ThemeContext from "../../context/ThemeProvider";
import {s} from "react-native-wind";


const SignIn = () => {
    const navigation = useNavigation();
    const {colors} = useContext(ThemeContext)
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
        setForm({...form, [name]: value});
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
                navigation.navigate("tabs", {screens: "home"});
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
            errorsTemp["password"] = "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
            isValid = false;
        } else {
            errorsTemp["password"] = "";
        }

        setErrors(errorsTemp);

        return isValid;
    }

    return (
        <View className={"h-full p-4 justify-start"}>
            <View>
                <View className="">
                    <View className='mb-10'>
                        <TouchableOpacity onPress={() => navigation.navigate("tabs", {screens: "home"})}>
                            <View>
                                <FontAwesomeIcon defaultProps={{}} icon={faArrowLeft} color={colors.main} size={20}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{color: colors.main}} className="text-3xl mb-2 mt-2 font-averia_r">Log in to your
                        account</Text>
                    <Text style={{color: colors.main, opacity: 0.8}} className="text-lg mb-6 font-averia_r">Welcome
                        back!
                        Please enter your details.</Text>
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
                        <View>
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
                    </View>
                </View>
                <View style={{marginTop: 50}} className='px-3 items-center'>
                    <Button
                        onPress={() => onFormSubmit()}
                        loading={loading}
                        title="Log in"
                        buttonStyle={{
                            backgroundColor: colors.buttons.signin,
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
                        Don't have an account? {" "}
                    </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("sign-up")}>
                        <Text style={{color: colors.main}} className="text-base font-averia_b">
                            Sign In
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default SignIn;
