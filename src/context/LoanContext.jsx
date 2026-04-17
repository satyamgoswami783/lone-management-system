import React, { createContext, useContext, useState, useEffect } from 'react';

const LoanContext = createContext(null);

export const STATUSES = {
  NEW: 'New',
  SUBMITTED: 'Submitted',
  HR_PENDING: 'HR Pending',
  HR_APPROVED: 'HR Approved',
  CREDIT_PENDING: 'Credit Pending',
  UNDER_REVIEW: 'Under Review',
  ON_HOLD: 'On Hold',
  NEED_MORE_INFO: 'Need More Info',
  ADMIN_APPROVAL: 'Admin Approval',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  PAID: 'Paid',
  DECLINED: 'Declined',
  REJECTED: 'Rejected',
  ESCALATED: 'Escalated',
  NEED_REVIEW: 'Need Review',
  DISBURSED: 'Disbursed',
};

export const RECOVERY_STATUSES = {
  HEALTHY: 'Healthy',
  IN_ARREARS: 'In Arrears',
  PTP: 'PTP Active',
  PTP_FAILED: 'PTP Failed',
  CONTACTED: 'Contacted',
  LEGAL: 'Legal Escalation',
  SUSPENDED: 'Suspended',
  RECOVERED: 'Recovered',
};


export const WORKFLOW_SEQUENCE = [
  STATUSES.SUBMITTED,
  STATUSES.HR_PENDING,
  STATUSES.HR_APPROVED,
  STATUSES.CREDIT_PENDING,
  STATUSES.UNDER_REVIEW,
  STATUSES.ADMIN_APPROVAL,
  STATUSES.APPROVED,
  STATUSES.ACTIVE,
  STATUSES.PAID
];

