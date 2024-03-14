export interface TimeSlot {
    index: number;
}

export interface Court {
    id: string;
    name: string;
    dayPrice: number;
    nightPrice: number;
}

export interface CourtCreateRequest {
    name: string;
    type: string;
    dayPrice: number;
    nightPrice: number;
}

export interface CourtUpdateRequest {
    id: string;
    dayPrice?: number;
    nightPrice?: number;
}
