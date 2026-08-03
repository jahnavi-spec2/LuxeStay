import Hotel from "../models/hotel.model.js";
import asyncHandler from "../utils/AsyncHandler.js";
import ApiError from "../utils/Apierror.js";
import ApiResponse from "../utils/Apiresponse.js";

export const getAllHotels = asyncHandler(async (req, res) => {
  const { city, minPrice, maxPrice, minRating, page = 1, limit = 12 } = req.query;

  const filter = {};
  if (city) filter.city = new RegExp(`^${city}$`, "i");
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (minPrice || maxPrice) {
    filter["priceRange.min"] = {};
    if (minPrice) filter["priceRange.min"].$gte = Number(minPrice);
    if (maxPrice) filter["priceRange.min"].$lte = Number(maxPrice);
  }


  if(search){
    filter.$text = { $search: search };
  }

  const sortMap={
      "price-low": { "priceRange.min": 1 },
    "price-high": { "priceRange.min": -1 },
    rating: { rating: -1 },
  };

   const sortOption = sortMap[sort] || { createdAt: -1 };
   
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const hotels = await Hotel.find(filter).skip(skip).limit(limitNum).sort(sortOption);
  const total = await Hotel.countDocuments(filter);

  return res.status(200).json(
    new ApiResponse(
      200,
      { hotels, pagination: { total, page: pageNum, totalPages: Math.ceil(total / limitNum) } },
      "Hotels fetched"
    )
  );
});

export const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) throw new ApiError(404, "Hotel not found");
  return res.status(200).json(new ApiResponse(200, { hotel }, "Hotel fetched"));
});