import { useNavigate, useParams } from "react-router-dom";
import Alert from "./Alert";
import { useEffect, useState } from "react";
import { axiosInstance, baseURL } from "../services/api-client";
import useAuthStore from "../context/useAuthContext";

export interface OrderItem {
  id: string;
  product_id: string;
  order: string;
  product: string;
  status: string;
  quantity: number;
  unit_price: number;
  sub_total: number;
  image: string;
  description: string;
}

export interface Order {
  id: string;
  user: string;
  city: string;
  state: string;
  address: string;
  buy_cash: boolean;
  recive_by_deliver: boolean;
  email: string;
  phone: string;
  order_code: string;
  order_items: OrderItem[];
  created_at: string;
}

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams<{ orderId: string }>();
  const { authTokens } = useAuthStore();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    localStorage.removeItem("orderId");
    localStorage.removeItem("orderInProgress");

    const fetchOrder = async () => {
      try {
        const orderResponse = await axiosInstance.get<Order>(
          `/checkout/order_detail/${orderId}/`,
          {
            headers: {
              Authorization: `Bearer ${authTokens}`,
            },
          }
        );
        setOrder(orderResponse.data);
      } catch (error) {
        console.error("Error fetching order status:", error);
      }
    };

    fetchOrder();
  }, [authTokens]);

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl pb-4">
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-5xl">
            Buyurtmangiz uchun rahmat
          </p>
          <p className="mt-2 text-base text-gray-500">
            Sizning buyurtmangiz 1 kundan ketin yetkazib beriladi, buyurtma
            raqami:
          </p>
          <p className="mt-2 text-xl text-green-500">#{order?.order_code}</p>
        </div>
        <Alert />

        <div className="mt-10 border-t border-gray-200">
          {order &&
            order.order_items.map((item) => (
              <div
                key={item.id}
                className="flex space-x-6 border-b border-gray-200 py-10"
              >
                <img
                  src={`${baseURL}${item.image}`}
                  className="h-20 w-20 flex-none rounded-lg bg-gray-100 object-cover object-center sm:h-40 sm:w-40"
                  alt={item.product}
                />
                <div className="flex flex-auto flex-col">
                  <div>
                    <h4 className="font-medium text-gray-900 cursor-pointer hover:text-gray-500">
                      <a
                        onClick={() => navigate(`/product/${item.product_id}`)}
                      >
                        {item.product}
                      </a>
                    </h4>
                    <p className="mt-2 text-sm text-gray-600">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-6 flex flex-col space-y-2">
                    <div className="flex">
                      <dt className="font-medium text-gray-900">Miqdori:</dt>
                      <dd className="ml-2 text-gray-700">{item.quantity} ta</dd>
                    </div>
                    <div className="flex">
                      <div className="flex">
                        <dt className="font-medium text-gray-900">Narxi:</dt>
                        <dd className="ml-2 text-gray-700">
                          <dd className="ml-2 text-gray-700">
                            {new Intl.NumberFormat("en-US").format(
                              item.unit_price
                            )}{" "}
                            UZS
                          </dd>
                        </dd>
                      </div>
                      <div className="flex pl-4 sm:pl-4">
                        <dt className="font-medium text-gray-900">Jami:</dt>
                        <dd className="ml-2 text-gray-700">
                          <dd className="ml-2 text-gray-700">
                            {new Intl.NumberFormat("en-US").format(
                              item.sub_total
                            )}{" "}
                            UZS
                          </dd>
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

          <div className="sm:ml-40 sm:pl-6">
            <h3 className="sr-only">Your information</h3>
            <h4 className="sr-only">Addresses</h4>
            <dl className="grid grid-cols-2 gap-x-6 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">Buyurtma manzili</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">{order?.state}</span>
                    <span className="block">{order?.city}</span>
                    <span className="block">{order?.address}</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Buyurtmachi</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">{order?.email}</span>
                    <span className="block">{order?.phone}</span>
                  </address>
                </dd>
              </div>
            </dl>

            <h4 className="sr-only">To'lov</h4>
            <dl className="grid grid-cols-2 gap-x-6 border-t border-gray-200 py-10 text-sm">
              <div>
                <dt className="font-medium text-gray-900">To'lov turi</dt>
                <dd className="mt-2 text-gray-700">
                  {order?.buy_cash ? (
                    <p>Naqd pul yoki karta orqali qabul qilganda</p>
                  ) : (
                    <>
                      <p>uzcard | humo</p>
                      <p>
                        <span className="sr-only">Ending in </span>9860
                        <span aria-hidden="true">••••</span>
                      </p>
                    </>
                  )}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">
                  Qabul qilish usuli va yetkazib berish manzili:
                </dt>
                <dd className="mt-2 text-gray-700">
                  {order?.recive_by_deliver ? (
                    <>
                      <p>Kuryer orqali yetkazib berish</p>
                      <b className="mt-6 text-sm font-medium text-red-400">
                        30,000 so'm
                      </b>
                    </>
                  ) : (
                    <>
                      <p>
                        Punkitdan olib ketish. Buyurtmani saqlash muddati 5 kun
                      </p>
                      <b className="text-green-500">bepul</b>
                    </>
                  )}
                </dd>
              </div>
            </dl>

            <h3 className="sr-only">Summary</h3>
            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-start gap-4">
                <dt className="font-medium text-xl text-gray-900">Jami:</dt>
                <dd className="text-gray-900 text-xl">
                  {order && (
                    <>
                      {new Intl.NumberFormat("en-US").format(
                        order.order_items.reduce(
                          (acc, item) => acc + item.sub_total,
                          0
                        ) + (order.recive_by_deliver ? 30000 : 0)
                      )}{" "}
                      UZS
                    </>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/")}
          type="button"
          className="mb-6 rounded-md border bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
        >
          Yana harid qilish
        </button>
      </div>
    </div>
  );
}
