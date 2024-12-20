"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import {
  Mail,
  MapPin,
  Phone,
  Send,
  Clock,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useScopedI18n } from "@/locales/client";

const ContactUs = () => {
  const tScope = useScopedI18n("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //   const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //     const { name, value } = e.target;
  //     setFormData((prev) => ({
  //       ...prev,
  //       [name]: value,
  //     }));
  //   };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission
    setIsLoading(true);
    // console.log("Form submitted:", formData);
    new Promise((resolve) =>
      setTimeout(() => {
        setIsLoading(false);
        setSubmitted(true);
        resolve(undefined);
      }, 1500)
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 bg-white shadow-2xl rounded-3xl overflow-hidden">
        {/* Contact Information Section */}
        <div className="bg-gradient-to-br from-yellow-600 to-purple-700 text-white p-12 flex flex-col justify-between relative">
          <div>
            <h2 className="text-3xl font-bold mb-6">{tScope("title")}</h2>
            <p className="mb-8 text-blue-100">{tScope("desc")}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Mail className="w-8 h-8" />
              <div>
                <p className="font-semibold">{tScope("email")}</p>
                <p>support@2ibn.com</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="w-8 h-8" />
              <div>
                <p className="font-semibold">{tScope("phone")}</p>
                <p>+971 50 908 7560</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="w-8 h-8" />
              <div>
                <p className="font-semibold">{tScope("address")}</p>
                <p>Compass Building, Al Shohada Road, Ras Al Khaimah, UAE</p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 right-0 opacity-10">
            <Shield className="w-64 h-64" />
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="p-12">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {tScope("formTitle")}
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-gray-700">
                    {tScope("formName")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-2 text-gray-700">
                    {tScope("formEmail")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  {tScope("formSubject")}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-gray-700">
                  {tScope("formMessage")}
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-yellow-500 transition"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-600 to-purple-700 text-white py-4 rounded-lg hover:opacity-90 transition flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="flex items-center">
                    <Send className="mr-2" /> {tScope("btn")}
                  </div>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <HelpCircle className="w-32 h-32 mx-auto text-green-500" />
              <h2 className="text-3xl font-bold text-gray-800">
                {tScope("successTitle")}
              </h2>
              <p className="text-gray-600">{tScope("successDesc")}</p>
              <button
                onClick={() => setSubmitted(false)}
                className="mx-auto block bg-gradient-to-r from-yellow-600 to-purple-700 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition"
              >
                {tScope("successSuggest")}
              </button>
            </div>
          )}

          <div className="mt-8 text-center text-gray-500 flex items-center justify-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>
              {tScope("formResponse")}: {tScope("formWithin")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
