import mongoose from "mongoose";

const reviewSchema=new mongoose.Schema({
userName:{
type:String,
required:true
},
rating:{
    type:Number,
    min:1,
    max:5,
    required:true,
},
comment:{
    type:String,
    required:true
},
date:{
    type:Date,
    default:Date.now
}
},{
    _id:false
}) ;

const roomSchema= new mongoose.Schema(
    {
        type:{
   type:String,
   required:true
        },
        pricePerNight:{
          type:Number,
         required:true,
        },
        capacity:{
type: Number, required: true
        },
        totalRooms:{
type: Number, required: true
        },
        availableRooms:{
type: Number, required: true
        },
        amenities:[String]
    },{
        _id:false
    }
)

const nearByPlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String },
    image:{type:String},
    rating: { type: Number, min: 0, max: 5 },
    distanceKm: { type: Number },
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    address: { type: String, default: "" },
    city: { type: String, required: true, index: true },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    latitude: { type: Number },
    longitude: { type: Number },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    mapUrl: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    photos: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    categories: { type: [String], default: [] },
    starRating: { type: Number, min: 0, max: 5, default: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
    reviews: { type: [reviewSchema], default: [] },
    nearBy: { type: [nearByPlaceSchema], default: [] },
    rooms: { type: [roomSchema], default: [] },

     priceRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
    },
    contact: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },
    policies: {
      checkInTime: { type: String, default: "2:00 PM" },
      checkOutTime: { type: String, default: "11:00 AM" },
      cancellation: { type: String, default: "" },
      petsAllowed: { type: Boolean, default: false },
       smokingAllowed: { type: Boolean, default: false },
    },
    tags: { type: [String], default: [] },
    availabilitySummary: { type: String, default: "Rooms available" },
    lastSynced: { type: Date },
    source: { type: String, default: "college-api" },
    raw: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

hotelSchema.index({ location: "2dsphere" });
hotelSchema.index({ name: "text", city: "text" });

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;