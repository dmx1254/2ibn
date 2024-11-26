"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { UserPaymentMethodResponse } from "@/lib/types/types";
import { useScopedI18n } from "@/locales/client";

// Définition des interfaces
interface UserCard {
  code: string;
  expirationDate: string;
}

interface UserPaymentMethod {
  method: string;
  rib?: string;
  trc20Address?: string;
  email?: string;
  cardInfo?: UserCard;
}
type UserIDENTIF = {
  userId: string | undefined;
};

const PaymentMethod: React.FC<UserIDENTIF> = ({ userId }) => {
  const tScope = useScopedI18n("paymentMethod");

  // États pour gérer les méthodes de paiement
  const [paymentMethods, setPaymentMethods] = useState<
    UserPaymentMethodResponse[]
  >([]);
  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [newMethod, setNewMethod] = useState<UserPaymentMethod>({
    method: "",
  });
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const [isPaymentDeletedLoading, setIsPaymentDeletedLoading] =
    useState<boolean>(false);
  const [idSelect, setIdSelect] = useState<string>("");

  useEffect(() => {
    const getPaymentMethods = async () => {
      const data = { userId };
      const response = await axios.post(
        `/api/iben/user/getPaymentMethods`,
        data
      );
      if (response) {
        setPaymentMethods(response.data);
      }
    };
    if (userId) {
      getPaymentMethods();
    }
  }, [userId]);

  // Méthodes de paiement disponibles
  const paymentMethodOptions = [
    { value: "carte_bancaire", label: tScope("bankCardTitle") },
    { value: "paypal", label: "PayPal" },
    { value: "trc20", label: "TRC20" },
    { value: "cih", label: "CIH Bank" },
    { value: "bmce", label: "BMCE Bank" },
    { value: "attijariwafa-bank", label: "Attijariwafa Bank" },
  ];

  // Gestion de l'ajout d'un nouveau moyen de paiement
  const handleAddPaymentMethod = async () => {
    if (newMethod.method && userId) {
      // setPaymentMethods([...paymentMethods, newMethod]);
      // Réinitialiser le formulaire
      // setNewMethod({ method: "" });
      // console.log(newMethod);
      const data = {
        ...newMethod,
        userId,
      };

      try {
        setIsPaymentLoading(true);
        const response = await axios.post(
          "/api/iben/user/addPaymentMethod",
          data
        );
        if (response.data) {
          toast.success(tScope("successMessageAdd"), {
            style: { color: "#16a34a" },
          });
        }
      } catch (error) {
        toast.error(tScope("errorMessage"), {
          style: { color: "#dc2626" },
        }),
          console.log(error);
      } finally {
        setIsPaymentLoading(false);
      }
    }
  };

  const deletePaymentMethod = async (idUser: string) => {
    setIdSelect(idUser);
    try {
      setIsPaymentDeletedLoading(true);
      const data = { id: idUser };
      const response = await axios.post(
        `/api/iben/user/deletePaymentMethod`,
        data
      );
      if (response.data) {
        toast.success(tScope("successMessageDel"), {
          style: { color: "#16a34a" },
        });
      }
    } catch (error) {
      toast.error(tScope("errorMessage"), {
        style: { color: "#dc2626" },
      }),
        console.log(error);
    } finally {
      setIsPaymentDeletedLoading(false);
    }
  };

  // Rendu conditionnel des champs de saisie selon le type de paiement
  const renderPaymentMethodFields = () => {
    switch (newMethod.method) {
      case "carte_bancaire":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>{tScope("paymentCardNum")}</Label>
                <Input
                  placeholder={tScope("paymentCardNum")}
                  value={newMethod.cardInfo?.code || ""}
                  onChange={(e) =>
                    setNewMethod({
                      ...newMethod,
                      cardInfo: {
                        ...newMethod.cardInfo,
                        code: e.target.value,
                      } as UserCard,
                    })
                  }
                />
              </div>
              <div>
                <Label>{tScope("paymentCardDate")}</Label>
                <Input
                  placeholder="27/11"
                  value={newMethod.cardInfo?.expirationDate || ""}
                  onChange={(e) =>
                    setNewMethod({
                      ...newMethod,
                      cardInfo: {
                        ...newMethod.cardInfo,
                        expirationDate: e.target.value,
                      } as UserCard,
                    })
                  }
                />
              </div>
            </div>
          </>
        );
      case "paypal":
        return (
          <div>
            <Label>{tScope("paymentEmail")}</Label>
            <Input
              placeholder={tScope("paymentEmail")}
              value={newMethod.email || ""}
              onChange={(e) =>
                setNewMethod({
                  ...newMethod,
                  email: e.target.value,
                })
              }
            />
          </div>
        );
      case "trc20":
        return (
          <div>
            <Label>{tScope("paymentTrc20")}</Label>
            <Input
              placeholder={tScope("paymentTrc20")}
              value={newMethod.trc20Address || ""}
              onChange={(e) =>
                setNewMethod({
                  ...newMethod,
                  trc20Address: e.target.value,
                })
              }
            />
          </div>
        );

      case "cih":
      case "bmce":
      case "attijariwafa-bank":
        return (
          <div className="space-y-4">
            <div>
              <Label>RIB</Label>
              <Input
                placeholder={tScope("paymentRibPlace")}
                value={newMethod.rib || ""}
                onChange={(e) =>
                  setNewMethod({
                    ...newMethod,
                    rib: e.target.value,
                  })
                }
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{tScope("subTitle")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="list">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              {tScope("payBtn")}
            </TabsTrigger>
            <TabsTrigger
              value="add"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              {tScope("addBtn")}
            </TabsTrigger>
          </TabsList>

          {/* Liste des moyens de paiement existants */}
          <TabsContent value="list">
            {paymentMethods.length === 0 ? (
              <p className="text-center text-gray-500 mt-4">
                {tScope("notPaymentFound")}
              </p>
            ) : (
              <div className="space-y-2 mt-4">
                {paymentMethods
                  .filter((method) => method._id !== idSelect)
                  .map((method, index) => (
                    <div
                      key={index}
                      className="border p-3 rounded-lg flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold">
                          {
                            paymentMethodOptions.find(
                              (m) => m.value === method.method
                            )?.label
                          }
                        </p>
                        {method.cardInfo && (
                          <div className="flex items-center">
                            <span className="-mb-1.5">**** **** ****</span>{" "}
                            <span>{method.cardInfo.code.slice(-4)}</span>
                          </div>
                        )}
                        {method.email && <p>{method.email}</p>}
                        {method.trc20Address && <p>{method.trc20Address}</p>}
                        {method.rib && (
                          <div>
                            {tScope("bankTitle")}: {method.method}{" "}
                            <p>RIB: {method.rib}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-50 text-red-600"
                        onClick={() => deletePaymentMethod(method._id)}
                      >
                        {isPaymentDeletedLoading && method._id === idSelect ? (
                          <Loader className="text-black animate-spin" />
                        ) : (
                          tScope("deleteBtn")
                        )}
                      </Button>
                    </div>
                  ))}
              </div>
            )}
          </TabsContent>

          {/* Formulaire d'ajout de moyen de paiement */}
          <TabsContent value="add">
            <div className="space-y-4 mt-4">
              <div>
                <Label>{tScope("paymentType")}</Label>
                <Select
                  value={newMethod.method}
                  onValueChange={(value) => setNewMethod({ method: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={tScope("paymentTypePlace")} />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethodOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Champs dynamiques selon le type de paiement */}
              {newMethod.method && renderPaymentMethodFields()}

              <Button
                onClick={handleAddPaymentMethod}
                disabled={!newMethod.method}
                className="w-full"
              >
                {isPaymentLoading ? (
                  <Loader className="text-white animate-spin" />
                ) : (
                  tScope("paymentBtn")
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentMethod;
