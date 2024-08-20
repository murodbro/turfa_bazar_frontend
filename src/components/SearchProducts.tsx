import { Fragment, useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import useProducts from "../hooks/useProducts";
import { FadeLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

const DialogTransition: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Transition.Child
    enter="ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    {children}
  </Transition.Child>
);

interface Props {
  isActive: boolean;
  onClick: () => void;
}

export default function SearchProducts({ isActive, onClick }: Props) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data, isLoading, error } = useProducts();

  if (isLoading)
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
        <FadeLoader color="#4c51bf" />
      </div>
    );
  if (error) return <p className="p-12">Error Occured!</p>;

  const filteredProducts =
    query === ""
      ? []
      : data?.filter((product) => {
          return product.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root
      show={isActive}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className="relative z-40" onClose={onClick}>
        <DialogTransition>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </DialogTransition>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <DialogTransition>
            <Dialog.Panel className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox
                onChange={(selectedValue) => {
                  const selectedProduct = data?.find(
                    (product) => product.name === selectedValue
                  );
                  if (selectedProduct) {
                    navigate(`/product/${selectedProduct.id}`);
                  }
                }}
              >
                <div className="relative">
                  <MagnifyingGlassIcon
                    className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {filteredProducts && filteredProducts?.length > 0 && (
                  <Combobox.Options
                    static
                    className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
                  >
                    {filteredProducts?.map((product) => (
                      <Combobox.Option
                        key={product.id}
                        value={product.name}
                        className={({ active }) =>
                          classNames(
                            "cursor-default select-none px-4 py-2",
                            active && "bg-indigo-600 text-white"
                          )
                        }
                      >
                        <div className="flex gap-4">
                          <img src={product.image} style={{ width: "35px" }} />
                          {product.name}
                        </div>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}

                {query !== "" && filteredProducts?.length === 0 && (
                  <p className="p-4 text-sm text-gray-500">
                    Hech narsa topilmadi.
                  </p>
                )}
              </Combobox>
            </Dialog.Panel>
          </DialogTransition>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
