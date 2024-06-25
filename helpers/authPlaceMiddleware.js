import Place from '../models/placeModel.js';

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const placeFound = await Place.findById(id);
    if (!placeFound?.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that :(')
        return res.redirect(`/places/${id}`);
    }
    next();
}

export default isAuthor;