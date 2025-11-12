import { RadioStation, VoiceActor } from './types';

export const CONTACTED_STATIONS: RadioStation[] = [
    { name: 'VUT FM', genre: 'Community/Campus', audience: '18-35, students, local community', reach: 25000, priceRange: [900, 2700] },
    { name: 'SEDIBENG FM', genre: 'Community', audience: '25-55, general local audience', reach: 40000, priceRange: [1250, 3250] },
    { name: 'THETHA FM', genre: 'Community', audience: 'General, local news and talk', reach: 35000, priceRange: [1100, 3000] },
    { name: 'LEKOA FM', genre: 'Community', audience: 'General, local focus', reach: 30000, priceRange: [900, 2900] },
];

export const VOICE_ACTORS: VoiceActor[] = [
    { id: 'Kore', name: 'Female Voice (Clear, South African Accent)' },
    { id: 'Puck', name: 'Male Voice (Warm, South African Accent)' },
    { id: 'Zephyr', name: 'Female Voice (Energetic, South African Accent)' },
];
