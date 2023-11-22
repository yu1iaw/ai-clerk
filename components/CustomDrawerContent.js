import { StyleSheet } from "react-native";
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";

import { DrawerLabel } from "./DrawerLabel";
import colors from "../constants/colors";



export const CustomDrawerContent = () => {
    return (
        <DrawerContentScrollView contentContainerStyle={styles.scrollContainer}  >
            <DrawerItem label={() => <DrawerLabel /> } />
        </DrawerContentScrollView>
    )
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: colors.thistle
    }
})