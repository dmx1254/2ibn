"use client";

import React from "react";
import LanguageAndCurrency from "./LanguageAndCurrency";
import { useSession } from "next-auth/react";
import ProfilePopover from "./ProfilePopover";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";

const MobileTopMenus = () => {
  const { data: session, status } = useSession();
  return (
    <div className="w-full px-4 py-1.5 bg-[#363A3D] flex items-center justify-between md:hidden">
      {session && status === "authenticated" ? (
        <ProfilePopover />
      ) : (
        <div className="flex items-center gap-4">
          <SignInModal />
          <SignUpModal />
        </div>
      )}

      <LanguageAndCurrency isShowBg={false} />
    </div>
  );
};

export default MobileTopMenus;
