import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, Alert, Keyboard, StyleSheet, View } from "react-native";
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { addDoc, collection, deleteDoc, doc, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import * as Progress from 'react-native-progress';
import { useUser } from "@clerk/clerk-expo";

import { ImageBackgroundContainer } from "../components/ImageBackgroundContainer";
import { Bubble } from "../components/Bubble";
import { Input } from "../components/Input";
import { IconButton } from "../components/IconButton";
import { initFireBase } from "../utils/initializeFirebase";
import colors from "../constants/colors";



export const ChatScreen = ({navigation, route}) => {
    const [isContentChange, setIsContentChange] = useState(false);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const flatList = useRef(null);
    const app = initFireBase();
    const firestoreDB = getFirestore(app);
    const { user } = useUser();
    const data = collection(firestoreDB, 'users', `${user?.firstName}-${user?.id}`, 'messages');


    useLayoutEffect(() => {
        navigation.setOptions({
            headerLeft: messages.length ? ({tintColor}) => (
                <IconButton 
                    IconPack={MaterialCommunityIcons}
                    name="database-alert" 
                    size={28} 
                    color={tintColor} 
                    left
                    onPress={() => {
                        Alert.alert('Are you sure to clean up database?', '', [
                            {text: "Cancel", style: "cancel"},
                            {text: "Yes!", style: "default", onPress: async () => {
                                setLoading(true);
                                const querySnapshot = await getDocs(data);
                                querySnapshot.docs.forEach(async (_doc, i) => {
                                    await deleteDoc(doc(firestoreDB, "users", `${user?.firstName}-${user?.id}`, "messages", `${messages[i].key}`));
                                    if (i === querySnapshot.docs.length - 1) setLoading(false);
                                });
                                
                            }}
                        ])
                    }} />
            ) : null
        })
    }, [messages])


    useEffect(() => {
        onSnapshot(data, snapshot => {
            const content = snapshot.docs.map(doc => {
                return {  ...doc.data(), key: doc.id }
            })
            setMessages(content)
        })
    }, [])


    useEffect(() => {
        let timerId = setTimeout(() => {
            try {
                flatList.current?.scrollToIndex({ index: 0, animated: false })
            } catch(e) {
                console.log(e.message)
            }
        }, 1800);

        return () => {
            clearTimeout(timerId);
        }
    }, [])


    const onLayout = () => {
        if (Keyboard.isVisible()) {
            setIsContentChange(true);
        }
        messages.length && flatList.current?.scrollToEnd({animated: false})
    }

    const handleContentChange = () => {
        if (messages.length && isContentChange) {
            flatList.current?.scrollToEnd({animated: false})
        } 
    }

    const handleIconButtonPress = () => {
        setIsContentChange(true);
        messages.length && flatList.current.scrollToEnd({ animated: false })
    }
    


    return (
        <ImageBackgroundContainer>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <Progress.Circle size={110} color={colors.thistle} indeterminate borderWidth={8} />
                </View>
            ) : (
                <>
                    <FlatList 
                        ref={ref => flatList.current = ref}
                        onContentSizeChange={handleContentChange}
                        onLayout={onLayout}
                        data={messages}
                        renderItem={itemData => <Bubble message={itemData.item} setIsContentChange={setIsContentChange} />}  
                        showsVerticalScrollIndicator={false}
                    />
                    <Input setIsContentChange={setIsContentChange} />
                
                    {messages.length > 0 && <IconButton 
                        onPress={handleIconButtonPress}
                        IconPack={AntDesign} 
                        name="caretdown" 
                        size={23}
                        color="white"
                        style={styles.icon} 
                        diffOpacity
                    /> }
                </>
            )}
        </ImageBackgroundContainer>
       
    )
}

const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        bottom: 90,
        right: 12,
        backgroundColor: colors.thistle, 
        borderWidth: 2, 
        borderColor: "white", 
        borderRadius: 40
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
})
