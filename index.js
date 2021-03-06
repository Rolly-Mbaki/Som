// import express from "express"
// import ejs, { render } from "ejs"
// import mongoose from "mongoose"
const express = require('express')
const ejs = require('ejs')
const mongoose = require('mongoose')
const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.set("port", 3000);

app.use(express.static("public"));
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))

app.set('views', './views')
app.set("view engine", "ejs")

let gem = 0;

let som = 0

let data = []
app.get('/',(req,res)=>{
    res.render('index',{data:data,som:som})
})

app.get('/logs',(req,res)=>{
    data.sort((a,b)=>{
        if(a.datum < b.datum ) return 1;
        if(a.datum > b.datum ) return -1;
        return 0;
    })
    res.render('logs',{data:data})
})

app.get('/error',(req,res)=>{
    res.render('error')
})

app.get('/logs/:user',(req,res)=>{
    let user = req.params.user

    let userLogs = []
    for (let i = 0; i < data.length; i++) {
        if (data[i].naam.toLowerCase() == user.toLowerCase()) {
            userLogs.push(data[i])
        }
    }
    if (userLogs.length == 0) {
        res.redirect('/error')
    }
    else res.render('userlogs',{userlogs:userLogs,user:user});
})

app.get('*',(req,res)=>{
    res.status(404).render('error')
})

app.post('/addGetal',(req,res)=>{
    if (req.body.naam == '') {
        req.body.naam = 'unknown'
    }
    if (parseFloat(req.body.getal)>10000 || parseFloat(req.body.getal) < 0) {
        res.redirect('error')
    }
    else if (!isNaN(req.body.getal)) {
        data.push({
            getal: parseFloat(req.body.getal),
            datum: new Date(),
            naam: req.body.naam
        })
        // console.log(data)
        som = 0
        for (let i = 0; i < data.length; i++) {
            som+=data[i].getal
        }
        // gem=som/data.length
        res.redirect('/')
    }
    else{
        res.redirect('error')
    }
})
// interface ArrGet {
//     getal:number,
//     woord:string
// }
// let somArr:number = 0
// let arrayGet:ArrGet[] = [
//     {getal:1,woord:'een'},
//     {getal:5,woord:'vijf'},
// ]
// console.log(arrayGet)
// for (let i = 0; i < arrayGet.length; i++) {
//     somArr+=arrayGet[i].getal
// }
// arrayGet.push(
//     {getal:3,woord:'drie'}
// )
// console.log(somArr)
// for (let i = 0; i < arrayGet.length; i++) {
//     somArr+=arrayGet[i].getal
// }
// console.log(somArr)
// for (let i = 0; i < data.length; i++) {
//     som+=data[i].getal
// }

app.set('port', (process.env.PORT || 8000))
app.listen(app.get("port"), () => {
  console.log(`Web application started at http://localhost:${app.get("port")}`);
});