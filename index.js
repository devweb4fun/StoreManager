'use strict'

const
    process = require('process'),
    express = require('express'),
    app = express(),
    cookieParser = require('cookie-parser'),
    GetRouter = require('./module/GetRouter'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    fs = require('fs')

/** Global value */
global.RootDir = __dirname

/** Check error */
try {
    if (fs.existsSync(__dirname + '/config.json')) {
        if (typeof JSON.parse(fs.readFileSync(__dirname + '\\config.json')).database_name == 'undefined') {
            const text = "[Error] Cannot detect database_name in config file"
            fs.writeFileSync(__dirname + "\\error_log.txt", text)
            console.error(text)
            process.exit(0)
        }
    } else {
        const text = "[Error] No config file found"
        fs.writeFileSync(__dirname + "\\error_log.txt", text)
        console.error(text)
        process.exit()

    }
} catch (error) {
    console.error(error)
}

/** Connect to Mongoose Database */
mongoose.connect('mongodb://localhost:27017/' + JSON.parse(fs.readFileSync(__dirname + '\\config.json')).database_name, { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("Connected to localhost")
})

/** Express Configation */
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(bodyParser.json())
app.use(cookieParser())
app.use(require('express').static('public'))

/** Run Express Server */
const port = JSON.parse(fs.readFileSync(__dirname + '\\config.json')).web_port
app.listen(port, () => {
    console.log(`========================================`)
    console.log(`Author: Duong Nguyen`)
    console.log(`Facebook: https://www.facebook.com/verifyaccounted`)
    console.log(`Global Server is started at port ${port}`)
    console.log(`========================================`)
})

/** Express Routes */
app.use('/', GetRouter('HomeRouter'))
app.use('/manage', GetRouter('ManageRouter'))
app.use('/api/auth', GetRouter('AuthApiRouter'))
app.use('/api/cart', GetRouter('CartApiRouter'))
app.use('/api/product', GetRouter('ProductApiRouter'))
app.use('/api/table', GetRouter('TableApiRouter'))
app.use('/api/list', GetRouter('ListApiRouter'))
app.use('/api/user', GetRouter('UserApiRouter'))
app.use('/api/invoice', GetRouter('InvoiceApiRouter'))