"use strict";
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://rohitkumargiddi:<db_password>@cluster0.fjlwgtf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log("DB is connected"))
    .catch((err) => console.log("MongoDB connection failed:", err));
//# sourceMappingURL=db.js.map