import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar, Footer } from "./components/Layout";
import { Home } from "./pages/Home";
import { Results } from "./pages/Results";
import { TeacherProfile } from "./pages/TeacherProfile";
import { AdmissionForm } from "./pages/AdmissionForm";
import { AdmissionStatus } from "./pages/AdmissionStatus";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminRegister } from "./pages/AdminRegister";
import { AdminDashboard } from "./pages/AdminDashboard";
import { DataProvider } from "./context/DataContext";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Admin Routes (No Navbar/Footer) */}
            <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Public Routes */}
            <Route
              path="*"
              element={
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/results" element={<Results />} />
                      <Route path="/admission" element={<AdmissionForm />} />
                      <Route path="/admission/status" element={<AdmissionStatus />} />
                      <Route path="/teacher/:id" element={<TeacherProfile />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
        </div>
      </Router>
    </DataProvider>
  );
}
