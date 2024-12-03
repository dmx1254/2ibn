"use client";

import React, {
  ChangeEvent,
  FormEvent,
  useLayoutEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import useStore from "@/lib/store-manage";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Home,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
} from "lucide-react";
import { redirect } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useScopedI18n } from "@/locales/client";

const SignUpForm = () => {
  const tScope = useScopedI18n("signup");
  const router = useRouter();
  const { user } = useStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lastname: "",
    firstname: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    address: "",
    postalCode: "",
    code: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [lastnameError, setLastnameError] = useState<string>("");
  const [firstnameError, setFirstnameError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [phoneError, setPhoneError] = useState<string>("");
  const [codeError, setCodeError] = useState<string>("");
  const [countryError, setCountryError] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const [postalCodeError, setPostalCodeError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;

  const handleNextStep = async () => {
    if (step === 1) {
      if (
        !formData.lastname ||
        !formData.firstname ||
        !emailRegex.test(formData.email) ||
        !formData.phone
      ) {
        if (!formData.lastname) {
          setLastnameError(tScope("error.countCitAddr"));
        } else {
          setLastnameError("");
        }
        if (!formData.firstname) {
          setFirstnameError(tScope("error.countCitAddr"));
        } else {
          setFirstnameError("");
        }
        if (!formData.phone) {
          setPhoneError(tScope("error.countCitAddr"));
        } else {
          setPhoneError("");
        }
        if (!emailRegex.test(formData.email)) {
          setEmailError(tScope("error.emailFormat"));
        } else {
          setEmailError("");
        }
      } else {
        setLastnameError("");
        setFirstnameError("");
        setPhoneError("");
        setEmailError("");
        try {
          setLoading(true);
          await axios
            .post("/api/iben/user/sendEmail", {
              email: formData.email,
            })
            .then((response) => {
              if (response.data) {
                setEmailSent(true);
                setLoading(false);
                setStep(2);
              }
            });
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    } else if (step === 2) {
      // Vérifier le code (à implémenter)
      if (formData.code.length < 6) {
        setCodeError(tScope("error.codeLength"));
      } else {
        setCodeError("");
        try {
          setLoading(true);
          await axios
            .post("/api/iben/user/verificationCode", {
              code: formData.code,
            })
            .then((response) => {
              if (response.data) {
                setLoading(false);
                setStep(3);
              }
            });
        } catch (error: any) {
          if (error?.response?.data?.codeError) {
            toast.error(tScope("serverError.codeError"), {
              style: { color: "#dc2626" },
            });
          }
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const handlePrevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const postalCodeRegex =
      /^\d{5}(-\d{4})?$|^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;

    // Implémenter la logique d'inscription finale ici

    if (
      !formData.country ||
      !formData.city ||
      !formData.address ||
      formData.password.length < 8 ||
      formData.password !== confirmPassword ||
      !postalCodeRegex.test(formData.postalCode)
    ) {
      if (!formData.country) {
        setCountryError(tScope("error.countCitAddr"));
      } else {
        setCountryError("");
      }

      if (!formData.city) {
        setCityError(tScope("error.countCitAddr"));
      } else {
        setCityError("");
      }

      if (!formData.address) {
        setAddressError(tScope("error.countCitAddr"));
      } else {
        setAddressError("");
      }
      if (formData.password.length < 8) {
        setPasswordError(tScope("error.password"));
      } else {
        setPasswordError("");
      }
      if (formData.password !== confirmPassword) {
        setConfirmPasswordError(tScope("error.confirmPassword"));
      } else {
        setConfirmPasswordError("");
      }
      if (!postalCodeRegex.test(formData.postalCode)) {
        setPostalCodeError(tScope("error.postalCode"));
      } else {
        setPostalCodeError("");
      }
    } else {
      setCountryError("");
      setCityError("");
      setAddressError("");
      setPasswordError("");
      setConfirmPasswordError("");
      setPostalCodeError("");
      const data = {
        email: formData.email,
        password: formData.password,
        code: formData.code,
        isAdmin: false,
        moderator: false,
        profil: "",
        lastname: formData.lastname,
        firstname: formData.firstname,
        phone: formData.phone,
        address: formData.address,
        country: formData.country,
        city: formData.city,
        postalCode: formData.postalCode,
        isEmailVerified: true,
      };

      try {
        setLoading(true);
        await axios.post("/api/iben/user/register", data).then((response) => {
          if (response.data) {
            toast.success(tScope("serverSuccess.successMessage"), {
              style: { color: "#22c55e" },
            });
            setLoading(false);
            setTimeout(() => {
              router.replace("/signin");
            }, 1000);
          }
        });
      } catch (error: any) {
        // console.log(error);
        if (error?.response?.data?.userError) {
          toast.error(tScope("serverError.userError"), {
            style: { color: "#dc2626" },
          });
        }
      } finally {
        setLoading(false);
      }
      // userError
    }
  };

  useLayoutEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);

  const renderProgress = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((i) => (
        <React.Fragment key={i}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step >= i
                ? "bg-yellow-500 text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {step > i ? <Check className="w-4 h-4" /> : i}
          </div>
          {i < 3 && (
            <div
              className={`w-20 h-1 ${
                step > i ? "bg-yellow-500" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastname" className="text-white/80">
            {tScope("renderStep1.lastname")}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <Input
              id="lastname"
              name="lastname"
              className="pl-10 outline-none bg-transparent border-white/80 text-white/80 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/60"
              placeholder={tScope("renderStep1.lastname")}
              value={formData.lastname}
              onChange={handleChange}
            />
            {lastnameError && (
              <span className="text-red-500 text-sm">{lastnameError}</span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="firstname" className="text-white/80">
            {tScope("renderStep1.firstname")}
          </Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <Input
              id="firstname"
              name="firstname"
              className="pl-10 outline-none bg-transparent border-white/80 text-white/80 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/60"
              placeholder={tScope("renderStep1.firstname")}
              value={formData.firstname}
              onChange={handleChange}
            />
            {firstnameError && (
              <span className="text-red-500 text-sm">{firstnameError}</span>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/80">
          {tScope("renderStep1.email")}
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-white/60" />
          <Input
            id="email"
            name="email"
            type="email"
            className="pl-10 outline-none bg-transparent border-white/80 text-white/80 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/60"
            placeholder={tScope("renderStep1.emailPlace")}
            value={formData.email}
            onChange={handleChange}
          />
          {emailError && (
            <span className="text-red-500 text-sm">{emailError}</span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white/80">
          {tScope("renderStep1.phone")}
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-white/60" />
          <Input
            id="phone"
            name="phone"
            type="tel"
            className="pl-10 outline-none bg-transparent border-white/80 text-white/80 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/60"
            placeholder={tScope("renderStep1.phonePlace")}
            value={formData.phone}
            onChange={handleChange}
          />
          {phoneError && (
            <span className="text-red-500 text-sm">{phoneError}</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="w-full space-y-6">
      <div className="text-center">
        <Mail className="mx-auto h-12 w-12 text-yellow-500" />
        <h3 className="mt-4 text-xl font-semibold text-white/80">
          {tScope("renderStep2.title")}
        </h3>
        <p className="mt-2 text-sm text-green-600">
          {tScope("renderStep2.subTitle")} {formData.email}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="code" className="text-white/80 text-base">
          {tScope("renderStep2.codeText")}
        </Label>
        <Input
          id="code"
          name="code"
          className="text-center bg-transparent border-white/80 text-white/80 text-2xl tracking-widest outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-white/70 px-4 py-6"
          placeholder={tScope("renderStep2.codeText")}
          maxLength={6}
          value={formData.code}
          onChange={handleChange}
        />
        {codeError && <span className="text-red-500 text-sm">{codeError}</span>}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="text-white/80">
            {tScope("renderStep3.country")}
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-white/60" />
            <Input
              id="country"
              name="country"
              className="pl-10 outline-none bg-transparent text-white/80 border-white/80 placeholder:text-white/60 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder={tScope("renderStep3.countryPlace")}
              value={formData.country}
              onChange={handleChange}
            />
            {countryError && (
              <span className="text-red-500 text-sm">{countryError}</span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="city" className="text-white/80">
            {tScope("renderStep3.city")}
          </Label>
          <div className="relative">
            <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="city"
              name="city"
              className="pl-10 outline-none bg-transparent text-white/80 border-white/80 placeholder:text-white/60 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder={tScope("renderStep3.cityPlace")}
              value={formData.city}
              onChange={handleChange}
            />
            {cityError && (
              <span className="text-red-500 text-sm">{cityError}</span>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="address" className="text-white/80">
          {tScope("renderStep3.address")}
        </Label>
        <div className="relative">
          <Home className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="address"
            name="address"
            className="pl-10 outline-none bg-transparent text-white/80 border-white/80 placeholder:text-white/60 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={tScope("renderStep3.addressPlace")}
            value={formData.address}
            onChange={handleChange}
          />
          {addressError && (
            <span className="text-red-500 text-sm">{addressError}</span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="postalCode" className="text-white/80">
          {tScope("renderStep3.postalCode")}
        </Label>
        <Input
          id="postalCode"
          name="postalCode"
          placeholder="75001"
          type="text"
          value={formData.postalCode}
          onChange={handleChange}
          className="outline-none bg-transparent text-white/80 border-white/80 placeholder:text-white/60 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        {postalCodeError && (
          <span className="text-red-500 text-sm">{postalCodeError}</span>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/80">
          {tScope("renderStep3.password")}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type="password"
            className="pl-10 outline-none bg-transparent text-white/80 border-white/80 placeholder:text-white/60 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={tScope("renderStep3.password")}
            value={formData.password}
            onChange={handleChange}
          />
          {passwordError && (
            <span className="text-red-500 text-sm">{passwordError}</span>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/80">
          {tScope("renderStep3.confirmPassword")}
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="pl-10 outline-none bg-transparent text-white/80 border-white/80 placeholder:text-white/60 focus:outline-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder={tScope("renderStep3.confirmPassword")}
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
          />
          {confirmPasswordError && (
            <span className="text-red-500 text-sm">{confirmPasswordError}</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-xl bg-white/20 border-white/20">
        <CardHeader>
          <CardTitle className="text-center text-white/80">
            {step === 1 && tScope("renderStep.step1")}
            {step === 2 && tScope("renderStep.step2")}
            {step === 3 && tScope("renderStep.step3")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderProgress()}
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            <div className="flex justify-between pt-4">
              {step > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex items-center gap-2"
                  aria-label="signup button"
                >
                  <ArrowLeft className="w-4 h-4" />{" "}
                  {tScope("renderStep1.btnBack")}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2"
                  aria-label="signup button"
                >
                  <ArrowLeft className="w-4 h-4" />{" "}
                  {tScope("renderStep1.btnBack")}
                </Button>
              )}
              <Button
                type={step === 3 ? "submit" : "button"}
                onClick={step < 3 ? handleNextStep : undefined}
                className={`flex items-center gap-2 ${
                  step === 1 ? "ml-auto" : ""
                }`}
                disabled={loading}
                aria-label="signup button"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {step === 3
                      ? tScope("renderStep1.createMyAccount")
                      : tScope("renderStep1.btnNext")}
                    {step < 3 && <ArrowRight className="w-4 h-4" />}
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpForm;
