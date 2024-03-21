export interface Court {
    id: string
    name: string;
    type: string
    dayPrice: number;
    nightPrice: number;
}
export interface DateTimeSelection {
    date: string;
    time: string;
}

export interface CourtCreateRequest {
    name: string;
    type: string;
    dayPrice: number;
    nightPrice: number;
}

export interface CourtUpdateRequest {
    name: string;
    dayPrice?: number;
    nightPrice?: number;
}
