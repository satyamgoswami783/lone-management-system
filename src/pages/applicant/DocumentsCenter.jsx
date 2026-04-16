import React, { useState } from 'react';
import { 
  FileText, 
  FileDown, 
  Eye, 
  Printer, 
  ShieldCheck, 
  Download, 
  Mail, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DocumentPreviewModal from '../../components/ui/DocumentPreviewModal';

const DocumentsCenter = () => {
    const { applications } = useLoans();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [viewingApp, setViewingApp] = useState(false);
    const [previewTarget, setPreviewTarget] = useState(null);

    // Get active/recent application for this user
    const userApp = applications.find(app => app.email === user?.email) || applications[0];

    const letters = [
        { id: 1, title: 'Settlement Letter', description: 'Official document confirming the outstanding settlement amount.', type: 'Settlement' },
        { id: 2, title: 'Paid-Up Letter', description: 'Proof that your loan has been fully settled and closed.', type: 'Paid-Up' },
        { id: 3, title: 'Loan Confirmation', description: 'Summary of your active loan agreement and terms.', type: 'Agreement' },
    ];

    const userDocuments = [
        { id: 'doc-1', name: 'ID Document.pdf', type: 'Identification', date: '2026-04-10', status: 'Verified' },
        { id: 'doc-2', name: 'Latest_Payslip.pdf', type: 'Income Proof', date: '2026-04-12', status: 'Verified' },
        { id: 'doc-3', name: 'Bank_Statement_3mo.pdf', type: 'Financial Proof', date: '2026-04-13', status: 'Pending' },
    ];

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <SectionHeader 
                title="Documents Center" 
                description="Access your official loan letters, managed documents, and submitted applications."
            />

            {/* 1. Letters Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-400">
                        <Mail className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-display font-bold">Official Letters</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {letters.map((letter) => (
                        <div key={letter.id} className="glass p-6 rounded-[32px] space-y-6 border-slate-800/50 hover:border-blue-500/30 transition-all group">
                            <div className="p-4 bg-slate-900 rounded-2xl w-fit text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-600/10 transition-all">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-slate-200">{letter.title}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{letter.description}</p>
                            </div>
                            <div className="pt-4 flex items-center gap-2">
                                <button 
                                    onClick={() => setPreviewTarget({ title: letter.title, type: letter.type })}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                                <button 
                                    onClick={() => alert(`Downloading ${letter.title}`)}
                                    className="p-2.5 bg-blue-600 rounded-xl text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                                >
                                    <FileDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 2. Documents Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-400">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-display font-bold">My Uploads</h2>
                    </div>

                    <div className="glass rounded-[32px] overflow-hidden border-slate-800/50">
                        <div className="divide-y divide-slate-800/50">
                            {userDocuments.map((doc) => (
                                <div key={doc.id} className="p-5 flex items-center justify-between hover:bg-slate-900/40 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200">{doc.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">{doc.type}</span>
                                                <span className="text-[10px] text-slate-600">•</span>
                                                <span className="text-[10px] text-slate-500 font-mono">{doc.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'}>
                                            {doc.status}
                                        </Badge>
                                        <button 
                                            onClick={() => setPreviewTarget({ title: doc.name, type: doc.type })}
                                            className="p-2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => alert(`Downloading ${doc.name}`)}
                                            className="p-2 text-slate-500 hover:text-white transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Application Form Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-600/10 flex items-center justify-center text-amber-400">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-display font-bold">Submitted Application</h2>
                    </div>

                    <div className="glass p-8 rounded-[32px] border-slate-800/50 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-200">Loan Application Preview</p>
                                <p className="text-xs text-slate-500 font-mono mt-1">{userApp?.id || 'NO-ACTIVE-APP'}</p>
                            </div>
                            <Badge variant="primary">{userApp?.status}</Badge>
                        </div>

                        <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Form Submission Date</span>
                                <span className="text-slate-300 font-bold">{new Date(userApp?.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Amount Requested</span>
                                <span className="text-blue-400 font-bold">R {userApp?.amount?.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-500">Loan Purpose</span>
                                <span className="text-slate-300 font-bold">{userApp?.purpose || 'General'}</span>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                onClick={() => setViewingApp(!viewingApp)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 rounded-2xl text-sm font-bold text-slate-300 hover:bg-slate-700 transition-all border border-slate-700"
                            >
                                <Eye className="w-4 h-4" />
                                {viewingApp ? 'Hide Details' : 'View Full Form'}
                            </button>
                            <button 
                                onClick={handlePrint}
                                className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all border border-slate-700"
                            >
                                <Printer className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => navigate(`/applicant/application/${userApp?.id}`)}
                                className="p-3 bg-blue-600 rounded-2xl text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                            >
                                <ExternalLink className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Expansive Full Form View (Animated) */}
            {viewingApp && userApp && (
                <div className="glass p-10 rounded-[40px] border-blue-500/20 animate-in zoom-in-95 duration-500 scroll-mt-10">
                    <div className="flex justify-between items-start mb-10 border-b border-slate-800 pb-8">
                        <div className="space-y-2">
                             <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center font-bold text-2xl mb-4">L</div>
                             <h3 className="text-3xl font-display font-bold">Loan Application Summary</h3>
                             <p className="text-slate-500 font-mono uppercase tracking-widest text-xs">Reference: {userApp.id}</p>
                        </div>
                        <button onClick={handlePrint} className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-bold text-slate-300 hover:text-white transition-all">
                             <Printer className="w-4 h-4" />
                             Print Copy
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Applicant Info</h4>
                            <div className="space-y-3">
                                <FormDetail label="Full Name" value={userApp.name} />
                                <FormDetail label="ID Number" value={userApp.idNumber || 'N/A'} />
                                <FormDetail label="Email Address" value={userApp.email} />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Employment Info</h4>
                            <div className="space-y-3">
                                <FormDetail label="Employer" value={userApp.company} />
                                <FormDetail label="Gross Salary" value={`R ${userApp.salary?.toLocaleString()}`} />
                                <FormDetail label="Pay Day" value="Monthly - 25th" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Loan Request</h4>
                            <div className="space-y-3">
                                <FormDetail label="Principle Amount" value={`R ${userApp.amount?.toLocaleString()}`} />
                                <FormDetail label="Loan Period" value="12 Months" />
                                <FormDetail label="Installment (Est)" value={`R ${(userApp.amount / 10).toLocaleString()}`} />
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-slate-800/50 flex flex-col md:flex-row gap-6 justify-between items-center bg-slate-900/20 p-8 rounded-[32px]">
                         <div className="flex items-center gap-4">
                             <ShieldCheck className="w-8 h-8 text-emerald-500" />
                             <div>
                                 <p className="text-sm font-bold text-slate-200">Electronic Signature Verified</p>
                                 <p className="text-xs text-slate-500">Digitally signed on {new Date(userApp.date).toLocaleString()}</p>
                             </div>
                         </div>
                         <div className="flex gap-3">
                             <button className="btn-primary px-8">Download PDF Report</button>
                         </div>
                    </div>
                </div>
            )}

            <DocumentPreviewModal 
                isOpen={!!previewTarget} 
                onClose={() => setPreviewTarget(null)}
                documentTitle={previewTarget?.title}
                documentType={previewTarget?.type}
            />
        </div>
    );
};

const FormDetail = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] text-slate-600 font-bold uppercase">{label}</p>
        <p className="text-sm font-medium text-slate-300">{value}</p>
    </div>
);

export default DocumentsCenter;
