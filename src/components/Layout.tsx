import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, Menu, X, MoreVertical } from "lucide-react";
import { useData } from "../context/DataContext";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const location = useLocation();
  const isResults = location.pathname === "/results";
  const { data, loading } = useData();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmissionDropdownOpen, setIsAdmissionDropdownOpen] = useState(false);

  if (loading || !data) {
    return (
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_20px_40px_rgba(0,93,66,0.06)]">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
          <div className="h-10 w-48 bg-surface-container-high rounded animate-pulse"></div>
          <div className="hidden md:flex gap-8">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-4 w-16 bg-surface-container-high rounded animate-pulse"></div>)}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_20px_40px_rgba(0,93,66,0.06)] print:hidden">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-3">
            {data.settings.logo ? (
              <div className="bg-white rounded-md p-1 shadow-sm flex items-center justify-center">
                <img 
                  src={data.settings.logo} 
                  alt="Logo" 
                  className="w-10 h-10 object-contain" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCMu0I0-nAJDaXwovvUL2h5E0lfJb2QiBph-NR8_oAyRv1Q3-fJBW3M1dnre4ZITR4zaTtV4uH14LW4Aqk26VWtc3leQbr6yRmlC4bZSBoV73fFaesFfXvjrQApCQWVTSW7pLrZy3Uw4MC27721dCQ9dcwyIxngTJrcVUISP_unAq58uXY1KWjGj-7sOnZA_CMs6rJPvuqIojqLt15Che6qnY2rl6rj2v-u9LtK8Ne_L4mQZSUZ3pf9MRJWgeYnSMid82DodR7LaKA7";
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-xl">school</span>
              </div>
            )}
            <span className="hidden sm:inline font-sans">
              Jamia Islamia Shamsul Uloom
            </span>
            <span className="sm:hidden font-sans">
              Jamia Islamia
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 font-bengali text-sm">
          <Link
            to="/"
            className={`${
              location.pathname === "/" ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
            } transition-colors`}
          >
            হোম
          </Link>
          <Link
            to="/results"
            className={`${
              location.pathname === "/results" ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
            } transition-colors`}
          >
            ফলাফল
          </Link>
          <div 
            className="relative group"
            onMouseEnter={() => setIsAdmissionDropdownOpen(true)}
            onMouseLeave={() => setIsAdmissionDropdownOpen(false)}
          >
            <button
              className={`${
                location.pathname.startsWith("/admission") ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
              } transition-colors flex items-center gap-1`}
            >
              ভর্তি
              <span className={`material-symbols-outlined text-xs transition-transform ${isAdmissionDropdownOpen ? "rotate-180" : ""}`}>expand_more</span>
            </button>
            
            <AnimatePresence>
              {isAdmissionDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-outline-variant/10 py-2 z-50 overflow-hidden"
                >
                  <Link
                    to="/admission"
                    className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    ভর্তি ফরম
                  </Link>
                  <Link
                    to="/admission/status"
                    className="block px-4 py-2 text-sm text-on-surface-variant hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    আবেদনের অবস্থা
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
            আমাদের সম্পর্কে
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
            বিভাগসমূহ
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
            নোটিশ
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
            যোগাযোগ
          </a>
          <Link
            to="/admin"
            className={`${
              location.pathname.startsWith("/admin") ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
            } transition-colors`}
          >
            অ্যাডমিন
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-primary">
            <Phone size={20} />
            <Mail size={20} />
          </div>
          <Link 
            to="/admission"
            className="hidden sm:flex bg-primary text-on-primary px-5 py-2 rounded-md font-bengali font-bold text-sm hover:scale-95 duration-200 ease-in-out transition-all items-center justify-center"
          >
            {isResults ? "ছাত্র প্রবেশ" : "ছাত্র প্রবেশ"}
          </Link>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <MoreVertical size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-outline-variant overflow-hidden"
          >
            <nav className="flex flex-col p-4 gap-4 font-bengali text-base">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  location.pathname === "/" ? "text-primary font-bold" : "text-on-surface-variant"
                } hover:text-primary transition-colors py-2`}
              >
                হোম
              </Link>
              <Link
                to="/results"
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  location.pathname === "/results" ? "text-primary font-bold" : "text-on-surface-variant"
                } hover:text-primary transition-colors py-2`}
              >
                ফলাফল
              </Link>
              <div className="flex flex-col">
                <button
                  onClick={() => setIsAdmissionDropdownOpen(!isAdmissionDropdownOpen)}
                  className={`${
                    location.pathname.startsWith("/admission") ? "text-primary font-bold" : "text-on-surface-variant"
                  } hover:text-primary transition-colors py-2 flex items-center justify-between`}
                >
                  ভর্তি
                  <span className={`material-symbols-outlined text-sm transition-transform ${isAdmissionDropdownOpen ? "rotate-180" : ""}`}>expand_more</span>
                </button>
                
                <AnimatePresence>
                  {isAdmissionDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-col pl-4 border-l-2 border-primary/10 gap-2 overflow-hidden"
                    >
                      <Link
                        to="/admission"
                        onClick={() => { setIsMenuOpen(false); setIsAdmissionDropdownOpen(false); }}
                        className="text-on-surface-variant hover:text-primary transition-colors py-2 text-sm"
                      >
                        ভর্তি ফরম
                      </Link>
                      <Link
                        to="/admission/status"
                        onClick={() => { setIsMenuOpen(false); setIsAdmissionDropdownOpen(false); }}
                        className="text-on-surface-variant hover:text-primary transition-colors py-2 text-sm"
                      >
                        আবেদনের অবস্থা
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a className="text-on-surface-variant hover:text-primary transition-colors py-2" href="#" onClick={() => setIsMenuOpen(false)}>
                আমাদের সম্পর্কে
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors py-2" href="#" onClick={() => setIsMenuOpen(false)}>
                বিভাগসমূহ
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors py-2" href="#" onClick={() => setIsMenuOpen(false)}>
                নোটিশ
              </a>
              <a className="text-on-surface-variant hover:text-primary transition-colors py-2" href="#" onClick={() => setIsMenuOpen(false)}>
                যোগাযোগ
              </a>
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`${
                  location.pathname.startsWith("/admin") ? "text-primary font-bold" : "text-on-surface-variant"
                } hover:text-primary transition-colors py-2`}
              >
                অ্যাডমিন
              </Link>
              <Link 
                to="/admission"
                onClick={() => setIsMenuOpen(false)}
                className="w-full bg-primary text-on-primary px-6 py-3 rounded-md font-bengali font-bold text-sm mt-2 flex items-center justify-center"
              >
                ছাত্র প্রবেশ
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export function Footer() {
  const { data, loading } = useData();

  if (loading || !data) {
    return <footer className="bg-primary-container h-64 animate-pulse"></footer>;
  }

  return (
    <footer className="bg-primary-container text-white overflow-hidden print:hidden">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="max-w-xs">
          <div className="flex items-center gap-3 mb-4">
            {data.settings.logo ? (
              <div className="bg-white rounded-md p-1 shadow-sm flex items-center justify-center">
                <img 
                  src={data.settings.logo} 
                  alt="Logo" 
                  className="w-12 h-12 object-contain" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCMu0I0-nAJDaXwovvUL2h5E0lfJb2QiBph-NR8_oAyRv1Q3-fJBW3M1dnre4ZITR4zaTtV4uH14LW4Aqk26VWtc3leQbr6yRmlC4bZSBoV73fFaesFfXvjrQApCQWVTSW7pLrZy3Uw4MC27721dCQ9dcwyIxngTJrcVUISP_unAq58uXY1KWjGj-7sOnZA_CMs6rJPvuqIojqLt15Che6qnY2rl6rj2v-u9LtK8Ne_L4mQZSUZ3pf9MRJWgeYnSMid82DodR7LaKA7";
                  }}
                />
              </div>
            ) : (
              <div className="w-12 h-12 bg-white/20 rounded-md flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
            )}
            <div className="text-xl font-bengali font-bold text-secondary-container">{data.settings.siteTitle}</div>
          </div>
          <p className="text-on-primary-container/60 font-bengali text-xs mb-6">{data.settings.address}</p>
          <p className="text-on-primary-container/80 font-bengali text-sm leading-relaxed mb-6">
            আদর্শ মানুষ গড়ার এক নির্ভরযোগ্য দ্বীনি শিক্ষা প্রতিষ্ঠান। কুরআন ও সুন্নাহর সঠিক জ্ঞান বিতরণে আমরা প্রতিশ্রুতিবদ্ধ।
          </p>
          <div className="flex gap-4">
            <a className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-on-primary-container hover:bg-primary transition-all" href="#">
              <span className="material-symbols-outlined text-lg">public</span>
            </a>
            <a className="w-10 h-10 rounded-full border border-primary/20 flex items-center justify-center text-on-primary-container hover:bg-primary transition-all" href="#">
              <span className="material-symbols-outlined text-lg">share</span>
            </a>
          </div>
        </div>
        <div>
          <h5 className="text-white font-bold mb-4 uppercase text-xs tracking-widest font-body">Quick Links</h5>
          <ul className="space-y-3 font-sans text-sm tracking-wide">
            <li><a className="text-on-primary-container/80 hover:text-white transition-colors" href="#">Privacy Policy</a></li>
            <li><a className="text-on-primary-container/80 hover:text-white transition-colors" href="#">Terms of Service</a></li>
            <li><a className="text-on-primary-container/80 hover:text-white transition-colors" href="#">Alumni Portal</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-white font-bold mb-4 uppercase text-xs tracking-widest font-body">Support</h5>
          <ul className="space-y-3 font-sans text-sm tracking-wide">
            <li><a className="text-secondary-container underline underline-offset-4" href="#">Donations</a></li>
            <li><a className="text-on-primary-container/80 hover:text-white transition-colors" href="#">Fatwa Request</a></li>
          </ul>
        </div>
        <div className="bg-primary p-6 rounded-xl border border-primary-container">
          <h5 className="text-white font-bold mb-4 text-sm font-body">Newsletter</h5>
          <div className="flex flex-col gap-2">
            <input
              className="bg-primary-container border-none rounded-md px-4 py-2 text-white text-sm focus:ring-1 focus:ring-secondary-container placeholder:text-on-primary-container/50"
              placeholder="Your email address"
              type="email"
            />
            <button className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-md font-bold text-sm hover:bg-secondary-container/80 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
      <div className="w-full py-8 border-t border-primary/10 text-center flex flex-col items-center gap-4">
        <p className="text-on-primary-container/50 font-sans text-xs tracking-wide">
          © {new Date().getFullYear()} Jamia Islamia Shamsul Uloom. All rights reserved.
        </p>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.open('/admin/login', '_blank');
          }}
          className="bg-secondary-container/10 hover:bg-secondary-container/20 text-secondary-container px-6 py-2 rounded-full text-xs font-sans uppercase tracking-widest transition-all border border-secondary-container/20 cursor-pointer relative z-50"
        >
          Admin Panel
        </button>
      </div>
    </footer>
  );
}
