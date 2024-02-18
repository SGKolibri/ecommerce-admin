import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { withSwal } from "react-sweetalert2"

function Categories({ swal }) {
    const [editingCategory, setEditingCategory] = useState(null)
    const [name, setName] = useState('')
    const [parent, setParent] = useState('')
    const [categories, setCategories] = useState([])
    const [properties, setProperties] = useState([])

    async function saveCategory(e) {
        e.preventDefault()

        if (!name) return

        const data = {
            name,
            parent,
            properties: properties.map(p => ({ name: p.name, values: p.values.split(',') }))
        }

        if (editingCategory) {
            data._id = editingCategory._id
            await axios.put('/api/categories', data)
            setEditingCategory(null)
        } else {
            await axios.post('/api/categories', data)

        }
        setName('')
        setParent('')
        setProperties([])
        getCategories()
    }

    useEffect(() => {
        getCategories()
    }, [])

    async function getCategories() {
        await axios.get('/api/categories')
            .then(({ data }) => {
                setCategories(data.Categories)
            })
    }

    function editCategory(category) {
        setEditingCategory(category)
        setName(category.name)
        setParent(category.parent?._id ? category.parent._id : '')
        setProperties(category.properties.map(p => ({ name: p.name, values: p.values.join(',') })))
    }

    function deleteCategory(category) {
        swal.fire({
            title: 'Are you sure?',
            text: 'You will not be able to recover this category!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await axios.delete('/api/categories', { data: { _id: category._id } })
                getCategories()
                swal.fire(
                    'Deleted!',
                    'Your category has been deleted.',
                    'success'
                )
            }
        })
    }

    function addProperty() {
        setProperties(oldProperties => {
            return [...oldProperties, { name: '', values: '' }]
        })
    }

    function handlePropertyNameChange(index, property, name) {
        setProperties(oldProperties => {
            const properties = [...oldProperties];
            properties[index].name = name;
            return properties;
        });
    }

    function handlePropertyValuesChange(index, property, values) {
        setProperties(oldProperties => {
            const properties = [...oldProperties];
            properties[index].values = values;
            return properties;
        });
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove;
            });
        });
    }

    return (
        <>
            <Layout>
                <h1>Categories</h1>
                <label>{editingCategory !== null ? `Edit category ${editingCategory?.name}` : 'Create new category'}</label>
                <form onSubmit={saveCategory}>
                    <div className="flex gap-1">
                        <input type="text" placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} />
                        <select value={parent} onChange={(e) => setParent(e.target.value)}>
                            <option value="">No parent category</option>
                            {categories.length > 0 && categories.map((category, index) => (
                                <option key={index} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="block">Properties</label>
                        <button onClick={addProperty} type="button" className="btn-default text-sm mb-2">Add property</button>
                        {properties.length > 0 && properties.map((property, index) => (
                            <div key={index} className="flex gap-1 mb-2">
                                <input className="mb-0" type="text" placeholder="Property name"
                                    value={property.name}
                                    onChange={(e) => handlePropertyNameChange(index, property, e.target.value)}
                                />
                                <input className="mb-0" type="text" placeholder="Property value"
                                    value={property.values}
                                    onChange={(e) => handlePropertyValuesChange(index, property, e.target.value)}
                                />
                                <button onClick={() => removeProperty(index)} className="btn-red" type="button">
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-1">
                        {editingCategory && (
                            <button onClick={() => {
                                setEditingCategory(null)
                                setName('')
                                setParent('')
                                setProperties([])
                            }} type="button" className="btn-default">Cancel</button>
                        )}
                        <button type="submit" className="btn-primary">Save</button>
                    </div>
                </form>
                {!editingCategory && (<table className="basic mt-4">
                    <thead>
                        <td>
                            Category name
                        </td>
                        <td>
                            Parent category
                        </td>
                    </thead>
                    <tbody>
                        {categories.length > 0 && categories.map((category, index) => (
                            <tr key={index}>
                                <td>{category.name}</td>
                                <td>{category?.parent?.name}</td>
                                <td>
                                    <div className="flex gap-2">
                                        <button onClick={() => editCategory(category)} className="btn-primary">Edit</button>
                                        <button onClick={() => deleteCategory(category)} className="btn-primary">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>)}

            </Layout>
        </>
    )
}

export default withSwal(({ swal }, ref) =>
    <Categories swal={swal} />
)