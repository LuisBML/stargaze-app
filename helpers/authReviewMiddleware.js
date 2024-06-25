import Review from '../models/reviewModel.js';

const isReviewAuthor = async (req, res, next) => {
    const { placeId, reviewId } = req.params;
    const reviewFound = await Review.findById(reviewId);
    if (!reviewFound?.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that :(')
        return res.redirect(`/places/${placeId}`);
    }
    next();
}

export default isReviewAuthor;