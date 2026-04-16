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
      navigate('/applicant/status');
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStep = () => {
    switch(currentStep) {
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
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <SectionHeader 
        title="Loan Application" 
        description="Please complete all steps to submit your application."
      />

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-4 duration-500">
          <AlertCircle className="w-5 h-5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="glass p-8 rounded-[40px] space-y-12 relative overflow-hidden">
        {/* Glow behind stepper */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-blue-600/5 blur-[60px]"></div>

        <Stepper steps={steps} currentStep={currentStep} />

        <div className="pt-8 transition-all duration-500">
            {renderStep()}
        </div>

        <div className="flex items-center justify-between pt-8 border-t border-slate-800/50">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-slate-400 hover:text-white disabled:opacity-0 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>
          
          {currentStep === steps.length - 1 ? (
             <button 
                onClick={handleSubmit}
                className="btn-primary px-10 py-3 appearance-none"
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
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Full Name</label>
        <input className="input-field" placeholder="John Doe" value={data.fullName} onChange={e => update({fullName: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">ID Number</label>
        <input className="input-field" placeholder="YYMMDD SSSS CCC" value={data.idNumber} onChange={e => update({idNumber: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Mobile Number</label>
        <input className="input-field" placeholder="+27 ..." value={data.mobile} onChange={e => update({mobile: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Email Address</label>
        <input className="input-field" type="email" placeholder="john@example.com" value={data.email} onChange={e => update({email: e.target.value})} />
      </div>
    </div>

    <div className="input-field py-4 space-y-4 bg-slate-900/30">
      <div className="flex items-center gap-2 text-blue-400 mb-2">
        <Info className="w-4 h-4" />
        <span className="text-xs font-bold uppercase tracking-wider">NCA Required Questions</span>
      </div>
      
      {[
        { label: 'Are you under Administration?', key: 'administration' },
        { label: 'Are you under Debt Review?', key: 'debtReview' },
        { label: 'Is this an emergency loan?', key: 'emergencyLoan' },
      ].map(q => (
        <div key={q.key} className="flex items-center justify-between gap-4">
          <span className="text-sm text-slate-300">{q.label}</span>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['Yes', 'No'].map(opt => (
              <button 
                key={opt}
                onClick={() => update({[q.key]: opt})}
                className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                    data[q.key] === opt ? "bg-blue-600 text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className="space-y-2 pt-2">
        <label className="text-sm text-slate-300">Purpose of Loan</label>
        <select 
            className="input-field bg-slate-950" 
            value={data.purpose} 
            onChange={e => update({purpose: e.target.value})}
        >
          <option value="">Select Purpose</option>
          <option value="Funeral">Funeral</option>
          <option value="Housing">Housing</option>
          <option value="Medical">Medical</option>
          <option value="Educational">Educational</option>
          <option value="Accounts">Accounts</option>
          <option value="Other">Other</option>
        </select>
        {data.purpose === 'Other' && (
          <input 
            className="input-field animate-in slide-in-from-top-2 duration-300" 
            placeholder="Please specify..." 
            value={data.purposeOther} 
            onChange={e => update({purposeOther: e.target.value})} 
          />
        )}
      </div>
    </div>
  </div>
);

const StepEmployment = ({ data, update }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">Employer Name</label>
      <input className="input-field" placeholder="Company Name" value={data.employerName} onChange={e => update({employerName: e.target.value})} />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">Employment Type</label>
      <select className="input-field" value={data.employmentType} onChange={e => update({employmentType: e.target.value})}>
        <option>Permanent</option>
        <option>Contract</option>
        <option>Seasonal</option>
      </select>
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">Start Date</label>
      <input className="input-field" type="date" value={data.startDate} onChange={e => update({startDate: e.target.value})} />
    </div>
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-400">Salary Frequency</label>
      <select className="input-field" value={data.salaryFrequency} onChange={e => update({salaryFrequency: e.target.value})}>
        <option>Weekly</option>
        <option>Fortnightly</option>
        <option>Monthly</option>
      </select>
    </div>
  </div>
);

const StepFinancial = ({ data, update }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="space-y-2 max-w-sm">
      <label className="text-sm font-medium text-slate-400">Net Salary (Monthly)</label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">R</span>
        <input className="input-field pl-8" type="number" placeholder="0.00" value={data.netSalary} onChange={e => update({netSalary: e.target.value})} />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Bank Name</label>
        <input className="input-field" placeholder="Bank" value={data.bankName} onChange={e => update({bankName: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Account Number</label>
        <input className="input-field" placeholder="..." value={data.accountNumber} onChange={e => update({accountNumber: e.target.value})} />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-400">Branch Code</label>
        <input className="input-field" placeholder="..." value={data.branchCode} onChange={e => update({branchCode: e.target.value})} />
      </div>
    </div>
  </div>
);

const StepRequest = ({ data, update }) => (
  <div className="space-y-12 py-4 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <label className="text-sm font-medium text-slate-400 uppercase tracking-widest">Loan Amount</label>
          <div className="text-5xl font-display font-bold text-blue-400 mt-2">R {data.amount.toLocaleString()}</div>
        </div>
        <div className="text-right">
             <label className="text-sm font-medium text-slate-400 uppercase tracking-widest">Repayment Term</label>
             <div className="flex gap-2 mt-2">
                {['1 Month', '3 Months', '6 Months'].map(t => (
                    <button 
                        key={t}
                        onClick={() => update({term: t})}
                        className={cn(
                            "px-4 py-2 rounded-xl text-xs font-bold border transition-all",
                            data.term === t ? "bg-blue-600 border-blue-600 text-white" : "border-slate-800 text-slate-500 hover:border-slate-600"
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
      </div>
      
      <input 
        type="range" 
        min="300" 
        max="9000" 
        step="100"
        value={data.amount}
        onChange={e => update({amount: parseInt(e.target.value)})}
        className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-widest">
        <span>Min: R 300</span>
        <span>Max: R 9,000</span>
      </div>
    </div>

    <div className="glass bg-blue-600/5 p-6 rounded-3xl border border-blue-500/10 flex items-center justify-between">
        <div className="flex gap-4 items-center">
            <div className="p-3 bg-blue-600/20 rounded-2xl text-blue-400">
                <HandCoins className="w-6 h-6" />
            </div>
            <div>
                <p className="text-sm text-slate-400">Estimated Monthly Repayment</p>
                <p className="text-2xl font-display font-bold">R {(data.amount * 1.12 / (parseInt(data.term) || 1)).toFixed(2)}</p>
            </div>
        </div>
        <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter">Interest Rate</p>
            <p className="text-sm font-bold text-emerald-400">12% Fixed</p>
        </div>
    </div>
  </div>
);

const StepDocuments = ({ data, update }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
    {[
      { label: 'Latest Payslip', key: 'payslip' },
      { label: 'ID Copy', key: 'idCopy' },
      { label: 'Bank Statement', key: 'bankStatement' },
    ].map(doc => (
      <div key={doc.key} className="relative group">
        <input 
            type="file" 
            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
            onChange={e => update({[doc.key]: e.target.files[0]})}
        />
        <div className={cn(
            "h-48 rounded-3xl border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-all duration-300",
            data[doc.key] ? "border-emerald-500/50 bg-emerald-500/5" : "border-slate-800 bg-slate-900/50 group-hover:border-blue-500/50 group-hover:bg-blue-500/5"
        )}>
          {data[doc.key] ? (
            <>
                <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-400">
                    <CheckSquare className="w-6 h-6" />
                </div>
                <div className="text-center px-4">
                    <p className="text-sm font-bold text-slate-200">Uploaded</p>
                    <p className="text-[10px] text-slate-500 truncate max-w-[120px]">{data[doc.key].name}</p>
                </div>
            </>
          ) : (
            <>
                <div className="p-3 bg-slate-800 rounded-2xl text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                    <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{doc.label}</p>
                    <p className="text-[10px] text-slate-600 uppercase tracking-widest mt-1">Click to browse</p>
                </div>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
);

const StepAgreement = ({ data, update }) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
    <div className="glass bg-slate-950 p-6 rounded-3xl h-64 overflow-y-auto mb-6 text-slate-400 text-sm leading-relaxed border border-slate-800">
        <h3 className="text-slate-200 font-bold mb-4">Terms and Conditions</h3>
        <p>1. I hereby confirm that the information provided is true and correct...</p>
        <p className="mt-4">2. I authorize the company to perform credit checks and verify my employment status...</p>
        <p className="mt-4">3. I agree to the payroll deduction terms as specified in the loan request step...</p>
        <p className="mt-4">4. NCA Compliance: I hereby declare that I am not under administration or debt review...</p>
        <p className="mt-8 text-xs italic">Scroll down to read the full agreement...</p>
    </div>

    <div className="space-y-4">
        <label className="flex items-start gap-4 cursor-pointer group">
            <input 
                type="checkbox" 
                className="w-5 h-5 rounded-md mt-1 border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500/50" 
                checked={data.consent}
                onChange={e => update({consent: e.target.checked})}
            />
            <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                I have read and agree to the terms and conditions and I consent to the credit check process.
            </span>
        </label>

        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-500 uppercase tracking-widest px-1">Digital Signature</label>
            <div className="relative">
                <input 
                    className="input-field font-display italic text-2xl h-16 border-slate-800 focus:border-emerald-500/50" 
                    placeholder="Type full name to sign" 
                    value={data.signature}
                    onChange={e => update({signature: e.target.value})}
                />
                {data.signature && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 animate-in zoom-in">
                        <CheckSquare className="w-6 h-6" />
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
