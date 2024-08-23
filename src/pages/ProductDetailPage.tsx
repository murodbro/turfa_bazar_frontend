import { Disclosure } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import useProduct, { Gallery, VariationValues } from "../hooks/useProduct";
import { useNavigate, useParams } from "react-router-dom";
import useAddCartQueryState from "../hooks/store";
import { axiosInstance, baseURL } from "../services/api-client";
import useAuthStore from "../context/useAuthContext";
import { toast } from "react-toastify";
import { FadeLoader } from "react-spinners";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/scss/image-gallery.scss";
import "react-image-gallery/styles/css/image-gallery.css";
import { useEffect, useState } from "react";
import { PaperClipIcon, PaperAirplaneIcon } from "@heroicons/react/20/solid";
import * as yup from "yup";
import { useFormik } from "formik";

export interface User {
  first_name: string;
}

export interface Reviews {
  id: string;
  user: User;
  review: string;
  image: string;
  created_at: string;
}

interface ReactImageGalleryItem {
  original: string;
  thumbnail: string;
}

const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

const transformGalleryToImageGalleryItems = (
  gallery: Gallery[]
): ReactImageGalleryItem[] => {
  return gallery.map((item) => ({
    original: item.gallery,
    thumbnail: item.gallery,
  }));
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  const monthNames = [
    "yanvar",
    "fevral",
    "mart",
    "aprel",
    "may",
    "iyun",
    "iyul",
    "avgust",
    "sentabr",
    "oktabr",
    "noyabr",
    "dekabr",
  ];

  const day = date.getDate().toString().padStart(2, "0");
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}, ${day}-${month}, ${hours}:${minutes}`;
};

const validationSchema = yup.object({
  review: yup.string().required("Review is required"),
  image: yup.mixed().nullable(),
  product: yup.string().required(),
});

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const setClicked = useAddCartQueryState((s) => s.setAddCart);
  const params = useParams<{ id?: string }>();
  const productId = params.id || "";
  const { data, isLoading, error } = useProduct(productId);
  const { userId, authTokens } = useAuthStore();
  const [imageName, setImageName] = useState<string>("");
  const [reviews, setReviews] = useState<Reviews[]>([]);
  const [selectedVariation, setSelectedVariation] = useState<VariationValues[]>(
    []
  );

  const [price, setPrice] = useState<number | null>(null);
  const [inStock, setInStock] = useState<number | null>(null);

  const initialValues = {
    review: "",
    image: null,
    product: productId,
  };

  const getMatchingVariation = () => {
    if (data && selectedVariation.length > 0) {
      const matchingVariation = data.variations?.find((variation) =>
        variation.variation_values.every((value) =>
          selectedVariation.some((selected) => selected.id === value.id)
        )
      );
      return matchingVariation;
    }
    return null;
  };

  const fetchAddCartItem = async () => {
    const matchingVariation = getMatchingVariation();
    const payload = {
      productId: productId,
      variationId: matchingVariation ? matchingVariation.id : null,
    };

    if (userId) {
      try {
        const response = await axiosInstance.post(
          `cart/cart_items/${userId}/`,
          payload,
          {
            headers: { Authorization: `Bearer ${authTokens}` },
          }
        );
        setClicked(productId);
        navigate(`/cart_items/${userId}/`);
        toast.success(response.data.message || "Xatolik yuz berdi", {
          position: "top-center",
        });
      } catch (error: any) {
        toast.error(error.response.data.message || "Xatolik yuz berdi", {
          position: "top-center",
        });
      }
    } else {
      toast.warning("Foydalanuvchi ro'yhatdan o'tmagan", {
        position: "top-center",
      });
    }
  };

  const fetchAllReviews = async () => {
    try {
      const response = await axiosInstance.get<Reviews[]>(
        `product/review/${productId}`
      );
      setReviews(response.data);
    } catch (error: any) {
      toast.error("Xatolik yuz berdi!");
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, [productId]);

  const fetchReview = async () => {
    const formData = new FormData();
    formData.append("review", formik.values.review);
    formData.append("user", userId || "");
    if (formik.values.image) {
      formData.append("image", formik.values.image);
    }

    try {
      await axiosInstance.post(`product/review/${productId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Izoh qoshildi!", {
        position: "top-center",
      });
      fetchAllReviews();
      setImageName("");
      formik.values.review = "";
      formik.values.image = null;
    } catch (error: any) {
      toast.error("Xatolik yuz berdi", {
        position: "top-center",
      });
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: fetchReview,
  });

  useEffect(() => {
    if (data) {
      if (data.variations && data.variations.length > 0) {
        setSelectedVariation([data.variations[0].variation_values[0]]);
      } else {
        setInStock(data.variations[0].stock);
      }
      setPrice(Number(data.variations[0].price));
    }
  }, [data]);

  useEffect(() => {
    if (data && selectedVariation.length > 0) {
      const matchingVariation = data.variations?.find((variation) =>
        variation.variation_values.every((value) =>
          selectedVariation.some((selected) => selected.id === value.id)
        )
      );
      if (matchingVariation) {
        setPrice(matchingVariation.price);
        setInStock(matchingVariation.stock);
      }
    }
  }, [selectedVariation, data]);

  const handleVariationChange = (
    variationType: string,
    value: VariationValues
  ) => {
    setSelectedVariation((prev) => {
      const updated = prev.filter((v) => v.type !== variationType);
      return [...updated, value];
    });
  };

  if (isLoading)
    return (
      <p className="p-12">
        <FadeLoader color="#36d7b7" />
      </p>
    );

  if (error) return <p className="p-12">Error occurred!</p>;

  const galleryItems = data?.gallery
    ? transformGalleryToImageGalleryItems(data.gallery)
    : [];

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 sm:py-4 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <div className="flex items-center justify-center">
            {data?.gallery.length === 0 ? (
              <img src={data?.image} className="w-9/12" />
            ) : (
              <ImageGallery
                items={galleryItems}
                showPlayButton={false}
                showBullets={true}
                slideOnThumbnailOver={true}
                thumbnailPosition="left"
              />
            )}
          </div>

          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <div className="border-b pb-4">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {data?.name}
              </h1>

              <div className="mt-6">
                <div
                  className="space-y-6 text-base text-gray-700"
                  dangerouslySetInnerHTML={
                    data && { __html: data?.description }
                  }
                />
              </div>

              <div className="pt-4 flex gap-10">
                <p>Sotuvchi:</p>{" "}
                <p className="text-indigo-500 text-md tracking-tight">
                  {data?.owner}
                </p>
              </div>
            </div>

            <div className="pt-4">
              {inStock ? (
                <div className="space-y-6 text-sm text-green-600">
                  Sotuvda {inStock} dona qoldi
                </div>
              ) : (
                <div className="text-red-400 text-sm">Sotuvda mavjud emas</div>
              )}
            </div>

            <div className="flex flex-col gap-4 pt-4">
              {data?.variations
                ? data?.variations[0].variation_values.map((variationType) => (
                    <div key={variationType.type} className="flex gap-2">
                      <div className="text-lg font-semibold mb-2 pr-4">
                        {variationType.type &&
                          data.variation_types
                            .filter(
                              (varType) => varType.id === variationType.type
                            )
                            .map((varType) => (
                              <small
                                className="text-gray-600 tracking-tight"
                                key={varType.id}
                              >
                                {varType.name}:{"  "}
                                {selectedVariation
                                  .filter((v) => v.type === variationType.type)
                                  .map((v) => v.value)
                                  .join(", ")}
                              </small>
                            ))}
                      </div>
                      {Array.from(
                        new Set(
                          data.variations?.flatMap((variation) =>
                            variation.variation_values
                              .filter((v) => v.type === variationType.type)
                              .map((v) => JSON.stringify(v))
                          )
                        ).values()
                      )
                        .map((v) => JSON.parse(v))
                        .map((value) =>
                          value ? (
                            <div className="">
                              <div
                                key={value.id}
                                className={`flex items-center p-2 cursor-pointer border-2 rounded-lg ${
                                  selectedVariation.some(
                                    (v) => v.id === value.id
                                  )
                                    ? "bg-indigo-500 text-white border-transparent border-indido-600"
                                    : "border-gray-300"
                                }`}
                                onClick={() =>
                                  handleVariationChange(
                                    variationType.type,
                                    value
                                  )
                                }
                              >
                                <div className="flex flex-col">
                                  {value.value
                                    ?.split(",")
                                    .map((val: string) => (
                                      <div
                                        key={val.trim()}
                                        className="mr-2 whitespace-nowrap"
                                      >
                                        {val.trim()}
                                      </div>
                                    ))}
                                </div>
                              </div>
                            </div>
                          ) : null
                        )}
                    </div>
                  ))
                : null}
            </div>

            <div className="mt-3">
              <small className="text-gray-800 text-sm">Narxi:</small>
              <p className="text-xl tracking-tight text-gray-900">
                {price !== undefined
                  ? `${new Intl.NumberFormat("en-US").format(
                      Number(price)
                    )} so'm`
                  : `${new Intl.NumberFormat("en-US").format(
                      Number(data?.base_price)
                    )} so'm`}
              </p>
            </div>

            <div className="mt-8 flex gap-2">
              <button
                onClick={() => fetchAddCartItem()}
                disabled={!inStock}
                type="button"
                className={
                  !inStock
                    ? "flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-400 px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full cursor-not-allowed"
                    : "flex max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                }
              >
                Savatga qo'shish
              </button>

              <button
                onClick={() => navigate("/")}
                type="button"
                className="max-w-xs flex-1 items-center justify-center rounded-md border border-indigo-600 bg-transparent px-8 py-3 text-base font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-offset-2 focus:ring-offset-indigo-50 sm:w-full"
              >
                Xarid qilish
              </button>
            </div>
            <div className="pt-4">
              {data?.ordered_count ? (
                <div className="space-y-6 text-sm text-indigo-600">
                  {data?.ordered_count} dona xarid qilingan.
                </div>
              ) : (
                <div className="text-green-400">Hali Sotilmagan.</div>
              )}
            </div>

            <section aria-labelledby="details-heading" className="mt-12">
              <div className="divide-y divide-gray-200 border-t">
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <h3>
                        <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span
                            className={classNames(
                              open ? "text-indigo-600" : "text-gray-900",
                              "text-sm font-medium"
                            )}
                          >
                            <p className="p-4">Xususiyatlari</p>
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel
                        as="div"
                        className="prose prose-sm pb-6"
                      >
                        <ul role="list">
                          <li key={data?.details}>{data?.details}</li>
                        </ul>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </section>
          </div>
        </div>

        <Disclosure as="div">
          {({ open }) => (
            <>
              <h3>
                <Disclosure.Button className="group relative flex items-center justify-between pt-10 text-left">
                  <span
                    className={classNames(
                      open ? "text-indigo-600" : "text-gray-900",
                      "text-sm font-medium"
                    )}
                  >
                    <p className="p-4">Izohlar</p>
                  </span>
                  <span className="ml-6 flex items-center">
                    {open ? (
                      <MinusIcon
                        className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
                        aria-hidden="true"
                      />
                    ) : (
                      <PlusIcon
                        className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                        aria-hidden="true"
                      />
                    )}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel as="div" className="prose prose-sm pb-6 ">
                <form
                  className="mt-6 flex gap-2 pb-4"
                  encType="multipart/form-data"
                  onSubmit={formik.handleSubmit}
                >
                  <input
                    type="text"
                    id="review"
                    name="review"
                    placeholder="Izoh qo'shish"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.review}
                  />

                  <label className="flex items-center space-x-2">
                    <PaperClipIcon className="h-8 w-10 text-gray-500" />
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          setImageName(file.name);
                          formik.setFieldValue("image", file);
                        }
                      }}
                    />
                    {imageName && (
                      <span className="text-gray-600">{imageName}</span>
                    )}
                  </label>

                  <button
                    type="submit"
                    className="pr-10"
                    disabled={!formik.values.review}
                  >
                    <PaperAirplaneIcon
                      className={
                        formik.values.review
                          ? "h-10 w-10 text-indigo-500"
                          : "h-10 w-10 text-indigo-300 cursor-not-allowed"
                      }
                    />
                  </button>
                </form>

                {reviews ? (
                  <div
                    className="space-y-4 overflow-x-hidden"
                    style={{ height: "600px" }}
                  >
                    {reviews?.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-white drop-shadow rounded-lg"
                      >
                        <p className="text-base text-gray-900">
                          {review.user ? review.user.first_name : "Anonim"}
                        </p>
                        <time className="text-xs text-gray-500">
                          {formatDate(review.created_at)}
                        </time>
                        <p className="text-sm text-gray-600">{review.review}</p>
                        <img
                          src={review.image ? `${baseURL}${review.image}` : ""}
                          className="pt-4"
                          style={{ width: "120px" }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  "Hozircha izhoh yoq"
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
};

export default ProductDetailPage;
