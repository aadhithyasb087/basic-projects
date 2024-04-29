const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const exhbs = require('express-handlebars');
const dbo=require('./db');
const ObjectId = dbo.ObjectID

app.engine('hbs',exhbs.engine({layoutsDir:'views/',defaultLayout:"main",extname:"hbs"}));
app.set('view engine','hbs');
app.set('views','views');
app.use(bodyParser.urlencoded({extended:true}));
app.get('/hello',async(req,res)=>{
    res.send("Helo")
})

app.get('/',async (req,res)=>{
let database = await dbo.getDatabase()
const collection=database.collection('employees');
const employees=await collection.find({}).toArray()
// let employees=await cursor.toArray()
// console.log(employees);
let message=''
let edit_id,edit_employee,delete_id;
if(req.query.edit_id){
    edit_id=req.query.edit_id
    edit_employee=await collection.findOne({_id:new ObjectId(edit_id)})
}
if(req.query.delete_id){
    await collection.deleteOne({_id:new ObjectId(req.query.delete_id)})
    return res.redirect('/?status=3')
}
switch(req.query.status){
    case '1':
        message="Inserted Successfully!"
        break
    case '2':
        message="Updated Successfully!"
        break;
    case '3':
        message="Deleted Successfully!"
        break;
    default:
        break; 
}
res.render('main',{message,employees,edit_employee,edit_id})
})

app.post('/store_employee', async (req,res)=>{
    let database = await dbo.getDatabase()
    const collection=database.collection('employees');
    let employee = {name:req.body.name,id:req.body.id}
    await collection.insertOne(employee)
    return res.redirect('/?status=1')
})

app.post('/update_employee/:edit_id', async (req,res)=>{
    let database = await dbo.getDatabase()
    const collection=database.collection('employees');
    let employee = {name:req.body.name,id:req.body.id}
    let edit_id=req.params.edit_id
   
    await collection.updateOne({_id:new ObjectId(edit_id)},{$set: employee})
    return res.redirect('/?status=2')
})

// app.get('/delete_employee', async (req,res)=>{
//     let database = await dbo.getDatabase()
//     const collection=database.collection('employees');
//     let delete_id=req.query.delete_id
//     await collection.deleteOne({_id:new ObjectId(delete_id)})
//     return res.redirect('/?status=3')
// })



app.listen(3002)
