import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

export default function Alert() {
  const [visible, setVisible] = useState(true);

  return (
    visible && (
      <div className="rounded-md bg-green-100 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon
              className="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Buyurtmangiz amalga oshirildi!
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Buyurtmangiz muvoffaqiyatli amalga oshirildi. Yanada ko'proq
                harid qilishni unutmang!
              </p>
            </div>
            <div className="mt-4">
              <div className="-mx-2 -my-1.5 flex">
                <button
                  type="button"
                  onClick={() => setVisible(false)}
                  className="rounded-md  px-2 py-1.5 text-sm font-medium text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  Yopish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
