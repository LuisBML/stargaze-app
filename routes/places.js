import express from 'express';
import wrappeError from '../helpers/wrapperAsync.js';
import isAuthor from '../helpers/authPlaceMiddleware.js';
import validatePlace from '../helpers/validatePlaceMiddleware.js';
import isLoggedIn from '../helpers/loginMiddleware.js';
import placeController from '../controllers/placeController.js';
import multer from 'multer';
import storage from '../cloudinary/index.js';
const router = express.Router();
const upload = multer(storage);

router.route('/')
    .get(wrappeError(placeController.index))
    .post(isLoggedIn, upload.single('image'), validatePlace, wrappeError(placeController.createPlace));

router.get('/new', isLoggedIn, placeController.newForm)

router.route('/:id')
    .get(wrappeError(placeController.showPlace))
    .put(isLoggedIn, isAuthor, upload.single('image'), validatePlace, wrappeError(placeController.editPlace))
    .delete(isLoggedIn, isAuthor, wrappeError(placeController.deletePlace));

router.get('/:id/edit', isLoggedIn, isAuthor, wrappeError(placeController.editForm));

export default router;