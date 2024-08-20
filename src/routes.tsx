import { createBrowserRouter } from "react-router-dom";
import Layout from "./pages/Layout";
import ErrorPage from "./pages/ErrorPage";
import { SignIn } from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import PaginatedItemsPage from "./pages/PaginatedItemsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartItmesPage from "./pages/CartItemsPage";
import CheckoutForm from "./components/CheckoutForm";
import PrivateRoute from "./utils/privateRouter";
import UserDetail from "./components/UserDetail";
import OrderDetails from "./components/OrderDetails";
import OrderHistory from "./components/OrderHistory";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <PaginatedItemsPage /> },
      { path: "product/:id", element: <ProductDetailPage /> },
      {
        path: "cart_items/:user_id",
        element: <PrivateRoute children={<CartItmesPage />} />,
      },
      {
        path: "checkout/",
        element: <PrivateRoute children={<CheckoutForm />} />,
      },
      {
        path: "order_detail/:orderId",
        element: <PrivateRoute children={<OrderDetails />} />,
      },
      {
        path: "order_history/",
        element: <PrivateRoute children={<OrderHistory />} />,
      },
      {
        path: "profile/",
        element: <PrivateRoute children={<UserDetail />} />,
      },
    ],
  },
  { path: "/sign_in", element: <SignIn /> },
  { path: "/register", element: <RegisterPage /> },
]);

export default router;
