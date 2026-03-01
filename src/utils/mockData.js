/**
 * ═══════════════════════════════════════════════════════════
 * SUVIDHA Setu - Mock Data & Constants
 * Contains all hardcoded mock data for demonstration
 * ═══════════════════════════════════════════════════════════
 */

/** Mock bills database */
export const mockBills = [
    {
        id: "PSEB-123456",
        service: "electricity",
        name: "R*** Kumar",
        fullName: "Rajesh Kumar",
        amount: 450,
        units: 85,
        unitLabel: "kWh",
        dueDate: "2026-02-28",
        lastPaymentDate: "2026-01-15",
        address: "H.No. 234, Sector 5, Ludhiana, Punjab",
        meterNo: "MTR-0098765",
    },
    {
        id: "PHED-789012",
        service: "water",
        name: "P*** Singh",
        fullName: "Paramjit Singh",
        amount: 280,
        units: 12,
        unitLabel: "KL",
        dueDate: "2026-03-05",
        lastPaymentDate: "2026-01-20",
        address: "H.No. 567, Model Town, Ludhiana, Punjab",
        meterNo: "WTR-0045678",
    },
    {
        id: "GPL-345678",
        service: "gas",
        name: "S*** Devi",
        fullName: "Sunita Devi",
        amount: 620,
        units: 3,
        unitLabel: "Cylinders",
        dueDate: "2026-03-10",
        lastPaymentDate: "2026-02-01",
        address: "H.No. 89, Civil Lines, Ludhiana, Punjab",
        meterNo: "GAS-0012345",
    },
];

/** Complaint categories (with keywords for voice auto-detect) */
export const complaintCategories = [
    { value: "broken_streetlight", label: "Broken Streetlight", icon: "💡", keywords: ["streetlight", "light", "dark", "lamp", "pole", "bijli", "roshni"] },
    { value: "water_supply", label: "Water Supply Issue", icon: "🚰", keywords: ["water", "supply", "pipe", "leak", "tap", "pani", "paani", "jal"] },
    { value: "garbage_collection", label: "Garbage Collection", icon: "🗑️", keywords: ["garbage", "waste", "trash", "dump", "kachra", "safai", "clean"] },
    { value: "voltage_fluctuation", label: "Voltage Fluctuation", icon: "⚡", keywords: ["voltage", "fluctuation", "power", "electric", "current", "bijli", "volt"] },
    { value: "road_damage", label: "Road Damage / Pothole", icon: "🛣️", keywords: ["road", "pothole", "damage", "crack", "broken", "sadak", "gaddha"] },
    { value: "other", label: "Other Issue", icon: "📋", keywords: [] },
];

/** Service icons and routes */
export const services = [
    { key: "electricity", icon: "⚡", route: "/bill/electricity", color: "#FBBF24", bgColor: "#FEF3C7" },
    { key: "water", icon: "💧", route: "/bill/water", color: "#3B82F6", bgColor: "#DBEAFE" },
    { key: "gas", icon: "🔥", route: "/bill/gas", color: "#F97316", bgColor: "#FFEDD5" },
    { key: "complaint", icon: "📝", route: "/complaint", color: "#8B5CF6", bgColor: "#EDE9FE" },
];

