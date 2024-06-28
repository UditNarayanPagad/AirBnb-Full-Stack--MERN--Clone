const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

let listingSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    description:String,
    image: {
        filename: {
            type: String,
            default: "listingimage"
        },
        url: {
            type: String,
            default: "https://cityfurnish.com/blog/wp-content/uploads/2023/08/beach-near-hotel-min-1200x800.jpg"
        }
    },
    price: Number,
    location: String,
    country: String,
    review:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in : listing.review}})
    }
})

const listing = mongoose.model('listing',listingSchema);
module.exports = listing;