import React from "react";
import { motion } from "framer-motion";

const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function InvoiceSkeleton() {
  return (
    <div className="flex flex-row items-center justify-between border-b dark:border-gray-700 border-gray-200 py-4">
      <div className="flex items-center">
        {/* <div className="mr-2 h-8 w-8 rounded-full dark:bg-gray-400 bg-gray-200 animate-pulse" /> */}
        <div className="min-w-0">
          <div className="h-5 w-40 rounded-md bg-[#363A3D] animate-pulse" />
          {/* <div className="mt-2 h-4 w-12 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" /> */}
        </div>
      </div>
      <div className="mt-2 h-6 w-16 rounded-md bg-[#363A3D] animate-pulse" />
      <div className="mt-2 h-6 w-16 rounded-md bg-[#363A3D] animate-pulse" />
      <div className="mt-2 h-6 w-16 rounded-md bg-[#363A3D] animate-pulse" />
      <div className="mt-2 h-6 w-16 rounded-md bg-[#363A3D] animate-pulse" />
    </div>
  );
}

export default function ServerSkeleton() {
  return (
    <div
      className={`${shimmer}  relative flex w-full mx-auto p-6 space-y-6 max-w-4xl flex-col overflow-hidden md:col-span-4`}
    >
      {/* <div className="mb-4 h-8 w-36 rounded-md bg-gray-100" /> */}
      <div className="flex grow flex-col justify-between rounded-xl dark:bg-[#1c1d22] bg-white p-4">
        <div className="bg-[#1c1d22] px-6">
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
          <InvoiceSkeleton />
        </div>
      </div>
    </div>
  );
}

export const BeforeTabs = () => {
  return (
    <div className="flex items-center justify-between w-full mt-4">
      <div className="flex items-center gap-4">
        <div className="ml-2 h-8 w-24 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
        <div className="ml-2 h-8 w-24 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
      <div className="flex items-center gap-4">
        <div className="ml-2 h-8 w-24 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
        <div className="ml-2 h-8 w-8 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div
      className={`${shimmer} flex flex-col items-start gap-6 w-[250px] p-4 rounded dark:shadow-sm shadow-xl dark:bg-[#1c1d22]`}
    >
      <div className="flex items-center justify-between w-full">
        <div className="h-5 w-5 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
        <div className="ml-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="h-5 w-5 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
        <div className="ml-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
    </div>
  );
};

export const UserTop = () => {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <div className="h-5 w-10 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
      </div>

      <div className="flex items-center gap-4">
        <div className="h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse" />
        <div className="ml-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
        <div className="ml-2 h-6 w-16 rounded-md dark:bg-gray-400 bg-gray-200 animate-pulse text-sm font-medium" />
      </div>
    </div>
  );
};

export const TestimonialsCardSkeleton: React.FC = () => {
  const skeletonItems = Array(5).fill(null);

  return (
    <div className="w-full h-[300px] max-sm:my-5 sm:h-[600px] sm:w-[500px] bg-[#1A1D21] rounded-lg p-4 overflow-hidden">
      <div className="space-y-6">
        {skeletonItems.map((_, index) => (
          <div key={index}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[#363A3D] rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-[#363A3D] rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-[#363A3D] rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-[#363A3D] rounded w-full animate-pulse" />
              <div className="h-4 bg-[#363A3D] rounded w-5/6 animate-pulse" />
              <div className="h-4 bg-[#363A3D] rounded w-4/6 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