/** Admin mock data */
export const adminMockData = {
    totalTransactions: 47,
    activeKiosks: "12/15",
    pendingComplaints: 8,
    revenueCollected: "₹1,24,500",

    activityLog: [
        { time: "10:45 PM", kioskId: "K-001", action: "Bill Payment", amount: "₹450", type: "payment" },
        { time: "10:40 PM", kioskId: "K-003", action: "Complaint Filed", amount: "-", type: "complaint" },
        { time: "10:35 PM", kioskId: "K-007", action: "Bill Payment", amount: "₹280", type: "payment" },
        { time: "10:30 PM", kioskId: "K-002", action: "Bill Payment", amount: "₹620", type: "payment" },
        { time: "10:25 PM", kioskId: "K-005", action: "Complaint Filed", amount: "-", type: "complaint" },
        { time: "10:20 PM", kioskId: "K-001", action: "Bill Payment", amount: "₹1,200", type: "payment" },
        { time: "10:15 PM", kioskId: "K-009", action: "Bill Payment", amount: "₹350", type: "payment" },
        { time: "10:10 PM", kioskId: "K-004", action: "Complaint Filed", amount: "-", type: "complaint" },
        { time: "10:05 PM", kioskId: "K-006", action: "Bill Payment", amount: "₹890", type: "payment" },
        { time: "10:00 PM", kioskId: "K-011", action: "Bill Payment", amount: "₹150", type: "payment" },
    ],

    // Hourly transaction data for charts
    hourlyData: [
        { hour: "6 AM", transactions: 2, revenue: 900 },
        { hour: "7 AM", transactions: 5, revenue: 2400 },
        { hour: "8 AM", transactions: 8, revenue: 4200 },
        { hour: "9 AM", transactions: 12, revenue: 6800 },
        { hour: "10 AM", transactions: 15, revenue: 9500 },
        { hour: "11 AM", transactions: 18, revenue: 12400 },
        { hour: "12 PM", transactions: 14, revenue: 8900 },
        { hour: "1 PM", transactions: 10, revenue: 5600 },
        { hour: "2 PM", transactions: 16, revenue: 11200 },
        { hour: "3 PM", transactions: 20, revenue: 14500 },
        { hour: "4 PM", transactions: 22, revenue: 16800 },
        { hour: "5 PM", transactions: 19, revenue: 13400 },
        { hour: "6 PM", transactions: 12, revenue: 7600 },
        { hour: "7 PM", transactions: 8, revenue: 4200 },
        { hour: "8 PM", transactions: 6, revenue: 3100 },
        { hour: "9 PM", transactions: 4, revenue: 1800 },
        { hour: "10 PM", transactions: 3, revenue: 1500 },
    ],

    // Complaint heatmap points (Indian cities)
    heatmapPoints: [
        { name: "Ludhiana", lat: 30.9010, lng: 75.8573, count: 15, x: 230, y: 155 },
        { name: "Chandigarh", lat: 30.7333, lng: 76.7794, count: 8, x: 240, y: 148 },
        { name: "Delhi", lat: 28.7041, lng: 77.1025, count: 23, x: 245, y: 175 },
        { name: "Jaipur", lat: 26.9124, lng: 75.7873, count: 12, x: 225, y: 200 },
        { name: "Mumbai", lat: 19.0760, lng: 72.8777, count: 31, x: 195, y: 290 },
        { name: "Pune", lat: 18.5204, lng: 73.8567, count: 9, x: 205, y: 300 },
        { name: "Bangalore", lat: 12.9716, lng: 77.5946, count: 18, x: 225, y: 370 },
        { name: "Chennai", lat: 13.0827, lng: 80.2707, count: 14, x: 260, y: 365 },
        { name: "Hyderabad", lat: 17.3850, lng: 78.4867, count: 10, x: 240, y: 320 },
        { name: "Kolkata", lat: 22.5726, lng: 88.3639, count: 16, x: 330, y: 255 },
        { name: "Ahmedabad", lat: 23.0225, lng: 72.5714, count: 7, x: 190, y: 245 },
        { name: "Lucknow", lat: 26.8467, lng: 80.9462, count: 11, x: 280, y: 205 },
    ],

    // Service type breakdown for pie chart
    serviceBreakdown: [
        { name: "Electricity", value: 45, color: "#FBBF24" },
        { name: "Water", value: 25, color: "#3B82F6" },
        { name: "Gas", value: 20, color: "#F97316" },
        { name: "Complaints", value: 10, color: "#8B5CF6" },
    ],
};

/** Generate a random transaction ID */
export function generateTxnId() {
    const now = new Date();
    const rand = Math.floor(Math.random() * 90000) + 10000;
    return `TXN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${rand}`;
}

/** Generate a complaint ticket ID */
let complaintCounter = 123;
export function generateComplaintId() {
    complaintCounter++;
    return `COMP-2026-${String(complaintCounter).padStart(5, '0')}`;
}

