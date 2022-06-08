require('dotenv').config() 
 
const express = require ('express') 
const cors = require('cors'); 
const path  = require ('path') 
const app = express() 

const apiRouter = require('./api/routes/apiRouter') 
const securiteRouter = require('./api/routes/securiteRouter') 

app.use(cors()) 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
 
app.use('/', express.static(path.join(__dirname, '/public'))) 
app.use('/app', express.static(path.join(__dirname, '/public'))) 
app.use ('/seguranca', securiteRouter)
app.use('/api', apiRouter) 
 
 
let port = process.env.PORT || 3000 
app.listen(port) 
 