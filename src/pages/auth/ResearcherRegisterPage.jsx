import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, User, Phone, Mail, Lock, Building, Award, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ResearcherRegisterPage = () => {
  const { registerResearcher } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    department: 'Plant Pathology',
    specialization: '',
    institution: '',
    employeeId: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerResearcher(formData);
    setSubmitted(true);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-teal-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Expert & Researcher Registration</h1>
          <p className="text-xs text-slate-500 font-medium">
            Join the Agriculture Department Expert Panel to diagnose crop cases and conduct research studies
          </p>
        </div>

        {/* Mandatory Admin Approval Notice */}
        <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl flex items-start gap-3 text-xs text-amber-900">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Agriculture Dept Admin Approval Required:</span>
            Your account will be submitted for verification by the Department Admin before you can log in and review farmer cases.
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Registration Submitted for Approval!</h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
                Thank you, Dr./Prof. {formData.fullName}. Your researcher application has been routed to the Agriculture Department Admin panel. You will receive an approval notification shortly.
              </p>
              <div className="pt-3">
                <Link to="/login" className="px-5 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl inline-block">
                  Return to Login Page
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-800">Full Name (with Designation) *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Dr. Anil Sharma"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-800">Official Email *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="anil.sharma@agri.gov.in"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-800">Mobile Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      value={formData.mobileNumber}
                      onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="9422011223"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-800">Department *</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                  >
                    <option value="Plant Pathology">Plant Pathology</option>
                    <option value="Entomology">Entomology</option>
                    <option value="Soil Science">Soil Science</option>
                    <option value="Agronomy">Agronomy</option>
                    <option value="Horticulture">Horticulture</option>
                    <option value="Agricultural Engineering">Agricultural Engineering</option>
                    <option value="Extension Department">Extension Department</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-800">Employee / Researcher ID *</label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={e => setFormData({ ...formData, employeeId: e.target.value })}
                    placeholder="e.g. EXP-8842"
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Specialization & Focus Area *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                    placeholder="e.g. Fungal Disease Management & Biological Pest Control"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                  />
                  <Award className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Research Institution / Organization *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.institution}
                    onChange={e => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. Mahatma Phule Krishi Vidyapeeth (MPKV), Rahuri"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                  />
                  <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Password *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-sm rounded-xl shadow-md transition-colors"
              >
                Submit Researcher Application for Approval
              </button>
            </form>
          )}

          <div className="border-t border-slate-100 pt-3 text-center text-xs text-slate-500">
            Already have an approved account? <Link to="/login" className="text-teal-700 font-bold hover:underline">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
