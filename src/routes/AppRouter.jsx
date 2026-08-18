
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoanApplicationPage from "../pages/LoanApplication/LoanApplicationPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import ResumePage from "../pages/Resume/ResumePage";
import SuccessPage from "../pages/Success/SuccessPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoanApplicationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resume" element={<ResumePage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;