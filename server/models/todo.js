const mongoose = require('mongoose');
 
// Create mongoose model: Todo
const Todo = mongoose.model('Todo', {
    text:{
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number, 
        default: null
    } 
});

console.log("Exporting Model: Todo");
module.exports = {Todo };
