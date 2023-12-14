const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
const path = require('path');
// const cors = require('cors');
const http = require('http');

const app = express();
var server = http.Server(app);
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://rhoshanaarif:eajcFu2XJ0iTbO1i@cluster0.ac9cqf3.mongodb.net/lego', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for your form data
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  message: String,
});

const Form = mongoose.model('Form', formSchema);

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.set("port" , PORT);

app.use(express.static(path.join(__dirname, "lego-coirs")));
app.use(express.json());


app.get("/", function(req, res){
  res.sendFile(path.join(__dirname , "lego-coirs/index.html"));
}
)
app.post('/submit-form', async (req, res) => {
  try {
    // Save form data to MongoDB
    const formData = new Form({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    });
    console.log('Form data received:', req.body);
    await formData.save();

    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'georgesorosperan@gmail.com',
        pass: 'wrgx wbnc upox fxsy',
      },
    });

    const mailOptions = {
      from: 'georgesorosperan@gmail.com',
      to: 'rhoshanaarif.work@gmail.com',
      subject: 'Client enquiry',
      text: `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nMessage: ${formData.message}`,
    };

    await transporter.sendMail(mailOptions);

    // Respond with a JSON object
    res.redirect('/');
  } catch (error) {
    console.error(error);
    // Respond with a JSON error object
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


server.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}`);
});
