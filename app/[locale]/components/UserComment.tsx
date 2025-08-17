"use client";

import { comments, convertDate, dislocName } from "@/lib/utils";
import { useScopedI18n } from "@/locales/client";
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const UserComment = () => {
  const tScope = useScopedI18n("reviews");
  return (
    <div className="px-6 pb-16">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-center mx-auto mt-8 mb-12"
      >
        <div className="relative">
          <h1
            className="text-3xl md:text-4xl text-white font-bold text-center bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
            aria-label="reviews"
          >
            {tScope("notes")}
          </h1>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {comments.map((comment, index) => (
          <motion.div
            key={comment._id}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              y: -8, 
              scale: 1.02,
              transition: { duration: 0.3 }
            }}
            className="group relative flex flex-col items-start gap-4 p-6 bg-gradient-to-br from-slate-800/90 via-slate-700/90 to-slate-800/90 border border-slate-600/30 rounded-2xl hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 cursor-pointer select-none h-full backdrop-blur-sm overflow-hidden"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-pink-500/10 to-red-500/10 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
            
            {/* Header with avatar and rating */}
            <div className="flex items-center space-x-4 w-full relative z-10">
              <div className="relative">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1 shadow-lg">
                  <div className="h-full w-full rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center overflow-hidden">
                    <img
                      src="/medail.png"
                      alt="user avatar"
                      className="h-10 w-10 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-3 h-3 text-white" />
                </div>
              </div>
              
              <div className="flex flex-col items-start flex-1">
                <span className="text-lg font-bold text-white mb-2">
                  {dislocName(comment.commentLastname)}
                </span>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className="w-5 h-5 text-yellow-400 fill-current drop-shadow-sm" 
                    />
                  ))}
                </div>
              </div>
            </div>
            
            {/* Comment text */}
            <div className="relative z-10 flex-1">
              <p className="text-base text-slate-200 leading-relaxed min-h-[80px] line-clamp-4 font-medium">
                {tScope(`user-${comment._id}` as any)}
              </p>
            </div>
            
            {/* Date footer */}
            <div className="relative z-10 w-full">
              <span className="text-sm text-slate-400 font-medium bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50 inline-block">
                {convertDate(comment.dateToCreated)}
              </span>
            </div>
            
            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserComment;
