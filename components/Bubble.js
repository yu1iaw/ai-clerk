import { useCallback, useEffect, useLayoutEffect, useRef, useState, memo } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View, ActivityIndicator, Alert, ToastAndroid, Share, Dimensions } from "react-native";
import { Menu, MenuTrigger, MenuOptions } from 'react-native-popup-menu';
import uuid from "react-native-uuid";
import { SimpleLineIcons, Foundation } from '@expo/vector-icons';
import { deleteDoc, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/clerk-expo";

import { initFireBase } from "../utils/initializeFirebase";
import { MenuItem } from "./PopupMenuItem";
import { translate } from "../utils/translateHelper";
import colors from "../constants/colors";



export const Bubble = ({message, onDelete, setIsContentChange}) => {
    const {role, content, key, createdAt} = message;
    const [isSaved, setIsSaved] = useState(false);
    const [translatedText, setTranslatedText] = useState("");
    const [originalText, setOriginalText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(null);
    const menuRef = useRef(null);
    const id = useRef(uuid.v4());
    const app = initFireBase();
    const firestoreDB = getFirestore(app);
    const { user } = useUser();
    const docRef = doc(firestoreDB, "users", `${user?.firstName}-${user?.id}`, "saved", `${key}`);
    let timeoutId;

    const outerContainer = {...styles.container};
    let innerContainer = {...styles.innerContainer};
    let textStyle = {...styles.text};
    const dateTextStyle = { ...styles.dateText };
    const laptopWidth = Dimensions.get('window').width;


    switch(role) {
        case 'user':
            outerContainer.justifyContent = "flex-start";
            innerContainer = {...innerContainer, justifyContent: "center", maxWidth: "70%", backgroundColor: colors.middleGreen};
            textStyle={...textStyle, color: "white", fontSize: laptopWidth > 425 ? 20 : textStyle.fontSize};
            break;
        case 'assistant':
            outerContainer.justifyContent = "flex-end";
            innerContainer = {...innerContainer, backgroundColor: colors.salmon, flexDirection: "row", alignItems: "center"};
            textStyle = {...textStyle, maxWidth: laptopWidth > 425 ? 550 : 267, marginRight: laptopWidth > 425 ? 20 : 6, fontSize: laptopWidth > 425 ? 20 : textStyle.fontSize}
            break;
        case 'saved':
            innerContainer = {...innerContainer, backgroundColor: colors.salmon, paddingVertical: 15, paddingLeft: 15, width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"};
            textStyle.maxWidth = laptopWidth > 425 ? 700 : Dimensions.get("screen").scale > 3 ? 270 : 290;
            dateTextStyle.minWidth = laptopWidth > 425 ? 690 : Dimensions.get("screen").scale > 3 ? 260 : 280;
            laptopWidth > 425 ? textStyle.fontSize = 20 : null;
            break;
        default: 
            break;
    }

    const isAssSavedType = role === "assistant" || role === "saved";
    const isAssistantType = role === "assistant";
    const toggleMenuItem = isAssistantType && isSaved;
   
    

    const toggleSaved = async () => {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await deleteDoc(docRef);
            setIsSaved(false);
        } else {
            await setDoc(docRef, message);
            setIsSaved(true);
        }
    }

    const removeSavedMessage = async () => {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            await deleteDoc(docRef);
            onDelete();
        }
    }

    const translateContent = useCallback(async () => {
        try {
            setIsLoading(true);
            const result = await translate(content);
            setTranslatedText(result.translated_text.uk);
            setOriginalText(result.original_text);
        } catch(e) {
            console.log(e);
            setIsError(e.message);
            timeoutId = setTimeout(() => setIsError(null), 7000);
        } finally {
            setIsLoading(false);
        }
    }, [content])


    const shareData = async () => {
        try {
            await Share.share({
                message: `Shared from Expo\n\n${content}\n${translatedText}`.trimEnd()
            })
        } catch (e) {
            Alert.alert('Something went wrong...', e.message);
        }
    }


    useLayoutEffect(() => {
        const fetchMarked = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setIsSaved(true);
            };
        }
        fetchMarked();

        return () => clearTimeout(timeoutId);
    }, [])


    let spaghettiContent = content.replace(/\s/gi, ''),
        spaghettiOriginalText = originalText.replace(/\s/gi, '');

   
    return (
        <View style={outerContainer}>
            <TouchableWithoutFeedback 
                style={{width: "100%"}}
                onPress={ isAssSavedType ? () => {
                    setIsContentChange(false);
                    menuRef.current.props.ctx.menuActions.openMenu(id.current);
                } : undefined} >
                <View style={innerContainer}>
                    <View>
                        <Text style={textStyle}>{content}</Text>
                        <Text style={dateTextStyle}>{createdAt}</Text>
                        { isLoading && <ActivityIndicator size="small" color="white" style={styles.loadingIndicator} /> }
                        { ((translatedText && spaghettiContent == spaghettiOriginalText) || isError) && <Text></Text> }
                        { isError && <Text style={{...textStyle, color: colors.lightYellow}}>{isError}</Text> }
                        { translatedText && spaghettiContent == spaghettiOriginalText && <Text style={{...textStyle, color: colors.lightYellow}}>{translatedText}</Text>}

                    </View>
                   { isAssSavedType && <Menu name={id.current} ref={menuRef}>
                        <MenuTrigger />
                        <MenuOptions>
                            <MenuItem 
                                text="Translate" 
                                icon="translate" 
                                onSelect={translateContent} />
                            <MenuItem 
                                text="Copy & Share" 
                                icon="content-copy" 
                                onSelect={shareData} />
                            <MenuItem 
                                text={ toggleMenuItem ? "Unsaved" : isAssistantType ? "Save" : "Delete" }
                                icon={ isAssistantType ? "save" : "delete-outline"} 
                                onSelect={ isAssistantType ? toggleSaved : removeSavedMessage} />
                        </MenuOptions>
                    </Menu> }
                    {
                        isAssSavedType && <SimpleLineIcons name="options-vertical" size={20} color="white" />
                    }
                    {
                        toggleMenuItem && (
                            <View style={styles.bookmarkContainer}>
                                <Foundation name="bookmark" size={19} color="white" />
                            </View>
                        )
                    }
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "center"
    },
    innerContainer: {
        minHeight: 46,
        backgroundColor: "white",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 3,
        marginBottom: 10,
        borderColor: colors.thistle,
        borderWidth: 1
    },
    text: {
        fontFamily: "IBM",
        fontSize: Dimensions.get("screen").fontScale > 1 ? 15 : 16,
        color: colors.darkGreen
    },
    dateText: {
        textAlign: "right", 
        fontFamily: "IBM_light_italic", 
        color: "#595959",
        marginRight: 4
    },
    bookmarkContainer: {
        position: "absolute",
        right: 2,
        top: -3
    },
    loadingIndicator: {
        position: "absolute",
        top: "45%",
        right: "44%"
    }
})
