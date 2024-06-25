import mongoose from "mongoose"
import passportLocalMongoose from "passport-local-mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})

// Adds on a username and password fields to the schema. And some statis methods
// like authenticate()
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);
export default User;
