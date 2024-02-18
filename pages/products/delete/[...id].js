import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage() {

    const [productInfo, setProductInfo] = useState(null);

    const router = useRouter();
    const { id } = router.query;

    useEffect(() => {
        if (!id) return;
        axios.get('/api/products?id=' + id).then((res) => {
            setProductInfo(res.data.productById)
        })
    }, [id]);

    async function deleteProduct() {
        await axios.delete('/api/products?id=' + id)
        goBack()
    }

    function goBack() {
        router.push('/products')
    }

    return (
        <>

            <Layout>
                <h1>
                    Delete product&nbsp;"{productInfo?.title}"?
                </h1>

                <div className="flex gap-2">
                    <button className="btn-primary" onClick={deleteProduct} >Delete</button>
                    <button className="btn-default" onClick={goBack}>Cancel</button>
                </div>
            </Layout>
        </>
    )
}