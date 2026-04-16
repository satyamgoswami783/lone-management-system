import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Briefcase,
  CreditCard,
  HandCoins,
  Upload,
  CheckSquare,
  ArrowRight,
  ArrowLeft,
  Info,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Stepper from '../../components/ui/Stepper';
import { SectionHeader } from '../../components/ui/Shared';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';

const steps = [
  "Personal",
  "Employment",
  "Financial",
  "Request",
  "Documents",
  "Agreement"
];

const LoanApplication = () => {
  const navigate = useNavigate();
  const { addApplication, canApply } = useLoans();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Step 1: Personal
    fullName: user?.name || '', idNumber: '', mobile: '', email: user?.email || '', address: '',
    administration: 'No', debtReview: 'No', emergencyLoan: 'No',
    purpose: '', purposeOther: '',
    // Step 2: Employment
    employerName: '', employmentType: 'Permanent', startDate: '', salaryFrequency: 'Monthly',
    // Step 3: Financial
    netSalary: '', bankName: '', accountNumber: '', branchCode: '',
    // Step 4: Request
    amount: 3000, term: '3 Months',
    // Step 5: Documents
    payslip: null, idCopy: null, bankStatement: null,
    // Step 6: Agreement
    consent: false, signature: ''
  });

  const isEligible = user ? canApply(user.email) : true;

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const nextStep = () => {
    if (currentStep === 0 && !isEligible) {
      setError('You already have an active loan or application and are currently not eligible for a new request.');
      return;
    }
    setError('');
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };
  const prevStep = () => {
    setError('');
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    try {
      addApplication({
        name: formData.fullName,
        email: formData.email,
        company: formData.employerName,
        amount: formData.amount,
        idNumber: formData.idNumber,
        salary: formData.netSalary,
        purpose: formData.purpose === 'Other' ? formData.purposeOther : formData.purpose
      });
      navigate('/employee/status');
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepPersonal data={formData} update={updateFormData} />;
      case 1: return <StepEmployment data={formData} update={updateFormData} />;
      case 2: return <StepFinancial data={formData} update={updateFormData} />;
      case 3: return <StepRequest data={formData} update={updateFormData} />;
      case 4: return <StepDocuments data={formData} update={updateFormData} />;
      case 5: return <StepAgreement data={formData} update={updateFormData} />;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in duration-700 pb-20">
      <SectionHeader
        title="Loan Application"
        description="Please complete all steps to submit your application for processing."
      />

      {error && (
        <div className="bg-red-50 border border-red-100 p-6 rounded-[24px] flex items-center gap-4 text-red-600 animate-in">
          <AlertCircle className="w-6 h-6" />
          <p className="font-bold text-sm tracking-tight">{error}</p>
        </div>
      )}

      <div className="glass p-10 rounded-[48px] border-slate-800 space-y-12 relative overflow-hidden group shadow-sm transition-all hover:shadow-xl">
        {/* Soft Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-blue-600/5 blur-[80px]"></div>

        <Stepper steps={steps} currentStep={currentStep} />

        <div className="pt-8 relative z-10 transition-all duration-500 min-h-[400px]">
          {renderStep()}
        </div>

        <div className="flex items-center justify-between pt-10 border-t border-slate-800 relative z-10">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-slate-500 hover:text-slate-200 disabled:opacity-0 transition-all uppercase text-[10px] tracking-widest"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {currentStep === steps.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="btn-primary"
              disabled={!formData.consent || !formData.signature}
            >
              Submit Application
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="btn-primary group flex items-center gap-2"
            >
              Continue
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Step Components ---

const StepPersonal = ({ data, update }) => (
  <div className="space-y-8 animate-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Full Name</label>
        <input className="input-field" placeholder="Full name as per ID" value={data.fullName} onChange={e => update({ fullName: e.target.value })} />
      </div>
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">ID Number</label>
        <input className="input-field" placeholder="YYMMDD SSSS CCC" value={data.idNumber} onChange={e => update({ idNumber: e.target.value })} />
      </div>
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Mobile Number</label>
        <input className="input-field" placeholder="+27 ..." value={data.mobile} onChange={e => update({ mobile: e.target.value })} />
      </div>
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
        <input className="input-field" type="email" placeholder="email@address.com" value={data.email} onChange={e => update({ email: e.target.value })} />
      </div>
    </div>

    <div className="p-8 rounded-[32px] bg-slate-900 border border-slate-800 space-y-6">
      <div className="flex items-center gap-3 text-blue-500 border-b border-slate-800 pb-4 mb-4">
        <Info className="w-5 h-5" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Required NCA Disclosures</span>
      </div>

      {[
        { label: 'Are you under Administration?', key: 'administration' },
        { label: 'Are you under Debt Review?', key: 'debtReview' },
        { label: 'Is this an emergency loan?', key: 'emergencyLoan' },
      ].map(q => (
        <div key={q.key} className="flex items-center justify-between gap-6">
          <span className="text-sm font-bold text-slate-300">{q.label}</span>
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-800">
            {['Yes', 'No'].map(opt => (
              <button
                key={opt}
                onClick={() => update({ [q.key]: opt })}
                className={cn(
                  "px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                  data[q.key] === opt ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-3 pt-4 border-t border-slate-800">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Purpose of Loan</label>
        <select
            className="input-field bg-white"
            value={data.purpose}
            onChange={e => update({ purpose: e.target.value })}
        >
          <option value="">Select individual purpose</option>
          <option value="Funeral">Funeral Cover</option>
          <option value="Housing">Housing Repair</option>
          <option value="Medical">Medical Bills</option>
          <option value="Educational">Tuition/Fees</option>
          <option value="Accounts">Account Settlement</option>
          <option value="Other">Other Reasons</option>
        </select>
        {data.purpose === 'Other' && (
          <input
            className="input-field animate-in mt-4"
            placeholder="Please specify specific reason..."
            value={data.purposeOther}
            onChange={e => update({ purposeOther: e.target.value })}
          />
        )}
      </div>
    </div>
  </div>
);

const StepEmployment = ({ data, update }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in duration-500">
    <div className="space-y-3">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Employer Name</label>
      <input className="input-field" placeholder="Registered entity name" value={data.employerName} onChange={e => update({ employerName: e.target.value })} />
    </div>
    <div className="space-y-3">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Employment Type</label>
      <select className="input-field bg-white" value={data.employmentType} onChange={e => update({ employmentType: e.target.value })}>
        <option>Permanent Staff</option>
        <option>Contract Basis</option>
        <option>Seasonal / Casual</option>
      </select>
    </div>
    <div className="space-y-3">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Start Date</label>
      <input className="input-field" type="date" value={data.startDate} onChange={e => update({ startDate: e.target.value })} />
    </div>
    <div className="space-y-3">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Salary Frequency</label>
      <select className="input-field bg-white" value={data.salaryFrequency} onChange={e => update({ salaryFrequency: e.target.value })}>
        <option>Weekly Payment</option>
        <option>Fortnightly Cycle</option>
        <option>Monthly Cycle</option>
      </select>
    </div>
  </div>
);

const StepFinancial = ({ data, update }) => (
  <div className="space-y-10 animate-in duration-500">
    <div className="space-y-4 max-w-sm">
      <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Net Salary (Monthly)</label>
      <div className="relative group">
        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-200 font-bold">R</span>
        <input className="input-field pl-12 h-16 text-xl" type="number" placeholder="0.00" value={data.netSalary} onChange={e => update({ netSalary: e.target.value })} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-slate-800">
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Bank Name</label>
        <input className="input-field" placeholder="Commercial Bank" value={data.bankName} onChange={e => update({ bankName: e.target.value })} />
      </div>
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Account Number</label>
        <input className="input-field" placeholder="10-12 digit sequence" value={data.accountNumber} onChange={e => update({ accountNumber: e.target.value })} />
      </div>
      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Branch Code</label>
        <input className="input-field" placeholder="6-digit sorting code" value={data.branchCode} onChange={e => update({ branchCode: e.target.value })} />
      </div>
    </div>
  </div>
);

const StepRequest = ({ data, update }) => (
  <div className="space-y-12 animate-in duration-500">
    <div className="p-10 rounded-[40px] bg-slate-900 border border-slate-800 flex flex-col items-center text-center space-y-10">
        <div className="space-y-2">
            <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Requesting Principal</h4>
            <div className="text-6xl font-display font-black text-slate-200 tracking-tighter">R {data.amount.toLocaleString()}</div>
        </div>

        <div className="w-full space-y-6">
            <input
                type="range"
                min="300"
                max="9000"
                step="100"
                value={data.amount}
                onChange={e => update({ amount: parseInt(e.target.value) })}
                className="w-full h-3 bg-white rounded-full appearance-none cursor-pointer accent-blue-600 border border-slate-800"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                <span>Minimum R 300</span>
                <span>Maximum R 9,000</span>
            </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
            {['1 Month', '3 Months', '6 Months'].map(t => (
                <button
                key={t}
                onClick={() => update({ term: t })}
                className={cn(
                    "px-10 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border transition-all",
                    data.term === t ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20" : "bg-white border-slate-800 text-slate-500 hover:border-slate-400"
                )}
                >
                {t}
                </button>
            ))}
        </div>
    </div>

    <div className="flex items-center justify-between p-8 rounded-[32px] bg-blue-50 border border-blue-100">
      <div className="flex gap-6 items-center">
        <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
          <HandCoins className="w-8 h-8" />
        </div>
        <div>
          <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest mb-1.5">Estimated Installment</p>
          <p className="text-4xl font-display font-bold text-slate-800 tracking-tight">R {(data.amount * 1.12 / (parseInt(data.term) || 1)).toFixed(2)}</p>
        </div>
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">Fixed Annual Interest</p>
        <p className="text-2xl font-bold text-emerald-500">12.0% APR</p>
      </div>
    </div>
  </div>
);

const StepDocuments = ({ data, update }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in duration-500">
    {[
      { label: 'Latest Payslip', key: 'payslip' },
      { label: 'ID Document', key: 'idCopy' },
      { label: 'Bank Statement', key: 'bankStatement' },
    ].map(doc => (
      <div key={doc.key} className="relative group">
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer z-20"
          onChange={e => update({ [doc.key]: e.target.files[0] })}
        />
        <div className={cn(
          "h-64 rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center gap-6 transition-all duration-500 relative overflow-hidden",
          data[doc.key] ? "border-emerald-500/30 bg-emerald-50 shadow-inner" : "border-slate-800 bg-slate-900 group-hover:border-blue-500/30 group-hover:bg-white shadow-sm"
        )}>
           <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity duration-500", 
               data[doc.key] ? "from-emerald-500" : "from-blue-600")}></div>

          {data[doc.key] ? (
            <div className="relative z-10 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/20">
                <CheckSquare className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-emerald-700">File Captured</p>
                <p className="text-[10px] text-emerald-500 font-bold uppercase truncate max-w-[160px] mx-auto opacity-70 mt-1">{data[doc.key].name}</p>
              </div>
            </div>
          ) : (
            <div className="relative z-10 text-center space-y-4">
              <div className="w-16 h-16 bg-slate-800 rounded-[20px] flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all shadow-sm">
                <Upload className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-300 group-hover:text-slate-200 transition-colors uppercase tracking-tight">{doc.label}</p>
                <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em] mt-2">Support: PDF, JPG, PNG</p>
              </div>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

const StepAgreement = ({ data, update }) => (
  <div className="space-y-10 animate-in duration-500">
    <div className="bg-white p-10 rounded-[40px] h-80 overflow-y-auto custom-scrollbar border border-slate-800 text-slate-400 text-sm leading-relaxed shadow-inner">
      <h3 className="text-slate-200 font-bold mb-6 text-base tracking-tight">Terms and Legal Conditions</h3>
      <div className="space-y-4 font-medium italic">
        <p>1. I hereby confirm that the electronic information provided is true and correct and matches my official identification.</p>
        <p>2. I authorize Corporate LMS to perform required credit checks and verify my current employment status with my listed employer.</p>
        <p>3. I agree to the payroll deduction terms as specified in the loan request summary previously confirmed.</p>
        <p>4. I hereby declare that I am not currently under administration or debt review as defined by the National Credit Act.</p>
        <p>5. Electronic signatures provided are legally binding under the Electronic Communications and Transactions Act.</p>
      </div>
    </div>

    <div className="space-y-8">
      <label className="flex items-start gap-5 cursor-pointer group p-4 border border-transparent hover:border-blue-500/10 rounded-3xl transition-all">
        <input
          type="checkbox"
          className="w-6 h-6 rounded-lg mt-0.5 border-slate-700 bg-white text-blue-600 focus:ring-blue-500/20"
          checked={data.consent}
          onChange={e => update({ consent: e.target.checked })}
        />
        <span className="text-sm font-bold text-slate-300 group-hover:text-slate-200 transition-colors leading-relaxed">
          I have read and agree to the terms and conditions and I consent to the validation and credit check process.
        </span>
      </label>

      <div className="space-y-3">
        <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Digital Execution (Full Name)</label>
        <div className="relative group">
          <input
            className="input-field font-display italic text-3xl h-24 border-slate-800 focus:border-emerald-500/30 tracking-tight"
            placeholder="Execution signature here..."
            value={data.signature}
            onChange={e => update({ signature: e.target.value })}
          />
          {data.signature && (
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-emerald-500 animate-in zoom-in">
              <CheckSquare className="w-10 h-10 shadow-lg shadow-emerald-500/10" />
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default LoanApplication;
