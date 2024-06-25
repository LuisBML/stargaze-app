import mongoose from "mongoose";
import Review from './reviewModel.js';

const Schema = mongoose.Schema;

const options = { toJSON: { virtuals: true } };

const placeSchema = new Schema({
    title: String,
    image: {
        url: String,
        filename: String
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, options);

placeSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a style='text-decoration: none; color: #000' href="/places/${this._id}">${this.title}</a></strong>`;
})

// Middleware for Place.findByIdAndDelete
placeSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        // Delete the reviews that belong to the deleted place
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        });
    }
});

const Place = mongoose.model('Place', placeSchema);
export default Place;