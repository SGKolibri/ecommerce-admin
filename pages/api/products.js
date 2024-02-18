import { mongooseConnect } from '@/lib/mongoose';
import { Product } from '@/models/Product';

export default async function handle(req, res) {
    const { method } = req
    const { title, description, price, images, category, properties } = req.body
    const data = { title, description, price, images, category, properties }

    await mongooseConnect();

    if (method === 'POST') {
        const productDoc = await Product.create({ ...data })
        res.json({ status: 'Saving product to the database', productDoc })
    }

    if (method === 'GET') {
        if (req.query?.id) {
            const productById = await Product.findById(req.query.id)
            res.json({ status: 'Getting product from the database by ID', productById })
        } else {
            const products = await Product.find({})
            res.json({ status: 'Getting products from the database', products })
        }
    }

    if (method === 'PUT') {
        const { _id } = req.body
        await Product.updateOne({ _id }, { ...data })
        res.json({ status: 'Updating product in the database' })
    }

    if (method === "DELETE") {
        if (req.query?.id) {
            await Product.deleteOne({ _id: req.query.id })
            res.json({ status: 'Deleting product from the database' })
        }
    }

}   
