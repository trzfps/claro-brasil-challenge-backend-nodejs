const mongoose =  require('../config/database')

const DevicesSchema = new mongoose.Schema({
    idUser: {
        type: Number,
        required: true,

    },
    idDevice: {
        type: Number,
        unique: true,
        required: true
    },
    nameDevice:{
        type: String,
        required: true
    },
    modelDevice: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now

    },
    exchangeable: {
        type: Boolean,
        default: true
    }
});


const Devices = mongoose.model('Devices', DevicesSchema)
module.exports = Devices