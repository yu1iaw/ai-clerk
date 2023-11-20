import { EXPO_PUBLIC_RAPID_API_KEY } from '@env';


export async function translate(text) {
    const url = `https://nlp-translation.p.rapidapi.com/v1/translate?text=${text}&to=uk&from=en`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': EXPO_PUBLIC_RAPID_API_KEY,
            'X-RapidAPI-Host': 'nlp-translation.p.rapidapi.com'
        }
    };

    const response = await fetch(url, options);
    const result = await response.json();

    if (result.status !== 200) {
        throw new Error('Translate call failed. Response status: ' + result.status);
    }

    return result;
}
