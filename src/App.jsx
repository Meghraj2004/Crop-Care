import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { DataProvider } from './context/DataContext';

import { Navbar } from './components/layout/Navbar';
import { BottomNav } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { RealtimeToastContainer } from './components/common/RealtimeToast';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { KnowledgeBasePage } from './pages/public/KnowledgeBasePage';
import { KnowledgeArticleDetailsPage } from './pages/public/KnowledgeArticleDetailsPage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
import { FarmerRegisterPage } from './pages/auth/FarmerRegisterPage';
import { ResearcherRegisterPage } from './pages/auth/ResearcherRegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Farmer Pages
import { FarmerDashboardPage } from './pages/farmer/FarmerDashboardPage';
import { ReportProblemPage } from './pages/farmer/ReportProblemPage';
import { MyProblemsPage } from './pages/farmer/MyProblemsPage';
import { IssueDetailsPage } from './pages/farmer/IssueDetailsPage';
import { SavedSolutionsPage } from './pages/farmer/SavedSolutionsPage';
import { FarmerNotificationsPage } from './pages/farmer/FarmerNotificationsPage';
import { FarmerProfilePage } from './pages/farmer/FarmerProfilePage';
import { HelpSupportPage } from './pages/farmer/HelpSupportPage';

// Expert Pages
import { ExpertDashboardPage } from './pages/expert/ExpertDashboardPage';
import { AssignedCasesPage } from './pages/expert/AssignedCasesPage';
import { ExpertCaseReviewPage } from './pages/expert/ExpertCaseReviewPage';
import { ResearchCasesPage } from './pages/expert/ResearchCasesPage';
import { ResearchCaseDetailsPage } from './pages/expert/ResearchCaseDetailsPage';
import { ExpertResponsesPage } from './pages/expert/ExpertResponsesPage';
import { ExpertProfilePage } from './pages/expert/ExpertProfilePage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { ManageUsersPage } from './pages/admin/ManageUsersPage';
import { ApproveResearchersPage } from './pages/admin/ApproveResearchersPage';
import { ManageDepartmentsPage } from './pages/admin/ManageDepartmentsPage';
import { ManageIssuesPage } from './pages/admin/ManageIssuesPage';
import { ManageResearchPage } from './pages/admin/ManageResearchPage';
import { ManageSolutionsPage } from './pages/admin/ManageSolutionsPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <DataProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
              <Navbar />
              <RealtimeToastContainer />

              <main className="flex-1">
                <Routes>
                  {/* Public / Entry Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/home" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
                  <Route path="/knowledge/:id" element={<KnowledgeArticleDetailsPage />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
                  <Route path="/register" element={<Navigate to="/register/farmer" replace />} />
                  <Route path="/register/farmer" element={<FarmerRegisterPage />} />
                  <Route path="/register/researcher" element={<Navigate to="/login" replace />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  {/* Farmer Routes (Protected by Farmer Role) */}
                  <Route path="/farmer/dashboard" element={<ProtectedRoute allowedRoles={['Farmer']}><FarmerDashboardPage /></ProtectedRoute>} />
                  <Route path="/farmer/report-problem" element={<ProtectedRoute allowedRoles={['Farmer']}><ReportProblemPage /></ProtectedRoute>} />
                  <Route path="/farmer/issues" element={<ProtectedRoute allowedRoles={['Farmer']}><MyProblemsPage /></ProtectedRoute>} />
                  <Route path="/farmer/issues/:id" element={<ProtectedRoute allowedRoles={['Farmer', 'Agricultural Expert / Researcher', 'Agriculture Department Admin']}><IssueDetailsPage /></ProtectedRoute>} />
                  <Route path="/farmer/saved-solutions" element={<ProtectedRoute allowedRoles={['Farmer']}><SavedSolutionsPage /></ProtectedRoute>} />
                  <Route path="/farmer/notifications" element={<ProtectedRoute allowedRoles={['Farmer', 'Agricultural Expert / Researcher']}><FarmerNotificationsPage /></ProtectedRoute>} />
                  <Route path="/farmer/profile" element={<ProtectedRoute allowedRoles={['Farmer']}><FarmerProfilePage /></ProtectedRoute>} />
                  <Route path="/farmer/help" element={<ProtectedRoute allowedRoles={['Farmer']}><HelpSupportPage /></ProtectedRoute>} />

                  {/* Expert Routes (Protected by Researcher Role) */}
                  <Route path="/expert/dashboard" element={<ProtectedRoute allowedRoles={['Agricultural Expert / Researcher']}><ExpertDashboardPage /></ProtectedRoute>} />
                  <Route path="/expert/cases" element={<ProtectedRoute allowedRoles={['Agricultural Expert / Researcher']}><AssignedCasesPage /></ProtectedRoute>} />
                  <Route path="/expert/cases/:id" element={<ProtectedRoute allowedRoles={['Agricultural Expert / Researcher']}><ExpertCaseReviewPage /></ProtectedRoute>} />
                  <Route path="/expert/research" element={<ProtectedRoute allowedRoles={['Agricultural Expert / Researcher']}><ResearchCasesPage /></ProtectedRoute>} />
                  <Route path="/expert/research/:id" element={<ProtectedRoute allowedRoles={['Agricultural Expert / Researcher']}><ResearchCaseDetailsPage /></ProtectedRoute>} />
                  <Route path="/expert/responses" element={<ProtectedRoute allowedRoles={['Agricultural Expert / Researcher']}><ExpertResponsesPage /></ProtectedRoute>} />
                  <Route path="/expert/profile" element={<ProtectedRoute allowedRoles={['Agricultural Expert / Researcher']}><ExpertProfilePage /></ProtectedRoute>} />

                  {/* Admin Routes (Protected by Department Admin Role) */}
                  <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['Agriculture Department Admin']}><AdminDashboardPage /></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['Agriculture Department Admin']}><ManageUsersPage /></ProtectedRoute>} />
                  <Route path="/admin/researchers" element={<ProtectedRoute allowedRoles={['Agriculture Department Admin']}><ApproveResearchersPage /></ProtectedRoute>} />
                  <Route path="/admin/departments" element={<ProtectedRoute allowedRoles={['Agriculture Department Admin']}><ManageDepartmentsPage /></ProtectedRoute>} />
                  <Route path="/admin/issues" element={<ProtectedRoute allowedRoles={['Agriculture Department Admin']}><ManageIssuesPage /></ProtectedRoute>} />
                  <Route path="/admin/research" element={<ProtectedRoute allowedRoles={['Agriculture Department Admin']}><ManageResearchPage /></ProtectedRoute>} />
                  <Route path="/admin/solutions" element={<ProtectedRoute allowedRoles={['Agriculture Department Admin']}><ManageSolutionsPage /></ProtectedRoute>} />
                  <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['Agriculture Department Admin']}><AdminAnalyticsPage /></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['Agriculture Department Admin']}><AdminSettingsPage /></ProtectedRoute>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>

              <BottomNav />
              <Footer />
            </div>
          </Router>
        </DataProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
