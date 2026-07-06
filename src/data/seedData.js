// seedData.js — Realistic Indian demo data for Star Buzz Loan CRM

/* ============================================================
   USERS
   ============================================================ */
export const usersData = [
  { id: 1, name: 'Super Admin',       email: 'admin@starbuzz.com',    password: 'Admin@123',    role: 'admin',    mobile: '9876543210', department: 'Management',  status: 'Active',   joinDate: '2022-01-10' },
  { id: 2, name: 'Arjun Mehta',       email: 'officer@starbuzz.com',  password: 'Officer@123',  role: 'officer',  mobile: '9876543211', department: 'Loan Dept',   status: 'Active',   joinDate: '2022-03-15' },
  { id: 3, name: 'Sneha Krishnan',    email: 'officer2@starbuzz.com', password: 'Officer@123',  role: 'officer',  mobile: '9876543212', department: 'Loan Dept',   status: 'Active',   joinDate: '2022-06-20' },
  { id: 4, name: 'Ravi Shankar',      email: 'sales@starbuzz.com',    password: 'Sales@123',    role: 'sales',    mobile: '9876543213', department: 'Sales',       status: 'Active',   joinDate: '2023-01-05' },
  { id: 5, name: 'Priya Nair',        email: 'sales2@starbuzz.com',   password: 'Sales@123',    role: 'sales',    mobile: '9876543214', department: 'Sales',       status: 'Active',   joinDate: '2023-04-12' },
  { id: 6, name: 'Rahul Sharma',      email: 'customer@starbuzz.com', password: 'Customer@123', role: 'customer', mobile: '9988776655', department: '',            status: 'Active',   joinDate: '2024-01-20' },
  { id: 7, name: 'Amit Verma',        email: 'amit@example.com',      password: 'Customer@123', role: 'customer', mobile: '9988776656', department: '',            status: 'Active',   joinDate: '2024-02-10' },
  { id: 8, name: 'Kavya Reddy',       email: 'kavya@example.com',     password: 'Customer@123', role: 'customer', mobile: '9988776657', department: '',            status: 'Active',   joinDate: '2024-03-05' },
];

/* ============================================================
   LOAN CATEGORIES
   ============================================================ */
export const loanCategoriesData = [
  { id: 1, name: 'Home Loan',              minAmount: 1000000,  maxAmount: 50000000,  interestRate: 8.5,  maxTenure: 240, description: 'Loans for purchasing or constructing home.' },
  { id: 2, name: 'Personal Loan',          minAmount: 50000,    maxAmount: 2000000,   interestRate: 12.5, maxTenure: 60,  description: 'Unsecured personal loans for any purpose.' },
  { id: 3, name: 'Business Loan',          minAmount: 500000,   maxAmount: 100000000, interestRate: 14.0, maxTenure: 84,  description: 'Loans for business expansion and working capital.' },
  { id: 4, name: 'Loan Against Property',  minAmount: 1500000,  maxAmount: 50000000,  interestRate: 9.5,  maxTenure: 180, description: 'Secured loans against residential/commercial property.' },
  { id: 5, name: 'Education Loan',         minAmount: 100000,   maxAmount: 4000000,   interestRate: 10.5, maxTenure: 84,  description: 'Loans for higher education in India or abroad.' },
  { id: 6, name: 'Car Loan',               minAmount: 200000,   maxAmount: 3000000,   interestRate: 9.0,  maxTenure: 84,  description: 'Loans for purchase of new or used vehicles.' },
  { id: 7, name: 'Gold Loan',              minAmount: 10000,    maxAmount: 5000000,   interestRate: 11.0, maxTenure: 24,  description: 'Quick loans against gold jewellery.' },
  { id: 8, name: 'MSME Loan',              minAmount: 300000,   maxAmount: 20000000,  interestRate: 13.0, maxTenure: 60,  description: 'Loans for Micro, Small & Medium Enterprises.' },
];

/* ============================================================
   CUSTOMERS (20) — must link user IDs 6,7,8 for portal login
   ============================================================ */
