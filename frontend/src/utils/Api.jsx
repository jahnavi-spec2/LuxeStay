const BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? "/api" : "http://localhost:8001/api");


async function request(path,options={}){
    const res=await fetch(`${BASE_URL}${path}`,
        {
            credentials:"include",
            headers:{ "Content-Type":"application/json"},
            ...options,
        }
    );


    const data= await res.json();

    if(!res.ok){
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}


//Auth.......

export const registerUser= (payload)=>
    request("/usersauth/register", {
        method:"POST",
        body: JSON.stringify(payload)
    })


export const loginUser= (payload)=>
    request("/usersauth/login", {
        method:"POST",
        body: JSON.stringify(payload)
    })



export const logoutUser= (payload)=>
    request("/usersauth/logout", {
        method:"POST",
        body: JSON.stringify(payload)
    })



export const getCurrentUser= (payload)=>
    request("/usersauth/me", {
        method:"GET",
    })


//booking...
export const createBooking=(payload)=>
    request("/bookings",{
        method:"POST",
        body: JSON.stringify(payload)
    })


export const getMyBooking=()=>
    request("/bookings/me",{
        method:"GET",
    })



export const getBookingById=(id)=>
    request(`/bookings/${id}`,{
        method:"GET",
    })



export const cancelBooking=(id)=>
    request(`/bookings/${id}/cancel`,{
        method:"PATCH",
    })



    //...hotels..
    export const getHotels=(params={})=>{
const query=new URLSearchParams();

Object.entries(params).forEach(([key,value])=>{
    if(value!==undefined && value!=null && value!=""){
    query.set(key,value);
    }
    });
return request(`/hotels?${query.toString()}`,{
    method:"GET",
    });

}

export const getHotelById=(id)=>{
    return request(`/hotels/${id}`,{
        method:"GET",
    });
}

//payments setup routes
export const createRazorpayOrder = (payload) =>
    request("/payments/create-order", {
         method: "POST", 
         body: JSON.stringify(payload) });

export const verifyRazorpayPayment = (payload) =>
    request("/payments/verify", { 
        method: "POST", 
        body: JSON.stringify(payload) });

export const markPaymentFailed = (payload) =>
    request("/payments/mark-failed", { 
        method: "POST",
         body: JSON.stringify(payload) });

    