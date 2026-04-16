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
  PAID: 'Paid',
  DECLINED: 'Declined',
  ESCALATED: 'Escalated',
  NEED_REVIEW: 'Need Review',
  DISBURSED: 'Disbursed',
};

export const RECOVERY_STATUSES = {
  HEALTHY: 'Healthy',
  IN_ARREARS: 'In Arrears',
  PTP: 'PTP Active',
  PTP_FAILED: 'PTP Failed',
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
  STATUSES.PAID
];



export const LoanProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const storedApps = localStorage.getItem('lms_applications');
    const storedLogs = localStorage.getItem('lms_audit_logs');
    
    // Seed initial data
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
      }
    ];

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

      // Update if any auto-changes were made
      setApplications(processedApps);
      localStorage.setItem('lms_applications', JSON.stringify(processedApps));
    }

    if (storedLogs) {
      setAuditLogs(JSON.parse(storedLogs));
    }
  }, []);

  const saveApplications = (newApps) => {
    setApplications(newApps);
    localStorage.setItem('lms_applications', JSON.stringify(newApps));
  };

  const logAction = (action) => {
    const newLogs = [{ ...action, id: Date.now(), timestamp: new Date().toISOString() }, ...auditLogs];
    setAuditLogs(newLogs);
    localStorage.setItem('lms_audit_logs', JSON.stringify(newLogs));
  };

  const canApply = (email) => {
    const activeLoanStatuses = [
      STATUSES.SUBMITTED, 
      STATUSES.HR_PENDING, 
      STATUSES.CREDIT_PENDING, 
      STATUSES.ADMIN_APPROVAL, 
      STATUSES.APPROVED
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
      auditHistory: [{ status: STATUSES.SUBMITTED, date: new Date().toISOString(), user: 'Applicant' }]
    };

    saveApplications([newApp, ...applications]);
    logAction({ type: 'CREATE', appId: newApp.id, user: 'Applicant', status: newApp.status });
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

        return {
          ...app,
          installments: newInstallments,
          status: isFullyPaid ? STATUSES.PAID : app.status,
          recoveryStatus: isFullyPaid ? RECOVERY_STATUSES.RECOVERED : app.recoveryStatus,
          auditHistory: [
            ...(app.auditHistory || []),
            { 
              status: 'RECOVERY_PAYMENT', 
              date: new Date().toISOString(), 
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
        return {
          ...app,
          interactionLogs: [{ ...interaction, id: Date.now(), date: new Date().toISOString() }, ...(app.interactionLogs || [])]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
  };

  const updatePTP = (id, ptpData) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          recoveryStatus: RECOVERY_STATUSES.PTP,
          ptpHistory: [{ ...ptpData, id: Date.now(), createdDate: new Date().toISOString(), status: 'ACTIVE' }, ...(app.ptpHistory || [])]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
  };

  return (
    <LoanContext.Provider value={{ 
      applications, 
      addApplication, 
      updateStatus, 
      assignApplication,
      recordRecoveryPayment,
      logRecoveryInteraction,
      updatePTP,
      assignRecoveryAgent,
      bulkAssignAgents,
      penaltyInterestRate,
      canApply, 
      auditLogs 
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
