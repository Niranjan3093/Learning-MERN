import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import khaltiRoute from './route/khaltiRoute.js';
import connectDB from "./config/mongodb.js"; 
import authRoutes from './route/userRoute.js';
import productRoutes from './route/productRoute.js';
import favoriteRoutes from './route/favoriteRoute.js';
import adminRoutes from './route/adminRoute.js';

dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);

const app = express();
const port = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use('/auth', authRoutes);
app.use("/api/khalti", khaltiRoute);  
app.use('/api', productRoutes);
app.use('/favorites', favoriteRoutes);
app.use("/api/admin", adminRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
  console.log(`Backend URI: ${process.env.BACKEND_URI}`);
});