import { UserCircleIcon } from "@heroicons/react/24/solid";
import { axiosInstance } from "../services/api-client";
import { useEffect, useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import useAuthStore from "../context/useAuthContext";
import { useNavigate } from "react-router-dom";

interface FormValues {
  first_name: string;
  last_name?: string;
  email: string;
  phone?: string;
}

const validationSchema = yup.object({
  first_name: yup
    .string()
    .min(3, "3 ta harfdan ko'p bo'lgan ism kiritng!")
    .required("Iltimos ismingizni kiringing!"),
  last_name: yup.string(),
  email: yup
    .string()
    .email("Iltimos elektron Pochtangizni to'g'ri kiritng!")
    .required("Eletron pochtangizni kiriting!"),
  phone: yup.string().nullable(),
});

export default function UserDetail() {
  const navigate = useNavigate();

  const { authTokens } = useAuthStore();
  const [initialValues, setInitialValues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axiosInstance.get("user/profile/", {
          headers: {
            Authorization: `Bearer ${authTokens}`,
          },
        });
        setInitialValues({
          first_name: response.data.first_name || "",
          last_name: response.data.last_name || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
        });
      } catch (error: any) {
        console.error("Error response data:", error.response.data);
      }
    };

    fetchUserProfile();
  }, [authTokens]);

  const changeUserProfile = async (values: FormValues) => {
    try {
      await axiosInstance.put("user/profile/", values, {
        headers: {
          Authorization: `Bearer ${authTokens}`,
        },
      });
      toast.success("Muvaffaqiyatli bajarildi", {
        position: "top-center",
      });
    } catch (error: any) {
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else {
        console.error("Error message:", error.message);
      }
      toast.error("Xatolik yuz berdi", {
        position: "top-center",
      });
    }
  };

  const formik = useFormik<FormValues>({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      changeUserProfile(values);
    },
  });

  return (
    <div className="space-y-10 divide-y divide-gray-900/10 px-4 py-8 sm:px-6 md:px-36 md:py-28">
      <div className="grid grid-cols-1 gap-x-4 gap-y-4 pt-10 md:gap-x-8 md:gap-y-8 md:grid-cols-3">
        <div className="px-4 sm:px-0">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            <UserCircleIcon
              className="h-12 w-12 text-gray-300 pb-1"
              aria-hidden="true"
            />{" "}
            Shaxsiy ma'lumotlar
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Buyurtma amalga oshirish uchun telefon raqamingizni kiriting
          </p>
          <div className="flex pt-6">
            <button
              type="button"
              className="rounded-md bg-indigo-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={() => navigate("/order_history/")}
            >
              Buyurtmalar tarixi
            </button>
          </div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
        >
          <div className="px-4 py-6 sm:p-8">
            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Ism
                </label>
                <div className="mt-2">
                  <input
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    type="text"
                    name="first_name"
                    id="first_name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Familiya
                </label>
                <div className="mt-2">
                  <input
                    onBlur={formik.handleBlur}
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    type="text"
                    name="last_name"
                    id="last_name"
                    autoComplete="family-name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Elektron Pochta
                </label>
                <div className="mt-2">
                  <input
                    readOnly
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Telefon raqam
                </label>
                <div className="mt-2">
                  <input
                    onBlur={formik.handleBlur}
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    type="number"
                    name="phone"
                    id="phone"
                    placeholder="998XXXXXXX"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formik.dirty}
              className={
                !formik.dirty
                  ? "rounded-md bg-indigo-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  : "rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              }
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
