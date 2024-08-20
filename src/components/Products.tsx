import { Link, useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import useProductCategory from "../hooks/productsCategory";
import { FadeLoader } from "react-spinners";

export default function ProductsPage() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useProducts();
  const { productQuery } = useProductCategory();

  const filteredProducts = data?.filter((item) => {
    if (productQuery.slug) {
      return (
        item.subcategory?.slug === productQuery.slug ||
        item.category?.slug === productQuery.slug
      );
    }
    return true;
  });

  if (isLoading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <FadeLoader color="#4c51bf" />
      </div>
    );
  if (error) return <p className="p-12">Error Occured!</p>;

  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-8 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 pb-10">Tavsiyalar</h1>

          <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
            {filteredProducts?.map((product) => (
              <div className="relative" key={product.id}>
                <div className="relative h-72 w-full overflow-hidden rounded-lg">
                  <img
                    src={product.image}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                <div className="relative mt-4">
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-base font-medium text-gray-900">
                      {product.name}
                    </h3>
                  </Link>
                </div>
                <div className="absolute inset-x-0 top-0 flex h-72 items-end justify-end overflow-hidden rounded-lg p-4">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black opacity-50"
                  />
                  <p className="relative text-lg font-semibold text-white">
                    {product?.base_price !== undefined
                      ? `${new Intl.NumberFormat("en-US").format(
                          Number(product.base_price)
                        )} UZS`
                      : ""}
                  </p>
                </div>
                <p className="text-xs text-gray-600 h-8 line-clamp-2">
                  {product.description}
                </p>

                <div className="pt-6">
                  <a
                    onClick={() => navigate(`product/${product.id}`)}
                    className="cursor-pointer relative flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                  >
                    Savatga qo'shish
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
