require('dotenv').config()
const mongoose = require('mongoose');
mongoose.connect(`mongodb://${process.env.DB_HOST}/devices`, {
    useNewUrlParser: true,
    useCreateIndex: true
});



module.exports = mongoose;