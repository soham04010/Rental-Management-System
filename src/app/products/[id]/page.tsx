// app/product/[id]/page.jsx
import ProductDetailClient from "./ProductDetailClient";

export default async function ProductPage( params: { id: any; } ) {
  const { id } = params;
  console.log("Fetching product with id:", id);

  const res = await fetch(`http://localhost:5000/api/rentals/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    console.log("Product not found or error:", res.status);
    return <div>Product not found</div>;
  }

  const product = await res.json();
  return <ProductDetailClient product={product} />;
}