export const customersData = [
  { id: 'CUST0001', name: 'Rahul Sharma',      dob: '1990-05-12', gender: 'Male',   email: 'customer@starbuzz.com', mobile: '9988776655', employer: 'Infosys Ltd',          designation: 'Senior Engineer',       employmentType: 'Salaried',    monthlyIncome: 85000,  existingEmi: 5000,  currentAddress: '12, Koramangala 5th Block, Bangalore',   permanentAddress: '45, Gandhi Nagar, Jaipur',    city: 'Bangalore',  state: 'Karnataka',   pincode: '560034', panNumber: 'ABCDE1234F', aadhaarNumber: '1234 5678 9012', cibil: 750, userId: 6, createdDate: '2024-01-20T10:00:00Z' },
  { id: 'CUST0002', name: 'Amit Verma',         dob: '1988-11-25', gender: 'Male',   email: 'amit@example.com',      mobile: '9988776656', employer: 'TCS',                  designation: 'Project Manager',       employmentType: 'Salaried',    monthlyIncome: 120000, existingEmi: 15000, currentAddress: '88, Andheri West, Mumbai',               permanentAddress: '88, Andheri West, Mumbai',    city: 'Mumbai',     state: 'Maharashtra', pincode: '400058', panNumber: 'BCDEF2345G', aadhaarNumber: '2345 6789 0123', cibil: 720, userId: 7, createdDate: '2024-02-10T10:00:00Z' },
  { id: 'CUST0003', name: 'Kavya Reddy',        dob: '1993-07-30', gender: 'Female', email: 'kavya@example.com',     mobile: '9988776657', employer: 'Wipro Technologies',   designation: 'Business Analyst',      employmentType: 'Salaried',    monthlyIncome: 75000,  existingEmi: 0,     currentAddress: '33, Jubilee Hills, Hyderabad',          permanentAddress: '33, Jubilee Hills, Hyderabad', city: 'Hyderabad',  state: 'Telangana',   pincode: '500033', panNumber: 'CDEFG3456H', aadhaarNumber: '3456 7890 1234', cibil: 780, userId: 8, createdDate: '2024-03-05T10:00:00Z' },
  { id: 'CUST0004', name: 'Mohan Das',          dob: '1985-03-18', gender: 'Male',   email: 'mohan@example.com',     mobile: '9977665544', employer: 'HDFC Bank',            designation: 'Branch Manager',        employmentType: 'Salaried',    monthlyIncome: 95000,  existingEmi: 8000,  currentAddress: '56, Anna Nagar, Chennai',               permanentAddress: '56, Anna Nagar, Chennai',     city: 'Chennai',    state: 'Tamil Nadu',  pincode: '600040', panNumber: 'DEFGH4567I', aadhaarNumber: '4567 8901 2345', cibil: 735, userId: null, createdDate: '2024-01-15T10:00:00Z' },
  { id: 'CUST0005', name: 'Sunita Agarwal',     dob: '1991-09-22', gender: 'Female', email: 'sunita@example.com',    mobile: '9966554433', employer: 'Reliance Industries', designation: 'Marketing Manager',     employmentType: 'Salaried',    monthlyIncome: 68000,  existingEmi: 3000,  currentAddress: '110, Salt Lake, Kolkata',               permanentAddress: '110, Salt Lake, Kolkata',     city: 'Kolkata',    state: 'West Bengal', pincode: '700091', panNumber: 'EFGHI5678J', aadhaarNumber: '5678 9012 3456', cibil: 695, userId: null, createdDate: '2024-02-20T10:00:00Z' },
  { id: 'CUST0006', name: 'Deepak Joshi',       dob: '1987-12-05', gender: 'Male',   email: 'deepak@example.com',    mobile: '9955443322', employer: 'Self Employed',        designation: 'Business Owner',        employmentType: 'Self-Employed',monthlyIncome: 150000, existingEmi: 20000, currentAddress: '22, MG Road, Pune',                     permanentAddress: '22, MG Road, Pune',           city: 'Pune',       state: 'Maharashtra', pincode: '411001', panNumber: 'FGHIJ6789K', aadhaarNumber: '6789 0123 4567', cibil: 760, userId: null, createdDate: '2024-01-30T10:00:00Z' },
  { id: 'CUST0007', name: 'Pooja Menon',        dob: '1995-04-14', gender: 'Female', email: 'pooja@example.com',     mobile: '9944332211', employer: 'Accenture',            designation: 'Software Developer',    employmentType: 'Salaried',    monthlyIncome: 90000,  existingEmi: 10000, currentAddress: '77, Indiranagar, Bangalore',             permanentAddress: '77, Indiranagar, Bangalore',  city: 'Bangalore',  state: 'Karnataka',   pincode: '560038', panNumber: 'GHIJK7890L', aadhaarNumber: '7890 1234 5678', cibil: 740, userId: null, createdDate: '2024-03-10T10:00:00Z' },
  { id: 'CUST0008', name: 'Vikram Singh',       dob: '1982-08-28', gender: 'Male',   email: 'vikram@example.com',    mobile: '9933221100', employer: 'State Bank of India',  designation: 'Senior Officer',        employmentType: 'Salaried',    monthlyIncome: 78000,  existingEmi: 12000, currentAddress: '5, Civil Lines, Delhi',                 permanentAddress: '5, Civil Lines, Delhi',       city: 'Delhi',      state: 'Delhi',       pincode: '110054', panNumber: 'HIJKL8901M', aadhaarNumber: '8901 2345 6789', cibil: 715, userId: null, createdDate: '2024-02-05T10:00:00Z' },
  { id: 'CUST0009', name: 'Ananya Iyer',        dob: '1993-01-16', gender: 'Female', email: 'ananya@example.com',    mobile: '9922110099', employer: 'Cognizant',            designation: 'Tech Lead',             employmentType: 'Salaried',    monthlyIncome: 110000, existingEmi: 7000,  currentAddress: '43, T. Nagar, Chennai',                 permanentAddress: '43, T. Nagar, Chennai',       city: 'Chennai',    state: 'Tamil Nadu',  pincode: '600017', panNumber: 'IJKLM9012N', aadhaarNumber: '9012 3456 7890', cibil: 755, userId: null, createdDate: '2024-01-25T10:00:00Z' },
  { id: 'CUST0010', name: 'Suresh Pillai',      dob: '1980-06-03', gender: 'Male',   email: 'suresh@example.com',    mobile: '9911009988', employer: 'Kerala Govt',          designation: 'Assistant Director',   employmentType: 'Govt Service', monthlyIncome: 72000,  existingEmi: 5000,  currentAddress: '15, Thampanoor, Thiruvananthapuram',     permanentAddress: '15, Thampanoor, Thiruvananthapuram', city: 'Thiruvananthapuram', state: 'Kerala', pincode: '695001', panNumber: 'JKLMN0123O', aadhaarNumber: '0123 4567 8901', cibil: 700, userId: null, createdDate: '2024-03-15T10:00:00Z' },
  { id: 'CUST0011', name: 'Rajesh Gupta',       dob: '1986-10-21', gender: 'Male',   email: 'rajesh@example.com',    mobile: '9900998877', employer: 'Amazon India',         designation: 'Operations Manager',   employmentType: 'Salaried',    monthlyIncome: 130000, existingEmi: 18000, currentAddress: '68, Whitefield, Bangalore',              permanentAddress: '68, Whitefield, Bangalore',   city: 'Bangalore',  state: 'Karnataka',   pincode: '560066', panNumber: 'KLMNO1234P', aadhaarNumber: '1234 5678 9013', cibil: 775, userId: null, createdDate: '2024-01-18T10:00:00Z' },
  { id: 'CUST0012', name: 'Meera Patel',        dob: '1989-02-14', gender: 'Female', email: 'meera@example.com',     mobile: '9889977665', employer: 'Gujarat Govt',         designation: 'Teacher',               employmentType: 'Govt Service', monthlyIncome: 55000,  existingEmi: 2000,  currentAddress: '90, Satellite, Ahmedabad',               permanentAddress: '90, Satellite, Ahmedabad',    city: 'Ahmedabad',  state: 'Gujarat',     pincode: '380015', panNumber: 'LMNOP2345Q', aadhaarNumber: '2345 6789 0124', cibil: 680, userId: null, createdDate: '2024-02-28T10:00:00Z' },
  { id: 'CUST0013', name: 'Arjun Rao',          dob: '1992-07-09', gender: 'Male',   email: 'arjun@example.com',     mobile: '9878766554', employer: 'Microsoft India',      designation: 'Cloud Architect',       employmentType: 'Salaried',    monthlyIncome: 180000, existingEmi: 25000, currentAddress: '34, Gachibowli, Hyderabad',              permanentAddress: '34, Gachibowli, Hyderabad',   city: 'Hyderabad',  state: 'Telangana',   pincode: '500032', panNumber: 'MNOPQ3456R', aadhaarNumber: '3456 7890 1235', cibil: 790, userId: null, createdDate: '2024-03-20T10:00:00Z' },
  { id: 'CUST0014', name: 'Divya Krishnan',     dob: '1994-11-30', gender: 'Female', email: 'divya@example.com',     mobile: '9867655443', employer: 'Flipkart',             designation: 'Product Manager',      employmentType: 'Salaried',    monthlyIncome: 140000, existingEmi: 15000, currentAddress: '12, Bellandur, Bangalore',               permanentAddress: '12, Bellandur, Bangalore',    city: 'Bangalore',  state: 'Karnataka',   pincode: '560103', panNumber: 'NOPQR4567S', aadhaarNumber: '4567 8901 2346', cibil: 765, userId: null, createdDate: '2024-01-22T10:00:00Z' },
  { id: 'CUST0015', name: 'Kiran Malhotra',     dob: '1983-04-07', gender: 'Male',   email: 'kiran@example.com',     mobile: '9856544332', employer: 'DLF Ltd',              designation: 'Project Director',      employmentType: 'Salaried',    monthlyIncome: 200000, existingEmi: 30000, currentAddress: '25, DLF Phase 3, Gurgaon',              permanentAddress: '25, DLF Phase 3, Gurgaon',    city: 'Gurgaon',    state: 'Haryana',     pincode: '122002', panNumber: 'OPQRS5678T', aadhaarNumber: '5678 9012 3457', cibil: 800, userId: null, createdDate: '2024-02-15T10:00:00Z' },
  { id: 'CUST0016', name: 'Anjali Desai',       dob: '1991-08-19', gender: 'Female', email: 'anjali@example.com',    mobile: '9845433221', employer: 'Bajaj Finserv',        designation: 'Risk Analyst',          employmentType: 'Salaried',    monthlyIncome: 82000,  existingEmi: 6000,  currentAddress: '50, FC Road, Pune',                     permanentAddress: '50, FC Road, Pune',           city: 'Pune',       state: 'Maharashtra', pincode: '411004', panNumber: 'PQRST6789U', aadhaarNumber: '6789 0123 4568', cibil: 730, userId: null, createdDate: '2024-03-01T10:00:00Z' },
  { id: 'CUST0017', name: 'Sanjay Tiwari',      dob: '1984-12-25', gender: 'Male',   email: 'sanjay@example.com',    mobile: '9834322110', employer: 'BPCL',                 designation: 'Senior Engineer',       employmentType: 'PSU',         monthlyIncome: 88000,  existingEmi: 9000,  currentAddress: '7, Patparganj, Delhi',                  permanentAddress: '7, Patparganj, Delhi',         city: 'Delhi',      state: 'Delhi',       pincode: '110092', panNumber: 'QRSTU7890V', aadhaarNumber: '7890 1234 5679', cibil: 742, userId: null, createdDate: '2024-01-28T10:00:00Z' },
  { id: 'CUST0018', name: 'Nisha Bansal',       dob: '1996-03-12', gender: 'Female', email: 'nisha@example.com',     mobile: '9823211009', employer: 'Byju\'s',              designation: 'Content Developer',    employmentType: 'Salaried',    monthlyIncome: 60000,  existingEmi: 4000,  currentAddress: '88, JP Nagar, Bangalore',               permanentAddress: '88, JP Nagar, Bangalore',     city: 'Bangalore',  state: 'Karnataka',   pincode: '560078', panNumber: 'RSTUV8901W', aadhaarNumber: '8901 2345 6780', cibil: 688, userId: null, createdDate: '2024-02-22T10:00:00Z' },
  { id: 'CUST0019', name: 'Rohit Kapoor',       dob: '1988-06-17', gender: 'Male',   email: 'rohit@example.com',     mobile: '9812100998', employer: 'Hero Motocorp',        designation: 'Regional Sales Head', employmentType: 'Salaried',    monthlyIncome: 115000, existingEmi: 16000, currentAddress: '14, Sector 15, Chandigarh',             permanentAddress: '14, Sector 15, Chandigarh',   city: 'Chandigarh', state: 'Punjab',      pincode: '160015', panNumber: 'STUVW9012X', aadhaarNumber: '9012 3456 7891', cibil: 758, userId: null, createdDate: '2024-03-08T10:00:00Z' },
  { id: 'CUST0020', name: 'Lakshmi Subramaniam',dob: '1990-01-28', gender: 'Female', email: 'lakshmi@example.com',   mobile: '9801099887', employer: 'TVS Motor Company',   designation: 'Finance Executive',    employmentType: 'Salaried',    monthlyIncome: 72000,  existingEmi: 5500,  currentAddress: '30, T. Nagar, Chennai',                 permanentAddress: '30, T. Nagar, Chennai',       city: 'Chennai',    state: 'Tamil Nadu',  pincode: '600017', panNumber: 'TUVWX0123Y', aadhaarNumber: '0123 4567 8902', cibil: 712, userId: null, createdDate: '2024-01-05T10:00:00Z' },
];

