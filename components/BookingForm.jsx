import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useBooking } from "../context/BookingContext";
import dayjs from "dayjs";
import DinnerModal from "./DinnerModal";
import ValidationErrorModal from "./ValidationErrorModal";
import Select from "react-select";
import CountryStateDropdown from "./CountryStateDropdown";

const BookingForm = () => {
  const { selectedDates, selectedRoom } = useBooking();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [city, setCity] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [secondGuest, setSecondGuest] = useState(false);
  const [secondFirstName, setSecondFirstName] = useState("");
  const [secondLastName, setSecondLastName] = useState("");
  const [secondEmail, setSecondEmail] = useState("");
  const [additionalCost, setAdditionalCost] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [showDinnerModal, setShowDinnerModal] = useState(false);
  const [showCharcuterieModal, setShowCharcuterieModal] = useState(false);
  const [dinner, setDinner] = useState(false);
  const [isDinnerSelected, setIsDinnerSelected] = useState(false);
  const [isCharcuterieSelected, setIsCharcuterieSelected] = useState(false);
  const [highlightFields, setHighlightFields] = useState(false); 
  const [formErrors, setFormErrors] = useState({});
  const [showValidationErrorModal, setShowValidationErrorModal] = useState(false); 
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const router = useRouter();

  const validateZipCode = (zip) => {
    const zipCodeRegex = /^\d{5}(-\d{4})?$/;
    return zipCodeRegex.test(zip);
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex =
        /^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s\-\.]?\d{3}[\s\-\.]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const [dinnerDetails, setDinnerDetails] = useState({
    allergies: "",
    preferences: "",
    specialOccasion: "",
    time: "",
  });
  const [charcuterie, setCharcuterie] = useState(false);
  const [charcuterieDetails, setCharcuterieDetails] = useState({
    allergies: "",
    preferences: "",
    specialOccasion: "",
    time: "",
  });

  useEffect(() => {
    if (selectedDates.length === 2 && selectedRoom) {
      const days = dayjs(selectedDates[1]).diff(dayjs(selectedDates[0]), "day");
      const subtotalAmount = days * selectedRoom.rate;
      setSubtotal(subtotalAmount);
    }
  }, [selectedDates, selectedRoom]);

  useEffect(() => {
    let additionalCostAmount = 0;
    if (isDinnerSelected) {
      additionalCostAmount += 100 * (secondGuest ? 2 : 1);
    }
    if (isCharcuterieSelected) {
      additionalCostAmount += 40;
    }
    setAdditionalCost(additionalCostAmount);
    const processingFee = subtotal * 0.026;
    const totalAmount = (subtotal + processingFee) * 1.06;
    setTotal(totalAmount);
  }, [subtotal, isDinnerSelected, isCharcuterieSelected, secondGuest]);

  const validateForm = () => {
    const errors = {};
    if (!firstName) errors.firstName = "First name is required";
    if (!lastName) errors.lastName = "Last name is required";
    if (!email) errors.email = "Email is required";
    if (!validatePhoneNumber(phoneNumber))
      errors.phoneNumber = "Invalid phone number format";
    if (!validateZipCode(zipCode)) errors.zipCode = "Invalid zip code format";
    if (dinner && !dinnerDetails.time)
      errors.dinnerTime = "Dinner time is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setHighlightFields(true);
      setShowValidationErrorModal(true); 
      return;
    }

    const bookingData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      country,
      state,
      city,
      streetAddress,
      zipCode,
      startDate: selectedDates[0].toISOString(),
      endDate: selectedDates[1].toISOString(),
      roomId: selectedRoom.id,
      paymentStatus: "pending",
      secondGuest: secondGuest
        ? {
            firstName: secondFirstName,
            lastName: secondLastName,
            email: secondEmail,
          }
        : null,
    };

    const foodData = {
      dinner: dinner ? dinnerDetails : null,
      charcuterie: charcuterie ? charcuterieDetails : null,
      allergies: dinnerDetails.allergies,
      preferences: dinnerDetails.preferences,
      specialOccasion: dinnerDetails.specialOccasion,
    };

    const requestData = { bookingData, foodData };

    try {
      const response = await fetch("/api/create-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
        router.push(`/payment?bookingId=${result.bookingId}`);
      } else {
        const errorText = await response.text();
        console.error("Failed to save booking:", errorText);
      }
    } catch (error) {
      console.error("Error during booking submission:", error);
    }
  };

  const handleDinnerYes = (details) => {
    setDinner(true);
    setIsDinnerSelected(true);
    setDinnerDetails(details);
    setShowDinnerModal(false);
  };

  const handleDinnerNo = () => {
    setDinner(false);
    setIsDinnerSelected(false);
    setShowDinnerModal(false);
  };

  const handleCharcuterieYes = (details) => {
    setCharcuterie(true);
    setIsCharcuterieSelected(true);
    setCharcuterieDetails(details);
    setShowCharcuterieModal(false);
  };

  const handleCharcuterieNo = () => {
    setCharcuterie(false);
    setIsCharcuterieSelected(false);
    setShowCharcuterieModal(false);
  };

  const handleDinnerClose = () => {
    setShowDinnerModal(false);
  };

  const handleCharcuterieClose = () => {
    setShowCharcuterieModal(false);
  };

  const handleValidationErrorModalClose = () => {
    setShowValidationErrorModal(false); 
  };

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
    setState("");
  };

  const handleStateChange = (e) => {
    setState(e.target.value);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-4xl my-12">Complete your booking details</h1>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box mb={2} className="flex justify-center items-center">
          <TextField
            label="Start Date"
            value={
              selectedDates[0] ? selectedDates[0].format("YYYY-MM-DD") : ""
            }
            InputProps={{ readOnly: true }}
          />
          <Box sx={{ mx: 2 }}>to</Box>
          <TextField
            label="End Date"
            value={
              selectedDates[1] ? selectedDates[1].format("YYYY-MM-DD") : ""
            }
            InputProps={{ readOnly: true }}
          />
        </Box>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col lg:w-full mx-auto p-6 bg-white shadow-md rounded-lg"
        >
          <h1 className="text-2xl font-bold mb-4">Contact Information</h1>

          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={`mb-4 p-2 border border-gray-300 rounded ${
              highlightFields && formErrors.firstName ? "border-red-500" : ""
            }`}
          />
          {highlightFields && formErrors.firstName && (
            <span className="text-red-500">{formErrors.firstName}</span>
          )}
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={`mb-4 p-2 border border-gray-300 rounded ${
              highlightFields && formErrors.lastName ? "border-red-500" : ""
            }`}
          />
          {highlightFields && formErrors.lastName && (
            <span className="text-red-500">{formErrors.lastName}</span>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mb-4 p-2 border border-gray-300 rounded ${
              highlightFields && formErrors.email ? "border-red-500" : ""
            }`}
          />
          {highlightFields && formErrors.email && (
            <span className="text-red-500">{formErrors.email}</span>
          )}
          <input
            type="text"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`mb-4 p-2 border border-gray-300 rounded ${
              highlightFields && formErrors.phoneNumber ? "border-red-500" : ""
            }`}
          />
          {highlightFields && formErrors.phoneNumber && (
            <span className="text-red-500">{formErrors.phoneNumber}</span>
          )}

          <h1 className="text-2xl font-bold mb-4">Address Information</h1>
          <CountryStateDropdown
            selectedCountry={country}
            selectedState={state}
            handleCountryChange={handleCountryChange}
            handleStateChange={handleStateChange}
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Street Address"
            value={streetAddress}
            onChange={(e) => setStreetAddress(e.target.value)}
            className="mb-4 p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            className={`mb-4 p-2 border border-gray-300 rounded ${
              highlightFields && formErrors.zipCode ? "border-red-500" : ""
            }`}
          />
          {highlightFields && formErrors.zipCode && (
            <span className="text-red-500">{formErrors.zipCode}</span>
          )}

          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={secondGuest}
                onChange={(e) => setSecondGuest(e.target.checked)}
                className="form-checkbox"
              />
              <span>Will a second guest be coming?</span>
            </label>
          </div>

          {secondGuest && (
            <div className="flex flex-col mb-4">
              <input
                type="text"
                placeholder="Second Guest First Name"
                value={secondFirstName}
                onChange={(e) => setSecondFirstName(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Second Guest Last Name"
                value={secondLastName}
                onChange={(e) => setSecondLastName(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="email"
                placeholder="Second Guest Email"
                value={secondEmail}
                onChange={(e) => setSecondEmail(e.target.value)}
                className="mb-4 p-2 border border-gray-300 rounded"
              />
            </div>
          )}

          <div className="mb-4">
            <button
              type="button"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200"
              onClick={() => setShowDinnerModal(true)}
            >
              Add Dinner Option
            </button>
            <button
              type="button"
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200 ml-4"
              onClick={() => setShowCharcuterieModal(true)}
            >
              Add Charcuterie Option
            </button>
          </div>

          {dinner && (
            <div className="flex flex-col mb-4">
              <input
                type="text"
                placeholder="Allergies"
                value={dinnerDetails.allergies}
                onChange={(e) =>
                  setDinnerDetails({
                    ...dinnerDetails,
                    allergies: e.target.value,
                  })
                }
                className="mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Preferences"
                value={dinnerDetails.preferences}
                onChange={(e) =>
                  setDinnerDetails({
                    ...dinnerDetails,
                    preferences: e.target.value,
                  })
                }
                className="mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Special Occasion"
                value={dinnerDetails.specialOccasion}
                onChange={(e) =>
                  setDinnerDetails({
                    ...dinnerDetails,
                    specialOccasion: e.target.value,
                  })
                }
                className="mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Dinner Time"
                value={dinnerDetails.time}
                onChange={(e) =>
                  setDinnerDetails({ ...dinnerDetails, time: e.target.value })
                }
                className={`mb-4 p-2 border border-gray-300 rounded ${
                  highlightFields && formErrors.dinnerTime
                    ? "border-red-500"
                    : ""
                }`}
              />
              {highlightFields && formErrors.dinnerTime && (
                <span className="text-red-500">{formErrors.dinnerTime}</span>
              )}
            </div>
          )}

          {charcuterie && (
            <div className="flex flex-col mb-4">
              <input
                type="text"
                placeholder="Allergies"
                value={charcuterieDetails.allergies}
                onChange={(e) =>
                  setCharcuterieDetails({
                    ...charcuterieDetails,
                    allergies: e.target.value,
                  })
                }
                className="mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Preferences"
                value={charcuterieDetails.preferences}
                onChange={(e) =>
                  setCharcuterieDetails({
                    ...charcuterieDetails,
                    preferences: e.target.value,
                  })
                }
                className="mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Special Occasion"
                value={charcuterieDetails.specialOccasion}
                onChange={(e) =>
                  setCharcuterieDetails({
                    ...charcuterieDetails,
                    specialOccasion: e.target.value,
                  })
                }
                className="mb-4 p-2 border border-gray-300 rounded"
              />
              <input
                type="text"
                placeholder="Dinner Time"
                value={charcuterieDetails.time}
                onChange={(e) =>
                  setCharcuterieDetails({
                    ...charcuterieDetails,
                    time: e.target.value,
                  })
                }
                className="mb-4 p-2 border border-gray-300 rounded"
              />
            </div>
          )}

          <div className="bg-sky-100 p-4 rounded mb-4">
            <div className="flex justify-between mb-2">
              <span className="font-bold">Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
              {additionalCost > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Additional Cost:</span>
                  <span>${additionalCost.toFixed(2)}</span>
                </div>
              )}{" "}
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Sales Tax (6%):</span>
              <span>
                $
                {(
                  (subtotal +
                    (dinner ? 100 * (secondGuest ? 2 : 1) : 0) +
                    (charcuterie ? 40 : 0)) *
                  0.06
                ).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-bold">Processing Fee:</span>
              <span>${(subtotal * 0.026).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
          >
            Next
          </button>
        </form>
      </LocalizationProvider>
      <DinnerModal
        open={showDinnerModal}
        onClose={handleDinnerClose}
        onYes={handleDinnerYes}
      />
      <DinnerModal
        open={showCharcuterieModal}
        onClose={handleCharcuterieClose}
        onYes={handleCharcuterieYes}
      />
      <ValidationErrorModal
        open={showValidationErrorModal}
        onClose={handleValidationErrorModalClose}
        errors={formErrors}
      />
    </div>
  );
};

export default BookingForm;
