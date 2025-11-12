import { GoogleGenAI, Type, Modality } from "@google/genai";
import { UserInput, RadioStation, PlacementRec, AdminSummary, VoiceActorId } from './types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateScript = async (userInput: UserInput): Promise<string> => {
    const prompt = `
        You are a professional radio ad copywriter. Your task is to create a 30-second radio advert script.

        **Instructions:**
        - The script must be conversational, between 60 and 80 words.
        - It must start with a strong hook and end with a clear call to action.
        - **Crucially, you must only output the words that will be spoken by the voice actor.**
        - **Do NOT include any stage directions, sound effect cues (e.g., "[SFX: sound]"), speaker labels (e.g., "VOICEOVER:", "NARRATOR:", "ANNOUNCER:"), or any other text in parentheses or brackets.**
        - Do NOT include any introductory text like "Here is the script:". Your entire output should be just the script text.

        **Business Details:**
        - Business Name: ${userInput.businessName}
        - Product or Service: ${userInput.productService}
        - Offer or Special Message: ${userInput.offer}
        - Location or Area Served: ${userInput.location}
        - Contact Info (optional): ${userInput.contactInfo}
        - Target Audience: ${userInput.targetAudience}
        - Preferred Tone: ${userInput.tone}

        Provide only the clean, speakable script text.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    return response.text.trim();
};

export const generateAdminSummary = async (userInput: UserInput, script: string, placement: PlacementRec): Promise<AdminSummary> => {
    const prompt = `
        You are an internal system assistant.
        Generate a short, structured summary for a radio station admin based on the following information.

        - Business Name: ${userInput.businessName}
        - Full Script: "${script}"
        - Chosen Slot: ${placement.slot}
        - Chosen Station: ${placement.stationName}
        - Suggested Price: ${placement.price}

        Create a 1-2 sentence summary of the script.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    businessName: { type: Type.STRING },
                    scriptSummary: { type: Type.STRING },
                    requestedSlot: { type: Type.STRING },
                    suggestedPrice: { type: Type.STRING }
                },
                required: ['businessName', 'scriptSummary', 'requestedSlot', 'suggestedPrice']
            }
        }
    });

    return JSON.parse(response.text);
};

export const generateAudio = async (script: string, voiceName: VoiceActorId): Promise<string> => {
    const prompt = `Read the following radio advert script clearly and professionally, with a South African accent: "${script}"`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-tts',
        contents: [{ parts: [{ text: prompt }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName },
                },
            },
        },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
        throw new Error('No audio data received from API');
    }
    return base64Audio;
};