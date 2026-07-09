import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI ;
    
    // Production-ready connection options
    const connectionOptions = {
      // Connection Pool - optimized for Express server (OLTP workload)
      maxPoolSize: 50,        // Handle concurrent requests
      minPoolSize: 10,        // Keep connections ready for traffic spikes
      maxIdleTimeMS: 600000,  // 10 minutes - close idle connections
      
      // Timeouts
      connectTimeoutMS: 10000,      // 10s - fail fast on connection issues
      socketTimeoutMS: 45000,       // 45s - prevent hanging queries
      serverSelectionTimeoutMS: 5000, // 5s - quick failover
      
      // Reliability
      retryWrites: true,     // Automatically retry writes on transient errors
      retryReads: true,      // Automatically retry reads on transient errors
      
      // Connection validation
      family: 4,              // Use IPv4 (set to 6 for IPv6 only)
    };
    
    await mongoose.connect(mongoUri, connectionOptions);
    
    // Log connection pool info
    const dbConnection = mongoose.connection;
    dbConnection.on('connected', () => {
    });
    
  } catch (error) {
    process.exit(1);
  }
};