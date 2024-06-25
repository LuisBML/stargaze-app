import mongoose from "mongoose";
import Place from "../models/placeModel.js";
import places from "./cities.js";

mongoose.connect('mongodb://localhost:27017/stargaze-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "conection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Place.deleteMany({});
    places.forEach((place) => {
        const newPlace = new Place({
            author: '66593a0f865da40cb80c5dc1',
            location: place.country,
            geometry: { type: 'Point', coordinates: [-122.330284, 47.603245] },
            title: place.spot,
            image: { url: 'https://images.unsplash.com/photo-1535224144809-6e323fbcb69c?q=80&w=3870&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', filename: 'Milky Way Galaxy' },
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent et fermentum lectus. Morbi tristique congue orci eget semper. Suspendisse consectetur metus ut tempor volutpat.'
        });
        newPlace.save();
    });
};

seedDB();