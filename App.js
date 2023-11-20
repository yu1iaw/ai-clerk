import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, View } from 'react-native';
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { MenuProvider } from 'react-native-popup-menu';
import { ClerkProvider, useAuth, SignedIn, SignedOut } from "@clerk/clerk-expo";
import * as SecureStore from "expo-secure-store";

import { ChatScreen } from './screens/ChatScreen';
import { SavedMessagesScreen } from './screens/SavedMessagesScreen';
import { useCallback, useEffect, useState } from 'react';
import { IconButton } from './components/IconButton';
import colors from './constants/colors';
import { SignInScreen } from './screens/SignInScreen';
import { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } from "@env";
import { ImageBackgroundContainer } from './components/ImageBackgroundContainer';


const tokenCache = {
  async getToken(key) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return await SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();


const RegisterStack = () => (
  <SignedOut key={0}>
    <Stack.Navigator 
      screenOptions={{
        headerStyle: {backgroundColor: colors.thistle},
        headerTintColor: "white",
        headerTitleAlign: "center", 
        headerTitleStyle: {
          fontFamily: "cherry",
          fontSize: 35
        },
        presentation: "modal"}}
    >
      <Stack.Screen 
          name="SignInScreen" 
          component={SignInScreen} 
          options={{
            headerTitle: "Sign In"
          }}
        />
    </Stack.Navigator>
  </SignedOut>
)

const PublicStack = () => (
  <SignedIn key={1}>
    <Stack.Navigator
      screenOptions={{
        headerStyle: {backgroundColor: colors.thistle},
        headerTintColor: "white",
        headerTitleAlign: "center", 
        headerTitleStyle: {
          fontFamily: "cherry",
          fontSize: 35
        },
        presentation: "modal"}}
    >
      <Stack.Screen 
            name="ChatScreen" 
            component={ChatScreen} 
            options={({navigation}) => ({ 
              headerTitle: "Ask Dorathy",
              headerRight: ({tintColor}) => (
                <IconButton 
                  IconPack={MaterialIcons}
                  name="collections-bookmark" 
                  size={26} 
                  color={tintColor} 
                  right
                  onPress={() => navigation.replace("SavedScreen")} />
              )
            })}
          />
      <Stack.Screen 
        name="SavedScreen" 
        component={SavedMessagesScreen} 
        options={({navigation}) => ({
          headerTitle: "Saved",
          headerLeft: ({tintColor}) => (
            <IconButton
              IconPack={AntDesign} 
              name="caretleft" 
              size={27} 
              color={tintColor} 
              left
              onPress={() => navigation.replace("ChatScreen")} />
            )
          })} 
      />
    </Stack.Navigator>
  </SignedIn>
)

const RootStack = () => {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <ImageBackgroundContainer>
        <View style={styles.rootStackContainer}>
          <Progress.CircleSnail thickness={8} size={110} color={colors.thistle} duration={500} />
        </View>
      </ImageBackgroundContainer>
    )
  }

  return [RegisterStack(), PublicStack()]
}


export default function App() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);


	useEffect(() => {
		const prepare = async () => {
			try {
				await Font.loadAsync({
					IBM: require("./assets/fonts/IBMPlexSans-Regular.ttf"),
          IBM_semi: require("./assets/fonts/IBMPlexSans-SemiBold.ttf"),
          IBM_bold: require("./assets/fonts/IBMPlexSans-Bold.ttf"),
          IBM_light: require("./assets/fonts/IBMPlexSans-Light.ttf"),
          IBM_light_italic: require("./assets/fonts/IBMPlexSans-LightItalic.ttf"),
          IBM_extra_light: require("./assets/fonts/IBMPlexSans-ExtraLight.ttf"),
          IBM_thin: require("./assets/fonts/IBMPlexSans-Thin.ttf"),
          cherry: require("./assets/fonts/CherryBombOne-Regular.ttf")
				});
			} catch (e) {
				console.log(e.message);
			} finally {
				setIsAppLoaded(true);
			}
		};
		prepare();
	}, []);

	const onLayout = useCallback(async() => {
		if (isAppLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [isAppLoaded]);

	if (!isAppLoaded) return null;
  
  return (
    <>
      <StatusBar style="dark" />
      <ClerkProvider publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <MenuProvider>
          <NavigationContainer>
            <View style={styles.container} onLayout={onLayout}>
              <Stack.Navigator 
                screenOptions={{
                  headerStyle: {backgroundColor: colors.thistle},
                  headerTintColor: "white",
                  headerTitleAlign: "center", 
                  headerTitleStyle: {
                    fontFamily: "cherry",
                    fontSize: 35
                  },
                  presentation: "modal"}} 
              >
                <Stack.Screen name="RootScreen" component={RootStack} options={{headerShown: false}}/>
              </Stack.Navigator>
            </View>
          </NavigationContainer>
        </MenuProvider>
      </ClerkProvider>
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rootStackContainer: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center"
  }
});
