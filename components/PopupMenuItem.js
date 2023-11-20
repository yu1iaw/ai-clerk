import { StyleSheet, Text, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MenuOption } from 'react-native-popup-menu';

import colors from '../constants/colors';

export const MenuItem = ({IconPack, icon, text, onSelect}) => {
    const Icon = IconPack ?? MaterialIcons;
    return (
        <MenuOption onSelect={onSelect}>
            <View style={styles.menuItemContainer}>
                <Text style={styles.menuText}>{text}</Text>
                <Icon name={icon} size={18} color={colors.seaGreen} />
            </View>
        </MenuOption>
    )
}

const styles = StyleSheet.create({
    menuItemContainer: {
        flexDirection: "row",
        padding: 5,
        alignItems: "center"
    },
    menuText: {
        flex: 1,
        fontFamily: "IBM_light",
        fontSize: 16,
        color: colors.textColor
    },
})