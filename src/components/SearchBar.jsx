import React from 'react';
import {TouchableOpacity, View} from "react-native";
import Input from "./Input";
import {FontAwesomeIcon} from "@fortawesome/react-native-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({
                       onChangeText,
                       clearIcon,
                       clearIconStyle,
                       value,
                       placeholder,
                       rightIcon,
                       onSubmitEditing,
                       containerStyle,
                       labelStyle,
                       inputContainerStyle,
                       iconContainerStyle,
                       errorStyle,
                       inputStyle,
                       placeholderTextColor,
                       onFocus,
                       textInputProps
                   }) => {
    return (
        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            {
                value !== '' &&
                <View style={{marginRight: 5, ...clearIconStyle}}>
                    {clearIcon}
                </View>
            }
            <View style={{flexGrow: 1}}>
                <Input
                    onFocus={onFocus}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    rightIcon={rightIcon}
                    onSubmitEditing={onSubmitEditing}
                    labelStyle={labelStyle}
                    errorStyle={errorStyle}
                    containerStyle={containerStyle}
                    inputContainerStyle={inputContainerStyle}
                    inputStyle={inputStyle}
                    iconContainerStyle={iconContainerStyle}
                    placeholderTextColor={placeholderTextColor}
                    textInputProps={{
                        inputMode: 'search',
                        enterKeyHint: 'search',
                        ...textInputProps
                    }}
                />
            </View>

        </View>
    );
};

export default SearchBar;
