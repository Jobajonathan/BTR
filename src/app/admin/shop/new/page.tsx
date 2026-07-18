import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <>
      <div className="admin-topbar"><h1>New Product</h1></div>
      <div className="admin-content">
        <ProductForm product={{ title: "", description: "", price: null, currency: "GBP", product_type: "merch", cover_image_url: "", buy_link: "", status: "draft", order_index: 0 }} />
      </div>
    </>
  );
}
