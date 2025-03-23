// Backend 

const express = require('express');
const sendgrid = require('@sendgrid/mail');
const path = require('path');
const app = express(); 
require('dotenv').config(); 

app.use(express.json()); 

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

// serve static files 
app.use(express.static(path.join(__dirname, 'public'))); 


// root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html')); 
})

app.post('/sendEmail', (req, res) => {
    const { to, subject, text } = req.body; 
    console.log(to); 

    const message = {
        to,
        from: {
          email: 'NIIY64308@gmail.com',
          name: 'Maple',
        } ,
        subject,
        text,
      };

      sendgrid.send(message)
      .then(() => {
        console.log("success");
      })
      .catch((error) => {
        console.error(error);
      });

})

app.listen(8080, () => {
    console.log("Server running on port 8080"); 
})


