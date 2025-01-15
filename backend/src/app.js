
const express = require('express');
const mongoose = require('mongoose');
const transactionRoutes = require('./routes/transactionRoutes');
const cors = require('cors')

const app = express();
app.use(cors())
const PORT = 3000;

mongoose.connect('mongodb+srv://VaibhavMhaske:8791435484@cluster0.xc1gd.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Database connected'))
  .catch(error => console.log(error));

app.use(express.json());
app.use('/api', transactionRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
