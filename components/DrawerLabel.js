import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";


export const DrawerLabel = () => {
	const { signOut } = useAuth();

	return (
		<TouchableOpacity onPress={() => signOut()} style={styles.container}>
			<Ionicons style={styles.icon} name="exit-outline" color="white" size={29} />
			<Text style={styles.text}>Log out</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center", 
        gap: 10, 
        width: 245, 
        paddingRight: 10
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
