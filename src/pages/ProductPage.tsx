import { useParams } from "react-router-dom"

const ProductPage = () => {
    const { id } = useParams<{id: string}>()
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Product Details</h1>
      <p className="mt-2 text-slate-600">Viewing product ID: {id}</p>
    </div>
  )
}

export default ProductPage