/** Look up a bill by consumer ID */
export function lookupBill(consumerId) {
    return mockBills.find(b =>
        b.id.toLowerCase() === consumerId.trim().toLowerCase()
    ) || null;
}

// ═══════════════════════════════════════════════════════════
// NEW DEPARTMENTS — Mock Data
// ═══════════════════════════════════════════════════════════

/** PM-KISAN installments */
export const pmKisanData = {
    beneficiary: { name: 'Ramesh Kumar', aadhaar: '****-****-5678', state: 'Punjab', district: 'Ludhiana', village: 'Gill' },
    installments: [
        { installment: 17, amount: 2000, date: '2026-02-15', status: 'Credited', mode: 'DBT' },
        { installment: 16, amount: 2000, date: '2025-10-15', status: 'Credited', mode: 'DBT' },
        { installment: 15, amount: 2000, date: '2025-06-15', status: 'Credited', mode: 'DBT' },
    ],
    totalReceived: 34000,
    nextInstallment: '2026-06-15',
};

/** Ayushman Bharat (PM-JAY) */
export const ayushmanData = {
    eligible: true,
    familyId: 'PMJAY-PB-2026-78901',
    members: [
        { name: 'Ramesh Kumar', relation: 'Self', age: 45, cardNo: 'AB-PB-001234' },
        { name: 'Sita Devi', relation: 'Spouse', age: 42, cardNo: 'AB-PB-001235' },
    ],
    coverageAmount: 500000,
    hospitals: [
        { name: 'Civil Hospital, Ludhiana', type: 'Government', distance: '2.3 km', specialities: ['General', 'Cardiology', 'Ortho'] },
        { name: 'DMCH, Ludhiana', type: 'Government', distance: '4.1 km', specialities: ['General', 'Surgery', 'Neuro'] },
        { name: 'SPS Hospital', type: 'Private (Empanelled)', distance: '5.8 km', specialities: ['Cardiology', 'Oncology'] },
        { name: 'Fortis Hospital', type: 'Private (Empanelled)', distance: '7.2 km', specialities: ['Multi-Speciality'] },
    ],
};

/** Jal Jeevan Mission */
export const jalJeevanData = {
    houseId: 'JJM-PB-LDH-00456',
    status: 'Completed',
    connectionDate: '2025-08-12',
    tapType: 'Functional Household Tap Connection (FHTC)',
    waterQuality: 'BIS Certified — Safe',
    village: 'Gill, Ludhiana',
    gram_panchayat: 'Gill Gram Panchayat',
    district: 'Ludhiana',
};

/** PM Awas Yojana */
export const pmAwasData = {
    applicationId: 'PMAY-PB-2025-12345',
    applicantName: 'Mohinder Singh',
    category: 'EWS (Economically Weaker Section)',
    sanctionedAmount: 250000,
    stages: [
        { stage: 'Application Submitted', date: '2025-03-15', status: 'completed' },
        { stage: 'Verification by ULB', date: '2025-04-20', status: 'completed' },
        { stage: 'Approved by SLSMC', date: '2025-06-10', status: 'completed' },
        { stage: '1st Installment Released', date: '2025-08-05', status: 'completed' },
        { stage: 'Foundation Laid', date: '2025-10-12', status: 'completed' },
        { stage: '2nd Installment Released', date: '2026-01-20', status: 'in_progress' },
        { stage: 'Construction Complete', date: null, status: 'pending' },
        { stage: 'Final Installment', date: null, status: 'pending' },
    ],
};

/** PM Ujjwala Yojana */
export const ujjwalaData = {
    eligibleCategories: ['BPL Families', 'SC/ST Households', 'Pradhan Mantri Awas Yojana beneficiaries', 'Antyodaya Anna Yojana', 'Forest Dwellers', 'Most Backward Classes'],
    benefits: ['Free LPG connection', '1st LPG refill free', 'Stove provided free', 'EMI option for deposit'],
    documentsRequired: ['Aadhaar Card', 'BPL Card / Ration Card', 'Bank Passbook', 'Passport Photo'],
};

