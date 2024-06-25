import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    body: String,
    rating: Number
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
