import { Link, useLocation } from "react-router-dom";
import { Phone, Mail } from "lucide-react";
import { useData } from "../context/DataContext";

export function Navbar() {
  const location = useLocation();
  const isResults = location.pathname === "/results";
  const { data, loading } = useData();

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
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_20px_40px_rgba(0,93,66,0.06)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold tracking-tight text-primary flex items-center gap-3">
            {data.settings.logo && (
              <img src={data.settings.logo} alt="Logo" className="w-10 h-10 object-contain" />
            )}
            <span className="hidden sm:inline font-sans">
              {isResults ? "Result Portal" : "Jamia Islamia Shamsul Uloom"}
            </span>
            <span className="sm:hidden font-sans">
              {isResults ? "Results" : "Jamia Islamia"}
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 font-body text-sm">
          <Link
            to="/"
            className={`${
              location.pathname === "/" ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
            } transition-colors`}
          >
            Home
          </Link>
          <Link
            to="/results"
            className={`${
              location.pathname === "/results" ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary"
            } transition-colors`}
          >
            Exams
          </Link>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
            About Us
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
            Departments
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
            Notices
          </a>
          <a className="text-on-surface-variant hover:text-primary transition-colors" href="#">
            Contact Us
          </a>
        </nav>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 text-primary">
            <Phone size={20} />
            <Mail size={20} />
          </div>
          <button className="bg-primary text-on-primary px-6 py-2.5 rounded-md font-semibold text-sm hover:scale-95 duration-200 ease-in-out transition-all">
            {isResults ? "Student Login" : "Enroll Now"}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  const { data, loading } = useData();

  if (loading || !data) {
    return <footer className="bg-primary-container h-64 animate-pulse"></footer>;
  }

  return (
    <footer className="bg-primary-container text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="max-w-xs">
          <div className="text-xl font-bengali font-bold text-secondary-container mb-2">{data.settings.siteTitle}</div>
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
          © 2024 Jamia Islamia Shamsul Uloom. All rights reserved.
        </p>
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            window.open('/secret-admin', '_blank');
          }}
          className="bg-secondary-container/10 hover:bg-secondary-container/20 text-secondary-container px-6 py-2 rounded-full text-xs font-sans uppercase tracking-widest transition-all border border-secondary-container/20 cursor-pointer relative z-50"
        >
          Admin Panel
        </button>
      </div>
    </footer>
  );
}
