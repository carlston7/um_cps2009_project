export interface TimeSlot {
    startTime: string;
    endTime: string;
    available: boolean;
}

export interface Court {
    id: string;
    name: string;
    dayPrice: number;
    nightPrice: number;
}

export interface CourtCreateRequest {
    name: string;
    dayPrice: number;
    nightPrice: number;
}

export interface CourtUpdateRequest {
    id: string;
    name?: string;
    dayPrice?: number;
    nightPrice?: number;
}
