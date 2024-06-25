import Review from '../models/reviewModel.js';
import Place from '../models/placeModel.js';

const reviewController = {};

reviewController.createReview = async (req, res) => {
    const place = await Place.findById(req.params.placeId);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    place.reviews.push(newReview);

    await place.save();
    await newReview.save();
    req.flash('success', 'New review added successfully!')

    res.redirect(`/places/${place._id}`);
};

reviewController.deleteReview = async (req, res) => {
    const { placeId, reviewId } = req.params;
    await Place.findByIdAndUpdate(placeId, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!')

    res.redirect(`/places/${placeId}`);
};

export default reviewController;