/* ============================================================
   APPLICATIONS (15)
   ============================================================ */
const appStatuses = ['New Application', 'Under Review', 'Document Pending', 'Document Verified', 'Approved', 'Rejected', 'Disbursed'];
const officers = ['Arjun Mehta', 'Sneha Krishnan'];

export const applicationsData = [
  { id: 'APP0001', customerId: 'CUST0001', customerName: 'Rahul Sharma',      loanType: 'Home Loan',             requestedAmount: 5000000,  tenure: 240, status: 'Disbursed',         assignedOfficer: 'Arjun Mehta',   createdDate: '2024-01-25T10:00:00Z', purpose: 'Purchase of 2BHK flat in Koramangala',   monthlyIncome: 85000, existingEmi: 5000, approvedAmount: 4800000, disbursedAmount: 4800000, disbursementDate: '2024-03-01T10:00:00Z', approvalDate: '2024-02-20T10:00:00Z', statusHistory: [{status:'New Application',date:'2024-01-25T10:00:00Z',remark:'Application submitted.',by:'Customer'},{status:'Under Review',date:'2024-02-01T10:00:00Z',remark:'Documents received.',by:'Arjun Mehta'},{status:'Document Verified',date:'2024-02-10T10:00:00Z',remark:'All documents verified.',by:'Arjun Mehta'},{status:'Approved',date:'2024-02-20T10:00:00Z',remark:'Loan approved for ₹48 Lakh.',by:'Arjun Mehta'},{status:'Disbursed',date:'2024-03-01T10:00:00Z',remark:'Amount disbursed to account.',by:'Arjun Mehta'}] },
  { id: 'APP0002', customerId: 'CUST0002', customerName: 'Amit Verma',         loanType: 'Personal Loan',         requestedAmount: 800000,   tenure: 36,  status: 'Approved',          assignedOfficer: 'Sneha Krishnan',createdDate: '2024-02-12T10:00:00Z', purpose: 'Home renovation and furniture purchase',  monthlyIncome: 120000, existingEmi: 15000, approvedAmount: 750000, approvalDate: '2024-03-05T10:00:00Z', statusHistory: [{status:'New Application',date:'2024-02-12T10:00:00Z',remark:'Application submitted.',by:'Customer'},{status:'Under Review',date:'2024-02-18T10:00:00Z',remark:'Under officer review.',by:'Sneha Krishnan'},{status:'Document Verified',date:'2024-02-28T10:00:00Z',remark:'Documents verified.',by:'Sneha Krishnan'},{status:'Approved',date:'2024-03-05T10:00:00Z',remark:'Loan approved for ₹7.5 Lakh.',by:'Sneha Krishnan'}] },
  { id: 'APP0003', customerId: 'CUST0003', customerName: 'Kavya Reddy',        loanType: 'Car Loan',              requestedAmount: 1200000,  tenure: 60,  status: 'Under Review',      assignedOfficer: 'Arjun Mehta',   createdDate: '2024-03-10T10:00:00Z', purpose: 'Purchase of new SUV',                      monthlyIncome: 75000, existingEmi: 0, statusHistory: [{status:'New Application',date:'2024-03-10T10:00:00Z',remark:'Application submitted.',by:'Customer'},{status:'Under Review',date:'2024-03-12T10:00:00Z',remark:'Under review.',by:'Arjun Mehta'}] },
  { id: 'APP0004', customerId: 'CUST0004', customerName: 'Mohan Das',          loanType: 'Business Loan',         requestedAmount: 2500000,  tenure: 60,  status: 'Document Pending',  assignedOfficer: 'Sneha Krishnan',createdDate: '2024-01-18T10:00:00Z', purpose: 'Expanding retail outlet chain',            monthlyIncome: 95000, existingEmi: 8000, statusHistory: [{status:'New Application',date:'2024-01-18T10:00:00Z',remark:'Application submitted.',by:'Sales'},{status:'Under Review',date:'2024-01-25T10:00:00Z',remark:'Application under review.',by:'Sneha Krishnan'},{status:'Document Pending',date:'2024-02-05T10:00:00Z',remark:'Bank statement and GST certificate pending.',by:'Sneha Krishnan'}] },
  { id: 'APP0005', customerId: 'CUST0005', customerName: 'Sunita Agarwal',     loanType: 'Education Loan',        requestedAmount: 1500000,  tenure: 84,  status: 'Rejected',          assignedOfficer: 'Arjun Mehta',   createdDate: '2024-02-05T10:00:00Z', purpose: 'MBA program at IIM Ahmedabad',             monthlyIncome: 68000, existingEmi: 3000, rejectionReason: 'Low CIBIL score (below 650). Applicant has existing payment defaults.', rejectionDate: '2024-02-28T10:00:00Z', statusHistory: [{status:'New Application',date:'2024-02-05T10:00:00Z',remark:'Application submitted.',by:'Customer'},{status:'Under Review',date:'2024-02-12T10:00:00Z',remark:'Under officer review.',by:'Arjun Mehta'},{status:'Rejected',date:'2024-02-28T10:00:00Z',remark:'Low CIBIL score (below 650).',by:'Arjun Mehta'}] },
  { id: 'APP0006', customerId: 'CUST0006', customerName: 'Deepak Joshi',       loanType: 'Loan Against Property', requestedAmount: 10000000, tenure: 120, status: 'Document Verified', assignedOfficer: 'Sneha Krishnan',createdDate: '2024-01-30T10:00:00Z', purpose: 'Business expansion and working capital',   monthlyIncome: 150000, existingEmi: 20000, statusHistory: [{status:'New Application',date:'2024-01-30T10:00:00Z',remark:'Application submitted.',by:'Sales'},{status:'Under Review',date:'2024-02-05T10:00:00Z',remark:'Under review.',by:'Sneha Krishnan'},{status:'Document Pending',date:'2024-02-15T10:00:00Z',remark:'Property valuation report pending.',by:'Sneha Krishnan'},{status:'Document Verified',date:'2024-03-01T10:00:00Z',remark:'All documents verified including property valuation.',by:'Sneha Krishnan'}] },
  { id: 'APP0007', customerId: 'CUST0007', customerName: 'Pooja Menon',        loanType: 'Personal Loan',         requestedAmount: 500000,   tenure: 24,  status: 'New Application',   assignedOfficer: 'Arjun Mehta',   createdDate: '2024-03-15T10:00:00Z', purpose: 'Medical treatment and recovery expenses',  monthlyIncome: 90000, existingEmi: 10000, statusHistory: [{status:'New Application',date:'2024-03-15T10:00:00Z',remark:'Application submitted by customer.',by:'Customer'}] },
  { id: 'APP0008', customerId: 'CUST0008', customerName: 'Vikram Singh',       loanType: 'Home Loan',             requestedAmount: 3500000,  tenure: 180, status: 'Disbursed',         assignedOfficer: 'Sneha Krishnan',createdDate: '2024-01-08T10:00:00Z', purpose: 'Purchase of apartment in South Delhi',     monthlyIncome: 78000, existingEmi: 12000, approvedAmount: 3200000, disbursedAmount: 3200000, disbursementDate: '2024-02-28T10:00:00Z', approvalDate: '2024-02-15T10:00:00Z', statusHistory: [{status:'New Application',date:'2024-01-08T10:00:00Z',remark:'Submitted.',by:'Customer'},{status:'Disbursed',date:'2024-02-28T10:00:00Z',remark:'Loan disbursed.',by:'Sneha Krishnan'}] },
  { id: 'APP0009', customerId: 'CUST0009', customerName: 'Ananya Iyer',        loanType: 'Personal Loan',         requestedAmount: 600000,   tenure: 36,  status: 'Under Review',      assignedOfficer: 'Arjun Mehta',   createdDate: '2024-03-18T10:00:00Z', purpose: 'International vacation and savings',        monthlyIncome: 110000, existingEmi: 7000, statusHistory: [{status:'New Application',date:'2024-03-18T10:00:00Z',remark:'Submitted.',by:'Customer'},{status:'Under Review',date:'2024-03-20T10:00:00Z',remark:'Under review.',by:'Arjun Mehta'}] },
  { id: 'APP0010', customerId: 'CUST0010', customerName: 'Suresh Pillai',      loanType: 'Gold Loan',             requestedAmount: 350000,   tenure: 12,  status: 'Approved',          assignedOfficer: 'Sneha Krishnan',createdDate: '2024-03-05T10:00:00Z', purpose: 'Working capital for business',             monthlyIncome: 72000, existingEmi: 5000, approvedAmount: 320000, approvalDate: '2024-03-12T10:00:00Z', statusHistory: [{status:'New Application',date:'2024-03-05T10:00:00Z',remark:'Submitted.',by:'Customer'},{status:'Approved',date:'2024-03-12T10:00:00Z',remark:'Gold valuation done. Loan approved.',by:'Sneha Krishnan'}] },
  { id: 'APP0011', customerId: 'CUST0011', customerName: 'Rajesh Gupta',       loanType: 'Business Loan',         requestedAmount: 5000000,  tenure: 60,  status: 'Document Pending',  assignedOfficer: 'Arjun Mehta',   createdDate: '2024-02-20T10:00:00Z', purpose: 'Launch of new e-commerce vertical',        monthlyIncome: 130000, existingEmi: 18000, statusHistory: [{status:'New Application',date:'2024-02-20T10:00:00Z',remark:'Submitted.',by:'Sales'},{status:'Document Pending',date:'2024-02-28T10:00:00Z',remark:'P&L statement and 2-year ITR pending.',by:'Arjun Mehta'}] },
  { id: 'APP0012', customerId: 'CUST0012', customerName: 'Meera Patel',        loanType: 'Education Loan',        requestedAmount: 2500000,  tenure: 84,  status: 'New Application',   assignedOfficer: 'Sneha Krishnan',createdDate: '2024-03-20T10:00:00Z', purpose: 'MBBS abroad (Ukraine Medical University)', monthlyIncome: 55000, existingEmi: 2000, statusHistory: [{status:'New Application',date:'2024-03-20T10:00:00Z',remark:'Submitted.',by:'Customer'}] },
  { id: 'APP0013', customerId: 'CUST0013', customerName: 'Arjun Rao',          loanType: 'Home Loan',             requestedAmount: 8000000,  tenure: 240, status: 'Document Verified', assignedOfficer: 'Arjun Mehta',   createdDate: '2024-02-25T10:00:00Z', purpose: 'Purchase of 3BHK in Gachibowli',          monthlyIncome: 180000, existingEmi: 25000, statusHistory: [{status:'New Application',date:'2024-02-25T10:00:00Z',remark:'Submitted.',by:'Customer'},{status:'Document Verified',date:'2024-03-15T10:00:00Z',remark:'All docs verified.',by:'Arjun Mehta'}] },
  { id: 'APP0014', customerId: 'CUST0014', customerName: 'Divya Krishnan',     loanType: 'Personal Loan',         requestedAmount: 1000000,  tenure: 48,  status: 'Approved',          assignedOfficer: 'Sneha Krishnan',createdDate: '2024-01-28T10:00:00Z', purpose: 'Wedding expenses and honeymoon',           monthlyIncome: 140000, existingEmi: 15000, approvedAmount: 950000, approvalDate: '2024-02-18T10:00:00Z', statusHistory: [{status:'New Application',date:'2024-01-28T10:00:00Z',remark:'Submitted.',by:'Customer'},{status:'Approved',date:'2024-02-18T10:00:00Z',remark:'Loan approved.',by:'Sneha Krishnan'}] },
  { id: 'APP0015', customerId: 'CUST0015', customerName: 'Kiran Malhotra',     loanType: 'Loan Against Property', requestedAmount: 15000000, tenure: 120, status: 'Disbursed',         assignedOfficer: 'Arjun Mehta',   createdDate: '2024-01-10T10:00:00Z', purpose: 'Commercial property acquisition in Gurgaon',monthlyIncome: 200000, existingEmi: 30000, approvedAmount: 14000000, disbursedAmount: 14000000, disbursementDate: '2024-02-20T10:00:00Z', approvalDate: '2024-02-05T10:00:00Z', statusHistory: [{status:'New Application',date:'2024-01-10T10:00:00Z',remark:'Submitted.',by:'Sales'},{status:'Disbursed',date:'2024-02-20T10:00:00Z',remark:'Disbursed.',by:'Arjun Mehta'}] },
];

