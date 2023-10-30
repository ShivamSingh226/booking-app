import { useContext, useEffect, useState } from "react";
import {Navigate} from "react-router-dom"
import axios from 'axios'
import {differenceInCalendarDays} from 'date-fns'
import { UserContext } from "./UserContext";
export default function BookingWidget({place}) {
    const[checkIn,setCheckIn]=useState('');
    const[checkOut,setCheckOut]=useState('');
    const[maxGuests,setMaxGuests]=useState(1);
    const[name,setName]=useState('');
    const[mobile,setMobile]=useState('');
    const[redirect,setRedirect]=useState('');
    const{user}=useContext(UserContext);
    useEffect(()=>{if(user){
      setName(user.name);
    }},[user]);
    let numberOfNights=0;
    if(checkIn && checkOut){
      numberOfNights=differenceInCalendarDays(new Date(checkOut),new Date(checkIn));
    }
    async function bookThisPlace(){
      
      const response=await axios.post('/bookings',{checkIn,checkOut,maxGuests,name,mobile,
        place:place._id,
        price:numberOfNights*place.price
      });
      const bookingId=response.data._id;
      setRedirect(`/account/bookings/${bookingId}`);


    }
    if(redirect){
      return <Navigate to={redirect}/>
    }
  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check-In:</label>
            <input type="date" value={checkIn} onChange={e=>setCheckIn(e.target.value)}/>
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check-Out:</label>
            <input type="date"value={checkOut} onChange={e=>setCheckOut(e.target.value)} />
          </div>
        </div>
        <div>
          <div className="py-3 px-4 border-t">
            <label>Max number of Guests</label>
            <input type="number" value={maxGuests} onChange={e=>setMaxGuests(e.target.value)} />
          </div>
        </div>

        {numberOfNights>0 && (
            <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text" value={name} onChange={e=>setName(e.target.value)} />
             <label>Phone Number:</label>
            <input type="tel" value={mobile} onChange={e=>setMobile(e.target.value)} />
          </div>
        )}
      </div>

      <button onClick={bookThisPlace} className="primary">Book this place
      {numberOfNights >0 && (
        <span> ${numberOfNights * place.price}</span>
      )}
      </button>
    </div>
  );
}
