import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/20/solid";
import { Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../context/useAuthContext";
import { Order } from "./OrderDetails";
import { axiosInstance, baseURL } from "../services/api-client";
import { toast } from "react-toastify";
import emptyOrderImage from "../media/order_history.png";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function OrderHistory() {
  const navigate = useNavigate();
  const { authTokens } = useAuthStore();
  const [orderHistory, setOrder] = useState<Order[] | []>([]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const monthNames = [
      "yanvar",
      "fevral",
      "mart",
      "aprel",
      "may",
      "iyun",
      "iyul",
      "avgust",
      "sentabr",
      "oktabr",
      "noyabr",
      "dekabr",
    ];

    const day = date.getDate().toString().padStart(2, "0");
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${year}, ${day}-${month}, ${hours}:${minutes}`;
  };

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const orderResponse = await axiosInstance.get<Order[]>(
          `/checkout/history/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens}`,
            },
          }
        );
        setOrder(orderResponse.data);
      } catch (error) {
        toast.error("Error fetching order status:", {
          position: "top-center",
        });
      }
    };

    fetchOrderHistory();
  }, [authTokens]);

  return (
    <div className="bg-white">
      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
          <div className="mx-auto max-w-2xl px-4 lg:max-w-4xl lg:px-0">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Buyurtmalar tarixi
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Ohirgi buyurtmalarni tekshiring, holatini ko'ring va yangi
              haridlarini kashf qiling.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="sr-only">Recent orders</h2>
          <div className="mx-auto max-w-7xl sm:px-2 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-8 sm:px-4 lg:max-w-4xl lg:px-0">
              {orderHistory && orderHistory.length ? (
                orderHistory.map((order) => (
                  <div
                    key={order.id}
                    className="border-b border-t border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border"
                  >
                    <h3 className="sr-only">
                      Order placed on{" "}
                      <time>{formatDate(order.created_at)}</time>
                    </h3>

                    <div className="flex items-center border-b border-gray-200 p-4 sm:grid sm:grid-cols-4 sm:gap-x-6 sm:p-6">
                      <dl className="grid flex-1 grid-cols-2 gap-x-6 text-sm sm:col-span-4 sm:grid-cols-4 lg:col-span-2">
                        <div>
                          <dt className="font-medium text-gray-900">
                            Buyurtma raqami
                          </dt>
                          <dd className="mt-1 text-indigo-400">
                            #{order.order_code}
                          </dd>
                        </div>
                        <div className="hidden sm:block">
                          <dt className="font-medium text-gray-900">Sanasi</dt>
                          <dd className="mt-1 text-gray-500">
                            <time>{formatDate(order.created_at)}</time>
                          </dd>
                        </div>

                        <div>
                          <dt className="font-medium text-gray-900">
                            Jami summa
                          </dt>
                          <dd className="mt-1 font-medium text-gray-900">
                            {new Intl.NumberFormat("en-US").format(
                              order.order_items.reduce(
                                (acc, item) => acc + item.sub_total,
                                0
                              ) + (order.recive_by_deliver ? 30000 : 0)
                            )}{" "}
                            UZS
                          </dd>
                        </div>
                      </dl>
                      <div>
                        <dt className="font-medium text-gray-900">
                          Eltib berish
                        </dt>
                        <dd className="mt-1 font-medium text-gray-900">
                          {order.recive_by_deliver ? (
                            <b className="px-2 text-sm font-medium text-red-400">
                              30,000 UZS
                            </b>
                          ) : (
                            <b className="px-2 text-sm font-medium text-green-400">
                              bepul
                            </b>
                          )}
                        </dd>
                      </div>

                      <Menu
                        as="div"
                        className="relative flex justify-end lg:hidden"
                      >
                        <div className="flex items-center">
                          <Menu.Button className="-m-2 flex items-center p-2 text-gray-400 hover:text-gray-500">
                            <EllipsisVerticalIcon
                              className="h-6 w-6"
                              aria-hidden="true"
                            />
                          </Menu.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="py-1">
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    View
                                  </a>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    className={classNames(
                                      active
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700",
                                      "block px-4 py-2 text-sm"
                                    )}
                                  >
                                    Invoice
                                  </a>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>

                    {/* Products */}
                    <h4 className="sr-only">Items</h4>
                    <ul role="list" className="divide-y divide-gray-200">
                      {order.order_items.map((product) => (
                        <li key={product.id} className="p-4 sm:p-6">
                          <div className="flex items-center sm:items-start">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-200 sm:h-40 sm:w-40">
                              <img
                                src={`${baseURL}${product.image}`}
                                className="h-full w-full object-cover object-center"
                              />
                            </div>
                            <div className="ml-6 flex-1 text-sm">
                              <div className="font-medium text-gray-900 sm:flex sm:justify-between">
                                <h5>{product.product}</h5>
                                <p className="mt-2 sm:mt-0">
                                  {new Intl.NumberFormat("en-US").format(
                                    product.unit_price
                                  )}{" "}
                                  UZS
                                </p>
                              </div>
                              <div className="flex flex-col gap-3">
                                <p className="hidden text-gray-500 sm:mt-2 sm:block">
                                  {product.description}
                                </p>

                                <h5>
                                  <b>Soni: </b>
                                  {product.quantity} ta
                                </h5>
                                <h5>
                                  <b>Jami: </b>
                                  {new Intl.NumberFormat("en-US").format(
                                    product.sub_total
                                  )}{" "}
                                  UZS
                                </h5>
                                <h5>
                                  <b>To'lov turi: </b>
                                  {order.buy_cash ? (
                                    <b className="px-2 text-sm font-medium text-indigo-400">
                                      Naqt pul
                                    </b>
                                  ) : (
                                    <b className="px-2 text-sm font-medium text-indigo-400">
                                      Plastik karta
                                    </b>
                                  )}
                                </h5>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 sm:flex sm:justify-between">
                            <div className="flex items-center">
                              {product.status === "Bekor qilindi" ? (
                                <XCircleIcon
                                  className="h-5 w-5 text-red-500"
                                  aria-hidden="true"
                                />
                              ) : product.status === "Kutilmoqda" ? (
                                <ExclamationCircleIcon
                                  className="h-5 w-5 text-yellow-500"
                                  aria-hidden="true"
                                />
                              ) : (
                                <CheckCircleIcon
                                  className="h-5 w-5 text-green-500"
                                  aria-hidden="true"
                                />
                              )}

                              <div className="flex gap-4">
                                <p className="ml-2 text-sm font-medium text-gray-500">
                                  {product.status}
                                </p>
                                <time>{formatDate(order.created_at)}</time>
                              </div>
                            </div>

                            <div className="mt-6 flex items-center space-x-4 divide-x divide-gray-200 border-t border-gray-200 pt-4 text-sm font-medium sm:ml-4 sm:mt-0 sm:border-none sm:pt-0">
                              <div className="flex flex-1 justify-center pl-4">
                                <a
                                  onClick={() =>
                                    navigate(`/product/${product.product_id}`)
                                  }
                                  className="whitespace-nowrap text-indigo-600 cursor-pointer hover:text-indigo-500"
                                >
                                  Yana harid qilish
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="flex flex-col py-4 gap-4 items-center justify-center">
                  <Image
                    src={emptyOrderImage}
                    alt="Description of the image"
                    boxSize="200px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  <p className="text-lg font-medium text-gray-900">
                    Buyurtmalar tarixi mavjud emas!
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
