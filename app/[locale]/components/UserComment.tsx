"use client";

import { comments, convertDate, dislocName } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import React from "react";
import { MdStars } from "react-icons/md";

const UserComment = () => {
  const tScope = useScopedI18n("reviews");
  return (
    <div className="px-4 pb-10">
      <div className="flex items-center justify-center mx-auto mt-6 mb-8">
        <h1
          className="text-[22px] text-white/80 font-bold text-center"
          aria-label="reviews"
        >
          {tScope("notes")}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="flex flex-col items-start gap-2 p-4 bg-[#363a3d] border-[#363a3d] rounded-lg border hover:shadow-lg transition-shadow duration-300 cursor-pointer select-none h-full"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <img
                  src="/medail.png"
                  alt="user avatar"
                  className="h-8 w-8 object-cover"
                />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-base font-semibold text-white/80">
                  {dislocName(comment.commentLastname)}
                </span>
                <span className="flex items-center gap-0">
                  <MdStars className="text-[18px] text-red-600" />
                  <MdStars className="text-[18px] text-red-600" />
                  <MdStars className="text-[18px] text-red-600" />
                  <MdStars className="text-[18px] text-red-600" />
                  <MdStars className="text-[18px] text-red-600" />
                </span>
              </div>
            </div>
            <p className="text-sm text-white/70 min-h-[60px] line-clamp-3">
              {tScope(`user-${comment._id}` as any)}
            </p>
            <span className="text-xs text-white/60  mt-auto">
              {convertDate(comment.dateToCreated)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserComment;