/* ============================================================
   LEADS (25)
   ============================================================ */
const leadNames = ['Prabhakaran T', 'Swati Kulkarni', 'Harish Chandra', 'Fatima Shaikh', 'Narendra Patel', 'Geeta Mishra', 'Ranjit Kumar', 'Lalitha Devi', 'Shyam Sunder', 'Preethi Murthy', 'Siddharth Roy', 'Varsha Bhatt', 'Murugan S', 'Kaveri Reddy', 'Vinod Khanna', 'Reena Gupta', 'Balaji V', 'Chandralekha', 'Prakash Yadav', 'Shobha Nair', 'Manish Aggarwal', 'Revathi Pillai', 'Sunil Tiwari', 'Mamta Banerjee', 'Karthik Subramanian'];
const leadStatuses = ['New', 'Contacted', 'Interested', 'Not Interested', 'Follow-up', 'Converted', 'Closed'];
const leadSources = ['Website', 'Walk-in', 'Referral', 'WhatsApp', 'Partner', 'Call'];
const loanTypes = ['Home Loan', 'Personal Loan', 'Business Loan', 'Car Loan', 'Education Loan', 'Gold Loan', 'Loan Against Property', 'MSME Loan'];
const salesReps = ['Ravi Shankar', 'Priya Nair'];

