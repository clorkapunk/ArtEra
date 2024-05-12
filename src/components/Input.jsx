import React from 'react';
import {Text, TextInput, View} from "react-native";
import {TextInputProps} from "react-native";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";

const Input = ({
                   onChangeText,
                   value,
                   placeholder,
                   rightIcon,
                   errorMessage = null,
                   label = null,
                   iconPosition = "right",
                   containerStyle,
                   labelStyle,
                   inputContainerStyle,
                   placeholderTextColor,
                   inputStyle,
                   errorStyle,
                   iconContainerStyle,
                   textInputProps,
                   onSubmitEditing
               }) => {
    return (
        <View style={{
            display: 'flex',
            flexDirection: 'col',
            ...containerStyle
        }}>
            {
                label !== null &&
                <Text style={{...labelStyle}}>{label}</Text>
            }
            <View style={{

                display: 'flex',
                flexDirection: iconPosition === 'right' ? "row" : 'row-reverse',
                alignItems: 'center',
                ...inputContainerStyle
            }}>

                <View style={{flex: 1}}>
                    <TextInput
                        style={{...inputStyle,}}
                        onChangeText={onChangeText}
                        value={value}
                        placeholder={placeholder}
                        placeholderTextColor={placeholderTextColor}
                        {...textInputProps}
                        onSubmitEditing={onSubmitEditing}
                    />
                </View>
                <View style={{...iconContainerStyle}}>
                    {rightIcon}
                </View>
            </View>
            {
                errorMessage !== null &&
                <Text style={{color: 'red', ...errorStyle}}>{errorMessage}</Text>
            }

        </View>
    );
};

export default Input;
