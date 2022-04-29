
const mongoose = require ('mongoose')

const connectDB = async () => {       //we are dealing with promise here
    try {                               //try catch to make room for errors
        const conn = await mongoose.connect(process.env.MONGO_URI, { // these are to avoid warnings in the console
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useFindAndModify: false
        }) 

        console.log(`MongoDB Connected: ${conn.connection.host}`)

    } catch (err) {
        console.error(err)
        process.exit(1)       //we want to exit the pg if theres an error

    }
}

module.exports = connectDB