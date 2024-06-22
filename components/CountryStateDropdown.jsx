import React, { useState, useEffect } from "react";
import { Select, MenuItem } from "@mui/material";

const CountryStateDropdown = ({ selectedCountry, selectedState, handleCountryChange, handleStateChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetchStates(selectedCountry);
    }
  }, [selectedCountry]);

  const fetchCountries = async () => {
    try {
      const response = await fetch("https://restcountries.com/v3.1/all");
      const data = await response.json();
      const countryList = data.map((country) => ({
        name: country.name.common,
        code: country.cca2,
      }));

      const usCountry = countryList.find(country => country.code === "US");
      const otherCountries = countryList.filter(country => country.code !== "US").sort((a, b) => a.name.localeCompare(b.name));

      if (usCountry) {
        setCountries([usCountry, ...otherCountries]);
      } else {
        setCountries(otherCountries);
      }
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const fetchStates = async (countryCode) => {
    if (countryCode === "US") {
      try {
        const response = await fetch(
          "https://api.census.gov/data/2019/pep/population?get=NAME&for=state:*"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const stateList = data.slice(1).map((state) => state[0]);
        setStates(stateList);
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      }
    } else {
      try {
        const response = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${countryCode}/regions`,
          {
            method: 'GET',
            headers: {
              'x-rapidapi-key': '250f966a20mshfb9eddd0ffa4e52p197ba0jsn7995b3d68d1c',
              'x-rapidapi-host': 'wft-geo-db.p.rapidapi.com'
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const stateList = data.data.map((region) => region.name);
        setStates(stateList);
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      }
    }
  };

  return (
    <div>
      <h1>Complete your booking details</h1>
      <div>
        <label>Country</label>
        <Select value={selectedCountry} onChange={handleCountryChange}>
          <MenuItem value="">
            <em>Select Country</em>
          </MenuItem>
          {countries.map((country) => (
            <MenuItem key={country.code} value={country.code}>
              {country.name}
            </MenuItem>
          ))}
        </Select>
      </div>
      {selectedCountry && (
        <div>
          <label>State/Province</label>
          <Select value={selectedState} onChange={handleStateChange}>
            <MenuItem value="">
              <em>Select State/Province</em>
            </MenuItem>
            {states.map((state) => (
              <MenuItem key={state} value={state}>
                {state}
              </MenuItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};

export default CountryStateDropdown;
