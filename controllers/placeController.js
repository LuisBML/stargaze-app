import Place from '../models/placeModel.js';
import storage from '../cloudinary/index.js';
import mapGeocoding from '@mapbox/mapbox-sdk/services/geocoding.js';

const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mapGeocoding({ accessToken: mapBoxToken });

const placeController = {};

placeController.index = async (req, res) => {
    const starPlaces = await Place.find({});
    res.render('places-views/index', { starPlaces });
};

placeController.newForm = (req, res) => {
    res.render('places-views/new');
};

placeController.createPlace = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({ query: req.body.newPlace.title, limit: 1 }).send();

    const place = new Place(req.body.newPlace);

    place.geometry = geoData.body.features[0].geometry;

    const newUrl = req.file.path.replace('upload/', 'upload/f_auto/');
    place.image = { url: newUrl, filename: req.file.filename }
    place.author = req.user._id;

    await place.save();

    console.log(place);
    req.flash('success', 'New Place added successfully!')
    res.redirect(`/places/${place._id}`);
};

placeController.showPlace = async (req, res) => {
    const placeFound = await Place
        .findById(req.params.id)
        .populate({ path: 'reviews', populate: { path: 'author' } });

    if (!placeFound) {
        req.flash('error', 'Cannot find that Place');
        return res.redirect('/places');
    }
    res.render('places-views/show', { place: placeFound });
};

placeController.editForm = async (req, res) => {
    const placeFound = await Place.findById(req.params.id);
    if (!placeFound) {
        req.flash('error', 'Cannot find that Place');
        return res.redirect('/places');
    }

    res.render('places-views/edit', { place: placeFound });
};

placeController.editPlace = async (req, res) => {
    const { id } = req.params;

    const updatedPlace = await Place.findByIdAndUpdate(id, { ...req.body.newPlace });

    const geoData = await geocoder.forwardGeocode({ query: req.body.newPlace.title, limit: 1 }).send();
    updatedPlace.geometry = geoData.body.features[0].geometry;

    if (req.file) {
        // Delete image from Cloudinary
        storage.cloudinary.uploader.destroy(updatedPlace.image.filename);

        const newUrl = req.file.path.replace('upload/', 'upload/f_auto/');
        updatedPlace.image = { url: newUrl, filename: req.file.filename }
    }

    await updatedPlace.save();

    req.flash('success', 'Place updated successfully!')
    res.redirect(`/places/${updatedPlace._id}`);
};

placeController.deletePlace = async (req, res) => {
    const { id } = req.params;
    const deletedPlace = await Place.findByIdAndDelete(id);

    // Delete image from Cloudinary
    storage.cloudinary.uploader.destroy(deletedPlace.image.filename);

    req.flash('success', 'Place deleted successfully!')
    res.redirect('/places');
};

export default placeController;