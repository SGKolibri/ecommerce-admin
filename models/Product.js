import { Schema, model, models } from 'mongoose'

const ProductSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category'
    },
    images: [{
        type: String
    }],
    properties: {
        type: Object
    }
})

export const Product = models.Product || model('Product', ProductSchema)