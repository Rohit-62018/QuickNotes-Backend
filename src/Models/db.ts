const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1/Notes')
  .then(()=>console.log("DB is connected"))
  .catch((err)=>console.log("MongoDB connection failed:", err))