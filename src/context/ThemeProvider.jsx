import React, {createContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from "../consts/colors";

const ThemeContext = createContext(null);

export const ThemeProvider = ({children}) => {
    const colorScheme = useColorScheme();
    const [theme, setTheme] = useState(colorScheme || 'light');

    useEffect(() => {
        // Load saved theme from storage
        const getTheme = async () => {
            try {
                const savedTheme = await AsyncStorage.getItem('theme');
                if (savedTheme) {
                    setTheme(savedTheme);
                }
            } catch (error) {
                console.log('Error loading theme:', error);
            }
        };
        getTheme();
    }, []);

    useEffect(() => {
        // set theme to system selected theme
        if (colorScheme) {
            setTheme(colorScheme);
        }
    }, [colorScheme]);

    const toggleTheme = newTheme => {
        setTheme(newTheme);
        // Save selected theme to storage
        AsyncStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{theme, colors: colors[theme], toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};
export default ThemeContext;
