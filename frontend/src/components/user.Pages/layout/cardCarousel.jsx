import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper/modules";

const CardCarousel = ({ children }) => {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={2.5}
      breakpoints={{
        640: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 3,
        },
        1024: {
          slidesPerView: 4,
        },
      }}
      navigation={true}
      pagination={{ clickable: true }}
      modules={[Navigation, Pagination]}
    >
      {React.Children.map(children, (child) => (
        <SwiperSlide className="flex justify-center">{child}</SwiperSlide>
      ))}
    </Swiper>
  );
};

export default CardCarousel;
