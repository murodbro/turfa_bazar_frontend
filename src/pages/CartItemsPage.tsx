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
  product_variation: Variations;
}

interface CartItems extends Array<CartItem> {}

const CartItemsPage = () => {
  const navigate = useNavigate();
  const { authTokens, userId } = useAuthStore();
  const [cartItems, setCartItems] = useState<CartItems>([]);
  const { setCartItem, updateCartItems } = useCartStore();
  const [total, setTotal] = useState(0);

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

  const fetchAddCartItem = async (variationId: string) => {
    try {
      const response = await axiosInstance.patch(
        `cart/cart_items/${userId}/`,
        {
          variationId: variationId,
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
          item.product_variation.id === variationId
            ? {
                ...item,
                quantity: item.quantity + 1,
                sub_total: item.sub_total + item.product_variation.price,
              }
            : item
        );
        setCartItems(updatedCartItem);
        toast.info(response.data.message || "Xatolik yuz berdi");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Xatolik yuz berdi");
    }
  };

  const fetchRemoveCartItem = async (variationId: string) => {
    try {
      const response = await axiosInstance.patch(
        `cart/cart_items/${userId}/`,
        {
          variationId: variationId,
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
            item.product_variation.id === variationId
              ? item.quantity === 1
                ? null
                : {
                    ...item,
                    quantity: item.quantity - 1,
                    sub_total: item.sub_total - item.product_variation.price,
                  }
              : item
          )
          .filter((item): item is CartItem => item !== null);

        setCartItems(updatedCartItem);
        toast.info(response.data.message || "Xatolik yuz berdi");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Xatolik yuz berdi");
    }
  };

  const fetchDeleteCartItem = async (variationId: string) => {
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
            variationId: variationId,
          },
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );
      if (response.data.ok) {
        const updatedCartItem = cartItems.filter(
          (item) => item.product_variation.id !== variationId
        );
        setCartItems(updatedCartItem);
        toast.info(response.data.message || "Xatolik yuz berdi");
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Xatolik yuz berdi");
    }
  };

  useEffect(() => {
    setCartItems(cartItems);
    updateCartItems(cartItems);
  }, [cartItems]);

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const calculateTotals = () => {
    let subtotal = 0;
    cartItems.forEach((product) => {
      if (product.product_variation) {
        subtotal += product.product_variation.price * product.quantity;
      } else {
        subtotal += product.base_price * product.quantity;
      }
    });
    setTotal(subtotal);
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
                            className="h-10 w-10 rounded-md object-cover object-center sm:h-48 sm:w-48"
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

                              <div className="mt-1 flex gap-2 text-sm">
                                <span>Mahsulat turi: </span>
                                {product.product_variation &&
                                  product.product_variation.variation_values.map(
                                    (value) => (
                                      <>
                                        <p className="border-r border-gray-200 pr-2 text-gray-500">
                                          {value.value}
                                        </p>
                                      </>
                                    )
                                  )}
                              </div>
                              <p className="mt-1 text-sm font-medium text-gray-900">
                                {product.product_variation
                                  ? `${new Intl.NumberFormat("en-US").format(
                                      Number(product.product_variation.price)
                                    )} UZS`
                                  : `${new Intl.NumberFormat("en-US").format(
                                      Number(product.base_price)
                                    )} UZS`}
                              </p>

                              <div className="pt-4">
                                {product.product_variation &&
                                product.product_variation ? (
                                  <div className="space-y-6 text-sm text-green-600">
                                    Sotuvda {product.product_variation.stock}{" "}
                                    dona mavjud
                                  </div>
                                ) : (
                                  <div className="text-red-400 text-sm">
                                    Sotuvda mavjud emas
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:pr-9">
                              <div className="flex space-x-2 pt-8">
                                <button
                                  type="button"
                                  className="w-12 h-8 border-2 rounded border-gray-300 flex items-center justify-center"
                                  onClick={() =>
                                    fetchRemoveCartItem(
                                      product.product_variation.id
                                    )
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
                                    !product.product_variation ||
                                    product.quantity + 1 >
                                      product.product_variation.stock ||
                                    product.product_variation.stock === 0
                                  }
                                  className={
                                    !product.product_variation ||
                                    product.quantity + 1 >
                                      product.product_variation.stock ||
                                    product.product_variation.stock === 0
                                      ? "w-12 h-8 border-2 rounded border-gray-300 flex items-center justify-center cursor-not-allowed"
                                      : "w-12 h-8 border-2 rounded border-gray-300 flex items-center justify-center"
                                  }
                                  onClick={() =>
                                    fetchAddCartItem(
                                      product.product_variation.id
                                    )
                                  }
                                >
                                  <AddIcon style={{ color: "teal" }} />
                                </button>
                              </div>

                              <div className="absolute right-0 top-0">
                                <button
                                  onClick={() =>
                                    fetchDeleteCartItem(
                                      product.product_variation.id
                                    )
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
                {cartItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-t border-gray-200 pt-4"
                  >
                    <dt className="flex text-sm text-gray-800">
                      <span>{product.product}</span>
                    </dt>
                    <div>
                      <small>{product.quantity} Dona</small>
                    </div>
                    <dd className="text-sm font-medium text-gray-900">
                      {new Intl.NumberFormat("en-US").format(
                        product.product_variation
                          ? product.product_variation.price
                          : product.base_price * product.quantity
                      )}{" "}
                      UZS
                    </dd>
                  </div>
                ))}

                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">
                    Jami buyurtmangiz:
                  </dt>
                  <dd className="text-base font-medium text-gray-900">
                    {new Intl.NumberFormat("en-US").format(total)} UZS
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
