import Hotel from "../models/hotel.model";
import asyncHandler from "../utils/AsyncHandler";
import ApiError from "../utils/Apierror";
import ApiResponse from "../utils/Apiresponse";

export const getAllHotels=asyncHandler(async(req,res)=>{
    const {city,minPrice,maxPrice,minRating,page=1, limit=12}= req.query;

    const filter={};
    if(city)
         filter.city= new RegExp(`^${city}$`,"i");
        if(minRating)
            filter.rating={$gte:Number(minRating)};
        if(minPrice |maxPrice){
            filter["priceRange.min"]={};
            if(minPrice)
                filter["priceRange.min"].$gte=Number(minPrice);
            if(maxPrice)
                filter["priceRange.min"].$lte=Number(maxPrice);
        }

          const skip = (page - 1) * limit;

    const hotels = await Hotel.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    const total = await Hotel.countDocuments(filter);

        return req.status(200).json(new ApiResponse(200,{
            hotels,
            pagination:{
                  total: total,
                    page: page,
                    totalPages: Math.ceil(total / limit)
            }
        },
    "Hotels fetched"))
});
export const getHotelById = asyncHandler(async (req, res) => {

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
        throw new ApiError(404, "Hotel not found");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            { hotel },
            "Hotel fetched"
        )
    );

});