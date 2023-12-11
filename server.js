const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
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
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static('lego-coirs'));
app.use('/', function(req, res){
  res.sendFile(path.join(__dirname+'/lego-coirs/index.html'));
})
// Handle form submission
app.post('/submit-form', async (req, res) => {
  try {
    // Save form data to MongoDB
    const formData = new Form({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    });

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

    res.send('Form submitted successfully!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
