const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema({

    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },//to whom the users subcribed to

    subscriber:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }//those who subscribed

}, {
    timestamps: true
})

const subscriptionModel = mongoose.model("subscription", subscriptionSchema)

module.exports = subscriptionModel