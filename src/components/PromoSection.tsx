import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import {
  ArrowPathIcon,
  CalendarIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

const perks = [
  {
    name: "Buyurtmani saqlash muddati – 5 kun",
    description: "1 kun ichida yetkazib beramiz",
    icon: CalendarIcon,
  },
  {
    name: "Mahsulotlarning tez va muammosiz qaytarib olinishi",
    description: "Mahsulotni tekshirish va kiyib koʻrish mumkin",
    icon: ArrowPathIcon,
  },
  {
    name: "Kuryer orqali yetkazib berish",
    description: "Arzon va tezkor",
    icon: TruckIcon,
  },
];

const images = [
  "https://images.uzum.uz/cqlo3jkqvsse8leu4su0/main_page_banner.jpg",
  "https://images.uzum.uz/cqkvnn4sslomdvnit9mg/main_page_banner.jpg",
  "https://images.uzum.uz/cq204qb5qt1gj8ddqqag/main_page_banner.jpg",
  "https://images.uzum.uz/cqhprtnfrr8a72r5sr9g/main_page_banner.jpg",
];

const styles = {
  carouselControlArrow: {
    background: "rgba(0, 0, 0, 0.5)",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    top: "50%",
    transform: "translateY(-50%)",
    zIndex: 2,
  },
  carouselControlPrev: {
    left: "10px",
  },
  carouselControlNext: {
    right: "10px",
  },
  carouselControlArrowHover: {
    background: "rgba(0, 0, 0, 1)",
  },
  carouselControlArrowBefore: {
    fontSize: "24px",
    color: "white",
  },
  carouselThumbsWrapper: {
    display: "none",
  },
};

const PromoSection = () => {
  return (
    <>
      <div className="bg-white pt-10">
        <div className="px-4 sm:px-6 sm:py-24 lg:px-36">
          <div
            className="relative overflow-hidden rounded-lg"
            style={{ height: "450px" }}
          >
            <Carousel
              showArrows={true}
              showThumbs={false}
              autoPlay={true}
              infiniteLoop={true}
              interval={5000}
              showStatus={false}
              renderArrowPrev={(clickHandler, hasPrev) => (
                <button
                  type="button"
                  className="absolute left-10 top-1/2 transform -translate-y-1/2"
                  style={styles.carouselControlArrow}
                  onClick={clickHandler}
                  disabled={!hasPrev}
                >
                  &lt;
                </button>
              )}
              renderArrowNext={(clickHandler, hasNext) => (
                <button
                  type="button"
                  className="absolute right-10 top-1/2 transform -translate-y-1/2"
                  style={styles.carouselControlArrow}
                  onClick={clickHandler}
                  disabled={!hasNext}
                >
                  &gt;
                </button>
              )}
            >
              {images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image}
                    alt={`Promo ${index + 1}`}
                    className="w-full object-cover object-top"
                  />
                </div>
              ))}
            </Carousel>
          </div>
        </div>
      </div>

      <div className="bg-white">
        <h2 className="sr-only">Our perks</h2>
        <div className="mx-auto max-w-7xl divide-y divide-gray-200 lg:flex lg:justify-center lg:divide-x lg:divide-y-0 lg:py-8">
          {perks.map((perk, perkIdx) => (
            <div key={perkIdx} className="py-8 lg:w-1/3 lg:flex-none lg:py-0">
              <div className="mx-auto flex max-w-xs items-center px-4 lg:max-w-none lg:px-8">
                <perk.icon
                  className="h-8 w-8 flex-shrink-0 text-indigo-600"
                  aria-hidden="true"
                />
                <div className="ml-4 flex flex-auto flex-col-reverse">
                  <h3 className="font-medium text-gray-900">{perk.name}</h3>
                  <p className="text-sm text-gray-500">{perk.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PromoSection;
