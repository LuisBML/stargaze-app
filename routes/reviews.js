import express from 'express';
import wrappeError from '../helpers/wrapperAsync.js';
import validateReview from '../helpers/validateReviewMiddleware.js';
import isLoggedIn from '../helpers/loginMiddleware.js';
import isReviewAuthor from '../helpers/authReviewMiddleware.js';
import reviewController from '../controllers/reviewController.js';

const router = express.Router({ mergeParams: true });

router.post('', isLoggedIn, validateReview, wrappeError(reviewController.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrappeError(reviewController.deleteReview));

export default router;