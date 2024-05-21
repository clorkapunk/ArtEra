/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {ThemeProvider} from './src/context/ThemeProvider'
import {name as appName} from './app.json';

function index () {
    return (
        <ThemeProvider>
            <App/>
        </ThemeProvider>

    )
}


AppRegistry.registerComponent(appName, () => index);
