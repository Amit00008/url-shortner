const mongoose = require('mongoose');


const mongoConnect = async ( ) => {
    await mongoose.connect("mongodb://0.0.0.0:27017/test-db").then(()=>{
        console.log('Connected to database')
    })
    .catch((err)=>{
        console.log('Error connecting to database');
        console.log(err);
    })};

module.exports = mongoConnect;