export const leadsData = leadNames.map((name, i) => ({
  id: `LD${String(i + 1).padStart(4, '0')}`,
  name,
  mobile: `9${String(800000000 + i * 1234567).slice(0, 9)}`,
  email: `${name.toLowerCase().replace(/ /g, '.')}@email.com`,
  loanType: loanTypes[i % 8],
  loanAmount: (i + 1) * 150000,
  source: leadSources[i % 6],
  status: leadStatuses[i % 7],
  assignedTo: salesReps[i % 2],
  followUpDate: new Date(Date.now() + (i - 12) * 86400000).toISOString().split('T')[0],
  createdDate: new Date(Date.now() - (30 - i) * 86400000).toISOString(),
  notes: [
    'Interested in home loan, has 20% down payment ready.',
    'Needs personal loan for medical emergency.',
    'Wants to expand grocery business — needs ₹25L.',
    'Looking to buy second car. Has existing auto loan.',
    'Son going to Germany for MS — needs education loan.',
    'Has property in Bandra worth ₹2Cr. Wants LAP.',
    'Not interested right now, follow up in 3 months.',
    'Very interested, needs quick processing.',
    'Asked for more details on interest rates.',
    'Referred by existing customer Rahul Sharma.',
    'Walk-in at our Koramangala branch.',
    'WhatsApp inquiry from Facebook ad.',
    'Called for loan eligibility check.',
    'Wants lower interest rate than current bank.',
    'First-time home buyer, needs guidance.',
  ][i % 15],
}));

