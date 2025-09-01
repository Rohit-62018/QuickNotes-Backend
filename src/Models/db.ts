const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://rohityt62018:HR2OvBtVTc8LegAA@cluster0.zymau4k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(()=>console.log("DB is connected"))
  .catch((err)=>console.log("MongoDB connection failed:", err))