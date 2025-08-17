"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Users, Trophy, Star, Gift, Share2, CheckCircle, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useScopedI18n } from "@/locales/client";

interface ReferralStats {
  totalReferrals: number;
  referralPoints: number;
  referralLevel: string;
  maxReferrals: number;
  remainingReferrals: number;
}

interface Referral {
  _id: string;
  referredId: {
    firstname: string;
    lastname: string;
    email: string;
  };
  status: string;
  createdAt: string;
  points: number;
}

const ReferralSystem = () => {
  const { data: session } = useSession();
  const tScope = useScopedI18n("referral");
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (session?.user?.id) {
      fetchReferralInfo();
    }
  }, [session?.user?.id]);

  const fetchReferralInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/iben/referral?userId=${session?.user?.id}`);
      const data = await response.json();

      if (data.success) {
        setReferralCode(data.referralCode);
        setReferralStats(data.stats);
        setReferrals(data.referrals);
      } else {
        setError(data.error || "Failed to fetch referral info");
      }
    } catch (error) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async () => {
    try {
      const response = await fetch("/api/iben/referral", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.user?.id }),
      });

      const data = await response.json();
      if (data.success) {
        setReferralCode(data.referralCode);
        await fetchReferralInfo(); // Refresh stats
      } else {
        setError(data.error || "Failed to generate referral code");
      }
    } catch (error) {
      setError("Network error occurred");
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setError("Failed to copy to clipboard");
    }
  };

  const shareReferralCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Ibendouma!",
          text: `Use my referral code: ${referralCode}`,
          url: `${window.location.origin}?ref=${referralCode}`,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard();
    }
  };

  const getLevelIcon = (level: string) => {
    const icons = {
      bronze: "🥉",
      silver: "🥈",
      gold: "🥇",
      platinum: "💎",
      diamond: "👑",
    };
    return icons[level as keyof typeof icons] || "🥉";
  };

  const getLevelColor = (level: string) => {
    const colors = {
      bronze: "from-amber-600 to-orange-600",
      silver: "from-gray-400 to-gray-600",
      gold: "from-yellow-400 to-yellow-600",
      platinum: "from-blue-400 to-blue-600",
      diamond: "from-purple-400 to-purple-600",
    };
    return colors[level as keyof typeof colors] || "from-amber-600 to-orange-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-2">
          {tScope("title") || "Système de Parrainage"}
        </h2>
        <p className="text-slate-300">
          {tScope("subtitle") || "Parrainez vos amis et gagnez des points !"}
        </p>
      </motion.div>

      {/* Referral Code Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-blue-400" />
              {tScope("yourCode") || "Votre Code de Parrainage"}
            </h3>
            {referralCode ? (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {tScope("active") || "Actif"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                {tScope("inactive") || "Inactif"}
              </Badge>
            )}
          </div>

          {referralCode ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-700/50 rounded-lg p-3 border border-slate-600/50">
                  <code className="text-xl font-mono text-white tracking-wider">
                    {referralCode}
                  </code>
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="bg-slate-700/50 border-slate-600/50 text-white hover:bg-slate-600/50"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  onClick={shareReferralCode}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  {tScope("share") || "Partager"}
                </Button>
              </div>
              <p className="text-sm text-slate-400">
                {tScope("codeDescription") || "Partagez ce code avec vos amis pour gagner des points !"}
              </p>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-slate-400 mb-4">
                {tScope("noCodeYet") || "Vous n'avez pas encore de code de parrainage"}
              </p>
              <Button
                onClick={generateReferralCode}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Star className="w-4 h-4 mr-2" />
                {tScope("generateCode") || "Générer un Code"}
              </Button>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Stats Section */}
      {referralStats && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-400" />
              {tScope("yourStats") || "Vos Statistiques"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Level Badge */}
              <div className="text-center p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-slate-600/50">
                <div className="text-4xl mb-2">{getLevelIcon(referralStats.referralLevel)}</div>
                <div className={`text-lg font-bold bg-gradient-to-r ${getLevelColor(referralStats.referralLevel)} bg-clip-text text-transparent`}>
                  {referralStats.referralLevel.toUpperCase()}
                </div>
                <p className="text-sm text-slate-400 mt-1">
                  {tScope("level") || "Niveau"}
                </p>
              </div>

              {/* Total Referrals */}
              <div className="text-center p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-slate-600/50">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {referralStats.totalReferrals}
                </div>
                <p className="text-sm text-slate-400">
                  {tScope("totalReferrals") || "Parrainages"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {referralStats.remainingReferrals} {tScope("remaining") || "restants"}
                </p>
              </div>

              {/* Points */}
              <div className="text-center p-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl border border-slate-600/50">
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {referralStats.referralPoints}
                </div>
                <p className="text-sm text-slate-400">
                  {tScope("points") || "Points"}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {tScope("earned") || "gagnés"}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Referrals List */}
      {referrals.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
              {tScope("yourReferrals") || "Vos Parrainages"}
            </h3>
            
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral._id}
                  className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg border border-slate-600/30"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {referral.referredId.firstname} {referral.referredId.lastname}
                      </p>
                      <p className="text-sm text-slate-400">
                        {referral.referredId.email}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`${
                      referral.status === "completed" 
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }`}>
                      {referral.status === "completed" ? "✅" : "⏳"} {referral.status}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Rewards Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-400" />
            {tScope("rewards") || "Récompenses"}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { level: "bronze", points: 0, reward: "1 point par parrainage" },
              { level: "silver", points: 50, reward: "2 points par parrainage" },
              { level: "gold", points: 200, reward: "3 points par parrainage" },
              { level: "platinum", points: 500, reward: "5 points par parrainage" },
              { level: "diamond", points: 1000, reward: "10 points par parrainage" },
            ].map((tier) => (
              <div
                key={tier.level}
                className={`text-center p-3 rounded-lg border ${
                  referralStats?.referralLevel === tier.level
                    ? "bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/50"
                    : "bg-slate-700/30 border-slate-600/30"
                }`}
              >
                <div className="text-2xl mb-1">{getLevelIcon(tier.level)}</div>
                <div className={`text-sm font-semibold ${
                  referralStats?.referralLevel === tier.level
                    ? "text-blue-400"
                    : "text-slate-300"
                }`}>
                  {tier.level.toUpperCase()}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {tier.points} {tScope("points") || "points"}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {tier.reward}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-300">{error}</span>
        </motion.div>
      )}
    </div>
  );
};

export default ReferralSystem;
