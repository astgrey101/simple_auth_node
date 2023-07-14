const express = require('express')
const mongoose = require('mongoose')
const router = require('./authRouter')

const PORT = process.env.PORT || 5000

const app = express()

app.use(express.json())
app.use('/auth', router)

const start = async () => {
    try {
        // await mongoose.connect('/')
        app.listen(PORT, () => console.log('start'))
    } catch (e) {
        console.log(e)
    }
}

start()

