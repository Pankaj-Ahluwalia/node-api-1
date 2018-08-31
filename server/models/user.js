const mongoose = require('mongoose');


// Create mongoose model: User
const User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    }
});

console.log("Exporting Model: User");
module.exports = {User };