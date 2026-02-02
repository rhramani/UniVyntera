const mongoose = require("mongoose");

const subModuleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    parentModule : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fields:{
        type: mongoose.Schema.Types.Mixed,
        default : {}
    }
},{
    timestamps: true
})

module.exports = mongoose.model("SubModule" , subModuleSchema);