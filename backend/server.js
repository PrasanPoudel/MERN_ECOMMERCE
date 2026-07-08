require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
// const morgan = require('morgan');

connectDB().catch((err) => { console.error('DB connection failed:', err); process.exit(1); });

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

//Http request logger middleware for node.js
// app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: process.env.NODE_ENV === 'production' ? 200 : 1000 });
app.use('/api', limiter);

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));

app.use(errorHandler);


app.get('/api/check-server', (req, res) => {
  res.status(200).json({ message: 'Server is up and running!' });
});

app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce API');
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
