import mongoose from "mongoose"

const { ObjectId } = mongoose.Schema

const reviewSchema = new mongoose.Schema(
    {
        reviewBy: {
            type: ObjectId,
            ref: "User",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            default: 0,
        },

        review: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
)

const productImageSchema = new mongoose.Schema(
    {
        url: {
            type: String,
            required: true,
        },

        public_id: {
            type: String,
            required: true,
        },
    },
    { _id: false }
)

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        longDescription: {
            type: String,
        },

        brand: {
            type: String,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        category: {
            type: ObjectId,
            required: true,
            ref: "Category",
        },

        subCategories: [
            {
                type: ObjectId,
                ref: "SubCategory",
            },
        ],

        details: [
            {
                name: String,
                value: String,
            },
        ],

        benefits: [
            {
                name: String,
            },
        ],

        ingredients: [
            {
                name: String,
            },
        ],

        reviews: [reviewSchema],

        rating: {
            type: Number,
            required: true,
            default: 0,
        },

        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },

        vendor: {
            type: Object,
            required: true,
        },

        questions: [
            {
                question: String,
                answer: String,
            },
        ],

        subProducts: [
            {
                sku: String,

                images: {
                    type: [productImageSchema],
                    validate: {
                        validator: function (value: any[]) {
                            return Array.isArray(value) && value.length > 0
                        },
                        message: "At least one product image is required.",
                    },
                },

                description_images: {
                    type: [productImageSchema],
                    default: [],
                },

                color: {
                    color: String,
                    image: String,
                },

                sizes: [
                    {
                        size: String,
                        qty: {
                            type: Number,
                            default: 0,
                        },
                        price: {
                            type: Number,
                            required: true,
                        },
                        sold: {
                            type: Number,
                            default: 0,
                        },
                    },
                ],

                discount: {
                    type: Number,
                    default: 0,
                },

                sold: {
                    type: Number,
                    default: 0,
                },
            },
        ],
    },
    { timestamps: true }
)

const Product =
    mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product