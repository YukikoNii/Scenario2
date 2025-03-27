// Backend 

const express = require('express');
const sendgrid = require('@sendgrid/mail');
const path = require('path');
const app = express();
require('dotenv').config();
const db = require("./firebaseConfig");
const cors = require("cors");
const { spawn } = require('child_process');

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

app.post("/scrapeCoupons", (req, res) => {
  const retailer = req.body.retailer; // Extract retailer string from request

  const pythonProcess = spawn("python3", ["coupon_scraper.py", retailer]);


  pythonProcess.stderr.on("data", (data) => {
    console.error(`Scraper Error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code != 0) {
      res.status(500).json({ error: `Scraper exited with code ${code}` });
    }
    res.status(200).json({ success: true });
  });
});

app.post("/scrapePrices", (req, res) => {
  const product = req.body.product; // Extract retailer string from request
  console.log(product);

  const pythonProcess = spawn("python3", ["price_scraper.py", product]);

  pythonProcess.stderr.on("data", (data) => {
    console.error(`Scraper Error: ${data}`);
  });

  pythonProcess.on("close", (code) => {
    if (code != 0) {
      res.status(500).json({ error: `price scraper exited with code ${code}` });
    }
    res.status(200).json({ success: true });
  });
});

app.post("/fetchCoupons", async (req, res) => {
  try {
    const retailer = req.body.retailer;

    if (retailer != null) {
      const snapshot = await db.collection("coupons").where("Retailer", "==", retailer).get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id, // Optional: Include Firestore document ID
        retailer: doc.data().Retailer,
        code: doc.data().Code,
        description: doc.data().Description
      }));

      res.json(data);
    } else {
      const snapshot = await db.collection("coupons").get();

      const data = snapshot.docs.map(doc => ({
        id: doc.id, // Optional: Include Firestore document ID
        retailer: doc.data().Retailer,
        code: doc.data().Code,
        description: doc.data().Description
      }));

      res.json(data);
    }

  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.post("/fetchPrices", async (req, res) => {
  try {
    const product = req.body.product;  //

    let data = {};

    if (product) {
      // If product is provided, get data for that specific product
      const productRef = db.collection("products").doc(product);
      const productSnapshot = await productRef.get();

      if (!productSnapshot.exists) {
        return res.status(404).json({ error: "Product not found" });
      }

      const productData = productSnapshot.data();
      data[product] = {};
      for (let retailerName in productData.prices) {
        data[product][retailerName] = productData.prices[retailerName];
      }

    } else {
      // If no product is provided, get all products from the collection
      const snapshot = await db.collection("products").get();

      snapshot.forEach((doc) => {
        const productData = doc.data();
        const product = doc.id;
        data[product] = {};
        for (let retailerName in productData.prices) {
          data[product][retailerName] = productData.prices[retailerName];
        }
      });

    }

    res.json(data);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});




app.listen(8080, () => {
  console.log("Server running on port 8080");
})
