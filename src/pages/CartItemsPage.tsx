import { XMarkIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance, baseURL } from "../services/api-client";
import useAuthStore from "../context/useAuthContext";
import { Image } from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import emptyImage from "../media/empty cart.png";
import { toast } from "react-toastify";
import useCartStore from "../context/useCartStore";
import { Variations } from "../hooks/useProduct";

export interface CartItem {
  id: string;
  user: string;
  product_id: string;
  product: string;
  quantity: number;
  sub_total: number;
  image: string;
  base_price: number;
  variations: Variations;
}

interface CartItems extends Array<CartItem> {}

const CartItemsPage = () => {
  const navigate = useNavigate();
  const { authTokens, userId } = useAuthStore();

  const [cartItems, setCartItems] = useState<CartItems>([]);

  const [subTotal, setSubTotal] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [grandTotal, setGrandTotal] = useState<number>(0);

  const { setCartItem, updateCartItems } = useCartStore();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await axiosInstance.get<CartItems>(
          `cart/cart_items/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authTokens}`,
            },
          }
        );
        setCartItems(response.data);
        setCartItem(response.data);
      } catch (error: any) {
        toast.error("Xatolik yuz berdi !");
      }
    };
    fetchCartItems();
  }, [authTokens, userId]);

  const fetchAddCartItem = async (productId: string) => {
    try {
      const response = await axiosInstance.patch(
        `cart/cart_items/${userId}/`,
        {
          productId: productId,
          action: "adding",
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );
      if (response.data.ok) {
        const updatedCartItem = cartItems.map((item) =>
          item.product_id === productId
            ? {
                ...item,
                quantity: item.quantity + 1,
                sub_total: item.sub_total + item.base_price,
              }
            : item
        );
        setCartItems(updatedCartItem);
        calculateSumm(updatedCartItem);
        toast.info(response.data.message || "Xatolik yuz berdi");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Xatolik yuz berdi");
    }
  };

  const fetchRemoveCartItem = async (productId: string) => {
    try {
      const response = await axiosInstance.patch(
        `cart/cart_items/${userId}/`,
        {
          productId: productId,
          action: "remove",
        },
        {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );
      if (response.data.ok) {
        const updatedCartItem = cartItems
          .map((item) =>
            item.product_id === productId
              ? item.quantity === 1
                ? null
                : {
                    ...item,
                    quantity: item.quantity - 1,
                    sub_total: item.sub_total - item.base_price,
                  }
              : item
          )
          .filter((item): item is CartItem => item !== null);

        setCartItems(updatedCartItem);
        calculateSumm(updatedCartItem);
        toast.info(response.data.message || "Xatolik yuz berdi");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Xatolik yuz berdi");
    }
  };

  const fetchDeleteCartItem = async (productId: string) => {
    const userConfirmed = window.confirm(
      "Mahulot savatdan olib tashlansinmi ?"
    );

    if (!userConfirmed) {
      return;
    }

    try {
      const response = await axiosInstance.delete(
        `cart/cart_items/${userId}/`,
        {
          data: {
            productId: productId,
          },
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );
      if (response.data.ok) {
        const updatedCartItem = cartItems.filter(
          (item) => item.product_id !== productId
        );
        setCartItems(updatedCartItem);
        calculateSumm(updatedCartItem);
        toast.info(response.data.message || "Xatolik yuz berdi");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Xatolik yuz berdi");
    }
  };

  useEffect(() => {
    setCartItems(cartItems);
    calculateSumm(cartItems);
    updateCartItems(cartItems);
  }, [cartItems]);

  const calculateSumm = (cartItems: CartItems) => {
    const subTotal = parseFloat(
      cartItems
        ? cartItems.reduce((acc, item) => acc + item.sub_total, 0).toFixed(2)
        : "0.00"
    );
    const discount = parseFloat((subTotal * 0.02).toFixed(2));
    const grandTotal = parseFloat((subTotal - discount).toFixed(2));

    setSubTotal(subTotal);
    setDiscount(discount);
    setGrandTotal(grandTotal);
  };

  return (
    <>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-2 sm:px-6 lg:max-w-7xl lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Savatingiz
          </h1>
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-8">
              <div>
                <ul
                  role="list"
                  className="divide-y divide-gray-200  border-t border-gray-200"
                >
                  {cartItems && cartItems.length > 0 ? (
                    cartItems.map((product) => (
                      <li key={product.id} className="flex py-6 sm:py-10">
                        <div className="flex-shrink-0">
                          <img
                            src={`${baseURL}${product.image}`}
                            className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                          />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                          <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-sm">
                                  <a
                                    className="font-medium text-gray-700 hover:text-gray-800 cursor-pointer"
                                    onClick={() =>
                                      navigate(`/product/${product.product_id}`)
                                    }
                                  >
                                    {product.product}
                                  </a>
                                </h3>
                              </div>
                              <div className="mt-1 flex text-sm">
                                <p className="text-gray-500">sariq</p>

                                <p className="ml-4 border-l border-gray-200 pl-4 text-gray-500">
                                  2xl
                                </p>
                              </div>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {product.base_price !== undefined
                                  ? `${new Intl.NumberFormat("en-US").format(
                                      Number(product.base_price)
                                    )} UZS`
                                  : ""}
                              </p>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:pr-9">
                              <div className="flex space-x-2 pt-8">
                                <button
                                  type="button"
                                  className="w-12 h-8 border-2 rounded border-gray-300 flex items-center justify-center"
                                  onClick={() =>
                                    fetchRemoveCartItem(product.product_id)
                                  }
                                >
                                  <MinusIcon style={{ color: "teal" }} />
                                </button>

                                <span className="w-12 h-8 flex items-center justify-center border-2 border-gray-300 rounded text-teal-700">
                                  {product.quantity}
                                </span>

                                <button
                                  type="button"
                                  disabled={
                                    !product.variations ||
                                    product.quantity + 1 >
                                      product.variations.stock ||
                                    product.variations.stock === 0
                                  }
                                  className={
                                    !product.variations ||
                                    product.quantity + 1 >
                                      product.variations.stock ||
                                    product.variations.stock === 0
                                      ? "w-12 h-8 border-2 rounded border-gray-300 flex items-center justify-center cursor-not-allowed"
                                      : "w-12 h-8 border-2 rounded border-gray-300 flex items-center justify-center"
                                  }
                                  onClick={() =>
                                    fetchAddCartItem(product.product_id)
                                  }
                                >
                                  <AddIcon style={{ color: "teal" }} />
                                </button>
                              </div>

                              <div className="absolute right-0 top-0">
                                <button
                                  onClick={() =>
                                    fetchDeleteCartItem(product.product_id)
                                  }
                                  type="button"
                                  className="-m-2 inline-flex  text-gray-400 hover:text-red-500"
                                >
                                  <XMarkIcon
                                    className="h-8 w-8"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>
                            </div>
                          </div>

                          <p
                            className={
                              product.variations && product.variations.stock
                                ? "mt-4 flex space-x-2 text-sm text-gray-700"
                                : "mt-4 flex space-x-2 text-sm text-red-700"
                            }
                          >
                            {product.variations && product.variations.stock ? (
                              <span>{`Sotuvda ${product.variations.stock} dona bor`}</span>
                            ) : (
                              <span>Sotuvda mavjud emas!</span>
                            )}
                          </p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="flex flex-col py-4 gap-4 items-center justify-center">
                      <Image
                        src={emptyImage}
                        alt="Description of the image"
                        boxSize="200px"
                        objectFit="cover"
                        borderRadius="md"
                      />
                      <p className="text-lg font-medium text-gray-900">
                        Savatda hozircha mahsulot yo'q
                      </p>
                      <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="rounded-md bg-indigo-600 m-4 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                      >
                        Bosh sahifa
                      </button>
                    </div>
                  )}
                </ul>
              </div>
            </section>

            <div className="lg:col-span-4 lg:sticky lg:top-0 ">
              <h2
                id="summary-heading"
                className="text-lg font-medium text-gray-900"
              >
                Buyurtma haqida
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Jami haridingiz:</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("en-US").format(Number(subTotal))}{" "}
                    UZS
                  </dd>
                </div>

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex text-sm text-gray-600">
                    <span>Chegirma 2 % :</span>
                    <a
                      href="#"
                      className="ml-2 flex-shrink-0 text-gray-400 hover:text-gray-500"
                    ></a>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {new Intl.NumberFormat("en-US").format(Number(discount))}{" "}
                    UZS
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Jami buyurtmangiz:
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {new Intl.NumberFormat("en-US").format(Number(grandTotal))}{" "}
                    UZS
                  </dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={!cartItems || cartItems.length === 0}
                  onClick={() => navigate("/checkout")}
                  className={
                    !cartItems || cartItems.length === 0
                      ? "w-full rounded-md border border-transparent bg-indigo-300 px-4 py-3 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 cursor-not-allowed"
                      : "w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                  }
                >
                  Rasmiylashtirish
                </button>
                <button
                  onClick={() => navigate("/")}
                  type="button"
                  className="w-full flex-1 items-center justify-center rounded-md border border-indigo-600 bg-transparent px-8 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-50 sm:w-full"
                >
                  Xarid qilish
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CartItemsPage;
