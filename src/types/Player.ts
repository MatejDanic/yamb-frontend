import { Link } from "./Link";
import { Role } from "./Role";
import { Score } from "./Score";

export interface Player {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    roles: Role[];
    registered: boolean;
    _links: {
        self: Link;
        scores?: Link;
        clashes?: Link;
        logs?: Link;
        preferences?: Link;
        username?: Link;
        stats?: Link;
    };
}

export interface PlayerCollection {
    _embedded: {
        players: Player[];
    };
    _links: {
        self: Link;
        next?: Link;
        prev?: Link;
    };
    page: {
        size: number;
        totalElements: number;
        totalPages: number;
        number: number;
    };
}

export interface PlayerPreferences {
    language: string;
    theme: string;
    _links: {
        self: Link;
    };
}

export interface GlobalPlayerStats {
    playerCount: number;
    mostScoresByAnyPlayer: number;
    playerWithMostScores: Player;
    highestAverageScoreByAnyPlayer: number;
    playerWithHighestAverageScore: Player;
    highScore: Score;
    newestPlayer: Player;
    oldestPlayer: Player;
}

export interface PlayerStats {
    lastActivity: Date;
    averageScore: number;
    highScore: Score;
    scoreCount: number;
}