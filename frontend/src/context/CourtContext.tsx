// CourtContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Court } from '../models/Courts';

interface BookingDetails {
    selectedCourt: Court | null;
    date: string;
    time: string;
    price: string
    setPrice: (price: string) => void;
    selectCourt: (court: Court) => void;
    setBookingDate: (date: string) => void;
    setBookingTime: (time: string) => void;
}

const CourtContext = createContext<BookingDetails | undefined>(undefined);

interface CourtProviderProps {
    children: ReactNode;
}

export const CourtProvider: React.FC<CourtProviderProps> = ({ children }) => {
    const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);
    const [price, setPrice] = useState('')
    const [date, setBookingDate] = useState('');
    const [time, setBookingTime] = useState('');

    const selectCourt = (court: Court) => setSelectedCourt(court);

    return (
        <CourtContext.Provider value={{ selectedCourt, date, time, price, selectCourt, setPrice, setBookingDate, setBookingTime }}>
            {children}
        </CourtContext.Provider>
    );
};

export const useCourt = () => {
    const context = useContext(CourtContext);
    if (!context) throw new Error('useCourt must be used within a CourtProvider');
    return context;
};
