// Backend 

const express = require('express');
const sendgrid = require('@sendgrid/mail');
const path = require('path');
const app = express();
require('dotenv').config();
const db = require("./firebaseConfig");
const cors = require("cors");

app.use(express.json(), cors());

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
    },
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

app.post("/scrape_coupons", (req, res) => {
  const retailer = req.body.retailer; // Extract retailer string from request

  const pythonProcess = spawn("python3", ["coupon_scraper.py"]);

  pythonProcess.stdout.on("data", (data) => {

    console.log(`Scraper Output: ${data}`);
  });

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Scraper Error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code != 0) {
      res.status(500).json({ error: `Scraper exited with code ${code}` });
    }
  });
});

app.get("/fetchData", async (req, res) => {
  try {
    const snapshot = await db.collection("coupons").get();
    const data = snapshot.docs.map(doc => ({
      id: doc.id, // Optional: Include Firestore document ID
      retailer: doc.data().Retailer,
      code: doc.data().Code,
      description: doc.data().Description
    }));

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
})