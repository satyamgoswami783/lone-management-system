import React, { createContext, useContext, useState, useEffect } from 'react';

const LoanContext = createContext(null);

export const STATUSES = {
  SUBMITTED: 'Submitted',
  HR_PENDING: 'HR Pending',
  CREDIT_PENDING: 'Credit Pending',
  ADMIN_APPROVAL: 'Admin Approval',
  APPROVED: 'Approved',
  PAID: 'Paid',
  REJECTED: 'Rejected',
};

export const WORKFLOW_SEQUENCE = [
  STATUSES.SUBMITTED,
  STATUSES.HR_PENDING,
  STATUSES.CREDIT_PENDING,
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
    
    if (storedApps) {
      setApplications(JSON.parse(storedApps));
    } else {
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
          status: STATUSES.ADMIN_APPROVAL,
          date: new Date(Date.now() - 172800000).toISOString(),
          idNumber: '900415 5001 083',
          salary: 28000,
          purpose: 'Education',
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 172800000 * 2).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_PENDING, date: new Date(Date.now() - 172800000).toISOString(), user: 'HR Manager' },
            { status: STATUSES.CREDIT_PENDING, date: new Date(Date.now() - 86400000).toISOString(), user: 'Credit Officer' }
          ]
        }
      ];

      setApplications(sampleData);
      localStorage.setItem('lms_applications', JSON.stringify(sampleData));
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

  const updateStatus = (id, newStatus, userName = 'System') => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        return { 
          ...app, 
          status: newStatus,
          auditHistory: [...(app.auditHistory || []), { status: newStatus, date: new Date().toISOString(), user: userName }]
        };
      }
      return app;
    });
    
    saveApplications(updatedApps);
    logAction({ type: 'STATUS_UPDATE', appId: id, user: userName, status: newStatus });
  };

  return (
    <LoanContext.Provider value={{ 
      applications, 
      addApplication, 
      updateStatus, 
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
