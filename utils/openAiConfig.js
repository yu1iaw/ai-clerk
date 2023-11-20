import { Configuration, OpenAIApi } from 'openai';
import { EXPO_PUBLIC_OPENAI_API_KEY } from '@env';

export const chatConfig = () => {
    const configuration = new Configuration({
        apiKey: EXPO_PUBLIC_OPENAI_API_KEY,
    })
    
    return new OpenAIApi(configuration);
}

export const instructionObj = {
    role: 'system',
    content: 'Speak like Shakespeare. Write using few words.'
}