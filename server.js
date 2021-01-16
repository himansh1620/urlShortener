const express = require ('express')
const bodyParser=require("body-parser")
const mongoose = require('mongoose')
const ShortUrl = require('./models/shortUrl')
const app = express()

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.set('view engine', 'ejs')
// app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.urlencoded({extended: true}) )

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls})
})

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if(shortUrl == null) return res.sendStatus(404)
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})

app.post('/delete', async (req, res) => {
    console.log(req.body);
    await ShortUrl.findOneAndDelete({short: req.body.delete})
    // console.log(req.body.delete)
    res.redirect('/')
})

app.listen(process.env.PORT || 5000);