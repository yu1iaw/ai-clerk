import 'react-native-url-polyfill/auto';
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View, Alert, Text, Dimensions } from "react-native";
import { collection, doc, getDocs, getFirestore, setDoc } from 'firebase/firestore';
import { Entypo } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { useUser } from '@clerk/clerk-expo';

import { chatConfig, instructionObj } from "../utils/openAiConfig";
import { initFireBase } from "../utils/initializeFirebase";
import { IconButton } from './IconButton';
import colors from "../constants/colors";



export const Input = ({setIsContentChange}) => {
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [infoContentWhileLoading, setInfoContentWhileLoading] = useState('Dorathy is writing');
    const [sound, setSound] = useState();
  

    const app = initFireBase();
    const firestoreDB = getFirestore(app);
    const { user } = useUser();

    const openai = chatConfig();
    let timeoutId;
    let timeInterval;
  

    const sendMessage = async () => {
        setIsContentChange(true);
        setInputValue('');

        await setDoc(doc(firestoreDB, "users", `${user?.firstName}-${user?.id}`, "messages", `${Date.now()}`), {role: 'user', content: inputValue});

        try {
            const data = collection(firestoreDB, 'users', `${user?.firstName}-${user?.id}`, 'messages');
        
            const querySnapshot = await getDocs(data);
            const conversationArr = querySnapshot.docs.map(doc => doc.data());
     
            timeoutId = setTimeout(async () => {
                try {
                    setIsLoading(true);
                    // const err = new Error('Bad Request 400');
                    // err.status = 400;
                    // throw err;
                    conversationArr.unshift(instructionObj);
                    const response = await openai.createChatCompletion({
                        model: 'gpt-3.5-turbo',
                        messages: conversationArr,
                        presence_penalty: 0.1,
                        frequency_penalty: 0.5,
                        temperature: 0.3
                    })
             
                    setIsLoading(false);
                    await setDoc(doc(firestoreDB, "users", `${user?.firstName}-${user?.id}`, "messages", `${Date.now()}`), response.data.choices[0].message);
                    await playSound();
                } catch(e) {
                    setIsLoading(false);
                    Alert.alert("OpenAI", `Oops! ${e.message}`);
                }
            }, 2000);
            
        } catch(e) {
            console.log(e);
        }
    }

    const playSound = async () => {
        const {sound} = await Audio.Sound.createAsync(require('../assets/audio/achievement-bell.wav'));
        setSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return sound ? () => {
            sound.unloadAsync();
        } : undefined
    }, [sound])

    useEffect(() => {
        return () => {
            clearTimeout(timeoutId);
        }
    }, [])


    useEffect(() => {
        if (isLoading) {
            timeInterval = setInterval(() => {
                setInfoContentWhileLoading(state => {
                    state += ".";
                    if (state === "Dorathy is writing....") state = state.slice(0, -4);
                    return state;
                });
             
            }, 400)
        } else {
            setInfoContentWhileLoading('Dorathy is writing');
        }

        return () => clearInterval(timeInterval)
    }, [isLoading])



    return (
        <>
        { isLoading && <View>
                <Text style={styles.infoText}>{infoContentWhileLoading}</Text>
            </View> }
            <View style={styles.container}>
                <TextInput
                    value={inputValue}
                    onChangeText={(txt) => setInputValue(txt)}
                    style={styles.input}
                    onSubmitEditing={inputValue ? sendMessage : undefined}/>
                <IconButton 
                    disabled={!inputValue}
                    IconPack={Entypo} 
                    name="paper-plane" 
                    size={28} 
                    color="white" 
                    style={styles.button} 
                    onPress={sendMessage} />
            </View>
        </>
    )
}

const laptopWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        paddingTop: 10
    },
    input: {
        flex: 1,
        minHeight: laptopWidth > 425 ? 60 : 46,
        paddingLeft: 8,
        paddingRight: laptopWidth > 425 ? 60 : 50,
        backgroundColor: colors.thistle,
        borderColor: "white",
        borderWidth: 2,
        borderRadius: 8,
        color: colors.textColor,
        fontFamily: "IBM",
        fontSize: laptopWidth > 425 ? 20: 16
    },
    button: {
        position: "absolute",
        right: laptopWidth > 425 ? 14 : 7,
        top: laptopWidth > 425 ? "33%" : "28%"
    },
    infoText: {
        fontFamily: "IBM_light_italic",
        color: "white",
        marginLeft: 4,
        fontSize: laptopWidth > 425 ? 18 : 14
    }
})