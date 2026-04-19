import React, { useEffect, useState } from "react";
import SearchableSelect from "./SearchableSelect";

const Billing = () => {
  const [profile, setProfile] = useState<any>(null);
  const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
  const [states, setStates] = useState<{ label: string; value: string }[]>([]);
  const [cities, setCities] = useState<{ label: string; value: string }[]>([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [loadingLocations, setLoadingLocations] = useState({
    countries: false,
    states: false,
    cities: false
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const parsedUser = JSON.parse(userStr);
      setProfile(parsedUser);
      const customer = parsedUser?.customer || {};
      if (customer.country) setSelectedCountry(customer.country);
      if (customer.state) setSelectedState(customer.state);
      if (customer.city) setSelectedCity(customer.city);
    }

    // Fetch countries on mount
    const fetchCountries = async () => {
      setLoadingLocations(prev => ({ ...prev, countries: true }));
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries");
        const data = await res.json();
        if (!data.error) {
          const list = data.data.map((c: any) => ({ label: c.country, value: c.country }));
          setCountries(list);
        }
      } catch (err) {
        console.error("Failed to fetch countries", err);
      } finally {
        setLoadingLocations(prev => ({ ...prev, countries: false }));
      }
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      return;
    }

    const fetchStates = async () => {
      setLoadingLocations(prev => ({ ...prev, states: true }));
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: selectedCountry })
        });
        const data = await res.json();
        if (!data.error && data.data.states) {
          const list = data.data.states.map((s: any) => ({ label: s.name, value: s.name }));
          setStates(list);
        } else {
          setStates([]);
        }
      } catch (err) {
        console.error("Failed to fetch states", err);
        setStates([]);
      } finally {
        setLoadingLocations(prev => ({ ...prev, states: false }));
      }
    };
    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoadingLocations(prev => ({ ...prev, cities: true }));
      try {
        const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: selectedCountry, state: selectedState })
        });
        const data = await res.json();
        if (!data.error && data.data) {
          const list = data.data.map((c: any) => ({ label: c, value: c }));
          setCities(list);
        } else {
          setCities([]);
        }
      } catch (err) {
        console.error("Failed to fetch cities", err);
        setCities([]);
      } finally {
        setLoadingLocations(prev => ({ ...prev, cities: false }));
      }
    };
    fetchCities();
  }, [selectedCountry, selectedState]);

  const customer = profile?.customer || {};
  const names = (customer.name || profile?.name || "").split(" ");
  const firstName = names[0] || "";
  const lastName = names.slice(1).join(" ") || "";

  return (
    <div className="bg-white-true shadow-1 rounded-lg p-6 sm:p-8 border border-gray-3">
      <h3 className="font-medium text-lg text-dark mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-dark-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 118 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
        Billing Information
      </h3>

      {/* Name Row */}
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
        <div className="w-full">
          <label htmlFor="firstName" className="block mb-2.5">
            First Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder="Jhon"
            defaultValue={firstName}
            className="rounded-md border border-gray-3 bg-white-true placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <div className="w-full">
          <label htmlFor="lastName" className="block mb-2.5">
            Last Name <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder="Deo"
            defaultValue={lastName}
            className="rounded-md border border-gray-3 bg-white-true placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>
<div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
        <div className="w-full">
          <label htmlFor="phone" className="block mb-2.5">
            Phone <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="phone"
            id="phone"
            defaultValue={customer.phone || ""}
            className="rounded-md border border-gray-3 bg-white-true placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <div className="w-full">
          <label htmlFor="email" className="block mb-2.5">
            Email Address <span className="text-red">*</span>
          </label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue={profile?.email || ""}
            className="rounded-md border border-gray-3 bg-white-true placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>
      {/* Country Row */}
      <div className="mb-5">
        <SearchableSelect
          name="customer_country"
          label="Country / Region"
          options={countries}
          value={selectedCountry}
          onChange={(val) => {
            setSelectedCountry(val);
            setSelectedState("");
            setSelectedCity("");
          }}
          placeholder={loadingLocations.countries ? "Loading countries..." : "Select Country"}
          required
        />
      </div>

      {/* State & City Row */}
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
        <div className="w-full">
          <SearchableSelect
            name="customer_state"
            label="State / Province"
            options={states}
            value={selectedState}
            onChange={(val) => {
              setSelectedState(val);
              setSelectedCity("");
            }}
            placeholder={loadingLocations.states ? "Loading states..." : (selectedCountry ? "Select State" : "Select Country first")}
            required
          />
        </div>
        <div className="w-full">
          <SearchableSelect
            name="customer_city"
            label="Town / City"
            options={cities}
            value={selectedCity}
            onChange={(val) => setSelectedCity(val)}
            placeholder={loadingLocations.cities ? "Loading cities..." : (selectedState ? "Select City" : "Select State first")}
            required
          />
        </div>
      </div>

      {/* Address Row */}
      <div className="mb-5">
        <label htmlFor="customer_address" className="block mb-2.5">
          Street Address <span className="text-red">*</span>
        </label>
        <input
          type="text"
          name="customer_address"
          id="customer_address"
          placeholder="House number and street name"
          defaultValue={customer.address || ""}
          className="rounded-md border border-gray-3 bg-white-true placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
        />
      </div>

      {/* House & Ward Row */}
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
        <div className="w-full">
          <label htmlFor="customer_house_number" className="block mb-2.5">
            House Number (Optional)
          </label>
          <input
            type="text"
            name="customer_house_number"
            id="customer_house_number"
            placeholder="e.g. Blk A 12"
            defaultValue={customer.house_number || ""}
            className="rounded-md border border-gray-3 bg-white-true placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <div className="w-full">
          <label htmlFor="customer_ward" className="block mb-2.5">
            Ward/ Village (Kelurahan)
          </label>
          <input
            type="text"
            name="customer_ward"
            id="customer_ward"
            placeholder="Kelurahan"
            defaultValue={customer.ward || ""}
            className="rounded-md border border-gray-3 bg-white-true placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      {/* District & Post Code Row */}
      <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
        <div className="w-full">
          <label htmlFor="customer_district" className="block mb-2.5">
            District (Kecamatan)
          </label>
          <input
            type="text"
            name="customer_district"
            id="customer_district"
            placeholder="Kecamatan"
            defaultValue={customer.district || ""}
            className="rounded-md border border-gray-3 bg-white-true placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
        <div className="w-full">
          <label htmlFor="customer_post_code" className="block mb-2.5">
            Post Code <span className="text-red">*</span>
          </label>
          <input
            type="text"
            name="customer_post_code"
            id="customer_post_code"
            placeholder="Zip Code"
            defaultValue={customer.post_code || ""}
            className="rounded-md border border-gray-3 bg-white-true placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
          />
        </div>
      </div>

      {/* Phone & Email Row */}
      

      {!profile && (
        <div>
          <label
            htmlFor="checkboxLabelTwo"
            className="text-dark flex cursor-pointer select-none items-center mt-5"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="checkboxLabelTwo"
                name="createAccount"
                className="sr-only"
              />
              <div className="mr-2 flex h-4 w-4 items-center justify-center rounded border border-gray-4">
                <span className="opacity-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="4" y="4.00006" width="16" height="16" rx="4" fill="#113104" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M16.3103 9.25104C16.471 9.41178 16.5612 9.62978 16.5612 9.85707C16.5612 10.0844 16.471 10.3024 16.3103 10.4631L12.0243 14.7491C11.8635 14.9098 11.6455 15.0001 11.4182 15.0001C11.191 15.0001 10.973 14.9098 10.8122 14.7491L8.24062 12.1775C8.08448 12.0158 7.99808 11.7993 8.00003 11.5745C8.00199 11.3498 8.09214 11.1348 8.25107 10.9759C8.41 10.8169 8.62499 10.7268 8.84975 10.7248C9.0745 10.7229 9.29103 10.8093 9.4527 10.9654L11.4182 12.931L15.0982 9.25104C15.2589 9.09034 15.4769 9.00006 15.7042 9.00006C15.9315 9.00006 16.1495 9.09034 16.3103 9.25104Z" fill="white" />
                  </svg>
                </span>
              </div>
            </div>
            Create an Account
          </label>
        </div>
      )}
    </div>
  );
};

export default Billing;
