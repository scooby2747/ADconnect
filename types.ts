export enum Step {
    GenerateScript = 1,
    GenerateAudio = 2,
    RecommendPlacement = 3,
    AdminSummary = 4,
}

export type ViewMode = 'advertiser' | 'admin';

export type Tone = 'Energetic' | 'Friendly' | 'Calm' | 'Professional';

export interface UserInput {
    businessName: string;
    productService: string;
    offer: string;
    location: string;
    contactInfo: string; // Contact info for the ad script itself (e.g., public phone number)
    targetAudience: string;
    tone: Tone;
    email: string; // Contact email for the station to reach the advertiser
    phone: string; // Contact phone for the station
}

export interface RadioStation {
    name: string;
    genre: string;
    audience: string;
    reach: number;
    priceRange: [number, number];
}

export interface PlacementRec {
    stationName: string;
    slot: 'Morning Drive' | 'Midday' | 'Afternoon' | 'Evening';
    price: string;
    reason: string;
}

export interface AdminSummary {
    businessName: string;
    scriptSummary: string;
    requestedSlot: string;
    suggestedPrice: string;
}

export type VoiceActorId = 'Kore' | 'Puck' | 'Zephyr';

export interface VoiceActor {
    id: VoiceActorId;
    name: string;
}

// A composite type to pass all ad data to the admin dashboard
export interface AdRequest {
    id: string; // Unique identifier for the request
    status: 'Pending' | 'Accepted';
    userInput: UserInput;
    script: string;
    placement: PlacementRec | null;
    summary: AdminSummary | null;
    audioData: string;
}