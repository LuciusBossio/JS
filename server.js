var express = require('express')
var path = require ('path')
var bodyParser = require('body-parser')

var app = express()
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//Set up session object
//each order is going to be stored in an array inside the session object
var session = require('express-session')        //require session module - makes it possible to delete node_modules folder
app.use(session(
{
    secret:'secret-comp-206',       //set secret key for session object - need id and secret in order to access session data
    resave: false,      //Don't save session data if no changes made
    saveUninitialized: false    //only save session if data has been added
}))

app.set('view engine', 'pug')

app.listen(3000,()=>{
        console.log('Server has started')
})

app.get("/",(request,response)=>{
    response.sendFile(path.join(__dirname,  '/public/order.html'))      //send root path to local path order.html
})

//enclose path in [] in order to access multiple file paths
app.get("/submitOrder",(req,res)=>
{   
    res.render('checkout', req.session.order);
})

/*
//create 2D arrays
app.get("/table", (req,res)=>
{
    let data =  [[1,2,3]
                [4,5,6]
                [7,8,9]]
    res.render('table', {data})    //keywork data is what pug uses to access data - {numberArray: data})
})*/

//modify post to add data to array inside of session
app.post('/order',(req,res)=>{
    let orderItem = req.body        //orderItem - contains all data from order
    switch (orderItem.size)
    {
        case "Small":  basePrice = 10; toppingPrice=2; break;
        case "Medium": basePrice = 15; toppingPrice=3; break;
        case "Large":  basePrice = 20; toppingPrice=4; break;
    }
    orderItem.price = basePrice + toppingPrice * orderItem.toppings.length      
    //now we have all the information we need to save to the session
    //req.session - allows you to store data to the session object
    if (!req.session.order)//if session object does not exist create session object with empty order
    {
        req.session.order = { orderItems:[], totalPrice:0 }   //create session object with empty orderItems array and initialize totalPrice variable
    }

    req.session.order.totalPrice += orderItem.price
    req.session.order.orderItems.push(orderItem)      //push - add element to array

    console.log(JSON.stringify(req.session.order))      //display row of JSON in console when it comes from server
    res.send(req.session.order)     //send back session to client
})