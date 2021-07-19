const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let vinDetails = new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId, ref:'users',
    },
    model: {
        type: String
    },
    modelyear: {
        type: String
    },
    ManufacturerName:{
        type:String
    },
    make:{
        type:String
    },
    code:{
        type:String
    },

}, {
    collection: 'vinDetails'
});

module.exports = mongoose.model('vinDetails', vinDetails);