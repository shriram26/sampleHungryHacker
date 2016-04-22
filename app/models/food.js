var mongoose = require('mongoose');

module.exports = mongoose.model('food', {
    foodName: {
        type: String,
        default: '',
        unique: true 
    },
    price :{
    	type: Number,
    	default:0
    }
});