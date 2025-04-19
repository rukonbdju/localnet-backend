import { Schema } from "mongoose";

export const geolocation = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
    },
    coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
    },
});