/** Document Services — e-Hastakshar certificates */
export const certificateData = {
    income: {
        certNo: 'INC-PB-2026-00789',
        name: 'Rajesh Kumar', fatherName: 'Sh. Mohan Lal', address: 'H.No. 234, Sector 5, Ludhiana',
        annualIncome: 360000, sourceOfIncome: 'Agriculture + Private Employment',
        issuedDate: '2026-03-01', validTill: '2027-02-28',
        issuingAuthority: 'Tehsildar, Ludhiana', qrCode: 'QR-INC-PB-789',
    },
    residence: {
        certNo: 'RES-PB-2026-00456',
        name: 'Paramjit Singh', fatherName: 'Sh. Gurdev Singh', address: 'H.No. 567, Model Town, Ludhiana',
        residingSince: '1998', purpose: 'General',
        issuedDate: '2026-03-01', validTill: '2027-02-28',
        issuingAuthority: 'Tehsildar, Ludhiana', qrCode: 'QR-RES-PB-456',
    },
    caste: {
        certNo: 'CST-PB-2026-00123',
        name: 'Sunita Devi', fatherName: 'Sh. Ram Prakash', caste: 'Scheduled Caste', subCaste: 'Valmiki',
        address: 'H.No. 89, Civil Lines, Ludhiana',
        issuedDate: '2026-03-01', validTill: '2031-02-28',
        issuingAuthority: 'SDM, Ludhiana', qrCode: 'QR-CST-PB-123',
    },
    birth: {
        certNo: 'BTH-PB-2026-99001',
        name: 'Arjun Kumar', fatherName: 'Sh. Rajesh Kumar', motherName: 'Smt. Priya Kumar',
        dob: '2020-05-15', placeOfBirth: 'Civil Hospital, Ludhiana', gender: 'Male',
        registrationNo: 'LDH-2020-12345',
        issuedDate: '2020-06-01', issuingAuthority: 'Registrar, Municipal Corporation Ludhiana', qrCode: 'QR-BTH-PB-99001',
    },
    domicile: {
        certNo: 'DOM-PB-2026-00321',
        name: 'Rajesh Kumar', fatherName: 'Sh. Mohan Lal',
        address: 'H.No. 234, Sector 5, Ludhiana, Punjab',
        state: 'Punjab', residingSince: '1990', purpose: 'Government Job / Education',
        issuedDate: '2026-03-01', validTill: '2031-02-28',
        issuingAuthority: 'SDM, Ludhiana', qrCode: 'QR-DOM-PB-321',
    },
};

/** Gas Services — LPG providers */
export const gasProvidersData = {
    providers: [
        { name: 'HP Gas (HPCL)', icon: '🛢️', distributors: 412, color: '#0066CC' },
        { name: 'Indane (IOC)', icon: '🔵', distributors: 578, color: '#FF6600' },
        { name: 'Bharat Gas (BPCL)', icon: '🟢', distributors: 356, color: '#006633' },
    ],
    subsidyStatus: {
        linked: true, bankName: 'Punjab National Bank', lastFourDigits: '5678',
        lastSubsidy: { amount: 203.77, date: '2026-02-10', cylinderNo: 'HP-LDH-78901' },
    },
    bookingHistory: [
        { date: '2026-02-10', provider: 'HP Gas', cylinderNo: 'HP-LDH-78901', status: 'Delivered', subsidy: 203.77 },
        { date: '2025-12-05', provider: 'HP Gas', cylinderNo: 'HP-LDH-78900', status: 'Delivered', subsidy: 198.50 },
    ],
};

/** Electricity Services — Slab rates */
export const electricitySlabRates = [
    { range: '0–100 kWh', rate: 3.00, fixedCharge: 30 },
    { range: '101–300 kWh', rate: 4.50, fixedCharge: 50 },
    { range: '301–500 kWh', rate: 5.75, fixedCharge: 80 },
    { range: '501+ kWh', rate: 7.00, fixedCharge: 120 },
];

export const smartMeterData = {
    meterId: 'SM-LDH-00234', currentBalance: 850, lastRecharge: 500,
    lastRechargeDate: '2026-02-20', dailyAvgUsage: 6.2, estimatedDaysLeft: 137,
};

