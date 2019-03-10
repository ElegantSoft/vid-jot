const express = require('express')
const app = express();
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const port = 5000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});
//middleware
app.engine('handlebars',exphbs({defaultLayout: 'main'}))
app.set('view engine','handlebars')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//mongo promise
mongoose.Promise = global.Promise
//connect database
mongoose.connect('mongodb://localhost/vidjot-dev',{
    useNewUrlParser: true
  
}).then(()=> {console.log('Connected to mongo...')}).catch((err)=>{console.log(err)})
//load Model
require('./models/Ideas');
const Idea = mongoose.model('ideas')
//route
app.get('/ideas',(req,res)=>{
    Idea.find({})
    .sort({date: 'desc'})
    .then(ideas =>{
        res.render('ideas/index',{
            ideas: ideas
        })
    })
})
app.get('/', (req,res) => {
    const title = 'Welcome'
    res.render('index',{
        title: title
    })
})
app.get('/ideas/add',(req,res)=>{
    res.render('ideas/add')
})
app.post('/ideas',(req,res)=>{
    errors= []
    if(!req.body.title){
        errors.push({text:'Please add title'})
    }
    if(!req.body.details){
        errors.push({text:'Please add some details'})
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors: errors,
            title: req.body.title,
            details: req.body.details
        })
    }else{
        const newIdea = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newIdea)
        .save()
        .then(idea =>{
            res.redirect('/ideas')
        })

    }
})
app.get('/about', (req,res) => {
    res.render('about')
})
