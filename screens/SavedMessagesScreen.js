import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { useDrawerStatus } from '@react-navigation/drawer';
import { collection, getFirestore, onSnapshot } from "firebase/firestore";
import { useAuth, useUser } from "@clerk/clerk-expo";

import { initFireBase } from "../utils/initializeFirebase";
import { Bubble } from "../components/Bubble";
import { ImageBackgroundContainer } from "../components/ImageBackgroundContainer";
import { IconButton } from "../components/IconButton";
import colors from "../constants/colors";



export const SavedMessagesScreen = ({navigation}) => {
    const [savedMessages, setSavedMessages] = useState([]);
    const [isContentChange, setIsContentChange] = useState(false);
    const [wasDeleted, setWasDeleted] = useState(false);
    const flatListRef = useRef(null);
    const app = initFireBase();
    const firestoreDB = getFirestore(app);
    const { user } = useUser();
    const isDrawerOpen = useDrawerStatus() === 'open';
    
   
    const onDelete = () => {
        setWasDeleted(true);
    }
    
    
    useLayoutEffect(() => {
        let timerId;

        navigation.setOptions({
            headerRight: ({tintColor}) => (
                <IconButton 
                    IconPack={MaterialCommunityIcons}
                    name={ wasDeleted ||  isDrawerOpen ? "emoticon-frown-outline" : "emoticon-excited-outline" }
                    size={29} 
                    color={tintColor} 
                    right
                    onPress={() => {
                        navigation.openDrawer();
                    }} />
            )
        })
        if (!isDrawerOpen && wasDeleted) {
            timerId = setTimeout(() => setWasDeleted(false), 2000)
        }

        return () => {
            clearTimeout(timerId)
        }
    }, [wasDeleted, savedMessages, isDrawerOpen])
    

    useEffect(() => {
        const data = collection(firestoreDB, 'users', `${user?.firstName}-${user?.id}`, 'saved');

        onSnapshot(data, snapshot => {
            const content = snapshot.docs.map(doc => ({...doc.data(), role: "saved"}))
        
            setSavedMessages(content)
        })
    }, [])


    const handleContentChange = () => {
        if (savedMessages && isContentChange) {
            flatListRef.current?.scrollToEnd();
        }
    }

    const handleIconButtonPress = () => {
        setIsContentChange(true);
        savedMessages.length && flatListRef.current?.scrollToEnd({ animated: false })
    }


    return (
        <ImageBackgroundContainer>
            <FlatList 
                ref={ref => flatListRef.current = ref}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={handleContentChange}
                data={savedMessages} 
                renderItem={itemData => <Bubble message={itemData.item} onDelete={onDelete} setIsContentChange={setIsContentChange} />}
            />
           
           {savedMessages.length > 0 && <IconButton 
                onPress={handleIconButtonPress}
                IconPack={AntDesign} 
                name="caretdown" 
                size={23}
                color="white"
                style={styles.icon} 
                diffOpacity
            />}
        </ImageBackgroundContainer>
    )
}



const styles = StyleSheet.create({
    icon: {
        position: "absolute",
        bottom: 30,
        right: 12,
        backgroundColor: colors.thistle, 
        borderWidth: 2, 
        borderColor: "white", 
        borderRadius: 40
    }
})