/* ============================================================
   DOCUMENTS (40)
   ============================================================ */
const docTypes = ['Aadhaar', 'PAN Card', 'Bank Statement', 'Salary Slip', 'Address Proof', 'Photo'];
const docStatuses = ['Approved', 'Approved', 'Pending Verification', 'Rejected', 'Uploaded', 'Approved'];

export const documentsData = (() => {
  const docs = [];
  applicationsData.slice(0, 8).forEach((app, appIdx) => {
    docTypes.forEach((type, typeIdx) => {
      if (docs.length < 40) {
        docs.push({
          id: `DOC${String(docs.length + 1).padStart(4, '0')}`,
          applicationId: app.id,
          customerId: app.customerId,
          customerName: app.customerName,
          type,
          fileName: `${type.replace(/ /g, '_')}_${app.customerName.split(' ')[0].toLowerCase()}.pdf`,
          fileSize: `${Math.floor(Math.random() * 3000 + 500)} KB`,
          status: docStatuses[(appIdx + typeIdx) % 6],
          uploadDate: new Date(Date.now() - (20 - typeIdx) * 86400000).toISOString(),
          remarks: (appIdx + typeIdx) % 6 === 3 ? 'Document is blurry. Please re-upload a clear scan.' : '',
          verifiedBy: (appIdx + typeIdx) % 6 <= 1 ? 'Arjun Mehta' : '',
        });
      }
    });
  });
  return docs;
})();

