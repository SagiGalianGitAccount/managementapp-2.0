const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const cors = require('cors')
app.use(cors())
require("dotenv").config()

const PORT = 3001 || process.env.PORT

const uri = process.env.MONGODB_KEY
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 })
const collection = client.db("StudentsApplication").collection("users");

app.get('/', (req, res) => {
    res.send("<h1>Server Home Page !</h1>")
})

app.get('/getStudents', (req, res) => {
    collection.findOne({
        _id: new ObjectId(req.query.managerId)
    }).then(result => {
        console.log(result.students)
        res.send(result.students)
    }).catch(err => {
        console.error(err)
        res.send("error occured !")
    })
})

app.post('/deleteStudent', (req, res) => {
    const managerId = req.query.managerId
    const studentId = req.query.studentId

    try{
        collection.updateOne({_id: ObjectId(managerId)}, {
            $pull: { 'students': { studentId: studentId.toString() } }
        })
        res.send("successfuly deleted !")
    }catch(e){
        console.log(e);
        res.send("Could not delete !")
    }
})

app.post('/updateStudentDetails', (req, res) => { // not working ? !
    const managerId = req.query.managerId
    const studentName = req.query.name
    const studentAge = req.query.age
    const studentEmail = req.query.email
    const studentPhone = req.query.phone
    const studentMom = req.query.mom
    const studentDad = req.query.dad   
    const studentId = req.query.studentId
    try{




        collection.updateOne(
            { _id: ObjectId(managerId) },
            { $set: { 
                "students.$[elem].name" : studentName,
                "students.$[elem].age" : studentAge,
                "students.$[elem].email" : studentEmail,
                "students.$[elem].phone" : studentPhone,
                "students.$[elem].mom" : studentMom,
                "students.$[elem].dad" : studentDad,
             } },
            { arrayFilters: [ { "elem.studentId": studentId } ] }
         )






        console.log(`Updated changes for ${studentName}, ${studentEmail}, id=${studentId}.`)
        res.send("successfuly Updated !")
    }catch(e){
        console.log(e);
        res.send("Could not delete !")
    }
})

app.get('/checkUser', (req, res) => {
    const name = req.query.name
    const password = req.query.password

    collection.findOne({
        name: name,
        password: password
        
    }).then(result => {
        console.log(result._id.toString())
        if (result != null) res.send(result._id.toString())
        else res.send('')

    }).catch(err => {
        console.error(err)
        res.send("") // in the frontend blank result will be counted as no user found !
    })
})

app.post('/addStudent', (req, res) => { // not working !
    const managerId = req.query.managerId
    const studentName = req.query.name
    const studentAge = req.query.age
    const studentEmail = req.query.email
    const studentPhone = req.query.phone
    const studentMom = req.query.mom
    const studentDad = req.query.dad   
    const studentId = req.query.studentId
    
    try{
        collection.updateOne({_id: ObjectId(managerId)}, { 
            $push:{
                students: {
                    $each: [{
                        name: studentName,
                        age: studentAge,
                        email: studentEmail,
                        phone: studentPhone,
                        mom: studentMom,
                        dad: studentDad,
                        studentId: studentId
                    }],
                    $position: 0
                }
            }
        })
        res.send("successfuly updated !")
    }catch(e){
        console.log(e);
        res.send("Unsuccessfuly action !")
    }
    //console.log(studentsBefore)
    
})

app.post('/addUser', (req, res) => {
    console.log(req.query)
    const name = req.query.name
    const password = req.query.password
    try{
        collection.insertOne({
        name: name,
        password: password,
        students: Array()
    })}catch(e){
        console.error(err);
        res.send("Could not Insert the user... Error Occoured !")
    }
    
    res.send("Req send Successfuly")
})

app.listen(PORT, () => {
    console.log(`[RUNNING] server is listening on port ${PORT}`)
})