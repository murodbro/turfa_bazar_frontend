import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../context/useAuthContext";
import { toast } from "react-toastify";

interface Props {
  email: string;
  isOpen: boolean;
  handleFetch: () => void;
  setIsOpen: (boolean: boolean) => void;
  onInputChange: (input: string) => void;
}

export default function DialogModal({
  email,
  isOpen,
  onInputChange,
  handleFetch,
}: Props) {
  const navigate = useNavigate();
  const { userId } = useAuthStore();
  const [timeLeft, setTimeLeft] = useState<number>(180);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const storedStartTime = localStorage.getItem("startTime");
    if (storedStartTime && isOpen) {
      const elapsedTime = Math.floor(
        (Date.now() - parseInt(storedStartTime)) / 1000
      );
      setTimeLeft(Math.max(180 - elapsedTime, 0));
    }

    if (isOpen) {
      if (!storedStartTime) {
        localStorage.setItem("startTime", Date.now().toString());
      }
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTimeLeft = prev > 0 ? prev - 1 : 0;
          localStorage.setItem("progress", newTimeLeft.toString());
          return newTimeLeft;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleCancel();
    }
  }, [timeLeft]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onInputChange(e.target.value);
  };

  const handleCancel = () => {
    localStorage.removeItem("progress");
    localStorage.removeItem("startTime");
    localStorage.removeItem("orderId");
    localStorage.removeItem("orderInProgress");
    setTimeLeft(180);
    navigate(`/cart_items/${userId}`);
    toast.error("Buyurtma amalga oshirilmadi", {
      position: "top-center",
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-center"
                  >
                    <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mr-2" />
                    Tasdiqlash kodi yuborildi!
                  </Dialog.Title>
                  <div className="mt-6">
                    <p className="text-sm text-gray-600">
                      Sizning buyurtma haqidagi arizangiz qabul qilindi va{" "}
                      <b className="text-sm text-indigo-500">
                        <a
                          href="https://mail.google.com/mail/u/0/#inbox/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {email}
                        </a>
                      </b>{" "}
                      ga tasdiqlash kodi yuborildi. Kodni kiriting:
                    </p>
                    <div className="mt-4 flex gap-4 justify-between items-center">
                      <input
                        type="number"
                        placeholder="123456"
                        name="code"
                        id="code"
                        className="pt-2 rounded"
                        value={inputValue}
                        onChange={handleChange}
                      />
                      <span className="text-red">{formatTime(timeLeft)}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex justify-between">
                    <button
                      className="px-4 py-2 text-grey-800"
                      onClick={handleCancel}
                    >
                      Bekor qilish
                    </button>
                    <button
                      className="px-4 py-2 bg-indigo-500 text-white rounded-md"
                      onClick={handleFetch}
                    >
                      Yuborish
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
