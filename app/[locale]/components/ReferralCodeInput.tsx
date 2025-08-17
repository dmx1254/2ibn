"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Gift, CheckCircle, AlertCircle, Info } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useScopedI18n } from "@/locales/client";

interface ReferralCodeInputProps {
  onReferralCodeChange: (code: string) => void;
  initialCode?: string;
  disabled?: boolean;
}

const ReferralCodeInput = ({ 
  onReferralCodeChange, 
  initialCode = "", 
  disabled = false 
}: ReferralCodeInputProps) => {
  const tScope = useScopedI18n("referral");
  const [referralCode, setReferralCode] = useState(initialCode);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message: string;
    referrerName?: string;
  } | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const validateReferralCode = async () => {
    if (!referralCode.trim()) {
      setValidationResult({
        isValid: false,
        message: tScope("enterCode") || "Veuillez entrer un code de parrainage"
      });
      return;
    }

    setIsValidating(true);
    try {
      const response = await fetch("/api/iben/referral/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ referralCode: referralCode.trim().toUpperCase() }),
      });

      const data = await response.json();
      
      if (data.success) {
        setValidationResult({
          isValid: true,
          message: tScope("validCode") || "Code de parrainage valide !",
          referrerName: data.referrerName
        });
        onReferralCodeChange(referralCode.trim().toUpperCase());
      } else {
        setValidationResult({
          isValid: false,
          message: data.error || tScope("invalidCode") || "Code de parrainage invalide"
        });
        onReferralCodeChange("");
      }
    } catch (error) {
      setValidationResult({
        isValid: false,
        message: tScope("validationError") || "Erreur lors de la validation"
      });
      onReferralCodeChange("");
    } finally {
      setIsValidating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setReferralCode(value);
    
    // Clear validation result when user types
    if (validationResult) {
      setValidationResult(null);
    }
    
    // Update parent component
    onReferralCodeChange(value);
  };

  const clearCode = () => {
    setReferralCode("");
    setValidationResult(null);
    onReferralCodeChange("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-white">
            {tScope("referralCode") || "Code de Parrainage"}
          </h3>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowInfo(!showInfo)}
          className="text-slate-400 hover:text-white"
        >
          <Info className="w-4 h-4" />
        </Button>
      </div>

      {/* Info Tooltip */}
      {showInfo && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3"
        >
          <p className="text-sm text-blue-300">
            {tScope("referralInfo") || 
              "Utilisez le code de parrainage d'un ami pour gagner des avantages mutuels. " +
              "Vous recevrez des bonus et votre ami gagnera des points de parrainage !"}
          </p>
        </motion.div>
      )}

      {/* Input Section */}
      <div className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={tScope("enterReferralCode") || "Entrez le code de parrainage"}
              value={referralCode}
              onChange={handleInputChange}
              disabled={disabled}
              className="bg-slate-800/50 border-slate-600/50 text-white placeholder:text-slate-400 focus:border-purple-500/50"
              maxLength={8}
            />
          </div>
          <Button
            type="button"
            onClick={validateReferralCode}
            disabled={disabled || isValidating || !referralCode.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50"
          >
            {isValidating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              tScope("validate") || "Valider"
            )}
          </Button>
          {referralCode && (
            <Button
              type="button"
              onClick={clearCode}
              variant="outline"
              disabled={disabled}
              className="border-slate-600/50 text-slate-400 hover:bg-slate-700/50"
            >
              ✕
            </Button>
          )}
        </div>

        {/* Validation Result */}
        {validationResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex items-center gap-3 p-3 rounded-lg border ${
              validationResult.isValid
                ? "bg-green-500/10 border-green-500/30"
                : "bg-red-500/10 border-red-500/30"
            }`}
          >
            {validationResult.isValid ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            <div className="flex-1">
              <p className={`text-sm font-medium ${
                validationResult.isValid ? "text-green-300" : "text-red-300"
              }`}>
                {validationResult.message}
              </p>
              {validationResult.referrerName && (
                <p className="text-xs text-green-200 mt-1">
                  {tScope("referredBy") || "Parrainé par"}: {validationResult.referrerName}
                </p>
              )}
            </div>
          </motion.div>
        )}

        {/* Benefits Preview */}
        {validationResult?.isValid && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4"
          >
            <h4 className="text-sm font-semibold text-purple-300 mb-2">
              {tScope("benefits") || "Avantages du parrainage :"}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-purple-200">
                  {tScope("welcomeBonus") || "Bonus de bienvenue"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-purple-200">
                  {tScope("prioritySupport") || "Support prioritaire"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-purple-200">
                  {tScope("exclusiveOffers") || "Offres exclusives"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs text-purple-200">
                  {tScope("fasterDelivery") || "Livraison accélérée"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Optional Badge */}
      <div className="flex items-center justify-center">
        <Badge className="bg-slate-700/50 text-slate-300 border-slate-600/50">
          {tScope("optional") || "Optionnel"}
        </Badge>
      </div>
    </motion.div>
  );
};

export default ReferralCodeInput;