/* ============================================================
   TICKETS (15)
   ============================================================ */
const ticketCategories = ['General Query', 'Document Issue', 'Disbursement Delay', 'Portal Access', 'EMI Issue', 'Application Status'];
const ticketSubjects = [
  'Unable to upload Aadhaar card on portal',
  'When will my loan be disbursed?',
  'Interest rate seems higher than quoted',
  'Application status not updating in portal',
  'Need to change registered mobile number',
  'EMI auto-debit failed this month',
  'Property valuation report rejected — reason unclear',
  'Need NOC for my closed loan',
  'Cannot login to customer portal',
  'Request for loan statement for tax purposes',
  'Pre-closure of personal loan — penalty query',
  'Want to increase loan tenure',
  'Request for part-prepayment of home loan',
  'Branch staff was unhelpful',
  'Document submitted but status still shows Pending',
];

export const ticketsData = Array.from({ length: 15 }).map((_, i) => ({
  id: `TKT${String(i + 1).padStart(4, '0')}`,
  customerId: customersData[i].id,
  customerName: customersData[i].name,
  applicationId: applicationsData[i % 15].id,
  category: ticketCategories[i % 6],
  subject: ticketSubjects[i],
  priority: ['High', 'Medium', 'Low'][i % 3],
  description: `Dear Support Team, ${ticketSubjects[i]}. I have been facing this issue for the past ${i % 5 + 1} day(s). Please resolve at the earliest. Thank you.`,
  status: ['Open', 'Assigned', 'In Progress', 'Resolved', 'Closed'][i % 5],
  assignedTo: i % 3 !== 0 ? ['Ravi Shankar', 'Arjun Mehta'][i % 2] : '',
  createdDate: new Date(Date.now() - (20 - i) * 86400000).toISOString(),
  adminResponse: i % 5 >= 3 ? `Thank you for contacting Star Buzz Support. We have reviewed your request regarding "${ticketSubjects[i]}" and taken appropriate action. Your issue has been resolved. Please check your application portal for updated status. If you face further issues, please raise a new ticket.` : '',
  responses: i % 5 >= 3 ? [{
    id: `RESP${i + 1}`,
    text: `Thank you for contacting Star Buzz Support. We have reviewed your request and resolved the issue. Your ${ticketCategories[i % 6].toLowerCase()} has been addressed.`,
    by: ['Ravi Shankar', 'Arjun Mehta'][i % 2],
    date: new Date(Date.now() - (10 - i) * 86400000).toISOString(),
  }] : [],
}));

/* ============================================================
   COLLECTIONS (30) — linked to disbursed applications
   ============================================================ */
const disbursedApps = applicationsData.filter(a => a.status === 'Disbursed');

export const collectionsData = (() => {
  const cols = [];
  disbursedApps.forEach((app) => {
    const amount = app.disbursedAmount || app.requestedAmount;
    const tenure = Math.min(app.tenure, 10);
    const emiAmount = Math.round(amount / app.tenure);
    for (let i = 0; i < tenure && cols.length < 30; i++) {
      const dueDate = new Date(app.disbursementDate || Date.now());
      dueDate.setMonth(dueDate.getMonth() + i + 1);
      const isPast = dueDate < new Date();
      const payStatus = isPast ? (i % 5 === 0 ? 'Overdue' : i % 5 === 1 ? 'Partial' : 'Paid') : 'Pending';
      const paid = payStatus === 'Paid' ? emiAmount : payStatus === 'Partial' ? Math.round(emiAmount * 0.5) : 0;
      cols.push({
        id: `COL${String(cols.length + 1).padStart(4, '0')}`,
        applicationId: app.id,
        customerId: app.customerId,
        customerName: app.customerName,
        loanType: app.loanType,
        emiMonth: dueDate.toISOString().slice(0, 7),
        emiNumber: i + 1,
        totalEmis: app.tenure,
        emiAmount,
        paidAmount: paid,
        balanceAmount: emiAmount - paid,
        dueDate: dueDate.toISOString().split('T')[0],
        paymentDate: payStatus !== 'Pending' && payStatus !== 'Overdue' ? new Date(dueDate.getTime() - 2 * 86400000).toISOString().split('T')[0] : null,
        paymentStatus: payStatus,
      });
    }
  });
  return cols;
})();

/* ============================================================
   FOLLOW UPS (20)
   ============================================================ */
export const followUpsData = Array.from({ length: 20 }).map((_, i) => ({
  id: `FU${String(i + 1).padStart(4, '0')}`,
  leadId: leadsData[i % 25].id,
  date: new Date(Date.now() + (i - 8) * 86400000).toISOString().split('T')[0],
  notes: [
    'Call to check interest in home loan.',
    'WhatsApp follow-up with EMI details.',
    'Email loan eligibility certificate.',
    'Schedule branch visit for document collection.',
    'Remind about document submission deadline.',
  ][i % 5],
  status: i < 8 ? 'Completed' : 'Pending',
}));

