const mongoose = require('mongoose')

const wishListArticleSchema = mongoose.Schema({
    title: String,
    content: String,
    description: String,
    img: String,
    token:String,
    language:String
})

const wishListArticleModel = mongoose.model('wishListArticle', wishListArticleSchema)

module.exports = wishListArticleModel