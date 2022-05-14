const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const lodash = require("lodash")
const app = express();
//// !!!!!!! An Important Note All Testing Done Here Using Postman api Software Because Here No Html Templte is Used Here!!!////
//// !!!!!!! Every User input Id Given to The Database Using PostMan Api Software software And Some Input Was given by default !!!!!!////
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/wikiDB');
const articleSchema = {
  tittle: String,
  content: String
};
 const Article = mongoose.model("Article", articleSchema);
//////// request targeting all the articles////////
 app.route("/articles")
 .get(function(req,res){
   Article.find(function(err,founditems){
     console.log(founditems);
   })
 })
 //// to insert all the article  /////
 .post(function(req, res){
   const newarticle = new Article({
     tittle: req.body.tittle,
     content: req.body.content
   });
   newarticle.save(function(err){
     if(!err){
       res.send("Succesfully Updated The Article");
     }else{
       res.send(err);
     }
   });
 })
 //// to delete all the article /////
 .delete(function(req,res){
   Article.deleteMany(function(err){
     if(!err){
       res.send("SuccessFully Deleted All The Articles")
     }else {
       res.send(err)
     }
   });
 });

//////// request targeting a specfic articles////////

app.route("/articles/:articletittle")
.get(function(req,res){
  const requestedtittle =req.params.articletittle;
  Article.findOne({tittle:requestedtittle},function(err,result){
    if(result){
      res.send(result);
    } else if (err){
      res.send(err);
    }
    else {
      res.send("No Article Found With The Current Tittle!");
    }
  });
})
//// put methods update the entire docment or object /////
.put(function(req,res){
  const requestedtittle = req.params.articletittle;
  Article.updateOne({tittle:requestedtittle},
    {tittle:req.body.tittle, content: req.body.content},
     {overwrite:true}, function(err,result){
       if(!err){
         res.send(result)
       }else{
         res.send("Failed To Update")
       }
     });


})
//// patch methods update the specific property or attribute of a document or object /////
.patch(function(req,res){
  const requestedtittle = req.params.articletittle;
  Article.updateOne({tittle:requestedtittle},
  {$set: req.body}, function(err,result){
    if(!err){
      res.send(result)
    }else{
      res.send("Failed to Update");
    }
  });
})
////Delete method will delete the specific property or attribute of a document or object /////
.delete(function(req,res){
  const requestedtittle = req.body.tittle;
  Article.deleteOne({tittle:requestedtittle},function(err,result){
    if(!err){
      res.send("SuccessFully Deleted the Article")
    } else{
      res.send("Failed To Delete The Selected Article");
    }
  });
})

////here this post method with post params will create new article the given tittle and article from user and it store it in th database /////
app.post("/article/:id",function(req,res){
  const requestedid = lodash.toUpper(req.body.id);
  if (requestedid === "POST"){
    Article.create({tittle:req.body.tittle, content: req.body.content},function(err, results){
      if(!err){
        res.send("Successfully Added The Article");
      }else{
        res.send("Failed Add The Article")
      }
    })
  } else {
    console.log("Wrong Url");
  }
});

app.listen(3000, function(req, res){
  console.log("Server Started On Port 3000");
});
