import colors from "./colors";

const range = new Date().getHours() > 20 || new Date().getHours() < 7;

export default {
    backgroundImageContainer: {
        flex: 1,
        backgroundColor: colors.seaGreen,
        padding: 10
    },
    imageStyle: {
        opacity: range? 0.5 : 1,
        bottom: 60
    }
}