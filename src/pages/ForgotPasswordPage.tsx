import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { axiosInstance } from "../services/api-client";
import { ClipLoader } from "react-spinners";

interface FormValues {
  email?: string;
  code?: string;
  password?: string;
  password2?: string;
}

const validationSchemas = [
  yup.object({
    email: yup
      .string()
      .email("Noto'g'ri elektron pochta")
      .required("Elektron pochta kiriting"),
  }),
  yup.object({
    code: yup.string().required("Kodini kiriting"),
  }),
  yup.object({
    password: yup
      .string()
      .required("Parol kiriting")
      .min(3, "Eng kami 3 ta belgi bo'lishi kerak"),
    password2: yup
      .string()
      .required("Parolni qaytadan kiriting!")
      .oneOf([yup.ref("password")], "Parol mos emas!"),
  }),
];

export function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      if (step === 0) {
        await axiosInstance.post("/user/forgot_password/", {
          email: values.email,
          step: 1,
        });
        setStep(1);
      } else if (step === 1) {
        await axiosInstance.post("/user/forgot_password/", {
          code: values.code,
          email: values.email,
          step: 2,
        });
        setStep(2);
      } else if (step === 2) {
        await axiosInstance.post("/user/forgot_password/", {
          password: values.password,
          email: values.email,
          step: 3,
        });
        navigate("/sign_in");
      }
    } catch (error) {
      console.error("Error handling form submission", error);
      toast.error("Xatolik yuz berdi, qaytadan urinib ko'ring!");
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      code: "",
      password: "",
    },
    validationSchema: validationSchemas[step],
    onSubmit: handleSubmit,
  });

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 pt-4">
            Parolni Tiklash
          </h2>
          <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
            <form className="space-y-6" onSubmit={formik.handleSubmit}>
              {step === 0 && (
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
              )}

              {step === 1 && (
                <div>
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    SMS Kodingiz
                  </label>
                  <div className="mt-2">
                    <input
                      id="code"
                      name="code"
                      type="text"
                      value={formik.values.code}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                      required
                      className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    {formik.touched.code && formik.errors.code ? (
                      <div className="text-red-500 text-sm">
                        {formik.errors.code}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {step === 2 && (
                <>
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Yangi Parol
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoComplete="new-password"
                        required
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
                      Parolni Tasdiqlang
                    </label>
                    <div className="mt-2">
                      <input
                        id="password2"
                        name="password2"
                        type="password"
                        value={formik.values.password2}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        autoComplete="new-password"
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      {formik.touched.password2 && formik.errors.password2 ? (
                        <div className="text-red-500 text-sm">
                          {formik.errors.password2}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm leading-6">
                  <a
                    onClick={() => navigate("/sign_in")}
                    className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                  >
                    Login
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <ClipLoader size={20} color="#ffffff" />
                      <span className="ml-2">Yuborilmoqda...</span>
                    </div>
                  ) : (
                    "Yuborish"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
