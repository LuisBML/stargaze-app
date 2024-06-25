import ExpressError from './ExpressError.js';
import { reviewSchemaJoi } from '../schemas.js';

const validateReview = (req, res, next) => {
    const { error } = reviewSchemaJoi.validate(req.body);

    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

export default validateReview;