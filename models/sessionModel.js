const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let sessionSchema = Schema({
	username: {type:String, required:true},
    password: {type:String, required:true},
});

module.exports = mongoose.model("Session", sessionSchema);
