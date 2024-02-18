import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    category: assignedCategory,
    images: existingImages,
    properties: existingProperties
}) {

    const [title, setTitle] = useState(existingTitle || '')
    const [description, setDescription] = useState(existingDescription || '')
    const [productProperties, setProductProperties] = useState(existingProperties || {})
    const [price, setPrice] = useState(existingPrice || '')
    const [images, setImages] = useState(existingImages || [])
    const [goToProducts, setGoToProducts] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [category, setCategory] = useState(assignedCategory || '')
    const [categories, setCategories] = useState([])
    const router = useRouter()

    async function saveProduct(e) {
        e.preventDefault()
        const data = { title, description, price, images, _id, category, properties: productProperties }
        if (_id) {
            await axios.put('/api/products', { ...data, _id })
        } else {
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }

    if (goToProducts) router.push('/products')

    async function uploadImages(e) {
        const files = e.target?.files;
        if (files?.length > 0) {
            setIsUploading(true)
            const data = new FormData();
            for (let i = 0; i < files.length; i++) {
                data.append('files', files[i])
            }
            const res = await axios.post('/api/upload', data)
            setImages(oldImages => [...oldImages, ...res.data.links])
        }
        setIsUploading(false)
    }

    function updateImagesOrder(newImages) {
        setImages(newImages)
    }

    useEffect(() => {
        axios.get('/api/categories').then((res) => {
            setCategories(res.data.Categories)
        })
    }, [])

    const propertiesToFill = []
    if (categories.length > 0 && category) {
        let selectedCategory = categories.find(({ _id }) => _id === category)
        propertiesToFill.push(...selectedCategory.properties)
        while (selectedCategory?.parent?._id) {
            const parent = categories.find(({ _id }) => _id === selectedCategory.parent._id)
            propertiesToFill.push(...parent.properties)
            selectedCategory = parent;
        }
    }

    function setProductProperty(name, value) {
        setProductProperties(oldProperties => {
            const newProductProps = { ...oldProperties };
            newProductProps[name] = value;
            return newProductProps;
        });

    }

    return (
        <>
            <form onSubmit={(e) => saveProduct(e)}>

                <label>Product Name</label>
                <input type="text" placeholder="product name" value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Uncategorized</option>
                    {categories.length > 0 && categories.map((category) => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                {propertiesToFill.length > 0 && propertiesToFill.map((property, index) => (
                    <div className="" key={index}>
                        <label>{property.name[0].toUpperCase() + property.name.substring(1)}</label>
                        <div>
                            <select onChange={(e) => setProductProperty(property.name, e.target.value)}>
                                {property.values.map((value) => (
                                    <option key={value} value={value}>{value}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                ))}
                <label>Photos</label>
                <div className="mb-2 flex flex-wrap gap-2">
                    <ReactSortable
                        className="flex flex-wrap gap-1"
                        list={images}
                        setList={updateImagesOrder}
                    >
                        {!!images?.length && images.map((link) => (
                            <div key={link} className="h-24 bg-white p-2 shadow-sm rounded-sm border border-gray-200">
                                <img src={link} className="object-cover rounded-lg" alt="product image" />
                            </div>
                        ))}
                    </ReactSortable>
                    {isUploading && (
                        <div className="h-24 w-24 rounded-md bg-gray-200 p-1 border flex items-center">
                            <Spinner />
                        </div>
                    )}
                    <label className="w-24 h-24 rounded-sm cursor-pointer bg-white shadow-sm px-4 border-gray-200 text-gray-600 border flex flex-col text-center items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                        </svg>
                        <div>
                            Add image
                        </div>
                        <input type="file" onChange={uploadImages} multiple className="hidden" />
                    </label>
                </div>

                <label>Description</label>
                <textarea placeholder="product description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>

                <label>Price (USD)</label>
                <input type="number" placeholder="product price" value={price} onChange={(e) => setPrice(e.target.value)} />

                <button type='xsubmit' className="btn-primary">Save</button>
            </form>
        </>
    )
}