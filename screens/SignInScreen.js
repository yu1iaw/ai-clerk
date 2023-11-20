import { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import * as Progress from 'react-native-progress';
import { useOAuth, useAuth } from "@clerk/clerk-expo";

import { IconButton } from "../components/IconButton";
import { ImageBackgroundContainer } from "../components/ImageBackgroundContainer";
import colors from "../constants/colors";



export const SignInScreen = ({navigation}) => {
    const [loading, setLoading] = useState(false);
    const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
    const { isSignedIn } = useAuth();


    const handlePress = useCallback(async () => {
        try {
            setLoading(true);
            const { createdSessionId, setActive } = await startOAuthFlow();
            if (createdSessionId) {
                setActive({ session: createdSessionId });
                // navigation.navigate("RootScreen", { screen: "ChatScreen" })
            }
        } catch(e) {
            alert(e.errors[0].message);
        } finally {
            setLoading(false);
        }
    }, [])


    return (
        <ImageBackgroundContainer>
            <View style={styles.container}>
                {!loading ? (
                    <TouchableOpacity onPress={handlePress} style={styles.btn} activeOpacity={0.85}>
                        <Text style={styles.text}>Continue with</Text>
                        <IconButton 
                            IconPack={AntDesign}
                            name="google"
                            size={24}
                            color={colors.cheeseColor}
                        />
                    </TouchableOpacity>
                ) : (
                    <Progress.CircleSnail thickness={8} size={110} color={colors.thistle} duration={500} />
                )}
            </View>
        </ImageBackgroundContainer>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    btn: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#006c80',
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 8,
        gap: 4,
        marginTop: 80
    },
    text: {
        color: "white",
        fontFamily: "cherry",
        fontSize: 24,
        marginBottom: 4,
        paddingLeft: 8
    }
})