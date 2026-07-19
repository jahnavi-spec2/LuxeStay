const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001/api";


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
