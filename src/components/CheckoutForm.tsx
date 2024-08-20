import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { axiosInstance } from "../services/api-client";
import useAuthStore from "../context/useAuthContext";
import * as yup from "yup";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DialogModal from "./Dialog";

interface OrderItem {
  id: string;
  order: string;
  product: string;
  status: string;
  quantity: number;
  unit_price: number;
  sub_total: number;
  confirmed: boolean;
}

interface Order {
  id: string;
  user: string;
  city: string;
  state: string;
  address: string;
  buy_cash: boolean;
  recive_by_deliver: boolean;
  email: string;
  order_items: OrderItem[];
}
const validationSchema = yup.object({
  email: yup
    .string()
    .email("Iltimos elektron Pochtangizni to'g'ri kiritng!")
    .required("Eletron pochtangizni kiriting!"),
  phone: yup.string().required("Iltimos telefon raqamingizni kiriting!"),
  state: yup.string().required("Iltimos viloyatingizni kiriting!"),
  city: yup.string().required("Tumaningizni kiriting!"),
  address: yup.string(),
  buy_cash: yup.boolean().required("To'lov turini tanlang!"),
  recive_by_deliver: yup.boolean().required("Qabul qilish usulini tanlang!"),
});

export default function CheckoutForm() {
  const { authTokens, userId } = useAuthStore();
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [dialogInput, setDialogInput] = useState("");
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    phone: "",
    city: "",
    state: "",
    address: "",
    buy_cash: null,
    recive_by_deliver: null,
  };

  const handleOrderStatus = async (orderId: string) => {
    try {
      const orderResponse = await axiosInstance.get<Order>(
        `/checkout/order_detail/${orderId}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );

      const order = orderResponse.data;
      console.log(order);

      const allConfirmed = order.order_items.every(
        (item: OrderItem) => item.confirmed === true
      );

      if (allConfirmed) {
        setVisible(false);
        localStorage.removeItem("orderId");
        localStorage.removeItem("orderInProgress");
        navigate(`/order_detail/${orderId}`);
        toast.success("Buyurtma amalga oshirildi", {
          position: "top-center",
        });
      } else {
        setVisible(false);
        await fetchCancelOrders(orderId);
        localStorage.removeItem("orderId");
        localStorage.removeItem("orderInProgress");
        navigate(`/cart_items/${userId}`);
        toast.error("Buyurtma amalga oshirilmadi", {
          position: "top-center",
        });
      }
    } catch (error) {
      console.error("Error fetching order status:", error);
    }
  };

  const confirmSMTP = async () => {
    setIsLoading(true);
    const order_id = localStorage.getItem("orderId");
    try {
      const response = await axiosInstance.post(
        `checkout/confirm_smtp/`,
        { smtp_code: dialogInput, order_id: order_id },
        {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );

      if (response.status === 201) {
        setVisible(false);
        localStorage.removeItem("progress");
        localStorage.removeItem("startTime");

        const redirectUrl = response.data["message"];
        if (formik.values.buy_cash) {
          navigate(`/order_detail/${order_id}/`);
        } else if (redirectUrl.startsWith("http")) {
          window.location.href = redirectUrl;
        } else {
          navigate(redirectUrl);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      toast.error("Xatolik yuz berdi", { position: "top-center" });
      console.error("Error during checkout:", error);
    }
  };

  const fetchCancelOrders = async (orderId: string) => {
    try {
      const response = await axiosInstance.get(
        `/checkout/cancel_order/${orderId}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );

      if (response.status === 200) {
        setVisible(false);
        localStorage.removeItem("orderId");
        localStorage.removeItem("orderInProgress");
      }
    } catch (error) {
      console.error("Error fetching order cancel:", error);
    }
  };

  const fetchCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `checkout/${userId}/`,
        formik.values,
        {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );

      if (response.status === 201) {
        setOrderId(response.data.orderId);
        localStorage.setItem("orderId", response.data.orderId);
        localStorage.setItem("orderInProgress", "true");
        localStorage.setItem("email", formik.values.email);
        setIsLoading(false);
        setVisible(true);

        setTimeout(async () => {
          if (orderId) {
            await axiosInstance.post(
              "checkout/cancel_order",
              { orderId },
              {
                headers: {
                  Authorization: `Bearer ${authTokens}`,
                },
              }
            );
            console.log("Order cancelled due to timeout");
            localStorage.removeItem("orderId");
            localStorage.removeItem("orderInProgress");
            setVisible(false);
            navigate(`/cart_items/${userId}`);
          }
        }, 180000);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error during checkout:", error);
    }
  };

  const changeOrderStatusToDelivered = async () => {
    try {
      const response = await axiosInstance.get(
        `/checkout/change_order_status/${orderId}/`,
        {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        }
      );

      if (response.status === 200) {
        localStorage.removeItem("orderId");
        localStorage.removeItem("orderInProgress");
      }
    } catch (error) {
      console.error("Error changing order status:", error);
    }
  };
  useEffect(() => {
    if (orderId) {
      const timerId = setTimeout(() => {
        changeOrderStatusToDelivered();
      }, 24 * 60 * 60 * 1000);

      return () => clearTimeout(timerId);
    }
  }, [orderId]);

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: fetchCheckout,
  });

  useEffect(() => {
    const allFieldsFilledExceptAddress = Object.entries(formik.values).every(
      ([key, value]) => {
        if (key === "address") {
          return true;
        }
        if (typeof value === "boolean") {
          return value !== null && value !== undefined;
        }
        return value !== "";
      }
    );

    if (formik.values.recive_by_deliver === true) {
      setIsSubmitEnabled(
        formik.values.address !== "" &&
          allFieldsFilledExceptAddress &&
          formik.isValid
      );
    }
    if (formik.values.recive_by_deliver === false) {
      setIsSubmitEnabled(allFieldsFilledExceptAddress && formik.isValid);
    }
  }, [formik.values, formik.isValid]);

  const email = localStorage.getItem("email");

  useEffect(() => {
    const storedOrderId = localStorage.getItem("orderId");
    const orderInProgress = localStorage.getItem("orderInProgress");

    if (storedOrderId && orderInProgress === "true") {
      setOrderId(storedOrderId);
      setVisible(true);
      setTimeout(() => handleOrderStatus(storedOrderId), 170000);
    }
  }, []);

  return (
    <>
      <DialogModal
        email={email || ""}
        isOpen={visible}
        setIsOpen={setVisible}
        onInputChange={setDialogInput}
        handleFetch={confirmSMTP}
      />
      <div className="bg-gray-50">
        <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
          <h2 className="sr-only">Checkout</h2>

          <form
            className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16"
            onSubmit={formik.handleSubmit}
          >
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Buyurtmani rasmiylashtirish
              </h2>

              <div className="mt-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Elektron pochta
                </label>
                <div className="mt-1">
                  <input
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Shaxsiy elektron pochtangizdan foydalaning!"
                    className={`block w-full rounded-md border-${
                      formik.errors.email ? "red" : "gray"
                    }-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Viloyat
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="state"
                        id="state"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.state}
                        className={`block w-full rounded-md border-${
                          formik.errors.state ? "red" : "gray"
                        }-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      />
                      {formik.touched.state && formik.errors.state ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.state}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Shahar / tuman
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.city}
                        className={`block w-full rounded-md border-${
                          formik.errors.city ? "red" : "gray"
                        }-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      />
                      {formik.touched.city && formik.errors.city ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.city}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  {formik.values.recive_by_deliver && (
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Manzil
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="address"
                          id="address"
                          placeholder="Kuryer topib borish ushun Uy manzilingizni to'g'ri kiriting!"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.address}
                          className={`block w-full rounded-md border-${
                            formik.errors.address ? "red" : "gray"
                          }-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Telefon raqam
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        name="phone"
                        id="phone"
                        placeholder="998XXxxxxxxx"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        className={`block w-full rounded-md border-${
                          formik.errors.phone ? "red" : "gray"
                        }-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                      />
                      {formik.touched.phone && formik.errors.phone ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.phone}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="m-2 border-gray-200 pt-10">
                  <div className="text-lg flex justify-center font-medium text-gray-900">
                    Qabul qilish usuli
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div
                      className={`relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none ${
                        formik.values.recive_by_deliver === false
                          ? "border-indigo-500"
                          : ""
                      }`}
                      onClick={() =>
                        formik.setFieldValue("recive_by_deliver", false)
                      }
                    >
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">
                            Tarqatish punkitidan olib ketish
                          </span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            Buyurtmani saqlash muddati 5 kun
                          </span>
                          <span className="mt-6 text-sm font-medium text-green-500">
                            bepul
                          </span>
                        </span>
                      </span>
                      {formik.values.recive_by_deliver === false && (
                        <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>

                    <div
                      className={`relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none ${
                        formik.values.recive_by_deliver === true
                          ? "border-indigo-500"
                          : ""
                      }`}
                      onClick={() =>
                        formik.setFieldValue("recive_by_deliver", true)
                      }
                    >
                      <span className="flex flex-1">
                        <span className="flex flex-col">
                          <span className="block text-sm font-medium text-gray-900">
                            Kuryer orqali eshikkacha
                          </span>
                          <span className="mt-1 flex items-center text-sm text-gray-500">
                            Yetkazib beramiz ertaga
                          </span>
                          <span className="mt-6 text-sm font-medium text-red-400">
                            30 000 so'm
                          </span>
                        </span>
                      </span>
                      {formik.values.recive_by_deliver === true && (
                        <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  </div>
                  {formik.errors.recive_by_deliver &&
                    formik.touched.recive_by_deliver && (
                      <div className="text-red-500 text-sm mt-2">
                        {formik.errors.recive_by_deliver}
                      </div>
                    )}
                </div>

                <div className="mt-10 border-t border-gray-200 pt-6 pb-6 px-2">
                  <h2 className="text-lg flex justify-center font-medium text-gray-900">
                    To'lov turi
                  </h2>

                  <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div
                      className={`relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none ${
                        formik.values.buy_cash === false
                          ? "border-indigo-500"
                          : ""
                      }`}
                      onClick={() => formik.setFieldValue("buy_cash", false)}
                    >
                      <span className="flex flex-1">
                        <span className="block text-sm font-medium text-gray-900">
                          Karta orqali onlayn
                        </span>
                      </span>
                      {formik.values.buy_cash === false && (
                        <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>

                    <div
                      className={`relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 shadow-sm focus:outline-none ${
                        formik.values.buy_cash === true
                          ? "border-indigo-500"
                          : ""
                      }`}
                      onClick={() => formik.setFieldValue("buy_cash", true)}
                    >
                      <span className="flex flex-1">
                        <span className="block text-sm font-medium text-gray-900">
                          Naqd pul yoki karta orqali qabul qilganda
                        </span>
                      </span>
                      {formik.values.buy_cash === true && (
                        <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  </div>
                  {formik.errors.buy_cash && formik.touched.buy_cash && (
                    <div className="text-red-500 text-sm mt-2">
                      {formik.errors.buy_cash}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <button
                    type="submit"
                    disabled={!isSubmitEnabled || isLoading}
                    className={
                      isSubmitEnabled || isLoading
                        ? "w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                        : "w-full rounded-md border border-transparent bg-indigo-300 px-4 py-3 text-base font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:ring-offset-2 focus:ring-offset-gray-50"
                    }
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <ClipLoader size={20} color="#ffffff" />
                        <span className="ml-2">Rasmiylashtirish...</span>
                      </div>
                    ) : (
                      "Buyurtmani rasmiylashtirish"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
