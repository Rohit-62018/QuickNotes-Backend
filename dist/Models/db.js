"use strict";
const mongoose = require('mongoose');
mongoose.connect(process.env.DB_URL)
    .then(() => console.log("DB is connected"))
    .catch((err) => console.log("MongoDB connection failed:", err));
//# sourceMappingURL=db.js.map