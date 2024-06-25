import ExpressError from './ExpressError.js';
import { placeSchemaJoi } from '../schemas.js';

const validatePlace = (req, res, next) => {
    const { error } = placeSchemaJoi.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

export default validatePlace;