export const meterReadingHistory = [
    { month: 'Feb 2026', reading: 45678, units: 85, submitted: true, photo: null },
    { month: 'Jan 2026', reading: 45593, units: 92, submitted: true, photo: null },
    { month: 'Dec 2025', reading: 45501, units: 78, submitted: true, photo: null },
];

/** Municipal — Property tax exemptions */
export const propertyTaxExemptions = [
    { category: 'SC/ST', discount: 50, description: 'Scheduled Caste / Scheduled Tribe', docsRequired: ['Caste Certificate', 'Property Papers'] },
    { category: 'Senior Citizen (60+)', discount: 20, description: 'Age above 60 years', docsRequired: ['Age Proof', 'Property Papers'] },
    { category: 'Widow / Disabled', discount: 25, description: 'Widow or Person with Disability', docsRequired: ['Death/Disability Certificate', 'Property Papers'] },
];

/** FASTag */
export const fastagData = {
    vehicleNo: 'PB-10-AB-1234', tagId: 'FTAG-NPCI-00567890',
    balance: 1250, issuer: 'Paytm Payments Bank',
    rechargeHistory: [
        { date: '2026-02-25', amount: 500, mode: 'UPI', newBalance: 1250 },
        { date: '2026-01-15', amount: 1000, mode: 'Cash', newBalance: 1750 },
    ],
    tollHistory: [
        { date: '2026-02-28', toll: 'Jalandhar Bypass', amount: 125 },
        { date: '2026-02-20', toll: 'Panipat Toll Plaza', amount: 215 },
    ],
};

/** Generate a certificate number */
let certCounter = 100;
export function generateCertNo(type) {
    certCounter++;
    const prefix = { income: 'INC', residence: 'RES', caste: 'CST', birth: 'BTH' }[type] || 'DOC';
    return `${prefix}-PB-2026-${String(certCounter).padStart(5, '0')}`;
}

/** Generate FASTag Recharge TXN ID */
export function generateFastagTxnId() {
    return `FTAG-TXN-${Date.now().toString(36).toUpperCase()}`;
}

/** Pension Status */
export const pensionData = {
    name: 'Mohinder Kaur', scheme: 'Old Age Pension (NSAP - IGNOAPS)',
    ppoNumber: 'PPO-PB-LDH-00789', monthlyAmount: 3000,
    bankName: 'Punjab & Sind Bank', accountEnding: '4829', status: 'Active',
    payments: [
        { month: 'Feb 2026', amount: 3000, status: 'Credited' },
        { month: 'Jan 2026', amount: 3000, status: 'Credited' },
        { month: 'Dec 2025', amount: 3000, status: 'Credited' },
    ],
};

/** PDS Ration Card */
export const pdsData = {
    headOfFamily: 'Ramesh Kumar', cardType: 'PHH (Priority Household)',
    cardNumber: 'PB-RC-LDH-00345', members: 5, fpsShop: 'Fair Price Shop #12, Sector 5, Ludhiana',
    entitlement: [
        { item: 'Rice', quantity: '5 kg/person', rate: 3 },
        { item: 'Wheat', quantity: '5 kg/person', rate: 2 },
        { item: 'Sugar', quantity: '1 kg/family', rate: 13.50 },
    ],
    distribution: [
        { month: 'Feb 2026', collected: true },
        { month: 'Jan 2026', collected: true },
        { month: 'Dec 2025', collected: false },
    ],
};

/** Bhulekh — Land Records */
export const bhulekhData = {
    recordId: 'BLK-UP-2026-00456', ownerName: 'Rajesh Kumar', fatherName: 'Sh. Mohan Lal',
    khasraNo: '123/456', khataNo: '789', village: 'Gill', tehsil: 'Ludhiana',
    district: 'Ludhiana', state: 'Punjab', area: '2.5 Acres (10 Biswa)',
    landType: 'Agricultural (Irrigated)', lastMutation: '2024-05-20',
    encumbrances: 'None', qrCode: 'QR-BLK-UP-456',
};
