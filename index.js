const express = require('express')
const app = express()
const port = 3000
const pdfController = require('./pdf') // Include the pdf.js. No need for .js suffix.

app.get('/pdf', pdfController.pdf) // “.pdf” because it’s the exported module “modules.exports.pdf”

app.listen(port, () => console.log(`Example app listening on port ${ port }!`))