const mongoose = require('mongoose');
const DATABASE_NAME = "i-Notebook"

const mongoURI = `mongodb://localhost:27017/${DATABASE_NAME}?readPreference=primary&appname=MongoDB%20Compass&ssl=false`;


const connectToMongo = () =>{
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to Mongo Successfully")
    })
}

module.exports = connectToMongo;