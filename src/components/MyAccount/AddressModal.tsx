import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const AddressModal = ({ isOpen, closeModal }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    city: "",
    state: "",
    district: "",
    ward: "",
    house_number: "",
    post_code: "",
  });

  useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const customer = user.customer || {};
        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: customer.phone || "",
          country: customer.country || "",
          address: customer.address || "",
          city: customer.city || "",
          state: customer.state || "",
          district: customer.district || "",
          ward: customer.ward || "",
          house_number: customer.house_number || "",
          post_code: customer.post_code || "",
        });
      }
    }

    // closing modal while clicking outside
    function handleClickOutside(event) {
      if (!event.target.closest(".modal-content")) {
        closeModal();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, closeModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Profile updated successfully!");
        closeModal();
        window.location.reload(); // Refresh to show updated data
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Update failed");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("An error occurred while updating profile");
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 overflow-y-auto no-scrollbar w-full h-screen sm:py-20 xl:py-25 2xl:py-[230px] bg-dark/70 sm:px-8 px-4 py-5 ${isOpen ? "block z-99999" : "hidden"
        }`}
    >
      <div className="flex items-center justify-center">
        <div className="w-full max-w-[900px] rounded-xl shadow-3 bg-white p-7.5 relative modal-content">
          <button
            onClick={closeModal}
            aria-label="button for close modal"
            className="absolute top-0 right-0 sm:top-3 sm:right-3 flex items-center justify-center w-10 h-10 rounded-full ease-in duration-150 bg-gray-3 text-dark hover:bg-gray-4 transition-colors"
          >
            <svg
              className="fill-current"
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.3108 13L19.2291 8.08167C19.5866 7.72417 19.5866 7.12833 19.2291 6.77083C19.0543 6.59895 18.8189 6.50262 18.5737 6.50262C18.3285 6.50262 18.0932 6.59895 17.9183 6.77083L13 11.6892L8.08164 6.77083C7.90679 6.59895 7.67142 6.50262 7.42623 6.50262C7.18104 6.50262 6.94566 6.59895 6.77081 6.77083C6.41331 7.12833 6.41331 7.72417 6.77081 8.08167L11.6891 13L6.77081 17.9183C6.41331 18.2758 6.41331 18.8717 6.77081 19.2292C7.12831 19.5867 7.72414 19.5867 8.08164 19.2292L13 14.3108L17.9183 19.2292C18.2758 19.5867 18.8716 19.5867 19.2291 19.2292C19.5866 18.8717 19.5866 18.2758 19.2291 17.9183L14.3108 13Z"
                fill=""
              />
            </svg>
          </button>

          <h3 className="text-custom-xl font-semibold mb-6 text-dark sm:text-heading-6">
            Update Address Details
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="rounded-2xl border border-gray-3 bg-gray-2 w-full py-3 px-4 text-custom-sm outline-none opacity-70 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  Phone
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  State / Province
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  District
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  Ward
                </label>
                <input
                  type="text"
                  name="ward"
                  value={formData.ward}
                  onChange={handleChange}
                  className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  House Number
                </label>
                <input
                  type="text"
                  name="house_number"
                  value={formData.house_number}
                  onChange={handleChange}
                  className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
                />
              </div>
              <div>
                <label className="block mb-2 ml-1 text-custom-xs font-semibold text-dark-4 uppercase tracking-wider">
                  Post Code
                </label>
                <input
                  type="text"
                  name="post_code"
                  value={formData.post_code}
                  onChange={handleChange}
                  className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-custom-sm font-medium">
                Full Address
              </label>
              <textarea
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className="rounded-2xl border border-gray-3 bg-gray-1 w-full py-3 px-4 text-custom-sm outline-none transition-all duration-200 focus:border-primary focus:bg-white-true focus:ring-4 focus:ring-primary/10"
              ></textarea>
            </div>

            <button
              type="submit"
              className="btn-action w-full"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
