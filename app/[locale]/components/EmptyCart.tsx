"use client";

import React from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";

import { useScopedI18n } from "@/locales/client";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

const EmptyCart = () => {
  const tScope = useScopedI18n("emptycart");
  return (
    <Card className="w-full max-w-md mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {tScope("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ShoppingCart className="w-24 h-24 text-gray-400 mb-4" />
        <p className="text-center text-gray-600 mb-4">{tScope("desc")}</p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/">
          <Button className="flex items-center bg-yellow-600 hover:bg-yellow-600 hover:opacity-90">
            {tScope("btn")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EmptyCart;
