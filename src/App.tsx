import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Navbar, Footer } from "./components/Layout";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Hisab } from "./pages/Hisab";
import { Results } from "./pages/Results";
import { StudentList } from "./pages/StudentList";
import { TeacherProfile } from "./pages/TeacherProfile";
import { AdmissionForm } from "./pages/AdmissionForm";
import { AdmissionStatus } from "./pages/AdmissionStatus";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminRegister } from "./pages/AdminRegister";
import { AdminDashboard } from "./pages/AdminDashboard";
import { DataProvider } from "./context/DataContext";

function ScrollToNavigation() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <DataProvider>
      <Router>
        <ScrollToNavigation />
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
                      <Route path="/about" element={<About />} />
                      <Route path="/hisab" element={<Hisab />} />
                      <Route path="/results" element={<Results />} />
                      <Route path="/students" element={<StudentList />} />
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
