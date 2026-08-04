import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import Signup from './pages/Signup';
import DSATracker from './pages/DSATracker';
import MainDashboardAnimated from './pages/MainDashboardAnimated';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import CompanyKanbanBoard from './pages/CompanyKanbanBoard';
import DetailedAnalytics from './pages/DetailedAnalytics';
import MockInterviewScheduling from './pages/MockInterviewScheduling';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        <Route path="/dashboard" element={<MainDashboardAnimated />} />
        <Route path="/dsa-tracker" element={<DSATracker />} />
        <Route path="/resume" element={<ResumeAnalyzer />} />
        <Route path="/companies" element={<CompanyKanbanBoard />} />
        <Route path="/analytics" element={<DetailedAnalytics />} />
        <Route path="/mock-interviews" element={<MockInterviewScheduling />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
