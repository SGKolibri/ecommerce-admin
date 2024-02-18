import { mongooseConnect } from '@/lib/mongoose';
import { Category } from "@/models/Category";


export default async function handle(req, res) {
    const { method } = req;

    const { name, parent, properties } = req.body;
    const parentValue = parent || null;

    const data = { name, parent: parentValue, properties }

    await mongooseConnect();

    if (method === 'GET') {
        try {
            const Categories = await Category.find().populate('parent');
            res.json({ status: 'Retrieving categories from the database', Categories })
        } catch (error) {
            res.json({ status: 'Error retrieving categories from the database', error })
        }
    }

    if (method === 'POST') {
        const categoryDoc = await Category.create({ ...data })
        res.json({ status: 'Saving category to the database', categoryDoc })
    }

    if (method === 'PUT') {
        const { _id } = req.body;
        const categoryDoc = await Category.findByIdAndUpdate(_id, data, { new: true })
        res.json({ status: 'Updating category in the database', categoryDoc })
    }

    if (method === 'DELETE') {
        const { _id } = req.body;
        await Category.findByIdAndDelete(_id)
        res.json({ status: 'Deleting category from the database' })
    }

}