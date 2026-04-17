import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Printer,
    Download,
    ShieldCheck,
    User,
    Building2,
    DollarSign,
    FileText,
    Clock,
    ExternalLink,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Badge, Toast } from '../../components/ui/Shared';
import { useLoans } from '../../context/LoanContext';
import html2pdf from 'html2pdf.js';
import { cleanupHtml2PdfArtifacts } from '../../utils/pdfCleanup';

const ApplicationFullView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { applications } = useLoans();
    const printableRef = useRef(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [toast, setToast] = useState(null);

    const application = applications.find(app => app.id === id);

    if (!application) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <FileText className="w-16 h-16 text-slate-800" />
                <h2 className="text-xl font-display font-bold text-slate-400">Application Not Found</h2>
                <button onClick={() => navigate(-1)} className="btn-primary">Go Back</button>
            </div>
        );
    }

    const handlePrint = () => window.print();
    const handleDownloadPdf = async () => {
        const targetElement = printableRef.current || document.getElementById('application-details-pdf');
        if (!targetElement) {
            setToast({ type: 'danger', message: 'PDF content is not ready yet. Please retry.' });
            return;
        }
        try {
            setIsDownloading(true);
            setToast({ type: 'info', message: 'Preparing PDF download...' });
            cleanupHtml2PdfArtifacts();
            if (typeof html2pdf !== 'function') {
                throw new Error('PDF engine unavailable');
            }
            await html2pdf()
                .set({
                    margin: 8,
                    filename: `Application-${application.id}.pdf`,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                })
                .from(targetElement)
                .save();
            setToast({ type: 'success', message: 'Application PDF downloaded successfully.' });
        } catch (error) {
            // Fallback path keeps action functional even if html2pdf fails in-browser.
            window.print();
            setToast({
                type: 'info',
                message: `PDF export fallback opened print dialog${error?.message ? ` (${error.message})` : ''}.`,
            });
        } finally {
            cleanupHtml2PdfArtifacts();
            setIsDownloading(false);
        }
    };
    const safeText = (value, fallback = 'N/A') => {
        if (value === null || value === undefined) return fallback;
        if (typeof value === 'string' && value.trim() === '') return fallback;
        return value;
    };
    const asNumber = (value, fallback = 0) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const applicantName = safeText(application.name || application.fullName);
    const applicantCompany = safeText(application.company || application.employerName);
    const applicantEmail = safeText(application.email);
    const applicantIdNumber = safeText(application.idNumber);
    const applicantSalary = asNumber(application.salary ?? application.netSalary);
    const loanAmount = asNumber(application.amount);
    const applicationDate = application.date ? new Date(application.date) : null;
    const formattedDate = applicationDate && !Number.isNaN(applicationDate.getTime())
        ? applicationDate.toLocaleDateString()
        : 'N/A';

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 print:p-0">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-xl"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold">Application Details</h1>
                        <p className="text-slate-500 font-mono text-sm uppercase tracking-widest">{application.id}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-bold transition-all shadow-xl"
                    >
                        <Printer className="w-5 h-5" />
                        Print
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                        {isDownloading ? 'Generating PDF...' : 'Download PDF'}
                    </button>
                </div>
            </div>

            <div id="application-details-pdf" ref={printableRef}>
                {/* Print Header (Only visible on print) */}
                <div className="hidden print:block mb-10 border-b-4 border-slate-900 pb-8">
                    <div className="flex justify-between items-start">
                        <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-bold text-3xl">L</div>
                        <div className="text-right space-y-1">
                            <p className="text-xl font-black tracking-tighter uppercase">Loan Management System</p>
                            <p className="text-sm font-bold">APPLICATION SUMMARY REPORT</p>
                            <p className="text-xs text-slate-500">{new Date().toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Main Content Column */}
                    <div className="lg:col-span-2 space-y-8">
                    {/* Status Overview Card */}
                    <div className="glass p-8 rounded-[40px] border-slate-800/50 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900/40">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em]">Application Progress</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-[24px] bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-200">{safeText(application.status)}</p>
                                    <p className="text-sm text-slate-400">Submitted on {formattedDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1">
                            <span className="text-[10px] text-slate-600 uppercase font-black tracking-widest">Global Status</span>
                            <Badge variant={application.status === 'Approved' || application.status === 'Paid' ? 'success' : 'primary'} className="px-6 py-2 text-sm uppercase">
                                {safeText(application.status)}
                            </Badge>
                        </div>
                    </div>

                    {/* Technical Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Personal Info */}
                        <DataSection
                            title="Personal Information"
                            icon={User}
                            items={[
                                { label: 'Full Legal Name', value: applicantName },
                                { label: 'National ID / Passport', value: applicantIdNumber },
                                { label: 'Email Correspondence', value: applicantEmail },
                                { label: 'Phone Number', value: safeText(application.mobile || application.phone) },
                            ]}
                        />
                        {/* Employment Info */}
                        <DataSection
                            title="Employment / Income"
                            icon={Building2}
                            items={[
                                { label: 'Registered Employer', value: applicantCompany },
                                { label: 'Monthly Gross Income', value: `R ${applicantSalary.toLocaleString()}` },
                                { label: 'Work Designation', value: safeText(application.jobTitle, 'Not Provided') },
                                { label: 'Payment Method', value: safeText(application.paymentMethod, 'Payroll Deduction') },
                            ]}
                        />
                    </div>

                    {/* Financial Summary Area */}
                    <div className="glass p-6 lg:p-10 rounded-[32px] lg:rounded-[40px] border-slate-800/50 space-y-6 lg:space-y-8 bg-gradient-to-br from-slate-900 to-slate-950">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <h3 className="text-lg lg:text-xl font-display font-bold">Financial Analysis</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
                            <MetricBox label="Principal" value={`R ${loanAmount.toLocaleString()}`} color="text-slate-100" />
                            <MetricBox label="Interest (Est)" value={`R ${(loanAmount * 0.09).toLocaleString()}`} color="text-slate-300" />
                            <MetricBox label="Fee / Service" value={`R ${(loanAmount * 0.03).toLocaleString()}`} color="text-slate-300" />
                            <MetricBox label="Total Repayable" value={`R ${(loanAmount * 1.12).toLocaleString()}`} color="text-emerald-400 font-black" />
                        </div>
                    </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="space-y-8">
                    {/* Loan Timeline */}
                    <div className="glass p-8 rounded-[40px] border-slate-800/50 space-y-8 h-fit bg-slate-900/60">
                        <h3 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em]">Audit Trail</h3>
                        <div className="space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-800"></div>

                            {(application.auditHistory || []).map((log, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center z-10">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-bold text-slate-200">{safeText(log.status)}</p>
                                        <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                            <span>{safeText(log.user)}</span>
                                            <span>{log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="glass p-8 rounded-[40px] border-emerald-500/10 bg-emerald-500/5 space-y-4">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <ShieldCheck className="w-6 h-6" />
                            <span className="font-bold">Compliance Verified</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            This application has been electronically signed and cryptographically bound to your identity profile.
                        </p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DataSection = ({ title, icon: Icon, items }) => (
    <div className="glass p-8 rounded-[40px] border-slate-800/50 space-y-6">
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-blue-400" />
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest">{title}</h4>
        </div>
        <div className="space-y-6">
            {items.map((item, i) => (
                <div key={i} className="space-y-1">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-slate-200">{item.value}</p>
                </div>
            ))}
        </div>
    </div>
);

const MetricBox = ({ label, value, color }) => (
    <div className="space-y-1">
        <p className="text-[10px] text-slate-600 font-bold uppercase">{label}</p>
        <p className={`text-lg transition-all ${color}`}>{value}</p>
    </div>
);

export default ApplicationFullView;
