import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

//write a function to connect to the mongodb database using mongoose

export const connectToMongoDB = async () => {
  const uri = process.env.MONGO_URI;

  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`Connected to MongoDB!`);

  } catch (error) {
    console.error(`Could not connect to MongoDB: ${error}`);
  }
};
