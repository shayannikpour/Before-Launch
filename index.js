require("./utils.js");

require('dotenv').config();

const express = require('express');
const MongoStore = require('connect-mongo');
const nodemailer = require('nodemailer');
const port = process.env.PORT || 3000;
const app = express();

const mongodb_host = process.env.MONGODB_HOST;
const mongodb_user = process.env.MONGODB_USER;
const mongodb_password = process.env.MONGODB_PASSWORD;
const mongodb_database = process.env.MONGODB_DATABASE;

var {database} = include('databaseConnection');

const emailsCollection = database.db(mongodb_database).collection('emails');

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/images"));

var mongoStore = MongoStore.create({
    mongoUrl: `mongodb+srv://${mongodb_user}:${mongodb_password}@${mongodb_host}/`
})

app.post('/sendEmail', async (req, res) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'roborental.team@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });
        if (!req.body.email) {
            res.render("index");
            return;
        }
        let email = req.body.email;
        const mailOptions = {
            from: 'roborental.team@gmail.com',
            to: email,
            subject: 'Robo Rental Launch',
            text:`Exciting news! Robo Rental, the app that makes it easy to rent robots for various services, is launching soon.
            By signing up you will be notified on the day of our apps launch.
            Robo Rental offers a seamless solution for renting robots to assist with a variety of tasks. Stay tuned for more details!

            Thank you for your interest.

            Best regards,

            The Robo Rental Team`,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.error('Error occurred:', error);
    }
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get("*", (req, res) => {
    res.status(404);
    res.render("404",);
})

app.listen(port, () => {
    console.log("Node application listening on port " + port);
}); 