import React, { ComponentType, useState } from "react";
import { Merriweather } from "next/font/google";
import BookingList from "@/components/AdminDash/BookingList";
const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });
const ReservationsPageFill = () => {
  return (
    <div className={merriweather.className}>
    <div className="mt-12">
      <div className="flex justify-center items-center gap-12">
        <BookingList/>
      </div>
    </div>
    </div>
  );
};

export default ReservationsPageFill;
