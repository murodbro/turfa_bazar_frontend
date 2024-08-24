import React from "react";
import { useNavigate } from "react-router-dom";
import { FormikErrors, FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import useRegister from "../hooks/useRegister";
import image from "../media/turfabazarlogo.jpg";

interface FormValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password2: string;
}

interface CustomFormikErrors extends FormikErrors<FormValues> {
  general?: string[];
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
    .required("Elektron pochtangizni kiriting!"),
  password: yup
    .string()
    .required("Parol kiriting")
    .min(3, "Eng kami 3 ta belgi bo'lishi kerak"),
  password2: yup
    .string()
    .required("Parolni qaytadan kiriting!")
    .oneOf([yup.ref("password")], "Parol mos emas!"),
});

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutate: register } = useRegister();

  const formik = useFormik<FormValues>({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password2: "",
    },
    validationSchema,
    onSubmit: (
      values,
      { setSubmitting, setErrors }: FormikHelpers<FormValues>
    ) => {
      setErrors({});

      register(values, {
        onSuccess: () => {
          navigate("/sign_in");
          toast.success("Muvaffaqiyatli bajarildi", {
            position: "top-center",
            hideProgressBar: true,
            theme: "colored",
          });
        },
        onError: (error: any) => {
          if (error.response && error.response.data) {
            setErrors(error.response.data as CustomFormikErrors);
          } else {
            setErrors({
              general: ["Serverda xatolik yuz berdi!"],
            } as CustomFormikErrors);
          }
        },
      });

      setSubmitting(false);
    },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img className="mx-auto h-10 w-auto" src={image} alt="Your Company" />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Registratsiyadan o'tish
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          {((formik.errors as CustomFormikErrors).general ?? []).map(
            (error, index) => (
              <div className="mb-4 text-center text-red-500" key={index}>
                {error}
              </div>
            )
          )}
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div>
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Ism
                </label>
                <div className="mt-2">
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="ism"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {formik.touched.first_name && formik.errors.first_name ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.first_name}
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Familiya
                </label>
                <div className="mt-2">
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="familiya"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {formik.touched.last_name && formik.errors.last_name ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.last_name}
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Elektron pochta
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Parol
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.password}
                    </div>
                  ) : null}
                </div>
              </div>
              <div>
                <label
                  htmlFor="password2"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tasdiqlash Paroli
                </label>
                <div className="mt-2">
                  <input
                    id="password2"
                    name="password2"
                    type="password"
                    value={formik.values.password2}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  {formik.touched.password2 && formik.errors.password2 ? (
                    <div className="text-red-500 text-sm">
                      {formik.errors.password2}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm leading-6">
                <a
                  onClick={() => navigate("/sign_in")}
                  className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                >
                  ro'yxatdan o'tganman
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                disabled={!formik.isValid || formik.isSubmitting}
              >
                Registratsiya
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
