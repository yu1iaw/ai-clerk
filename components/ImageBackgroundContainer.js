import { ImageBackground } from "react-native";
import layout from "../constants/layout";

export const ImageBackgroundContainer = ({children}) => {
    return (
        <ImageBackground 
            source={require("../assets/cheese-eating-rat.png")} 
            resizeMode="contain" 
            style={layout.backgroundImageContainer}
            imageStyle={layout.imageStyle} >
                {children}
        </ImageBackground>
    )
}