const mongoose = require("mongoose");
const DB =
  "mongodb://gauravprof2998:V8m0kQXdTWVEsIHO@ac-mhqgcah-shard-00-00.x6mutts.mongodb.net:27017,ac-mhqgcah-shard-00-01.x6mutts.mongodb.net:27017,ac-mhqgcah-shard-00-02.x6mutts.mongodb.net:27017/?ssl=true&replicaSet=atlas-s0wson-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error in connecting to MongoDB"));

db.once("open", function () {
  console.log("Connected to Database :: Mongodb");
});

module.exports = mongoose;
