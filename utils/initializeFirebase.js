import { initializeApp } from "firebase/app";
import { EXPO_PUBLIC_FIREBASE_API_KEY } from '@env';

export const initFireBase = () => {
    const appSettings = {
        apiKey: EXPO_PUBLIC_FIREBASE_API_KEY,
        databaseURL: 'https://scrimbapro-chatgpt-default-rtdb.firebaseio.com/',
        projectId: "scrimbapro-chatgpt",
    }

    return initializeApp(appSettings);
}