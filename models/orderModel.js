const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let orderSchema = Schema({
	username: {type:String, required:true},
    order: {type:JSON, required:true}
});

module.exports = mongoose.model("Order", orderSchema);
