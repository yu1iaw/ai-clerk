import { View, Pressable, StyleSheet } from "react-native";

export const IconButton = ({IconPack, name, color, size, onPress, right, left, style, disabled, diffOpacity}) => {

    let Container = onPress ? Pressable : View;

    let diffOpacityStyle = { ...styles.pressed };
    if (diffOpacity) diffOpacityStyle.opacity = 0.95;
    
    let iconStyle = styles.container;
    if (right) {
        iconStyle = {...iconStyle, marginRight: 5}
    }
    if (left) {
        iconStyle = {...iconStyle, marginLeft: 5}
    }

    
    return (
        <Container disabled={disabled} style={({pressed}) => [iconStyle, pressed && diffOpacityStyle, style]} onPress={onPress}>
            <IconPack name={name} color={color} size={size} />
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center"
    },
    pressed: {
        opacity: 0.5
    }
})