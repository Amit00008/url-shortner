const mongoose = require('mongoose');


const mongoConnect = async ( ) => {
    await mongoose.connect("mongodb+srv://amit:870574046@urlshort.f7vdk.mongodb.net/?retryWrites=true&w=majority&appName=urlshort").then(()=>{
        console.log('Connected to database')
    })
    .catch((err)=>{
        console.log('Error connecting to database');
        console.log(err);
    })};

module.exports = mongoConnect;