export const LoanProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const storedApps = localStorage.getItem('lms_applications');
    const storedLogs = localStorage.getItem('lms_audit_logs');
    
    if (storedApps) {
      const parsed = JSON.parse(storedApps);
      
      // Auto-Detection Logic: Missed PTPs and Escalations
      const today = new Date();
      const processedApps = parsed.map(app => {
          let updatedApp = { ...app };
          let changed = false;

          // 1. Detect Missed PTPs
          if (updatedApp.ptpHistory) {
              const newPtpHistory = updatedApp.ptpHistory.map(ptp => {
                  if (ptp.status === 'ACTIVE' && new Date(ptp.date) < today) {
                      changed = true;
                      return { ...ptp, status: 'FAILED' };
                  }
                  return ptp;
              });
              if (changed) {
                  updatedApp.ptpHistory = newPtpHistory;
                  updatedApp.recoveryStatus = RECOVERY_STATUSES.PTP_FAILED;
              }
          }

          // 2. Automated Escalation (DPD > 90)
          const overdueInstallments = updatedApp.installments?.filter(i => 
              i.status !== 'PAID' && new Date(i.dueDate) < today
          ) || [];
          
          if (overdueInstallments.length > 0) {
              const earliest = new Date(Math.min(...overdueInstallments.map(i => new Date(i.dueDate))));
              const dpd = Math.floor((today - earliest) / (1000 * 60 * 60 * 24));
              if (dpd > 90 && updatedApp.recoveryStatus !== RECOVERY_STATUSES.LEGAL) {
                  updatedApp.recoveryStatus = RECOVERY_STATUSES.LEGAL;
                  changed = true;
              }
          }

          return updatedApp;
      });
      
      // Inject missing test cases for the user to check the recovery features
      const newSamples = [
        {
            id: "REC-9942",
            name: "Themba Khumalo",
            email: "themba.k@mining.co.za",
            company: "Platinum Mines Ltd",
            amount: 45000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.PTP_FAILED,
            date: new Date(Date.now() - 86400000 * 120).toISOString(),
            disbursementDate: new Date(Date.now() - 86400000 * 115).toISOString(),
            assignedAgent: "Agent Smith",
            tenure: 18,
            salary: 35000,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 90).toISOString(), amount: 3500, paidAmount: 3500, status: 'PAID' },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 60).toISOString(), amount: 3500, paidAmount: 1500, status: 'PARTIAL' },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 30).toISOString(), amount: 3500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Answered', agent: 'Agent Smith', date: new Date(Date.now() - 86400000 * 15).toISOString(), notes: 'Debtor claims temporary cash flow issue.' },
              { id: 2, type: 'Visit', outcome: 'Answered', agent: 'Field Agent Zoe', date: new Date(Date.now() - 86400000 * 5).toISOString(), notes: 'Site visit confirmed residency. Debtor signed a new PTP.' }
            ],
            ptpHistory: [
              { id: 1, date: new Date(Date.now() - 86400000 * 10).toISOString(), amount: 5000, status: 'FAILED', createdDate: new Date(Date.now() - 86400000 * 15).toISOString() },
              { id: 2, date: new Date(Date.now() + 86400000 * 2).toISOString(), amount: 3500, status: 'ACTIVE', createdDate: new Date(Date.now() - 86400000 * 5).toISOString() }
            ],
            auditHistory: [
              { status: STATUSES.ACTIVE, date: new Date(Date.now() - 86400000 * 115).toISOString(), user: 'Finance', notes: 'Loan activated' },
              { status: RECOVERY_STATUSES.IN_ARREARS, date: new Date(Date.now() - 86400000 * 59).toISOString(), user: 'System', notes: 'Default detected' }
            ]
        },
        {
            id: "REC-2210",
            name: "Priya Pillay",
            email: "p.pillay@consult.co",
            company: "Creative Solutions",
            amount: 15000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.LEGAL,
            date: new Date(Date.now() - 86400000 * 180).toISOString(),
            salary: 42000,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 150).toISOString(), amount: 1500, paidAmount: 1500, status: 'PAID' },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 120).toISOString(), amount: 1500, paidAmount: 0, status: 'UNPAID' },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 95).toISOString(), amount: 1500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Refusal', agent: 'Legal Clerk', date: new Date(Date.now() - 86400000 * 40).toISOString(), notes: 'Debtor refused to discuss payment. Escalating to legal.' }
            ],
            ptpHistory: [],
            auditHistory: [
              { status: RECOVERY_STATUSES.LEGAL, date: new Date(Date.now() - 86400000 * 35).toISOString(), user: 'Legal Dept', notes: 'Letter of Demand issued' }
            ]
        }
      ];

      const finalApps = [...processedApps];
      newSamples.forEach(sample => {
          if (!finalApps.find(a => a.id === sample.id)) {
              finalApps.push(sample);
          }
      });

      setApplications(finalApps);
    } else {
      // Seed initial data (Merged version)
      const sampleData = [
        {
          id: 'APP-001',
          name: 'Sarah Jenkins',
          email: 'sarah.j@gmail.com',
          company: 'TechFlow SA',
          amount: 5000,
          status: STATUSES.SUBMITTED,
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          idNumber: '920101 5001 081',
          salary: 22500,
          purpose: 'Medical',
          score: 680,
          risk: 'Medium',
          bankDetails: { name: 'Standard Bank', account: '123456789', type: 'Savings' },
          auditHistory: [{ status: STATUSES.SUBMITTED, date: new Date(Date.now() - 3600000 * 3).toISOString(), user: 'Applicant' }]
        },
        {
          id: 'APP-002',
          name: 'Michael Chen',
          email: 'm.chen@outlook.com',
          company: 'Global Logistics',
          amount: 15000,
          status: STATUSES.HR_PENDING,
          date: new Date(Date.now() - 3600000 * 5).toISOString(),
          idNumber: '880512 5123 084',
          salary: 32000,
          purpose: 'Accounts',
          score: 720,
          risk: 'Low',
          bankDetails: { name: 'First National', account: '442199281', type: 'Current' },
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 3600000 * 10).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_PENDING, date: new Date(Date.now() - 3600000 * 6).toISOString(), user: 'HR Manager' }
          ]
        },
        {
          id: 'APP-003',
          name: 'David Smith',
          email: 'david.s@comp.co',
          company: 'Standard Bank',
          amount: 9000,
          status: STATUSES.CREDIT_PENDING,
          date: new Date(Date.now() - 86400000).toISOString(),
          idNumber: '850325 5001 082',
          salary: 45000,
          purpose: 'Housing',
          score: 790,
          risk: 'Low',
          bankDetails: { name: 'Absa', account: '992100234', type: 'Savings' },
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 86400000 * 3).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_PENDING, date: new Date(Date.now() - 86400000 * 2).toISOString(), user: 'HR Manager' },
            { status: STATUSES.CREDIT_PENDING, date: new Date(Date.now() - 86400000 * 1.5).toISOString(), user: 'Credit Officer' }
          ]
        },
        {
          id: 'APP-004',
          name: 'Elena Rodriguez',
          email: 'elena.r@agency.com',
          company: 'Creative Studio',
          amount: 12000,
          status: STATUSES.CREDIT_PENDING,
          date: new Date(Date.now() - 172800000).toISOString(),
          idNumber: '900415 5001 083',
          salary: 28000,
          purpose: 'Education',
          score: 720,
          risk: 'Low',
          bankDetails: { name: 'Capitec', account: '772188291', type: 'Savings' },
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 172800000 * 2).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_PENDING, date: new Date(Date.now() - 172800000).toISOString(), user: 'HR Manager' },
            { status: STATUSES.HR_APPROVED, date: new Date(Date.now() - 86400000).toISOString(), user: 'HR Manager' }
          ]
        },
        {
          id: 'APP-005',
          name: 'Lerato Molefe',
          email: 'lerato.m@gmail.com',
          company: 'Retail Group',
          amount: 8000,
          status: STATUSES.CREDIT_PENDING,
          date: new Date(Date.now() - 3600000 * 24).toISOString(),
          idNumber: '820712 5001 085',
          salary: 19500,
          purpose: 'Emergency',
          score: 450,
          risk: 'High',
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 3600000 * 48).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_APPROVED, date: new Date(Date.now() - 3600000 * 30).toISOString(), user: 'HR Manager' }
          ]
        },
        {
          id: 'APP-006',
          name: 'John Doe',
          email: 'john.doe@corp.co',
          company: 'Tech Solutions',
          amount: 25000,
          status: STATUSES.UNDER_REVIEW,
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          idNumber: '750302 5001 086',
          salary: 55000,
          purpose: 'Investment',
          score: 610,
          risk: 'Medium',
          assignedTo: 'Credit Officer',
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 3600000 * 10).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_APPROVED, date: new Date(Date.now() - 3600000 * 8).toISOString(), user: 'HR Manager' },
            { status: STATUSES.UNDER_REVIEW, date: new Date(Date.now() - 3600000 * 2).toISOString(), user: 'Credit Officer' }
          ]
        },
        {
            id: "APP-10925",
            name: "Sipho Mdluli",
            email: "sipho.m@global.co.za",
            company: "General Logistics",
            amount: 12000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.HEALTHY,
            date: new Date(Date.now() - 86400000 * 60).toISOString(),
            disbursementDate: new Date(Date.now() - 86400000 * 55).toISOString(),
            disbursedAt: new Date(Date.now() - 86400000 * 55).toISOString(),
            transactionId: 'TXN-DISB-10925',
            tenure: 6,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 25).toISOString(), amount: 2200, paidAmount: 2200, status: 'PAID', lastPaymentDate: new Date(Date.now() - 86400000 * 27).toISOString() },
              { id: 2, dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), amount: 2200, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [],
            ptpHistory: [],
            auditHistory: [
              { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 86400000 * 60).toISOString(), user: 'Applicant' },
              { status: STATUSES.DISBURSED, date: new Date(Date.now() - 86400000 * 55).toISOString(), user: 'Finance' }
            ]
        },
        {
            id: "APP-10926",
            name: "Nicolette Steyn",
            email: "n.steyn@retail.co.za",
            company: "Retail Group",
            amount: 25000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.IN_ARREARS,
            date: new Date(Date.now() - 86400000 * 95).toISOString(),
            disbursementDate: new Date(Date.now() - 86400000 * 90).toISOString(),
            disbursedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
            transactionId: 'TXN-DISB-10926',
            assignedAgent: "Sarah Collections",
            tenure: 12,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 60).toISOString(), amount: 2500, paidAmount: 2500, status: 'PAID', lastPaymentDate: new Date(Date.now() - 86400000 * 62).toISOString() },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 30).toISOString(), amount: 2500, paidAmount: 1000, status: 'PARTIAL', lastPaymentDate: new Date(Date.now() - 86400000 * 25).toISOString() },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 0).toISOString(), amount: 2500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Answered', agent: 'Sarah Collections', date: new Date(Date.now() - 86400000 * 5).toISOString(), notes: 'Debtor promised to pay by Friday.' }
            ],
            ptpHistory: [
              { id: 1, date: new Date(Date.now() - 86400000 * 2).toISOString(), amount: 1500, status: 'FAILED', createdDate: new Date(Date.now() - 86400000 * 5).toISOString() }
            ],
            auditHistory: [
              { status: STATUSES.DISBURSED, date: new Date(Date.now() - 86400000 * 90).toISOString(), user: 'Finance' }
            ]
        },
        {
            id: "REC-9942",
            name: "Themba Khumalo",
            email: "themba.k@mining.co.za",
            company: "Platinum Mines Ltd",
            amount: 45000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.PTP_FAILED,
            date: new Date(Date.now() - 86400000 * 120).toISOString(),
            disbursementDate: new Date(Date.now() - 86400000 * 115).toISOString(),
            assignedAgent: "Agent Smith",
            tenure: 18,
            salary: 35000,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 90).toISOString(), amount: 3500, paidAmount: 3500, status: 'PAID' },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 60).toISOString(), amount: 3500, paidAmount: 1500, status: 'PARTIAL' },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 30).toISOString(), amount: 3500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Answered', agent: 'Agent Smith', date: new Date(Date.now() - 86400000 * 15).toISOString(), notes: 'Debtor claims temporary cash flow issue.' },
              { id: 2, type: 'Visit', outcome: 'Answered', agent: 'Field Agent Zoe', date: new Date(Date.now() - 86400000 * 5).toISOString(), notes: 'Site visit confirmed residency. Debtor signed a new PTP.' }
            ],
            ptpHistory: [
              { id: 1, date: new Date(Date.now() - 86400000 * 10).toISOString(), amount: 5000, status: 'FAILED', createdDate: new Date(Date.now() - 86400000 * 15).toISOString() },
              { id: 2, date: new Date(Date.now() + 86400000 * 2).toISOString(), amount: 3500, status: 'ACTIVE', createdDate: new Date(Date.now() - 86400000 * 5).toISOString() }
            ],
            auditHistory: [
              { status: STATUSES.ACTIVE, date: new Date(Date.now() - 86400000 * 115).toISOString(), user: 'Finance', notes: 'Loan activated' },
              { status: RECOVERY_STATUSES.IN_ARREARS, date: new Date(Date.now() - 86400000 * 59).toISOString(), user: 'System', notes: 'Default detected' }
            ]
        },
        {
            id: "REC-2210",
            name: "Priya Pillay",
            email: "p.pillay@consult.co",
            company: "Creative Solutions",
            amount: 15000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.LEGAL,
            date: new Date(Date.now() - 86400000 * 180).toISOString(),
            salary: 42000,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 150).toISOString(), amount: 1500, paidAmount: 1500, status: 'PAID' },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 120).toISOString(), amount: 1500, paidAmount: 0, status: 'UNPAID' },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 95).toISOString(), amount: 1500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Refusal', agent: 'Legal Clerk', date: new Date(Date.now() - 86400000 * 40).toISOString(), notes: 'Debtor refused to discuss payment. Escalating to legal.' }
            ],
            ptpHistory: [],
            auditHistory: [
              { status: RECOVERY_STATUSES.LEGAL, date: new Date(Date.now() - 86400000 * 35).toISOString(), user: 'Legal Dept', notes: 'Letter of Demand issued' }
            ]
        }
      ];
      setApplications(sampleData);
      localStorage.setItem('lms_applications', JSON.stringify(sampleData));
    }

    if (storedLogs) {
      setAuditLogs(JSON.parse(storedLogs));
    }

    // Cross-Tab Synchronization
    const handleStorageChange = (e) => {
      if (e.key === 'lms_applications') {
        setApplications(JSON.parse(e.newValue));
      }
      if (e.key === 'lms_audit_logs') {
        setAuditLogs(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveApplications = (newApps) => {
    setApplications(newApps);
    localStorage.setItem('lms_applications', JSON.stringify(newApps));
  };

  const logAction = (action) => {
    const newLog = { ...action, id: Date.now(), timestamp: new Date().toISOString() };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('lms_audit_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const disburseLoan = (id, userName = 'Finance Office') => {
    const transactionId = `TXN-${Math.floor(Math.random() * 1000000)}`;
    const disbursedAt = new Date().toISOString();
    
    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === id) {
          if (app.status !== STATUSES.APPROVED) throw new Error('Loan must be APPROVED before disbursement.');
          return { 
            ...app, 
            status: STATUSES.ACTIVE,
            disbursedAt,
            transactionId,
            auditHistory: [...(app.auditHistory || []), { status: STATUSES.ACTIVE, date: disbursedAt, user: userName, note: `Funds Disbursed: ${transactionId}` }]
          };
        }
        return app;
      });
      localStorage.setItem('lms_applications', JSON.stringify(updated));
      return updated;
    });
    
    logAction({ type: 'DISBURSED', appId: id, user: userName, status: STATUSES.ACTIVE, transactionId });
  };

  const batchMarkAsPaid = (appIds, userName = 'Payroll System') => {
    const paidAt = new Date().toISOString();
    const results = { success: [], failed: [] };

    setApplications(prev => {
      const updated = prev.map(app => {
        if (appIds.includes(app.id)) {
          // Simulation: IDs ending in '3' or '7' fail
          if (app.id.endsWith('3') || app.id.endsWith('7')) {
              results.failed.push({ id: app.id, name: app.name, reason: 'Insufficient Funds' });
              return app;
          }
          results.success.push(app.id);
          return { 
            ...app, 
            status: STATUSES.PAID,
            paidAt,
            auditHistory: [...(app.auditHistory || []), { status: STATUSES.PAID, date: paidAt, user: userName, note: 'Repayment Received' }]
          };
        }
        return app;
      });
      localStorage.setItem('lms_applications', JSON.stringify(updated));
      return updated;
    });

    results.success.forEach(id => {
      logAction({ type: 'PAID', appId: id, user: userName, status: STATUSES.PAID });
    });
    
    results.failed.forEach(f => {
      logAction({ type: 'FAILED', appId: f.id, user: userName, status: STATUSES.ACTIVE, note: f.reason });
    });

    return results;
  };

  const canApply = (email) => {
    const activeLoanStatuses = [
      STATUSES.SUBMITTED, 
      STATUSES.HR_PENDING, 
      STATUSES.CREDIT_PENDING, 
      STATUSES.ADMIN_APPROVAL, 
      STATUSES.APPROVED,
      STATUSES.ACTIVE
    ];
    
    return !applications.some(app => 
      app.email === email && activeLoanStatuses.includes(app.status)
    );
  };

  const addApplication = (app) => {
    if (!canApply(app.email)) {
      throw new Error('User already has an active loan or application.');
    }

    const newApp = {
      ...app,
      id: `APP-00${applications.length + 1}`,
      status: STATUSES.HR_PENDING,
      date: new Date().toISOString(),
      auditHistory: [{ status: STATUSES.SUBMITTED, date: new Date().toISOString(), user: 'Employee' }]
    };

    saveApplications([newApp, ...applications]);
    logAction({ type: 'CREATE', appId: newApp.id, user: 'Employee', status: newApp.status });
    return newApp;
  };

  const updateStatus = (id, newStatus, userName = 'System', notes = '') => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        const historyEntry = { 
            status: newStatus, 
            date: new Date().toISOString(), 
            user: userName,
            notes: notes 
        };
        return { 
          ...app, 
          status: newStatus,
          auditHistory: [...(app.auditHistory || []), historyEntry]
        };
      }
      return app;
    });
    
    saveApplications(updatedApps);
    logAction({ type: 'STATUS_UPDATE', appId: id, user: userName, status: newStatus, notes });
  };

  const assignApplication = (id, officerName) => {
    const updatedApps = applications.map(app => {
        if (app.id === id) {
            return {
                ...app,
                assignedTo: officerName,
                status: STATUSES.UNDER_REVIEW,
                auditHistory: [
                    ...(app.auditHistory || []), 
                    { status: STATUSES.UNDER_REVIEW, date: new Date().toISOString(), user: officerName, notes: `Assigned to ${officerName}` }
                ]
            };
        }
        return app;
    });
    saveApplications(updatedApps);
    logAction({ type: 'ASSIGNMENT', appId: id, user: officerName, status: STATUSES.UNDER_REVIEW });
  };

  const penaltyInterestRate = 0.02; // 2% monthly penalty

  const assignRecoveryAgent = (id, agentName) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          assignedAgent: agentName,
          auditHistory: [
            ...(app.auditHistory || []),
            { 
              status: 'AGENT_ASSIGNMENT', 
              date: new Date().toISOString(), 
              user: 'Manager', 
              notes: `Assigned to ${agentName}` 
            }
          ]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
  };

  const bulkAssignAgents = (ids, agentName) => {
    const updatedApps = applications.map(app => {
      if (ids.includes(app.id)) {
        return {
          ...app,
          assignedAgent: agentName,
          auditHistory: [
            ...(app.auditHistory || []),
            { status: 'BULK_ASSIGNMENT', date: new Date().toISOString(), user: 'Manager', notes: `Bulk assigned to ${agentName}` }
          ]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
  };

  const recordRecoveryPayment = (id, amount, method = 'Bank Transfer', reference = '') => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        // Validation: Prevent overpayment
        const currentOutstanding = app.installments?.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0) || 0;
        if (amount > currentOutstanding + 1) { // +1 for rounding grace
          return app;
        }

        let remaining = amount;
        const newInstallments = app.installments?.map(inst => {
          if (remaining <= 0 || inst.status === 'PAID') return inst;
          
          const needed = inst.amount - inst.paidAmount;
          const payment = Math.min(remaining, needed);
          remaining -= payment;
          
          const newPaid = inst.paidAmount + payment;
          return {
            ...inst,
            paidAmount: newPaid,
            status: newPaid >= inst.amount ? 'PAID' : 'PARTIAL',
            lastPaymentDate: new Date().toISOString()
          };
        }) || [];

        const totalOutstanding = newInstallments.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
        const isFullyPaid = totalOutstanding <= 0;
        const now = new Date().toISOString();

        return {
          ...app,
          installments: newInstallments,
          lastActionDate: now,
          status: isFullyPaid ? STATUSES.PAID : app.status,
          recoveryStatus: isFullyPaid ? RECOVERY_STATUSES.RECOVERED : (app.recoveryStatus === RECOVERY_STATUSES.HEALTHY ? RECOVERY_STATUSES.IN_ARREARS : app.recoveryStatus),
          auditHistory: [
            ...(app.auditHistory || []),
            { 
              status: 'RECOVERY_PAYMENT', 
              date: now, 
              user: 'System', 
              notes: `Payment of R ${amount} recorded. Ref: ${reference}` 
            }
          ]
        };
      }
      return app;
    });

    saveApplications(updatedApps);
  };

  const logRecoveryInteraction = (id, interaction) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        const now = new Date().toISOString();
        let newStatus = app.recoveryStatus || RECOVERY_STATUSES.IN_ARREARS;
        
        // Auto-update status based on interaction
        if (interaction.type === 'Call' || interaction.type === 'Visit') {
            newStatus = RECOVERY_STATUSES.CONTACTED || 'Contacted'; // Fallback if CONTACTED not in enum
        }

        return {
          ...app,
          lastActionDate: now,
          recoveryStatus: newStatus,
          interactionLogs: [{ ...interaction, id: Date.now(), date: now }, ...(app.interactionLogs || [])]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
  };

  const updatePTP = (id, ptpData) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        const now = new Date().toISOString();
        return {
          ...app,
          lastActionDate: now,
          recoveryStatus: RECOVERY_STATUSES.PTP,
          ptpHistory: [{ ...ptpData, id: Date.now(), createdDate: now, status: 'ACTIVE' }, ...(app.ptpHistory || [])]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
  };

  // --- MANAGEMENT AGGREGATION UTILITIES ---
  
  const getExecutiveStats = () => {
    // Total Revenue = sum of interest (10%) from PAID loans
    const paidLoans = applications.filter(app => app.status === STATUSES.PAID);
    const totalRevenue = paidLoans.reduce((sum, app) => sum + (Number(app.amount) * 0.1), 0);
    
    // Active Clients = unique Employees with ACTIVE loans
    const activeClients = applications.filter(app => app.status === STATUSES.ACTIVE).length;
    
    // Portfolio Yield = (Total Interest / Total Principal) * 100
    const totalPrincipal = applications.reduce((sum, app) => sum + Number(app.amount), 0);
    const totalPotentialInterest = totalPrincipal * 0.1;
    const yieldRate = totalPrincipal > 0 ? (totalPotentialInterest / totalPrincipal) * 100 : 0;

    return {
      totalRevenue,
      activeClients,
      yieldRate: yieldRate.toFixed(1)
    };
  };

  const getDisbursementTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const lastSixMonths = [];
    
    for (let i = 5; i >= 0; i--) {
      const m = (currentMonth - i + 12) % 12;
      lastSixMonths.push({ name: months[m], amount: 0, index: m });
    }

    applications.forEach(app => {
      if (app.disbursedAt) {
        const d = new Date(app.disbursedAt);
        const m = d.getMonth();
        const trend = lastSixMonths.find(t => t.index === m);
        if (trend) trend.amount += Number(app.amount);
      }
    });

    return lastSixMonths;
  };

  const getStatusDistribution = () => {
    const counts = {};
    Object.values(STATUSES).forEach(s => counts[s] = 0);
    applications.forEach(app => counts[app.status]++);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getAnalyticsData = () => {
    // Default Rate = FAILED audit logs / Total active
    const failedCount = auditLogs.filter(l => l.type === 'FAILED').length;
    const activeCount = applications.filter(app => app.status === STATUSES.ACTIVE).length;
    const defaultRate = activeCount > 0 ? (failedCount / activeCount) * 100 : 0;

    // Average Loan Size
    const avgLoanSize = applications.length > 0 
      ? applications.reduce((sum, app) => sum + Number(app.amount), 0) / applications.length 
      : 0;

    // Risk Segmentation (Fake mapping for demo)
    const riskData = [
      { name: 'Low Risk', value: applications.filter(app => Number(app.salary) > 30000).length },
      { name: 'Medium Risk', value: applications.filter(app => Number(app.salary) <= 30000 && Number(app.salary) > 15000).length },
      { name: 'High Risk', value: applications.filter(app => Number(app.salary) <= 15000).length },
    ];

    // Top Employers
    const employers = {};
    applications.forEach(app => {
      const co = app.company || 'Unknown';
      employers[co] = (employers[co] || 0) + 1;
    });
    const topEmployers = Object.entries(employers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { 
        defaultRate: defaultRate.toFixed(1), 
        avgLoanSize, 
        riskData, 
        topEmployers 
    };
  };

  return (
    <LoanContext.Provider value={{ 
      applications, 
      addApplication, 
      updateStatus, 
      disburseLoan,
      batchMarkAsPaid,
      assignApplication,
      recordRecoveryPayment,
      logRecoveryInteraction,
      updatePTP,
      assignRecoveryAgent,
      bulkAssignAgents,
      penaltyInterestRate,
      canApply, 
      auditLogs,
      getExecutiveStats,
      getDisbursementTrends,
      getStatusDistribution,
      getAnalyticsData
    }}>
      {children}
    </LoanContext.Provider>
  );
};




export const useLoans = () => {
  const context = useContext(LoanContext);
  if (!context) throw new Error('useLoans must be used within a LoanProvider');
  return context;
};
