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

const AccountAndBilling = ({
  onContinue,
  status,
  formData,
  setFormData,
  createAccount,
  loadingRegister,
  billingInfo,
  setBillingInfo,
}: {
  onContinue: () => void;
  status: string;
  formData: any;
  setFormData: (val: string) => void;
  createAccount: () => void;
  loadingRegister: boolean;
  billingInfo: Billing;
  setBillingInfo: (type: Billing) => void;
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

    createAccount();
  };

  return (
    <Card className="w-full mx-auto border-none shadow-none">
      {!session && (
        <CardHeader>
          <CardTitle className="text-lg">
            {tScope("renderStep1.personnalInformation")}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        {session ? (
          <Card className="w-full border-none shadow-none flex flex-col items-start space-y-6">
            <div
              className="flex items-center gap-2 cursor-pointer"
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
              <div className="flex items-center gap-2 mb-4 mt-1">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="lastname" className="required">
                      {tScope("renderStep1.firstname")}
                    </Label>
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

                  <div className="grid gap-2">
                    <Label htmlFor="firstname" className="required">
                      {tScope("renderStep1.lastname")}
                    </Label>
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
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="adresse" className="required">
                        {tScope("renderStep3.address")}
                      </Label>
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

                    <div className="grid gap-2">
                      <Label htmlFor="pays" className="required">
                        {tScope("renderStep3.country")}
                      </Label>
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                      <Label htmlFor="codePostal">
                        {tScope("renderStep3.postalCode")}
                      </Label>
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
                    <div className="grid gap-2">
                      <Label htmlFor="city" className="required">
                        {tScope("renderStep3.city")}
                      </Label>
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
                      />
                      {cityError && (
                        <span className="text-sm text-red-600">
                          {cityError}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="departement" className="required">
                      {tScope("renderStep3.depart")}
                    </Label>
                    <Select
                      value={billingInfo.departement}
                      onValueChange={(value) =>
                        setBillingInfo({ ...billingInfo, departement: value })
                      }
                    >
                      <SelectTrigger className="w-full max-w-60 focus:ring-0 focus:ring-offset-0">
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
              </Card>
            )}

            <button
              onClick={handleContinue}
              className="text-base px-6 py-2 rounded bg-yellow-600 text-white transition-colors hover:opacity-90"
            >
              Continuer
            </button>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="lastname" className="required">
                    {tScope("renderStep1.firstname")}
                  </Label>
                  <Input
                    id="lastname"
                    required
                    placeholder={tScope("renderStep1.firstname")}
                    value={formData.lastname}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, lastname: e.target.value })
                    }
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="firstname" className="required">
                    {tScope("renderStep1.lastname")}
                  </Label>
                  <Input
                    id="firstname"
                    required
                    value={formData.firstname}
                    placeholder={tScope("renderStep1.lastname")}
                    onChange={(e) =>
                      setFormData({ ...formData, firstname: e.target.value })
                    }
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className="required">
                    {tScope("renderStep1.email")}
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
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone" className="required">
                    {tScope("renderStep1.phone")}
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
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </div>
            {status !== "authenticated" && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {tScope("renderStep1.passwordDesc")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="password" className="required">
                      {tScope("renderStep3.password")}
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
                      className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {passwordError && (
                      <span className="text-sm text-red-600">
                        {passwordError}
                      </span>
                    )}
                    {confirmPasswordError && (
                      <span className="text-sm invisible text-red-600">
                        {confirmPasswordError}
                      </span>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword" className="required">
                      {tScope("renderStep3.confirmPassword")}
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
                      className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    {confirmPasswordError && (
                      <span className="text-sm text-red-600">
                        {confirmPasswordError}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {tScope("renderStep3.addressPlace")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="adresse" className="required">
                    {tScope("renderStep3.address")}
                  </Label>
                  <Input
                    id="adresse"
                    required
                    value={formData.address}
                    placeholder={tScope("renderStep3.address")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {countrySignupError && (
                    <span className="text-sm invisible text-red-600">
                      {countrySignupError}
                    </span>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="pays" className="required">
                    {tScope("renderStep3.country")}
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      setFormData({ ...formData, country: value })
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
                  {countrySignupError && (
                    <span className="text-sm text-red-600">{countrySignupError}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="codePostal">
                    {tScope("renderStep3.postalCode")}
                  </Label>
                  <Input
                    id="codePostal"
                    value={formData.codePostal}
                    placeholder={tScope("renderStep3.postalCode")}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({ ...formData, codePostal: e.target.value })
                    }
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {postalCodeSignupError && (
                    <span className="text-sm  text-red-600">
                      {postalCodeSignupError}
                    </span>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="city" className="required">
                    {tScope("renderStep3.city")}
                  </Label>
                  <Input
                    id="city"
                    required
                    value={formData.city}
                    placeholder={tScope("renderStep3.city")}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="outline-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                  {postalCodeSignupError && (
                    <span className="text-sm invisible text-red-600">
                      {postalCodeSignupError}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="departement" className="required">
                  {tScope("renderStep3.depart")}
                </Label>
                <Select
                  value={formData.departement}
                  onValueChange={(value) =>
                    setFormData({ ...formData, departement: value })
                  }
                >
                  <SelectTrigger className="w-full max-w-60 focus:ring-0 focus:ring-offset-0">
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
                  <span className="text-sm text-red-600">
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
