import express from 'express'
import mysql from 'mysql'
import expressEjsLayouts from 'express-ejs-layouts'

const app = express()

//configure ejs
app.set('view engine', 'ejs')
app.use(expressEjsLayouts)

// receive form data 
app.use(express.urlencoded({extended: true, limit: '1mb'}))


// connect to the database

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'rat12345',
    database : 'formData'
})
  
db.connect(err => {
    if (err) throw err 
    console.log('MySQL database connected successfully!')
})

// ROUTES

// route_1: [GET] home page
app.get('/', (req, res) => {

    db.query('SELECT * FROM USERS ',(err, output) => {
        if (err) throw err 
        res.render('index',{ usersList: output}) 
     }) 
})

// route_2: Nodejs save form data in MySQL
app.post('/users', (req, res) => {
    const { username, email, adress } = req.body
    const user = { username, email , adress}

    db.query('INSERT INTO users SET ?', user, (err, output) => {
        if (err) throw err 
        console.log('User saved successfully!');
        res.redirect('/');
    })
})
app.post('/users/:id/delete', (req,res) => {
    const id = req.params.id
    db.query('DELETE FROM USERS WHERE id=?',id,(err, output) => {
        if(err) throw err
        console.log("user deleted");
    })
    res.redirect( '/') ;
})
// wait for requests from PORT 3000
app.listen(3000)