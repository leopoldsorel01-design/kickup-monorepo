export enum SkillLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
    PRO = 'PRO'
}

export enum AgeGroup {
    UNDER_12 = 'UNDER_12',
    UNDER_15 = 'UNDER_15',
    UNDER_18 = 'UNDER_18',
    ADULT = 'ADULT'
}

export enum Position {
    GOALKEEPER = 'GOALKEEPER',
    DEFENDER = 'DEFENDER',
    MIDFIELDER = 'MIDFIELDER',
    FORWARD = 'FORWARD'
}

export interface Location {
    latitude: number;
    longitude: number;
}

export enum Vibe {
    CHILL = 'CHILL',
    TRAINING = 'TRAINING',
    TRYHARD = 'TRYHARD'
}

export interface Player {
    id: string;
    username: string;
    skillLevel: SkillLevel;
    ageGroup: AgeGroup;
    location: Location;
    distanceKm?: number;
    vibe: Vibe; // New
}

export interface Stats {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defense: number;
    physical: number;
}

export interface MatchmakingFilter {
    latitude: number;
    longitude: number;
    radiusKm: number;
    skillLevel?: SkillLevel;
    ageGroup?: AgeGroup;
}
