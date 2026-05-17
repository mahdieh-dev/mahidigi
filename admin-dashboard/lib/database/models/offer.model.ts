import mongoose from "mongoose";

const OfferSchema = new mongoose.Schema({
    title: { type: String, required: true },
    images: [{ url: String, public_id: String }],
    offerType: { type: String, enum: ["specialCombo", "crazyDeal"], required: true },
})

const Offer = mongoose.models.Offer || mongoose.model("Offer", OfferSchema)

export default Offer