import mongoose from 'mongoose'

export const connectDB = async (MONGODB_URI) => {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Successfully Connected to Database')
  } catch (error) {
    console.error('Error Connecting to Database:', error)
  }
}
