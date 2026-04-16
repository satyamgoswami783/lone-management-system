import React, { createContext, useContext, useState, useEffect } from 'react';

const LoanContext = createContext(null);

export const STATUSES = {
  SUBMITTED: 'Submitted',
  HR_PENDING: 'HR Pending',
  CREDIT_PENDING: 'Credit Pending',
  ADMIN_APPROVAL: 'Admin Approval',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  PAID: 'Paid',
  REJECTED: 'Rejected',
};

export const WORKFLOW_SEQUENCE = [
  STATUSES.SUBMITTED,
  STATUSES.HR_PENDING,
  STATUSES.CREDIT_PENDING,
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
          status: STATUSES.APPROVED,
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          idNumber: '920101 5001 081',
          salary: 22500,
          purpose: 'Medical',
          bankDetails: { name: 'Standard Bank', account: '123456789', type: 'Savings' },
          auditHistory: [{ status: STATUSES.SUBMITTED, date: new Date(Date.now() - 3600000 * 10).toISOString(), user: 'Employee' }]
        },
        {
          id: 'APP-002',
          name: 'Michael Chen',
          email: 'm.chen@outlook.com',
          company: 'Global Logistics',
          amount: 15000,
          status: STATUSES.ACTIVE,
          disbursedAt: new Date(Date.now() - 86400000).toISOString(),
          transactionId: 'TXN-99281',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          idNumber: '880512 5123 084',
          salary: 32000,
          purpose: 'Accounts',
          bankDetails: { name: 'First National', account: '442199281', type: 'Current' },
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 86400000 * 5).toISOString(), user: 'Employee' },
            { status: STATUSES.APPROVED, date: new Date(Date.now() - 86400000 * 2).toISOString(), user: 'Admin' },
            { status: STATUSES.ACTIVE, date: new Date(Date.now() - 86400000).toISOString(), user: 'Finance' }
          ]
        },
        {
          id: 'APP-003',
          name: 'David Smith',
          email: 'david.s@comp.co',
          company: 'Standard Bank',
          amount: 9000,
          status: STATUSES.APPROVED,
          date: new Date(Date.now() - 86400000).toISOString(),
          idNumber: '850325 5001 082',
          salary: 45000,
          purpose: 'Housing',
          bankDetails: { name: 'Absa', account: '992100234', type: 'Savings' },
          auditHistory: [{ status: STATUSES.SUBMITTED, date: new Date(Date.now() - 86400000 * 3).toISOString(), user: 'Employee' }]
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
          bankDetails: { name: 'Capitec', account: '772188291', type: 'Savings' },
          auditHistory: [{ status: STATUSES.SUBMITTED, date: new Date(Date.now() - 172800000 * 2).toISOString(), user: 'Employee' }]
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

  const updateStatus = (id, newStatus, userName = 'System') => {
    setApplications(prev => {
      const updated = prev.map(app => {
        if (app.id === id) {
          return { 
            ...app, 
            status: newStatus,
            auditHistory: [...(app.auditHistory || []), { status: newStatus, date: new Date().toISOString(), user: userName }]
          };
        }
        return app;
      });
      localStorage.setItem('lms_applications', JSON.stringify(updated));
      return updated;
    });
    logAction({ type: 'STATUS_UPDATE', appId: id, user: userName, status: newStatus });
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
