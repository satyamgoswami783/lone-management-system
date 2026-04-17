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
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DocumentPreviewModal from '../../components/ui/DocumentPreviewModal';
import Modal from '../../components/ui/Modal';
import { buildLetterPayload, LETTER_TYPES } from '../../features/letters/generator';
import { cleanupHtml2PdfArtifacts } from '../../utils/pdfCleanup';

const DocumentsCenter = () => {
    const { applications } = useLoans();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [viewingApp, setViewingApp] = useState(false);
    const [previewTarget, setPreviewTarget] = useState(null);
    const [toast, setToast] = useState(null);

    // Get active/recent application for this user
    const userApp = applications.find(app => app.email === user?.email) || applications[0];

    const letters = [
        { id: 1, title: 'Settlement Letter', description: 'Official document confirming the outstanding settlement amount.', type: LETTER_TYPES.SETTLEMENT },
        { id: 2, title: 'Paid-Up Letter', description: 'Proof that your loan has been fully settled and closed.', type: LETTER_TYPES.PAID_UP },
        { id: 3, title: 'Loan Confirmation', description: 'Summary of your active loan agreement and terms.', type: LETTER_TYPES.CONFIRMATION },
    ];

    const userDocuments = [
        { id: 'doc-1', name: 'ID Document.pdf', type: 'Identification', date: '2026-04-10', status: 'Verified' },
        { id: 'doc-2', name: 'Latest_Payslip.pdf', type: 'Income Proof', date: '2026-04-12', status: 'Verified' },
        { id: 'doc-3', name: 'Bank_Statement_3mo.pdf', type: 'Financial Proof', date: '2026-04-13', status: 'Pending' },
    ];

    const handlePrint = () => {
        window.print();
    };

    const handlePreviewLetter = (letterType) => {
        try {
            if (!userApp) {
                throw new Error('No loan application found for this user.');
            }

            const payload = buildLetterPayload(letterType, userApp);
            setPreviewTarget(payload);
        } catch (error) {
            setToast({
                type: 'danger',
                message: error.message || 'Unable to generate this letter.',
            });
        }
    };

    const handleDownloadPdf = async (element, filename) => {
        try {
            cleanupHtml2PdfArtifacts();
            const html2pdfModule = await import('html2pdf.js');
            const html2pdf = html2pdfModule.default || html2pdfModule;
            await html2pdf()
                .set({
                    margin: 8,
                    filename,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                })
                .from(element)
                .save();

            setToast({ type: 'success', message: `${filename} downloaded successfully.` });
        } catch (error) {
            setToast({ type: 'danger', message: 'Failed to generate PDF. Please try again.' });
        } finally {
            cleanupHtml2PdfArtifacts();
        }
    };

    const handleSendEmail = ({ borrowerEmail, bankEmail, documentTitle }) => {
        if (!borrowerEmail) {
            setToast({ type: 'danger', message: 'Borrower email is missing.' });
            return;
        }
        if (!bankEmail || !bankEmail.includes('@')) {
            setToast({ type: 'danger', message: 'Enter a valid bank/compliance email.' });
            return;
        }

        setToast({
            type: 'success',
            message: `${documentTitle} queued for email to ${borrowerEmail} and ${bankEmail}.`,
        });
    };

    return (
        <>
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
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
                                    onClick={() => handlePreviewLetter(letter.type)}
                                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all"
                                >
                                    <Eye className="w-4 h-4" />
                                    View
                                </button>
                                <button
                                    onClick={() => handlePreviewLetter(letter.type)}
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
                                <div key={doc.id} className="p-4 lg:p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-900/40 transition-all gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-slate-900 flex items-center justify-center text-slate-500 shrink-0">
                                            <FileText className="w-5 h-5 lg:w-6 lg:h-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-200 truncate">{doc.name}</p>
                                            <div className="flex flex-wrap items-center gap-2 mt-1">
                                                <span className="text-[10px] text-slate-500 uppercase font-bold">{doc.type}</span>
                                                <span className="text-[10px] text-slate-600 hidden xs:inline">•</span>
                                                <span className="text-[10px] text-slate-500 font-mono">{doc.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800/50 pt-3 sm:pt-0">
                                        <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'}>
                                            {doc.status}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setPreviewTarget({ title: doc.name, type: doc.type })}
                                                className="p-2.5 bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => alert(`Downloading ${doc.name}`)}
                                                className="p-2.5 bg-slate-800 rounded-xl text-slate-500 hover:text-white transition-colors"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
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

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={() => setViewingApp(!viewingApp)}
                                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-800 rounded-2xl text-sm font-bold text-slate-300 hover:bg-slate-700 transition-all border border-slate-700"
                            >
                                <Eye className="w-4 h-4" />
                                {viewingApp ? 'Hide Details' : 'View Full Form'}
                            </button>
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 sm:flex-none p-3 lg:px-4 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all border border-slate-700 flex items-center justify-center"
                                >
                                    <Printer className="w-5 h-5 lg:w-5 lg:h-5" />
                                </button>
                                <button
                                    onClick={() => navigate(`/employee/application/${userApp?.id}`)}
                                    className="flex-1 sm:flex-none p-3 lg:px-4 bg-blue-600 rounded-2xl text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center"
                                >
                                    <ExternalLink className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            </div>

            {/* Application Full Form Modal */}
            <Modal
                isOpen={viewingApp}
                onClose={() => setViewingApp(false)}
                title="Loan Application Details"
                maxWidth="max-w-6xl"
            >
                {userApp && (
                    <div className="space-y-12 py-4 pb-20">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-800/50 pb-8">
                            <div className="space-y-3">
                                <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-2xl shadow-blue-600/20">
                                    <FileText className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-3xl font-display font-bold text-slate-100 italic">Form Summary</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="primary">{userApp.status}</Badge>
                                        <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest leading-none">•</span>
                                        <p className="text-slate-500 font-mono font-bold text-[10px] uppercase tracking-widest">REF: {userApp.id}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 sm:gap-8 bg-slate-950/40 p-6 rounded-[32px] border border-slate-800/50 w-full md:w-auto">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Submission Date</p>
                                    <p className="text-sm font-bold text-slate-200">{new Date(userApp.date).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Requested Principal</p>
                                    <p className="text-sm font-black text-blue-400">R {userApp.amount?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                            <section className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Personal Assets</h4>
                                </div>
                                <div className="space-y-5 bg-slate-950/20 p-6 rounded-3xl border border-slate-800/30">
                                    <FormDetail label="Employee Full Name" value={userApp.name} />
                                    <FormDetail label="National ID / Passport" value={userApp.idNumber || 'LMS-940251-X'} />
                                    <FormDetail label="Primary Email" value={userApp.email} />
                                    <FormDetail label="Contact Number" value={userApp.phone || '+27 71 000 0000'} />
                                </div>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Professional Data</h4>
                                </div>
                                <div className="space-y-5 bg-slate-950/20 p-6 rounded-3xl border border-slate-800/30">
                                    <FormDetail label="Registered Employer" value={userApp.company} />
                                    <FormDetail label="Net Monthly Salary" value={`R ${userApp.salary?.toLocaleString()}`} />
                                    <FormDetail label="Employment Duration" value="3 Years, 2 Months" />
                                    <FormDetail label="Department" value={userApp.department || 'Operations'} />
                                </div>
                            </section>

                            <section className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Risk Analysis</h4>
                                </div>
                                <div className="space-y-5 bg-slate-950/20 p-6 rounded-3xl border border-slate-800/30">
                                    <FormDetail label="Requested Loan Amount" value={`R ${userApp.amount?.toLocaleString()}`} />
                                    <FormDetail label="Estimated Installment" value={`R ${(userApp.amount / 12 * 1.15).toFixed(2)}`} />
                                    <FormDetail label="Repayment Strategy" value="Payroll Deduction" />
                                    <div className="pt-2 border-t border-slate-800/50">
                                        <p className="text-[9px] font-black text-slate-600 uppercase mb-2">Internal Risk Profile</p>
                                        <Badge variant="success">Low Volatility</Badge>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="p-8 bg-blue-600/5 rounded-[32px] border border-blue-600/10 flex flex-col sm:flex-row items-center gap-6 justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 text-blue-500">
                                     <ShieldCheck className="w-10 h-10" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-200 italic">Legal Acknowledgment</p>
                                    <p className="text-xs text-slate-500 leading-relaxed max-w-lg">I hereby confirm that all provided information is accurate and verified by the Corporate Compliance Engine.</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-5 py-2.5 rounded-2xl text-[10px] font-mono font-bold text-blue-400 italic">
                                SIGNED: {new Date(userApp.date).toLocaleDateString()}
                            </div>
                        </div>

                        {/* Footer Buttons moved inside Scroll Area */}
                        <div className="mt-20 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row gap-6 justify-between items-center bg-slate-900/40 p-8 rounded-[40px] border border-slate-800/30">
                            <div className="flex items-center gap-4">
                                <ShieldCheck className="w-8 h-8 text-emerald-500" />
                                <div>
                                    <p className="text-[10px] font-black text-slate-100 uppercase tracking-widest leading-tight">Digital Audit Hash</p>
                                    <p className="text-[10px] text-slate-500 font-mono truncate max-w-[200px]">{userApp?.id}-SECURE-VERIFIED</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                                <button 
                                    onClick={handlePrint}
                                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-800 rounded-2xl text-[10px] sm:text-xs font-bold text-slate-300 hover:text-white transition-all border border-slate-700 active:scale-95"
                                >
                                    <Printer className="w-4 h-4" />
                                    Export Analysis
                                </button>
                                <button 
                                    onClick={() => setViewingApp(false)}
                                    className="w-full sm:w-auto px-10 py-3.5 bg-blue-600 rounded-2xl text-white font-bold hover:bg-blue-500 shadow-xl shadow-blue-600/20 text-[10px] sm:text-xs uppercase active:scale-95"
                                >
                                    Close View
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <DocumentPreviewModal
                isOpen={!!previewTarget}
                onClose={() => setPreviewTarget(null)}
                documentTitle={previewTarget?.title}
                documentType={previewTarget?.type}
                htmlContent={previewTarget?.html}
                borrowerEmail={previewTarget?.user?.email}
                defaultFilename={previewTarget?.filename}
                onDownloadPdf={handleDownloadPdf}
                onSendEmail={handleSendEmail}
            />
        </>
    );
};

const FormDetail = ({ label, value }) => (
    <div className="space-y-1">
        <p className="text-[10px] text-slate-600 font-bold uppercase">{label}</p>
        <p className="text-sm font-medium text-slate-300">{value}</p>
    </div>
);

export default DocumentsCenter;