/* ============================================================
   TIMELINE (25)
   ============================================================ */
export const timelineData = [
  { id: 'TL0001', referenceId: 'APP0001', type: 'Application', action: 'Created',      description: 'Loan application submitted for Home Loan by Rahul Sharma.',           date: '2024-01-25T10:00:00Z' },
  { id: 'TL0002', referenceId: 'APP0001', type: 'Application', action: 'Status Changed',description: 'Status changed to Under Review.',                                       date: '2024-02-01T10:00:00Z' },
  { id: 'TL0003', referenceId: 'APP0001', type: 'Application', action: 'Status Changed',description: 'Status changed to Document Verified.',                                  date: '2024-02-10T10:00:00Z' },
  { id: 'TL0004', referenceId: 'APP0001', type: 'Application', action: 'Approved',      description: 'Loan approved for ₹48,00,000.',                                        date: '2024-02-20T10:00:00Z' },
  { id: 'TL0005', referenceId: 'APP0001', type: 'Application', action: 'Disbursed',     description: 'Loan amount disbursed to customer account. EMI schedule generated.',    date: '2024-03-01T10:00:00Z' },
  { id: 'TL0006', referenceId: 'LD0001',  type: 'Lead',        action: 'Created',       description: 'Lead created from Website source.',                                     date: '2024-01-15T10:00:00Z' },
  { id: 'TL0007', referenceId: 'LD0001',  type: 'Lead',        action: 'Assigned',      description: 'Lead assigned to Ravi Shankar.',                                       date: '2024-01-16T10:00:00Z' },
  { id: 'TL0008', referenceId: 'LD0002',  type: 'Lead',        action: 'Created',       description: 'Lead created from Referral source.',                                    date: '2024-01-18T10:00:00Z' },
  { id: 'TL0009', referenceId: 'APP0002', type: 'Application', action: 'Created',       description: 'Personal Loan application submitted by Amit Verma.',                   date: '2024-02-12T10:00:00Z' },
  { id: 'TL0010', referenceId: 'APP0002', type: 'Application', action: 'Approved',      description: 'Loan approved for ₹7,50,000.',                                        date: '2024-03-05T10:00:00Z' },
  { id: 'TL0011', referenceId: 'TKT0001', type: 'Ticket',      action: 'Created',       description: 'Support ticket raised: Unable to upload Aadhaar card on portal.',      date: '2024-02-10T10:00:00Z' },
  { id: 'TL0012', referenceId: 'TKT0001', type: 'Ticket',      action: 'Assigned',      description: 'Ticket assigned to Ravi Shankar.',                                     date: '2024-02-11T10:00:00Z' },
  { id: 'TL0013', referenceId: 'APP0003', type: 'Application', action: 'Created',       description: 'Car Loan application submitted by Kavya Reddy.',                       date: '2024-03-10T10:00:00Z' },
  { id: 'TL0014', referenceId: 'APP0004', type: 'Application', action: 'Status Changed',description: 'Status changed to Document Pending. Bank statement missing.',           date: '2024-02-05T10:00:00Z' },
  { id: 'TL0015', referenceId: 'DOC0001', type: 'Document',    action: 'Uploaded',      description: 'Aadhaar uploaded by Rahul Sharma.',                                    date: '2024-01-26T10:00:00Z' },
  { id: 'TL0016', referenceId: 'DOC0001', type: 'Document',    action: 'Approved',      description: 'Aadhaar approved by Arjun Mehta.',                                     date: '2024-02-05T10:00:00Z' },
  { id: 'TL0017', referenceId: 'APP0005', type: 'Application', action: 'Rejected',      description: 'Education Loan rejected due to low CIBIL score (below 650).',           date: '2024-02-28T10:00:00Z' },
  { id: 'TL0018', referenceId: 'APP0008', type: 'Application', action: 'Disbursed',     description: 'Home Loan disbursed to Vikram Singh. EMI schedule created.',           date: '2024-02-28T10:00:00Z' },
  { id: 'TL0019', referenceId: 'LD0010', type: 'Lead',         action: 'Note Added',    description: 'Note: Very interested, needs quick processing.',                        date: '2024-02-20T10:00:00Z' },
  { id: 'TL0020', referenceId: 'LD0006', type: 'Lead',         action: 'Status Changed',description: 'Lead status changed to Converted.',                                    date: '2024-01-30T10:00:00Z' },
  { id: 'TL0021', referenceId: 'APP0006', type: 'Application', action: 'Status Changed',description: 'Status changed to Document Verified.',                                  date: '2024-03-01T10:00:00Z' },
  { id: 'TL0022', referenceId: 'TKT0004', type: 'Ticket',      action: 'Resolved',      description: 'Ticket resolved: Application status now updated in portal.',            date: '2024-02-18T10:00:00Z' },
  { id: 'TL0023', referenceId: 'APP0010', type: 'Application', action: 'Approved',      description: 'Gold Loan approved for ₹3,20,000 after property valuation.',           date: '2024-03-12T10:00:00Z' },
  { id: 'TL0024', referenceId: 'COL0001', type: 'Collection',  action: 'Payment Recorded', description: 'EMI payment of ₹20,000 received from Rahul Sharma.',               date: '2024-04-01T10:00:00Z' },
  { id: 'TL0025', referenceId: 'APP0015', type: 'Application', action: 'Disbursed',     description: 'LAP disbursed to Kiran Malhotra — ₹1.4 Crore. EMI schedule generated.', date: '2024-02-20T10:00:00Z' },
];
