"use client";

import React from "react";
import { ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <Card className="w-full max-w-md mx-auto border-none">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Your cart is empty
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <ShoppingCart className="w-24 h-24 text-gray-400 mb-4" />
        <p className="text-center text-gray-600 mb-4">
          Looks like you haven't added any items to your cart yet.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href="/">
          <Button className="flex items-center bg-yellow-600 hover:bg-yellow-600 hover:opacity-90">
            Start Shopping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default EmptyCart;
