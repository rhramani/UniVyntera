const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URI ,{
    useNewUrlParser: true,
})

.then(() => {
    console.log("database connected");
    console.log("=============================================")
})
.catch((err) => {
    console.log("database connection error" , err);
})
