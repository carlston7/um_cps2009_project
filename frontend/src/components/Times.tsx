// import React, { useState, useEffect } from 'react';
// import { getCourtAvailability } from '../api/Courts';
// import { TimeSlot } from '../models/Courts';

// interface Props {
//     courtId: string;
//     date: string; // Assuming date is in a suitable format as a string (e.g., "YYYY-MM-DD")
// }

// const TimeSlotList: React.FC<Props> = ({ courtId, date }) => {
//     const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     useEffect(() => {
//         const fetchTimeSlots = async () => {
//             setIsLoading(true);
//             const slots = await getCourtAvailability(courtId, date);
//             setTimeSlots(slots);
//             setIsLoading(false);
//         };

//         fetchTimeSlots();
//     }, [courtId, date]);

//     if (isLoading) {
//         return <div>Loading available time slots...</div>;
//     }

//     return (
//         <div>
//             <h3>Available Time Slots</h3>
//             {timeSlots.length > 0 ? (
//                 <ul>
//                     {timeSlots.map((slot, index) => (
//                         <li key={index}>{slot.startTime} - {slot.endTime} ({slot.available ? 'Available' : 'Booked'})</li>
//                     ))}
//                 </ul>
//             ) : (
//                 <div>No available time slots for this date. Please select another date.</div>
//             )}
//         </div>
//     );
// };

// export default TimeSlotList;

export {}