import { Fragment, useState } from "react";
import { Dialog, Popover, Transition } from "@headlessui/react";
import {
  MagnifyingGlassIcon,
  ShoppingBagIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import SearchProducts from "./SearchProducts";
import useAllCategories from "../hooks/useAllCategories";
import useProductCategory from "../hooks/productsCategory";
import { toast } from "react-toastify";
import useAuthStore from "../context/useAuthContext";
import image from "../media/turfabazarlogo.jpg";
import useCartStore from "../context/useCartStore";

const currencies = ["UZS", "USD", "RUB", "EUR"];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function StoreNavigation() {
  const [open, setOpen] = useState(false);
  const [isChildActive, setIsChildActive] = useState(false);

  const { totalQuantity } = useCartStore();

  const setProductCategorySlug = useProductCategory(
    (s) => s.setProductCategory
  );

  const clearCategory = useProductCategory((s) => s.clearProductCategory);

  const handleCategoryClick = (categorySlug: string) => {
    setProductCategorySlug(categorySlug);
  };

  const { isAuthenticated, logout, userId } = useAuthStore();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/sign_in");
    toast.info("Siz muvaffaqiyatli chiqdingiz !");
  };

  const { data, error, isLoading } = useAllCategories();

  if (isLoading) return <div>Loading</div>;

  if (error) return <div>Error</div>;

  return (
    <>
      <SearchProducts
        isActive={isChildActive}
        onClick={() => setIsChildActive(!isChildActive)}
      />
      <div className="bg-white top-0 right-0 z-30 w-full">
        {/* Mobile menu */}

        <Transition.Root show={open} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-40 lg:hidden"
            onClose={setOpen}
          >
            {/* Dialog backdrop */}
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            {/* Mobile menu content */}
            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="flex w-full max-w-xs flex-col bg-white pb-12 shadow-xl">
                  <div className="flex px-4 pb-2 pt-5">
                    <button
                      type="button"
                      className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
                      onClick={() => setOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                    {/* Currency selector */}
                    <form>
                      <div className="inline-block">
                        <label htmlFor="mobile-currency" className="sr-only">
                          Currency
                        </label>
                        <div className="group relative -ml-2 rounded-md border-transparent focus-within:ring-2 focus-within:ring-white">
                          <select
                            id="mobile-currency"
                            name="currency"
                            className="flex items-center rounded-md border-transparent bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-gray-700 focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-800"
                          >
                            {currencies.map((currency) => (
                              <option key={currency}>{currency}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                            <ChevronDownIcon
                              className="h-5 w-5 text-gray-500"
                              aria-hidden="true"
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <header className="relative">
          <nav aria-label="Top">
            {/* Top navigation */}
            <div className="bg-gray-900">
              <div className="mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Currency selector */}
                <form className="hidden lg:block lg:flex-1">
                  <div className="flex">
                    <label htmlFor="desktop-currency" className="sr-only">
                      Currency
                    </label>
                    <div className="group relative -ml-2 rounded-md border-transparent bg-gray-900 focus-within:ring-2 focus-within:ring-white">
                      <select
                        id="desktop-currency"
                        name="currency"
                        className="flex items-center rounded-md border-transparent bg-gray-900 bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-white focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-100"
                      >
                        {currencies.map((currency) => (
                          <option key={currency}>{currency}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                        <ChevronDownIcon
                          className="h-5 w-5 text-gray-300"
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  </div>
                </form>

                <p className="flex-1 text-center text-sm font-medium text-white lg:flex-none">
                  Buyurtmangizni 1 kun ichida bepul yetkazib beramiz
                </p>

                <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                  {isAuthenticated ? null : (
                    <a
                      onClick={() => navigate("/register")}
                      className="text-sm font-medium text-white hover:text-gray-100 cursor-pointer"
                    >
                      {isAuthenticated ? "" : "Registratsiya"}
                    </a>
                  )}

                  <span className="h-6 w-px bg-gray-600" aria-hidden="true" />
                  {isAuthenticated ? (
                    <a
                      onClick={() => handleLogout()}
                      className="text-sm font-medium text-white hover:text-gray-100 cursor-pointer"
                    >
                      Chiqish
                    </a>
                  ) : (
                    <a
                      onClick={() => navigate("/sign_in")}
                      className="text-sm font-medium text-white hover:text-gray-100 cursor-pointer"
                    >
                      Kirish
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Secondary navigation */}
            <div className="bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="border-b border-gray-200">
                  <div className="flex h-16 items-center justify-between">
                    {/* Logo (lg+) */}
                    <div className="hidden lg:flex lg:items-center">
                      <a>
                        <img
                          className="h-8 w-auto cursor-pointer"
                          src={image}
                          onClick={() => {
                            navigate("/");
                            clearCategory();
                          }}
                        />
                      </a>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="flex items-center lg:ml-8">
                        <div className="flex space-x-8">
                          <div className="hidden lg:flex">
                            <a
                              className="-m-2 p-2 flex gap-2 text-gray-400 hover:text-gray-500 cursor-pointer"
                              onClick={() => setIsChildActive(!isChildActive)}
                            >
                              <MagnifyingGlassIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                              <span>Qidiruv</span>
                            </a>
                          </div>

                          <div className="flex">
                            <a
                              onClick={() => navigate("/profile")}
                              className="-m-2 p-2 flex gap-2 text-gray-400 hover:text-gray-500 cursor-pointer"
                            >
                              <UserIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                              <span>Shaxsiy ma'lumotlar</span>
                            </a>
                          </div>

                          <a
                            className="group -m-2 flex gap-2 items-center p-2 cursor-pointer"
                            onClick={() => navigate(`/cart_items/${userId}`)}
                          >
                            <ShoppingBagIcon
                              className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                              aria-hidden="true"
                            />
                            <span className=" text-sm font-medium text-gray-400 group-hover:text-gray-800">
                              {totalQuantity}
                            </span>
                            <span className="text-gray-400 group-hover:text-gray-800">
                              Savatdagi mahsulotlar
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* {Third navigation} */}

            <div className="bg-white">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className=" overflow-x-auto overflow-y-hidden scrollbar-hide">
                  <div className="flex h-16 items-center justify-between">
                    <div className="hidden h-full lg:flex">
                      {/* Make this div scrollable horizontally */}
                      <div className="ml-8 flex h-full space-x-8">
                        {data &&
                          data.map((category) => (
                            <Popover key={category.name} className="flex">
                              {({ open }) => (
                                <>
                                  <div className="relative flex">
                                    <Popover.Button
                                      className={classNames(
                                        open
                                          ? "border-indigo-600 text-indigo-600"
                                          : "border-transparent text-gray-700 hover:text-gray-800",
                                        "relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out whitespace-nowrap"
                                      )}
                                    >
                                      {category.name}
                                    </Popover.Button>
                                  </div>

                                  <Transition
                                    as={Fragment}
                                    enter="transition ease-out duration-200"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="transition ease-in duration-150"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                  >
                                    <Popover.Panel className="absolute inset-x-0 top-full text-gray-500 sm:text-sm">
                                      {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                      <div
                                        className="absolute inset-0 top-1/2 bg-white shadow"
                                        aria-hidden="true"
                                      />

                                      <div className="relative bg-white z-50">
                                        <div className="mx-auto max-w-7xl px-8">
                                          <div className="grid items-start gap-x-8 gap-y-10 pb-6 pt-4">
                                            <div className="grid gap-x-8 gap-y-10">
                                              <div>
                                                <button
                                                  key={category.id}
                                                  className="font-medium text-gray-900 cursor-pointer"
                                                  onClick={() =>
                                                    handleCategoryClick(
                                                      category.slug
                                                    )
                                                  }
                                                >
                                                  {category.name}
                                                </button>
                                                <ul
                                                  role="list"
                                                  className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4"
                                                >
                                                  {category.sub_category.map(
                                                    (item) => (
                                                      <li
                                                        key={item.id}
                                                        className="hover:text-gray-800 cursor-pointer"
                                                        onClick={() =>
                                                          handleCategoryClick(
                                                            item.slug
                                                          )
                                                        }
                                                      >
                                                        {item.name}
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </Popover.Panel>
                                  </Transition>
                                </>
                              )}
                            </Popover>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        </header>
      </div>
    </>
  );
}
