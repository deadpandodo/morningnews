


var express = require('express');
var router = express.Router();

var uid2 = require('uid2')
var bcrypt = require('bcrypt');

var userModel = require('../models/users')
var wishListArticleModel = require('../models/article')


router.post('/sign-up', async function(req,res,next){

  var error = []
  var result = false
  var saveUser = null
  var token = null
  var languageSelected = "fr"

  const data = await userModel.findOne({
    email: req.body.emailFromFront
  })

  if(data != null){
    error.push('utilisateur déjà présent')
  }

  if(req.body.usernameFromFront == ''
  || req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }


  if(error.length == 0){

    var hash = bcrypt.hashSync(req.body.passwordFromFront, 10);
    var newUser = new userModel({
      username: req.body.usernameFromFront,
      email: req.body.emailFromFront,
      password: hash,
      token: uid2(32),
      lastSelectedLanguage: "fr",
    })
<<<<<<< HEAD
=======

>>>>>>> 87e6528abd504f7074898840e6a16daacdc9921e
    saveUser = await newUser.save()


    if(saveUser){
      result = true
      token = saveUser.token
      languageSelected = saveUser.languageSelected
    }
  }


  res.json({result, saveUser, error, token, languageSelected})
})

router.post('/sign-in', async function(req,res,next){

  var result = false
  var user = null
  var error = []
  var token = null
  var languageSelected = "fr"
  

  if(req.body.emailFromFront == ''
  || req.body.passwordFromFront == ''
  ){
    error.push('champs vides')
  }

  if(error.length == 0){
    user = await userModel.findOne({
      email: req.body.emailFromFront,
    })


    if(user){
      if(bcrypt.compareSync(req.body.passwordFromFront, user.password)){
        result = true
        token = user.token
        languageSelected = user.languageSelected
      } else {
        result = false
        error.push('mot de passe incorrect')
      }

    } else {
      error.push('email incorrect')
    }
  }


  res.json({result, user, error, token, languageSelected})


})

router.put('/update-language', async function(req,res,next){

  
  var token = req.body.token
  var language = req.body.lang
  console.log(token)
  console.log(language)
  
  var update_result = await userModel.updateOne(
    { token: token},
    { lastSelectedLanguage: language }
  );
  console.log(update_result)
  
  res.json({update_result})

})


router.post('/add-article-in-wishlist',async function(req,res,next){
  let newArticleInWishlist = await wishListArticleModel({
     title:req.body.titleFromFront,
     content:req.body.contentFromFront,
     description:req.body.descriptionFromFront,
     img:req.body.img,
     token:req.body.token,
  })

  await newArticleInWishlist.save();

  res.json({success:true})
})

module.exports = router;
