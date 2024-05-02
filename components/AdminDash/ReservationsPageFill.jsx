import React, { ComponentType, useState } from "react";
import ReservationList from "@/components/AdminDash/ReservationList";
import AdminCalendar from "@/components/AdminDash/AdminCalendar"
import Image from "next/image";
import { Merriweather } from "next/font/google";

const merriweather = Merriweather({ weight: "400", subsets: ["latin"] });
const ParentComponent = () => {
  const [activeComponent, setActiveComponent] = useState("");

  const renderComponent = () => {
    switch (activeComponent) {
      case "A":
        return <ReservationList />;
      case "B":
        return <AdminCalendar />;
  
    }
  };

  return (
    <div className={merriweather.className}>
    <div className="mt-12">
      <div className="flex justify-center items-center gap-12">
        <ul className="flex lg:flex-row flex-col  gap-10 mb-16">
          <li className="flex flex-col justify-center items-center">
            <button
              onClick={() => setActiveComponent("A")}
              className="bg-emerald-950 py-2 mt-2 px-48 text-white text-xl"
            >
             List of Reservations
            </button>
          </li>
          <li className="flex flex-col justify-center items-center">
            <button
              onClick={() => setActiveComponent("B")}
              className="bg-emerald-950 py-2 mt-2 px-48 text-white text-xl"
            >
              Reservation Calendar
            </button>{" "}
          </li>
        </ul>
      </div>
      <div>{renderComponent()}</div>
    </div>
    </div>
  );
};

export default ParentComponent;
