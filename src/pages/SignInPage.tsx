import { useNavigate } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import { FormikErrors, FormikHelpers, useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import useAuthStore from "../context/useAuthContext";
import image from "../media/turfabazarlogo.jpg";

interface FormValues {
  email: string;
  password: string;
}

interface CustomFormikErrors extends FormikErrors<FormValues> {
  general?: string[];
}

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Iltimos elektron Pochtangizni to'g'ri kiritng!")
    .required("Elektron pochtangizni kiriting!"),
  password: yup
    .string()
    .required("Parol kiriting")
    .min(3, "Eng kami 3 ta belgi bo'lishi kerak"),
});

export function SignIn() {
  const navigate = useNavigate();
  const { mutate: login } = useLogin();
  const { login: authLogin } = useAuthStore();

  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (
      values,
      { setSubmitting, setErrors }: FormikHelpers<FormValues>
    ) => {
      setErrors({});

      login(values, {
        onSuccess: (response) => {
          localStorage.setItem("authTokens", response["access_token"]);
          localStorage.setItem("authTokensRefresh", response["refresh_token"]);
          navigate("/");
          authLogin(response["access_token"], response["refresh_token"]);
          toast.success("Xush kelibsiz !", {
            position: "top-center",
            hideProgressBar: true,
            theme: "colored",
            autoClose: 2000,
          });
        },
        onError: (error: any) => {
          if (error.response && error.response.data) {
            const errorData = error.response.data;
            const formErrors: CustomFormikErrors = {};

            if (Array.isArray(errorData)) {
              formErrors.general = errorData;
            } else {
              // Assuming error response structure has field-wise errors
              for (const key in errorData) {
                if (errorData.hasOwnProperty(key)) {
                  formErrors[key as keyof FormValues] = errorData[key];
                }
              }
            }

            setErrors(formErrors);
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
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-10 w-auto cursor-pointer"
            src={image}
            alt="Your Company"
            onClick={() => navigate("/")}
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Shaxsiy hisobga kirish
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

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    autoComplete="current-password"
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

              <div className="flex items-center justify-between">
                <div className="text-sm leading-6">
                  <a
                    onClick={() => navigate("/register")}
                    className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                  >
                    Registratsiya
                  </a>
                </div>
                <div className="text-sm leading-6">
                  <a
                    onClick={() => navigate("/forgot_password")}
                    className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer"
                  >
                    Parolni unutdim
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  Kirish
                </button>
              </div>
            </form>

            <div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                      fill="#EA4335"
                    />
                    <path
                      d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.70499L1.27497 6.60999C0.464966 8.19995 0 10.0499 0 11.9999C0 13.9499 0.464966 15.7999 1.27497 17.39L5.26498 14.2949Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.0003 23.9998C15.1753 23.9998 17.8703 22.9398 19.9453 21.0998L16.0803 18.0998C15.0503 18.7898 13.6603 19.2498 12.0003 19.2498C8.87028 19.2498 6.21525 17.1398 5.27028 14.2948L1.28027 17.3898C3.25527 21.3098 7.31028 23.9998 12.0003 23.9998Z"
                      fill="#34A853"
                    />
                  </svg>
                  Google
                </a>
                <a
                  href="#"
                  className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent"
                >
                  <svg
                    className="h-5 w-5"
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M23.998 24V23.999H24V14.564C24 10.454 23.146 7.267 18.209 7.267C16.063 7.267 14.634 8.435 14.095 9.416H14.04V7.559H9.351V24H14.22V15.282C14.22 13.324 14.594 11.429 17.01 11.429C19.395 11.429 19.435 13.858 19.435 15.409V24H23.998Z"
                      fill="#1877F2"
                    />
                    <path
                      d="M0.399994 7.55999H5.28002V24H0.399994V7.55999Z"
                      fill="#1877F2"
                    />
                    <path
                      d="M2.84001 0C1.27201 0 0 1.272 0 2.84C0 4.408 1.27201 5.68 2.84001 5.68C4.40801 5.68 5.68001 4.408 5.68001 2.84C5.68001 1.272 4.40801 0 2.84001 0Z"
                      fill="#1877F2"
                    />
                  </svg>
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
