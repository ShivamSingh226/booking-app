import { useState } from "react";

export default function BookingWidget({place}) {
    const[checkIn,setCheckIn]=useState('');
    const[checkOut,setCheckOut]=useState('');
    const[maxGuests,setMaxGuests]=useState('');
  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check-In:</label>
            <input type="date" />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check-Out:</label>
            <input type="date" />
          </div>
        </div>
        <div>
          <div className="py-3 px-4 border-t">
            <label>Max number of Guests</label>
            <input type="number" value={1} />
          </div>
        </div>
      </div>

      <button className="primary">Book this place</button>
    </div>
  );
}
