const mongoose = require('mongoose')
const config = require('config')
const db = config.get('mongoURI')

const connectDB = async () =>{
    try {
        await mongoose.connect(db, {
            useCreateIndex: true,
            useFindAndModify : false,
            useNewUrlParser : true,
            useUnifiedTopology : true
        });

        console.log('MongoDB connected')
    } catch (err) {
        console.error(err.message);
        process.exit(1) //exits process with failure
    }
}

// const connectDB = mongoose.connect(db, ()=>{
//     console.log('database connectd');
// })


// const connectDB = async() =>{
//     await mongoose.connect(db)

//     console.log('serverrr')
// }

module.exports = connectDB