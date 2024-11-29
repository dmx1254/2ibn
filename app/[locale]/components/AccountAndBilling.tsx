"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { Country, State, City } from "country-state-city";
import { ICountry, IState, ICity } from "country-state-city";
import { useScopedI18n } from "@/locales/client";
import { Billing } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { UserProfile } from "@/lib/types/types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "./ui/skeleton";
import clsx from "clsx";

const AccountAndBilling = ({
  onContinue,
  status,
  formData,
  setFormData,
  createAccount,
  loadingRegister,
  billingInfo,
  setBillingInfo,
  invitedAccount,
}: {
  onContinue: () => void;
  status: string;
  formData: any;
  setFormData: (val: string) => void;
  createAccount: () => void;
  loadingRegister: boolean;
  billingInfo: Billing;
  setBillingInfo: (type: Billing) => void;
  invitedAccount: boolean;
}) => {
  const { data: session } = useSession();
  const tScope = useScopedI18n("signup");
  const tScopeDialog = useScopedI18n("dialogsell");
  const [cityList, setCityList] = useState<IState[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [existAddressOrNew, setExistAddressOrNew] = useState<
    "exitsAddress" | "newAddress"
  >("exitsAddress");
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
  const [departementError, setDepartementError] = useState<string>("");
  const [countrySignupError, setCountrySignupError] = useState<string>("");
  const [postalCodeSignupError, setPostalCodeSignupError] =
    useState<string>("");
  const [departementSignupError, setDepartementSignupError] =
    useState<string>("");

  // INVITED ACCOUNT

  const [lastnameInvitedError, setLastnameInvitedError] = useState<string>("");
  const [firstnameInvitedError, setFirstnameInvitedError] =
    useState<string>("");
  const [emailInvitedError, setEmailInvitedError] = useState<string>("");
  const [phoneInvitedError, setPhoneInvitedError] = useState<string>("");
  const [addressInvitedError, setAddressInvitedError] = useState<string>("");
  const [countryInvitedError, setCountryInvitedError] = useState<string>("");
  const [cityInvitedError, setCityInvitedError] = useState<string>("");
  const [postalCodeInvitedError, setPostalCodeInvitedError] =
    useState<string>("");
  const [departementInvitedError, setDepartementInvitedError] =
    useState<string>("");

  // console.log(session);

  const getUser = async () => {
    const response = await axios.get(`/api/iben/user/${session?.user.id}`);
    return response.data;
  };
  const { isLoading, data, error } = useQuery({
    queryKey: ["userOrder", session?.user.id],
    queryFn: getUser,
    enabled: !!session?.user.id,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  //   console.log(continents);
  //   console.log(countries);
  //   console.log(Object.values(countries));
  //   console.log(typeof countries);
  //   console.log(languages);

  const countries = Country.getAllCountries();

  const handleChangeRadioAddress = (
    e: ChangeEvent<HTMLInputElement>,
    type?: string
  ) => {
    setExistAddressOrNew(e.target.id as "exitsAddress" | "newAddress");
  };
  const handleChangeRadioAddressDiv = (type: string) => {
    setExistAddressOrNew(type as "exitsAddress" | "newAddress");
  };
  // console.log(Object.values(countriesWT));

  useEffect(() => {
    const filterCountry = formData.country
      ? formData.country
      : billingInfo.country
      ? billingInfo.country
      : "France";
    const isCountry = countries.find((c) => c.name === filterCountry)?.isoCode;
    if (isCountry) {
      const statesCities = State.getStatesOfCountry(isCountry);
      setCityList(statesCities);
    }
  }, [formData.country, billingInfo.country]);

  const handleContinue = () => {
    const newBilling = {
      lastname: user?.lastname || "",
      firstname: user?.firstname || "",
      address: user?.address || "",
      country: user?.country || "",
      codePostal: user?.postalCode || "",
      city: user?.city || "",
      departement: user?.departement || "",
    };
    if (existAddressOrNew === "exitsAddress") {
      setBillingInfo(newBilling!);
      onContinue();
    } else {
      if (
        !billingInfo.lastname ||
        !billingInfo.firstname ||
        !billingInfo.address ||
        !billingInfo.country ||
        !billingInfo.codePostal ||
        !billingInfo.city ||
        !billingInfo.departement
      ) {
        if (!billingInfo.lastname) {
          setLastnameError(tScopeDialog("lastnameError"));
        } else {
          setLastnameError("");
        }
        if (!billingInfo.firstname) {
          setFirstnameError(tScopeDialog("lastnameError"));
        } else {
          setFirstnameError("");
        }
        if (!billingInfo.address) {
          setAddressError(tScopeDialog("lastnameError"));
        } else {
          setAddressError("");
        }
        if (!billingInfo.country) {
          setCountryError(tScopeDialog("lastnameError"));
        } else {
          setCountryError("");
        }
        if (!billingInfo.codePostal) {
          setPostalCodeError(tScopeDialog("lastnameError"));
        } else {
          setPostalCodeError("");
        }
        if (!billingInfo.city) {
          setCityError(tScopeDialog("lastnameError"));
        } else {
          setCityError("");
        }
        if (!billingInfo.departement) {
          setDepartementError(tScopeDialog("lastnameError"));
        } else {
          setDepartementError("");
        }
      } else {
        onContinue();
      }
    }
  };

  const handleInvitedAccountContinue = () => {
    if (
      !billingInfo.lastname ||
      !billingInfo.firstname ||
      !billingInfo.phone ||
      !billingInfo.email ||
      !billingInfo.address ||
      !billingInfo.country ||
      !billingInfo.codePostal ||
      !billingInfo.city ||
      !billingInfo.departement
    ) {
      if (!billingInfo.lastname) {
        setLastnameInvitedError(tScopeDialog("lastnameError"));
      } else {
        setLastnameInvitedError("");
      }
      if (!billingInfo.firstname) {
        setFirstnameInvitedError(tScopeDialog("lastnameError"));
      } else {
        setFirstnameInvitedError("");
      }
      if (!billingInfo.email) {
        setEmailInvitedError(tScopeDialog("lastnameError"));
      } else {
        setEmailInvitedError("");
      }
      if (!billingInfo.phone) {
        setPhoneInvitedError(tScopeDialog("lastnameError"));
      } else {
        setPhoneInvitedError("");
      }
      if (!billingInfo.address) {
        setAddressInvitedError(tScopeDialog("lastnameError"));
      } else {
        setAddressInvitedError("");
      }
      if (!billingInfo.country) {
        setCountryInvitedError(tScopeDialog("lastnameError"));
      } else {
        setCountryInvitedError("");
      }
      if (!billingInfo.codePostal) {
        setPostalCodeInvitedError(tScopeDialog("lastnameError"));
      } else {
        setPostalCodeInvitedError("");
      }
      if (!billingInfo.city) {
        setCityInvitedError(tScopeDialog("lastnameError"));
      } else {
        setCityInvitedError("");
      }
      if (!billingInfo.departement) {
        setDepartementInvitedError(tScopeDialog("lastnameError"));
      } else {
        setDepartementInvitedError("");
      }
    } else {
      onContinue();
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      formData.password.length < 8 ||
      formData.password !== formData.confirmPassword ||
      !formData.country ||
      !formData.postalCode ||
      !formData.departement
    ) {
      if (!formData.country) {
        setCountrySignupError(tScopeDialog("lastnameError"));
      } else {
        setCountrySignupError("");
      }
      if (!formData.codePostal) {
        setPostalCodeSignupError(tScopeDialog("lastnameError"));
      } else {
        setPostalCodeSignupError("");
      }

      if (!formData.departement) {
        setDepartementSignupError(tScopeDialog("lastnameError"));
      } else {
        setDepartementSignupError("");
      }
      if (formData.password.length < 8) {
        setPasswordError(tScope("error.password"));
      } else {
        setPasswordError("");
      }
      if (formData.password !== formData.confirmPassword) {
        setConfirmPasswordError(tScope("error.confirmPassword"));
      } else {
        setConfirmPasswordError("");
      }
    } else {
      createAccount();
    }
  };

  return (
    <Card className="w-full mx-auto border-none shadow-none">
      {!session && (
        <CardHeader className="w-full">
          <CardTitle className="text-lg border-b border-dashed border-gray-400 pb-2">
            {tScope("renderStep1.personnalInformation")}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {session ? (
          <Card className="w-full border-none shadow-none flex flex-col items-start space-y-6">
            <div
              className="flex items-center gap-2 cursor-pointer mt-4"
              onClick={() => handleChangeRadioAddressDiv("exitsAddress")}
            >
              <input
                type="radio"
                name="exitsAddress"
                id="exitsAddress"
                checked={existAddressOrNew === "exitsAddress"}
                onChange={handleChangeRadioAddress}
                className="cursor-pointer"
              />
              <span className="text-base">
                Je veux utiliser une adresse existante.
              </span>
            </div>
            {isLoading ? (
              <div className="flex items-center gap-2 mb-2 mt-1">
                <Skeleton className="w-10 h-2" />
                <Skeleton className="w-10 h-2" />
                <Skeleton className="w-10 h-2" />
                <Skeleton className="w-10 h-2" />
              </div>
            ) : (
              existAddressOrNew !== "newAddress" && (
                <div className="flex items-center gap-2 mb-4 mt-1 bg-yellow-50 text-yellow-500 p-2 rounded">
                  {user?.lastname} {user?.firstname}, {user?.address},{" "}
                  {user?.departement}, {user?.city}, {user?.country}
                </div>
              )
            )}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleChangeRadioAddressDiv("newAddress")}
            >
              <input
                type="radio"
                name="newAddress"
                id="newAddress"
                checked={existAddressOrNew === "newAddress"}
                onChange={handleChangeRadioAddress}
                className="cursor-pointer"
              />
              <span className="text-base">
                Je veux utiliser une nouvelle adresse.
              </span>
            </div>
            {existAddressOrNew === "newAddress" && (
              <Card className="w-full shadow-none border-none">
                <div className="grid grid-cols-1 gap-6">
                  <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                    <Label
                      htmlFor="lastname"
                      className="relative required lg:w-1/5"
                    >
                      {tScope("renderStep1.firstname")} :
                      <span className="absolute text-red-600 text-lg top-[-56%] left-[-10%] lg:left-[-3.5%]">
                        *
                      </span>
                    </Label>
                    <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                      <Input
                        id="lastname"
                        required
                        placeholder={tScope("renderStep1.firstname")}
                        value={billingInfo.lastname}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          setBillingInfo({
                            ...billingInfo,
                            lastname: e.target.value,
                          })
                        }
                        className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {lastnameError && (
                        <span className="text-sm text-red-600">
                          {lastnameError}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                    <Label
                      htmlFor="firstname"
                      className="relative required lg:w-1/5"
                    >
                      {tScope("renderStep1.lastname")} :
                      <span className="absolute text-red-600 text-lg top-[-56%] left-[-13%] lg:left-[-3.5%]">
                        *
                      </span>
                    </Label>
                    <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                      <Input
                        id="firstname"
                        required
                        value={billingInfo.firstname}
                        placeholder={tScope("renderStep1.lastname")}
                        onChange={(e) =>
                          setBillingInfo({
                            ...billingInfo,
                            firstname: e.target.value,
                          })
                        }
                        className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                      {firstnameError && (
                        <span className="text-sm text-red-600">
                          {firstnameError}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 gap-6">
                    <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                      <Label
                        htmlFor="adresse"
                        className="relative required lg:w-1/5"
                      >
                        {tScope("renderStep3.address")} :
                        <span className="absolute text-red-600 text-lg top-[-56%] left-[-9%] lg:left-[-3.5%]">
                          *
                        </span>
                      </Label>
                      <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                        <Input
                          id="adresse"
                          required
                          value={billingInfo.address}
                          placeholder={tScope("renderStep3.address")}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setBillingInfo({
                              ...billingInfo,
                              address: e.target.value,
                            })
                          }
                          className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {addressError && (
                          <span className="text-sm text-red-600">
                            {addressError}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                      <Label
                        htmlFor="pays"
                        className="relative required lg:w-1/5"
                      >
                        {tScope("renderStep3.country")} :
                        <span className="absolute text-red-600 text-lg top-[-56%] left-[-14%] lg:left-[-3.5%]">
                          *
                        </span>
                      </Label>
                      <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                        <Select
                          value={billingInfo.country}
                          onValueChange={(value) =>
                            setBillingInfo({ ...billingInfo, country: value })
                          }
                        >
                          <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
                            <SelectValue placeholder="Sélectionnez un pays" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((c) => (
                              <SelectItem key={c.name} value={c.name}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {countryError && (
                          <span className="text-sm text-red-600">
                            {countryError}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                      <Label htmlFor="codePostal" className="relative lg:w-1/5">
                        {tScope("renderStep3.postalCode")} :
                        <span className="absolute text-red-600 text-lg top-[-56%] left-[-8%] lg:left-[-3.5%]">
                          *
                        </span>
                      </Label>
                      <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                        <Input
                          id="codePostal"
                          value={billingInfo.codePostal}
                          placeholder={tScope("renderStep3.postalCode")}
                          onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            setBillingInfo({
                              ...billingInfo,
                              codePostal: e.target.value,
                            })
                          }
                          className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {postalCodeError && (
                          <span className="text-sm text-red-600">
                            {postalCodeError}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                      <Label
                        htmlFor="city"
                        className="relative required lg:w-1/5"
                      >
                        {tScope("renderStep3.city")} :
                        <span className="absolute text-red-600 text-lg top-[-56%] left-[-15%] lg:left-[-3.5%]">
                          *
                        </span>
                      </Label>
                      <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                        <Input
                          id="city"
                          required
                          value={billingInfo.city}
                          placeholder={tScope("renderStep3.city")}
                          onChange={(e) =>
                            setBillingInfo({
                              ...billingInfo,
                              city: e.target.value,
                            })
                          }
                          className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        {cityError && (
                          <span className="text-sm text-red-600">
                            {cityError}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                    <Label
                      htmlFor="departement"
                      className="relative required lg:w-1/5"
                    >
                      {tScope("renderStep3.depart")} :
                      <span className="absolute text-red-600 text-lg top-[-56%] left-[-8%] lg:left-[-3.5%]">
                        *
                      </span>
                    </Label>
                    <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                      <Select
                        value={billingInfo.departement}
                        onValueChange={(value) =>
                          setBillingInfo({ ...billingInfo, departement: value })
                        }
                      >
                        <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="--- Veuillez choisir ---" />
                        </SelectTrigger>
                        <SelectContent>
                          {cityList.map((c) => (
                            <SelectItem key={c.name} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {departementError && (
                        <span className="text-sm text-red-600">
                          {departementError}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <button
              onClick={handleContinue}
              className="text-base px-6 py-2 rounded bg-yellow-600 text-white transition-colors hover:opacity-90"
            >
              Continuer
            </button>
          </Card>
        ) : invitedAccount ? (
          <Card className="w-full shadow-none border-none">
            <div className="grid grid-cols-1 gap-6">
              <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                <Label
                  htmlFor="lastname"
                  className="relative required lg:w-1/5"
                >
                  {tScope("renderStep1.firstname")} :
                  <span className="absolute text-red-600 text-lg top-[-56%] left-[-10%] lg:left-[-3.5%]">
                    *
                  </span>
                </Label>
                <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                  <Input
                    id="lastname"
                    required
                    placeholder={tScope("renderStep1.firstname")}
                    value={billingInfo.lastname}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setBillingInfo({
                        ...billingInfo,
                        lastname: e.target.value,
                      })
                    }
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {lastnameInvitedError && (
                    <span className="text-sm text-red-600">
                      {lastnameInvitedError}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                <Label
                  htmlFor="firstname"
                  className="relative required lg:w-1/5"
                >
                  {tScope("renderStep1.lastname")} :
                  <span className="absolute text-red-600 text-lg top-[-56%] left-[-13%] lg:left-[-3.5%]">
                    *
                  </span>
                </Label>
                <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                  <Input
                    id="firstname"
                    required
                    value={billingInfo.firstname}
                    placeholder={tScope("renderStep1.lastname")}
                    onChange={(e) =>
                      setBillingInfo({
                        ...billingInfo,
                        firstname: e.target.value,
                      })
                    }
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {firstnameInvitedError && (
                    <span className="text-sm text-red-600">
                      {firstnameInvitedError}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                <Label htmlFor="email" className="relative required lg:w-1/5">
                  {tScope("renderStep3.email")} :
                  <span className="absolute text-red-600 text-lg top-[-56%] left-[-9%] lg:left-[-3.5%]">
                    *
                  </span>
                </Label>
                <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                  <Input
                    id="email"
                    required
                    type="email"
                    value={billingInfo.email}
                    placeholder={tScope("renderStep3.email")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setBillingInfo({
                        ...billingInfo,
                        email: e.target.value,
                      })
                    }
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {emailInvitedError && (
                    <span className="text-sm text-red-600">
                      {emailInvitedError}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                <Label htmlFor="phone" className="relative required lg:w-1/5">
                  {tScope("renderStep3.phone")} :
                  <span className="absolute text-red-600 text-lg top-[-56%] left-[-9%] lg:left-[-3.5%]">
                    *
                  </span>
                </Label>
                <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                  <Input
                    id="phone"
                    required
                    value={billingInfo.phone}
                    placeholder={tScope("renderStep3.phone")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setBillingInfo({
                        ...billingInfo,
                        phone: e.target.value,
                      })
                    }
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {phoneInvitedError && (
                    <span className="text-sm text-red-600">
                      {phoneInvitedError}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-6">
                <h3 className="text-lg font-medium border-b border-dashed border-gray-400 pb-2">
                  {tScope("renderStep3.addressPlace")}
                </h3>
                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label
                    htmlFor="adresse"
                    className="relative required lg:w-1/5"
                  >
                    {tScope("renderStep3.address")} :
                    <span className="absolute text-red-600 text-lg top-[-56%] left-[-9%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                    <Input
                      id="adresse"
                      required
                      value={billingInfo.address}
                      placeholder={tScope("renderStep3.address")}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setBillingInfo({
                          ...billingInfo,
                          address: e.target.value,
                        })
                      }
                      className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {addressInvitedError && (
                      <span className="text-sm text-red-600">
                        {addressInvitedError}
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label htmlFor="pays" className="relative required lg:w-1/5">
                    {tScope("renderStep3.country")} :
                    <span className="absolute text-red-600 text-lg top-[-56%] left-[-14%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                    <Select
                      value={billingInfo.country}
                      onValueChange={(value) =>
                        setBillingInfo({ ...billingInfo, country: value })
                      }
                    >
                      <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
                        <SelectValue placeholder="Sélectionnez un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.name} value={c.name}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {countryInvitedError && (
                      <span className="text-sm text-red-600">
                        {countryInvitedError}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label htmlFor="codePostal" className="relative lg:w-1/5">
                    {tScope("renderStep3.postalCode")} :
                    <span className="absolute text-red-600 text-lg top-[-56%] left-[-8%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                    <Input
                      id="codePostal"
                      value={billingInfo.codePostal}
                      placeholder={tScope("renderStep3.postalCode")}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setBillingInfo({
                          ...billingInfo,
                          codePostal: e.target.value,
                        })
                      }
                      className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {postalCodeInvitedError && (
                      <span className="text-sm text-red-600">
                        {postalCodeInvitedError}
                      </span>
                    )}
                  </div>
                </div>
                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label htmlFor="city" className="relative required lg:w-1/5">
                    {tScope("renderStep3.city")} :
                    <span className="absolute text-red-600 text-lg top-[-56%] left-[-15%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                    <Input
                      id="city"
                      required
                      value={billingInfo.city}
                      placeholder={tScope("renderStep3.city")}
                      onChange={(e) =>
                        setBillingInfo({
                          ...billingInfo,
                          city: e.target.value,
                        })
                      }
                      className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {cityInvitedError && (
                      <span className="text-sm text-red-600">
                        {cityInvitedError}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                <Label
                  htmlFor="departement"
                  className="relative required lg:w-1/5"
                >
                  {tScope("renderStep3.depart")} :
                  <span className="absolute text-red-600 text-lg top-[-56%] left-[-8%] lg:left-[-3.5%]">
                    *
                  </span>
                </Label>
                <div className="w-full lg:w-4/5 flex flex-col items-start gap-1">
                  <Select
                    value={billingInfo.departement}
                    onValueChange={(value) =>
                      setBillingInfo({ ...billingInfo, departement: value })
                    }
                  >
                    <SelectTrigger className="focus:ring-0 focus:ring-offset-0">
                      <SelectValue placeholder="--- Veuillez choisir ---" />
                    </SelectTrigger>
                    <SelectContent>
                      {cityList.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {departementInvitedError && (
                    <span className="text-sm text-red-600">
                      {departementInvitedError}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={handleInvitedAccountContinue}
              className="text-base mt-4 px-6 py-2 rounded bg-yellow-600 text-white transition-colors hover:opacity-90"
            >
              Continuer
            </button>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label
                    htmlFor="lastname"
                    className="relative required lg:w-1/5"
                  >
                    {tScope("renderStep1.firstname")} :
                    <span className="absolute text-red-600 text-lg top-[-50%] left-[-12%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <Input
                    id="lastname"
                    required
                    placeholder={tScope("renderStep1.firstname")}
                    value={formData.lastname}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    className="lg:w-4/5 outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label
                    htmlFor="firstname"
                    className="relative required lg:w-1/5"
                  >
                    {tScope("renderStep1.lastname")} :
                    <span className="absolute text-red-600 text-lg top-[-52%] left-[-16%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <Input
                    id="firstname"
                    required
                    value={formData.firstname}
                    placeholder={tScope("renderStep1.lastname")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, firstname: e.target.value })
                    }
                    className="outline-none lg:w-4/5 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label htmlFor="email" className="relative required lg:w-1/5">
                    {tScope("renderStep1.email")} :
                    <span className="absolute text-red-600 text-lg top-[-52%]  left-[-14%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <Input
                    id="courriel"
                    type="email"
                    required
                    placeholder={tScope("renderStep1.emailPlace")}
                    value={formData.email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="outline-none lg:w-4/5 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label htmlFor="phone" className="relative required lg:w-1/5">
                    {tScope("renderStep1.phone")} :
                    <span className="absolute text-red-600 text-lg top-[-52%]  left-[-10%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    placeholder={tScope("renderStep1.phonePlace")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="outline-none lg:w-4/5 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </div>
            {status !== "authenticated" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium border-b border-dashed border-gray-400 pb-2">
                  {tScope("renderStep1.passwordDesc")}
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                    <Label
                      htmlFor="password"
                      className="relative required lg:w-1/5"
                    >
                      {tScope("renderStep3.password")} :
                      <span className="absolute text-red-600 text-lg top-[-52%]  left-[-8%] lg:left-[-3.5%]">
                        *
                      </span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      placeholder="********"
                      value={formData.password}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      className={clsx(
                        "outline-none lg:w-4/5 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                        {
                          "border-red-600": passwordError,
                        }
                      )}
                    />
                    {passwordError && (
                      <span className="flex lg:hidden text-sm text-red-600">
                        {passwordError}
                      </span>
                    )}
                  </div>

                  <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="relative required lg:w-1/5"
                    >
                      {tScope("renderStep3.confirmPassword")} :
                      <span className="absolute text-red-600 text-lg top-[-52%]  left-[-4%] lg:left-[-3.5%]">
                        *
                      </span>
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      required
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className={clsx(
                        "outline-none lg:w-4/5 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                        {
                          "border-red-600": confirmPasswordError,
                        }
                      )}
                    />
                    {confirmPasswordError && (
                      <span className="flex lg:hidden text-sm text-red-600">
                        {confirmPasswordError}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b border-dashed border-gray-400 pb-2">
                {tScope("renderStep3.addressPlace")}
              </h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label
                    htmlFor="adresse"
                    className="relative required lg:w-1/5"
                  >
                    {tScope("renderStep3.address")} :
                    <span className="absolute text-red-600 text-lg top-[-52%]  left-[-6%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <Input
                    id="adresse"
                    required
                    value={formData.address}
                    placeholder={tScope("renderStep3.address")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="outline-none lg:w-4/5 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {countrySignupError && (
                    <span className="text-sm invisible text-red-600">
                      {countrySignupError}
                    </span>
                  )}
                </div>

                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label htmlFor="pays" className="relative required w-1/5">
                    {tScope("renderStep3.country")} :
                    <span className="absolute text-red-600 text-lg top-[-52%]  left-[-8%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
                    }
                    required
                  >
                    <SelectTrigger
                      className={clsx(
                        "lg:w-4/5 focus:ring-0 focus:ring-offset-0",
                        {
                          "border-red-600": countrySignupError,
                        }
                      )}
                    >
                      <SelectValue placeholder="Sélectionnez un pays" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.name} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {countrySignupError && (
                    <span className="flex lg:hidden text-sm text-red-600">
                      {countrySignupError}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label htmlFor="codePostal" className="relative lg:w-1/5">
                    {tScope("renderStep3.postalCode")} :
                    <span className="absolute text-red-600 text-lg top-[-52%]  left-[-8%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <Input
                    id="codePostal"
                    value={formData.codePostal}
                    placeholder={tScope("renderStep3.postalCode")}
                    required
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, codePostal: e.target.value })
                    }
                    className="outline-none lg:w-4/5 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {postalCodeSignupError && (
                    <span className="flex lg:hidden text-sm text-red-600">
                      {postalCodeSignupError}
                    </span>
                  )}
                </div>
                <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                  <Label htmlFor="city" className="relative required w-1/5">
                    {tScope("renderStep3.city")} :
                    <span className="absolute text-red-600 text-lg top-[-52%]  left-[-8%] lg:left-[-3.5%]">
                      *
                    </span>
                  </Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    placeholder={tScope("renderStep3.city")}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className={clsx(
                      "outline-none lg:w-4/5 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
                      {
                        "border-red-600": postalCodeSignupError,
                      }
                    )}
                  />
                </div>
              </div>

              <div className="w-full max-lg:items-start max-lg:flex-col flex items-center justify-between gap-2">
                <Label
                  htmlFor="departement"
                  className="relative required lg:w-1/5"
                >
                  {tScope("renderStep3.depart")} :
                  <span className="absolute text-red-600 text-lg top-[-52%]  left-[-6%] lg:left-[-3.5%]">
                    *
                  </span>
                </Label>
                <Select
                  value={formData.departement}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departement: value })
                  }
                  required
                >
                  <SelectTrigger
                    className={clsx(
                      "lg:w-4/5 focus:ring-0 focus:ring-offset-0",
                      {
                        "border-red-600": departementSignupError,
                      }
                    )}
                  >
                    <SelectValue placeholder="--- Veuillez choisir ---" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityList.map((c) => (
                      <SelectItem key={c.name} value={c.name}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {departementSignupError && (
                  <span className="flex lg:hidden text-sm text-red-600">
                    {departementSignupError}
                  </span>
                )}
              </div>
            </div>

            <button
              // onClick={onContinue}
              type="submit"
              className="bg-yellow-600 text-white text-base px-6 py-2 rounded hover:bg-yellow-700 transition-colors"
            >
              {loadingRegister ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Continuer"
              )}
            </button>
          </form>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountAndBilling;
