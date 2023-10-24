import { useState } from "react";
import PhotosUploader from "../PhotosUploader";
import Perks from "../Perks";
import AccountNav from "../AccountNav";
import { Navigate } from "react-router-dom";
import axios from 'axios'
export default function PlacesFormPage(){
    const[title,setTitle]=useState('');
    const[address,setAddress]=useState('');
    const[addedPhotos,setAddedPhotos]=useState([]);
   
    const[description,setDescription]=useState('');
    const[perks,setPerks]=useState([]);
    const[extraInfo,setExtraInfo]=useState('');
    const[checkIn,setCheckIn]=useState('');
    const[checkOut,setCheckOut]=useState('');
    const[maxGuests,setMaxGuests]=useState(1);
    const[redirect,setRedirect]=useState(false);
    function inputHeader(text){
        return(
            <h2 className="text-2xl mt-4">{text}</h2>
        );
    }
    function inputDescription(text){
        return(
            <p className="text-gray-500 text-sm">{text}</p>
        );
    }
    function preInput(header,description){
        return(
            <>
                {inputHeader(header)}
                {inputDescription(description)}
            </>
        );
    }
    async function addNewPlace(e){
        e.preventDefault();
        
        await axios.post('/places',{title,address,addedPhotos,
            description,perks,extraInfo,
            checkIn,checkOut,maxGuests});
            setRedirect(true);
        
    }
    if(redirect){
        return <Navigate to={'/account/places'}/>
    }
    return(
        <div>
            <AccountNav/>
        <form onSubmit={addNewPlace}>
            {preInput('Title','Title for your place should be short and catchy')}
            <input type="text" value={title} onChange={e=>setTitle(e.target.value)} placeholder=""/>
            {preInput('Address','For example: My lovely apt')}
            <input type="text" value={address} onChange={e=>setAddress(e.target.value)} placeholder="Address"/>


            {preInput('Photos','more = better')}
          
             <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>
           
            {preInput('name of the Place','Description')}
            
            <textarea value={description} onChange={e=>setDescription(e.target.value)}/>
           
            {preInput('Perks','Select all the perks you want')}
            
            <Perks selected={perks} onChange={setPerks}/>
            
            {preInput('Extra Info','Houese rules, info')}
            
            <textarea value={extraInfo} onChange={e=>setExtraInfo(e.target.value)}/>
            
            {preInput('Check-In&out time,max guests','Add check-in & out time, remember to clean the guest room between the guests come in')}
            
            <div className="grid gap-2 sm:grid-cols-3">
                <div>
                     <h3 className="mt-2 -mb-1">Check-in time</h3>
                     <input type="text" value={checkIn} onChange={e=>setCheckIn(e.target.value)} placeholder="14"/>
                </div>
                <div>
                    <h3 className="mt-2 -mb-1">Check-out time</h3>
                     <input type="text" value={checkOut} onChange={e=>setCheckOut(e.target.value)}placeholder="11"/>
                </div>
                <div>
                    <h3 className="mt-2 -mb-1">Max-number of guests</h3>
                     <input type="number" value={maxGuests} onChange={e=>setMaxGuests(e.target.value)}/>
                </div>
               
            </div>
            <div>
                <button className="primary my-4">Save</button>
            </div>
        </form>
    </div>
    );
}