import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";

import colors from "../constants/colors";


export const DrawerLabel = () => {
	const { signOut } = useAuth();

	return (
		<View style={styles.container}>
            <TouchableOpacity onPress={() => signOut()} style={styles.btn} activeOpacity={0.75}>
                <Ionicons style={styles.icon} name="exit-outline" color="white" size={29} />
                <Text style={styles.text}>Log out</Text>
            </TouchableOpacity>
		</View>
	);
};


const styles = StyleSheet.create({
    container: {
        justifyContent: "center", 
        alignItems: "center", 
        width: 245, 
        height: 60,
        backgroundColor: "transparent"
    },
    btn: {
        width: "100%", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        backgroundColor: colors.cheeseColor,
        gap: 10, 
        padding: 10, 
        borderWidth: 2, 
        borderColor: "white", 
        borderRadius: 4
    },
    text: {
        color: "white", 
        fontFamily: "cherry", 
        fontSize: 21 
    },
    icon: {
        width: 30, 
        textAlign: "right", 
        paddingTop: 3 
    }
})
