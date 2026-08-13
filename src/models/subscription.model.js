const mongoose = require("mongoose")

const subscriptionSchema = new mongoose.Schema({

    channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },//whom the users subcribed to

    subscribers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user"
        }
    ]//those who subscribed

}, {
    timestamps: true
})

const subscriptionModel = mongoose.model("subscription", subscriptionSchema)

module.exports = subscriptionModel