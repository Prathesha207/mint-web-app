"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, User, Info, Settings, Heart, List, CheckCircle, Clock } from 'lucide-react';

// Dummy Data
const TAPES = [
  { id: 1, title: "INCEPTION", progress: 76, genre: "SCI-FI" },
  { id: 2, title: "STRANGER THINGS", progress: 42, genre: "HORROR" },
  { id: 3, title: "BLADE RUNNER 2049", progress: 90, genre: "SCI-FI" },
  { id: 4, title: "THE MATRIX", progress: 55, genre: "ACTION" },
  { id: 5, title: "PULP FICTION", progress: 20, genre: "CRIME" },
  { id: 6, title: "INTERSTELLAR", progress: 80, genre: "SCI-FI" },
  { id: 7, title: "THE GODFATHER", progress: 100, genre: "DRAMA" },
];

export default function CineStreamApp() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-zinc-300 p-2 sm:p-6 font-mono selection:bg-pink-500/40">

      {/* --- TOP HUD --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
        {/* Neon Logo */}
        <div className="border-2 border-pink-500 p-3 rounded-md shadow-[0_0_15px_rgba(236,72,153,0.5)] bg-black/40">
          <h1 className="text-3xl font-black italic tracking-tighter text-pink-500">
            CINE-STREAM <span className="text-blue-400">1986</span>
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase">Your Personal Movie Archive</p>
        </div>

        {/* Top Nav Tabs */}
        <nav className="flex gap-4 bg-zinc-900/50 p-1 rounded-lg border border-white/5">
          {['SHELF', 'STATS', 'WISHLIST', 'SETTINGS'].map((tab) => (
            <button key={tab} className={`px-4 py-2 text-xs font-bold rounded-md transition-all ${tab === 'SHELF' ? 'bg-orange-600 text-white shadow-lg' : 'hover:bg-white/5'}`}>
              {tab}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="hidden lg:flex items-center gap-3 bg-zinc-900/80 p-2 rounded-full border border-white/10">
          <div className="text-right">
            <p className="text-[10px] font-bold">MEMBER</p>
            <p className="text-[9px] text-zinc-500">EST. 1986</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 border-2 border-white/20" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* --- LEFT SIDEBAR (STATS) --- */}
        <aside className="w-full lg:w-64">
          <div className="relative bg-[#0b0f1a] border border-white/10 rounded-md p-4 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_10px_30px_rgba(0,0,0,0.5)]">

            {/* Top Display */}
            <div className="bg-[#111827] border border-white/10 rounded-md p-3 mb-4 text-center shadow-inner">
              <div className="text-blue-400 text-[10px] tracking-widest uppercase">
                Collection
              </div>
              <div className="text-white text-lg font-bold tracking-wider mt-1">
                247 Tapes
              </div>
            </div>

            {/* List */}
            <ul className="space-y-2 text-[11px] font-bold tracking-wider">

              {/* Active */}
              <li className="flex justify-between items-center px-3 py-2 rounded-md 
        bg-gradient-to-r from-orange-500/10 to-transparent 
        border border-orange-500/20 
        text-orange-400 shadow-[0_0_10px_rgba(255,140,0,0.2)]">

                <span className="flex items-center gap-2 uppercase">
                  ▶ ALL MOVIES
                </span>
                <span>247</span>
              </li>

              {/* Items */}
              {[
                { label: "Watching", value: 12 },
                { label: "Completed", value: 198 },
                { label: "On Hold", value: 8 },
                { label: "Wishlist", value: 29 },
                { label: "Favorites ♥", value: 23 },
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center px-3 py-2 rounded-md 
          border border-white/5 
          bg-[#0f172a] 
          hover:bg-white/5 
          hover:border-white/20 
          transition-all duration-200 cursor-pointer"
                >
                  <span className="uppercase text-gray-300 tracking-wide">
                    {item.label}
                  </span>
                  <span className="text-gray-400">{item.value}</span>
                </li>
              ))}

            </ul>
          </div>
        </aside>
        {/* <div className="bg-[#e2e2d8] p-3 -rotate-2 shadow-lg border border-black/10 text-black font-mono text-[9px] w-48 mx-auto lg:mx-0">
          <p className="font-bold border-b border-black/20 pb-1 mb-1">STORE POLICY:</p>
          <p>• LATE FEES: $1.00/DAY</p>
          <p>• BE KIND, REWIND</p>
        </div> */}
        {/* --- THE MAIN SHELF AREA --- */}
        <div className="flex-1 relative">

          {/* Wooden Frame Wrapper */}
          <div className="bg-[#2a1d15] p-2 sm:p-4 rounded-sm border-[10px] border-[#3d2b1f] shadow-[inset_0_0_50px_rgba(0,0,0,0.8),0_20px_40px_rgba(0,0,0,0.5)] overflow-hidden">

            {/* Shelf Label */}
            <div className="bg-[#4e3a2c] w-fit px-4 py-1 mx-auto text-[10px] font-bold text-orange-200/50 rounded-b-md mb-4 border border-white/5">
              DRAMA / SCI-FI
            </div>

            {/* HORIZONTAL SCROLLING CONTAINER */}
            <div className="flex gap-3 overflow-x-auto pb-8 pt-4 no-scrollbar snap-x scroll-smooth">
              {TAPES.map((movie) => (
                <VHSTape key={movie.id} movie={movie} />
              ))}

              {/* Add Movie Neon Slot */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                className="flex-shrink-0 w-24 sm:w-32 h-[350px] border-2 border-dashed border-pink-500/40 rounded flex flex-col items-center justify-center gap-4 bg-pink-500/5 group"
              >
                <div className="w-12 h-12 rounded-full border-2 border-pink-500 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:scale-110 transition-transform">
                  <Plus className="text-pink-500" />
                </div>
                <span className="text-[10px] font-black text-pink-500 tracking-tighter">ADD MOVIE</span>
              </motion.button>
            </div>

            {/* Lower Wooden Ledge */}
            <div className="h-4 w-full bg-[#1a110b] mt-[-10px] border-t border-white/5 rounded-sm shadow-inner" />
          </div>

          {/* Device Footer Stats */}
          <div className="mt-4 flex justify-between items-center font-mono text-[9px] text-zinc-600 px-2 uppercase">
            <div className="flex gap-4">
              <span>Store Hours: 10:00 - 11:00</span>
              <span className="text-orange-900/50 italic">Be Kind Rewind</span>
            </div>
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_green]" />
              <span>CINE-STREAM OS v1.986</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- VHSTAPE COMPONENT ---
function VHSTape({ movie }: { movie: any }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="flex-shrink-0 w-16 sm:w-20 lg:w-24 h-[350px] bg-[#121214] border-l-4 border-zinc-800 shadow-[10px_0_20px_rgba(0,0,0,0.5)] relative snap-start group"
    >
      {/* Tape Top Details */}
      <div className="h-10 w-full border-b border-white/5 p-1">
        <div className="w-full h-1 bg-zinc-800 rounded-full" />
      </div>

      {/* Vertical Spine Title */}
      <div className="absolute inset-0 flex items-center justify-center pt-12 pb-20 pointer-events-none">
        <span className="text-zinc-400 group-hover:text-white transition-colors font-black text-xs sm:text-sm tracking-tighter [writing-mode:vertical-rl] rotate-180 uppercase">
          {movie.title}
        </span>
      </div>

      {/* Bottom Progress Area */}
      <div className="absolute bottom-0 left-0 right-0 p-2 space-y-2 bg-gradient-to-t from-black to-transparent">
        {/* Glow Bar */}
        <div className="h-16 w-full bg-zinc-900 rounded-sm relative overflow-hidden flex items-end p-[2px]">
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${movie.progress}%` }}
            className="w-full bg-gradient-to-t from-orange-600 to-orange-400 shadow-[0_0_15px_#ea580c] rounded-sm"
          />
        </div>
        {/* Percent Text */}
        <div className="text-[10px] text-center font-bold text-orange-500/80">
          {movie.progress}%
        </div>
        <div className="text-[8px] text-center text-zinc-600 font-bold">VHS</div>
      </div>
    </motion.div>
  );
}