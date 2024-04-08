export interface Court {
    _id: string
    name: string;
    type: string
    dayPrice: number | { $numberDecimal: string };
    nightPrice: number | { $numberDecimal: string };
}

export interface DateTimeSelection {
    dateTime: string;
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
