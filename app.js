const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");




const app = express()
app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static("public"));

const uri = "mongodb+srv://haribhajank5:j7vbWLuUymNCKLFU@cluster2.kp2snpl.mongodb.net/";
const client = new MongoClient(uri);

const database = client.db('JOSAA');
const orcr = database.collection('orcr');


let userToken = orcr.find({ Year: 2021, Institute:"Indian Institute of Technology Guwahati","Seat_Type":"OPEN",Round:6,Gender:"Gender-Neutral"},{"Academic_Program_Name":1,"Opening_Rank":1,"Closing_Rank":1,"Institute":1,"Year":1}).toArray();


let all = orcr.find({}).toArray();





app.get("/",function(req,res){
    all.then(function(ele){
        var iit = [...new Set(ele.map(document => document.Institute))];
        res.render("trend",{it:iit});
    })
})

app.get("/about",function(req,res){
    res.render("about");
})

app.post('/submit', (req, res) => {
    var selectedOption = req.body.selectedOption;
    all.then(function(el){
        var courseNames = el
        .filter(function(document) {
            return document.Institute === selectedOption;
        })
        .map(function(document) {
            return document.Academic_Program_Name;
        });
        var distinctCourses = Array.from(new Set(courseNames));
        res.json(distinctCourses);
    })

  });

app.post('/sub',(req,res)=>{
    var selectedOption = req.body.selectedOption2;

    all.then(function(el){
        var Cat = el
        .filter(function(document) {
            return (document.Academic_Program_Name === selectedOption);
        })
        .map(function(document) {
            return document.Seat_Type;
        });
        var dCat = Array.from(new Set(Cat));

        res.json(dCat);
    })

});

app.post('/cat',(req,res)=>{
    var selectedOption = req.body.selectedOption3;

    all.then(function(el){
        var Cat = el
        .filter(function(document) {
            return (document.Seat_Type === selectedOption);
        })
        .map(function(document) {
            return document.Gender;
        });
        var dGender = Array.from(new Set(Cat));

        res.json(dGender);
    })

});


app.post('/backendRoute', (req, res) => {
    var selectedCollege = req.body.college;
    var selectedCourse = req.body.course;
    var selectedCategory = req.body.category;
    var selectedGender = req.body.gender;


    
    all.then(function(el){
            // Perform filtering on the array of documents based on the selected options
    const filteredArray = el.filter(document => {
        return (
          document.Institute === selectedCollege &&
          document.Academic_Program_Name === selectedCourse &&
          document.Seat_Type === selectedCategory &&
          document.Gender === selectedGender &&
          document.Round === 6
        );
      });
    
      // Extract the year and opening rank arrays from the filtered array
      var years = filteredArray.map(document => document.Year);
      var openingRanks = filteredArray.map(document => document.Opening_Rank);
      var closingRanks = filteredArray.map(document => document.Closing_Rank);
      var dyears = Array.from(new Set(years));
      var dopeningranks = Array.from(new Set(openingRanks));
      var dclosingranks = Array.from(new Set(closingRanks));

    
      // Construct the response data with the year and opening rank arrays
      const responseData = { dyears, dopeningranks, dclosingranks };
    
      res.json(responseData);
    })

  });


app.listen(3000,function(){
    console.log("Server is up and running on port 3000");
})