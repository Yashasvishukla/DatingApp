import { Photo } from "./photo";


export interface User {
    id: number;
    username: string;
    gender: string;
    knownAs: string;
    created: Date;
    age: number;
    lastActive: Date;
    photoUrl: string;
    city: string;
    country: string;
    interests?: string;
    introduction?: string;
    lookingFor?: string;
    photos?: Photo[];
}

