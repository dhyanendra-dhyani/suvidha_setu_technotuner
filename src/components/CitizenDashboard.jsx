/**
 * ═══════════════════════════════════════════════════════════
 * CitizenDashboard v5.0 — Enhanced with:
 *   - Payment History: Filter by Date + Download Receipt
 *   - Tracking: Vertical Timeline Animation
 *   - Parivaar Link: Aadhaar Input + SuccessModal
 * ═══════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../utils/i18n';
import SuccessModal from './SuccessModal';

// ── Mock Data ──────────────────────────────────────
const myBills = [
    { service: 'Electricity', icon: '⚡', id: 'PSEB-123456', amount: 1200, due: '2026-02-28', status: 'due', route: '/bill/electricity' },
    { service: 'Water', icon: '💧', id: 'PHED-789012', amount: 280, due: '2026-03-05', status: 'paid', route: '/bill/water' },
    { service: 'Gas', icon: '🔥', id: 'GPL-345678', amount: 620, due: '2026-03-10', status: 'due', route: '/bill/gas' },
];

const myComplaints = [
    { ticketId: 'COMP-2026-00909', category: 'Broken Streetlight', status: 'resolved', date: '2026-01-28', stages: ['Submitted', 'Assigned to Team', 'Work in Progress', 'Resolved'] },
    { ticketId: 'COMP-2026-00915', category: 'Water Supply', status: 'in-progress', date: '2026-02-10', stages: ['Submitted', 'Under Review', 'In Progress'] },
    { ticketId: 'ELEC-0008A2F', category: 'Voltage Fluctuation', status: 'in-progress', date: '2026-02-25', stages: ['Submitted', 'Assigned to Lineman'] },
    { ticketId: 'MUNI-0009B3E', category: 'Road Pothole', status: 'resolved', date: '2026-02-18', stages: ['Submitted', 'Site Inspection', 'Repair Completed', 'Resolved'] },
];

const myApplications = [
    { id: 'CONN-PB-2026-001', type: 'New Electricity Connection', status: 'in-progress', date: '2026-02-15', stage: 'Site Survey Scheduled', stages: ['Submitted', 'Documents Verified', 'Site Survey Scheduled'] },
    { id: 'INC-PB-2026-00789', type: 'Income Certificate', status: 'resolved', date: '2026-03-01', stage: 'Ready for Print', stages: ['Submitted', 'Under Verification', 'Approved', 'Ready for Print'] },
    { id: 'TAX-EX-54321', type: 'SC/ST Tax Exemption (50%)', status: 'in-progress', date: '2026-02-20', stage: 'Under Verification', stages: ['Submitted', 'Under Verification'] },
];

const paymentHistory = [
    { date: '2026-02-28', desc: 'Electricity Bill (PSEB-123456)', amount: 450, method: 'UPI', txnId: 'TXN-20260228-54321' },
    { date: '2026-02-20', desc: 'FASTag Recharge (PB-10-AB-1234)', amount: 500, method: 'Cash', txnId: 'FTAG-TXN-K8F4' },
    { date: '2026-02-15', desc: 'Water Bill (PHED-789012)', amount: 280, method: 'Card', txnId: 'TXN-20260215-67890' },
    { date: '2026-02-10', desc: 'LPG Cylinder Booking (HP Gas)', amount: 1103, method: 'UPI', txnId: 'LPG-HP-78901' },
    { date: '2026-02-01', desc: 'Property Tax (PROP-LDH-00123)', amount: 3500, method: 'Cash', txnId: 'TXN-20260201-11111' },
    { date: '2026-01-15', desc: 'Water Bill (PHED-789012)', amount: 240, method: 'UPI', txnId: 'TXN-20260115-22222' },
    { date: '2026-01-05', desc: 'Electricity Bill (PSEB-123456)', amount: 520, method: 'Card', txnId: 'TXN-20260105-33333' },
];

const familyMembers = [
    { name: 'Sita Devi', relation: 'Spouse', aadhaar: '****-****-5679', authorized: true },
    { name: 'Arjun Kumar', relation: 'Son', aadhaar: '****-****-5680', authorized: false },
];

const availableServices = [
    // ── Guest Services (inherited) ──
    { label: 'Electricity Bill', labelHi: 'बिजली बिल', icon: '⚡', route: '/bill/electricity', type: 'guest' },
    { label: 'Water Bill', labelHi: 'पानी बिल', icon: '💧', route: '/bill/water', type: 'guest' },
    { label: 'Property Tax', labelHi: 'प्रॉपर्टी टैक्स', icon: '🏠', route: '/bill/property-tax', type: 'guest' },
    { label: 'Cylinder Booking', labelHi: 'सिलेंडर बुकिंग', icon: '🛢️', route: '/gas-services', type: 'guest' },
    { label: 'LPG Subsidy', labelHi: 'LPG सब्सिडी', icon: '💰', route: '/gas-services', type: 'guest' },
    { label: 'File Complaint', labelHi: 'शिकायत', icon: '📝', route: '/complaint', type: 'guest' },
    // ── Citizen-Exclusive ──
    { label: 'New Connection', labelHi: 'नया कनेक्शन', icon: '🔌', route: '/new-connection', type: 'citizen' },
    { label: 'Wrong Bill Dispute', labelHi: 'गलत बिल विवाद', icon: '📝', route: '/electricity-services', type: 'citizen' },
    { label: 'Tax Exemption', labelHi: 'टैक्स छूट', icon: '📋', route: '/municipal', type: 'citizen' },
    { label: 'Birth/Death Cert', labelHi: 'जन्म/मृत्यु प्रमाण', icon: '📜', route: '/documents', type: 'citizen' },
    { label: 'New Gas Connection', labelHi: 'नया गैस कनेक्शन', icon: '🔧', route: '/gas-services', type: 'citizen' },
    { label: 'Name Change', labelHi: 'नाम बदलना', icon: '✏️', route: '/name-change', type: 'citizen' },
];

const statusColors = {
    'due': { bg: 'rgba(239,68,68,0.15)', text: '#F87171', label: 'Due' },
    'paid': { bg: 'rgba(16,185,129,0.15)', text: '#34D399', label: 'Paid' },
    'resolved': { bg: 'rgba(16,185,129,0.15)', text: '#34D399', label: 'Resolved' },
    'in-progress': { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24', label: 'In Progress' },
};

// Timeline step component
function TimelineStep({ label, isCompleted, isActive, index, total }) {
    const dotColor = isCompleted ? '#10B981' : isActive ? '#FBBF24' : 'rgba(255,255,255,0.15)';
    const lineColor = isCompleted ? '#10B981' : 'rgba(255,255,255,0.08)';

    return (
        <div className="flex gap-3" style={{ minHeight: index < total - 1 ? '48px' : 'auto' }}>
            <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 timeline-dot"
                    style={{
                        background: dotColor,
                        borderColor: isCompleted ? '#10B981' : isActive ? '#FBBF24' : 'rgba(255,255,255,0.2)',
                        animationDelay: `${index * 0.15}s`,
                    }} />
                {index < total - 1 && (
                    <div className="w-0.5 flex-1 mt-1 rounded-full"
                        style={{ background: lineColor, minHeight: '24px' }} />
                )}
            </div>
            <div className="pb-3">
                <p className={`text-sm font-semibold ${isCompleted ? 'text-green-400' : isActive ? 'text-amber-400' : 'text-white/30'}`}>
                    {label}
                </p>
                {isActive && <p className="text-white/30 text-xs mt-0.5">Current stage</p>}
                {isCompleted && index === total - 1 && <p className="text-green-400/60 text-xs mt-0.5">✓ Complete</p>}
            </div>
        </div>
    );
}

export default function CitizenDashboard({ lang, citizen, onLogout, isOnline, pendingIntent, clearPendingIntent }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bills');
    const [showNaamChangeNotice, setShowNaamChangeNotice] = useState(pendingIntent === 'naam_change');
    const [authorizingMember, setAuthorizingMember] = useState(null);

    // Payment history filter
    const [dateFilter, setDateFilter] = useState('all');

    // Tracking – expanded timeline
    const [expandedTicket, setExpandedTicket] = useState(null);

    // Parivaar – add member
    const [showAddMember, setShowAddMember] = useState(false);
    const [newMemberName, setNewMemberName] = useState('');
    const [newMemberAadhaar, setNewMemberAadhaar] = useState('');
    const [newMemberRelation, setNewMemberRelation] = useState('');
    const [successModal, setSuccessModal] = useState(null);
    const [addedMembers, setAddedMembers] = useState([]);

    const initials = citizen?.name?.split(' ').map(w => w[0]).join('') || 'VK';

    const TABS = [
        { key: 'bills', icon: '💰', label: lang === 'hi' ? 'मेरे बिल' : 'My Bills' },
        { key: 'payments', icon: '📊', label: lang === 'hi' ? 'भुगतान इतिहास' : 'Payment History' },
        { key: 'tracking', icon: '📋', label: lang === 'hi' ? 'ट्रैकिंग' : 'Tracking' },
        { key: 'parivaar', icon: '👨‍👩‍👧‍👦', label: lang === 'hi' ? 'परिवार लिंक' : 'Parivaar Link' },
        { key: 'services', icon: '🏛️', label: lang === 'hi' ? 'सेवाएँ' : 'Services' },
    ];

    // Filter payments by date
    const filteredPayments = dateFilter === 'all'
        ? paymentHistory
        : paymentHistory.filter(p => {
            const d = new Date(p.date);
            const now = new Date();
            if (dateFilter === '7d') return (now - d) / (1000 * 60 * 60 * 24) <= 7;
            if (dateFilter === '30d') return (now - d) / (1000 * 60 * 60 * 24) <= 30;
            if (dateFilter === '90d') return (now - d) / (1000 * 60 * 60 * 24) <= 90;
            return true;
        });

    // Add family member
    const handleAddMember = () => {
        const auditTimestamp = new Date().toLocaleString('en-IN');
        setAddedMembers(prev => [...prev, {
            name: newMemberName,
            relation: newMemberRelation,
            aadhaar: `****-****-${newMemberAadhaar.slice(-4)}`,
            authorized: true,
            addedAt: auditTimestamp,
        }]);
        setSuccessModal({
            title: 'Linked Successfully',
            refLabel: 'Audit Trail',
            refId: `FAM-${Date.now().toString(36).toUpperCase()}`,
            subtitle: `${newMemberName} has been linked to your family account`,
            details: [
                { label: 'Member', value: newMemberName },
                { label: 'Relation', value: newMemberRelation },
                { label: 'Aadhaar', value: `****-****-${newMemberAadhaar.slice(-4)}` },
                { label: 'Timestamp', value: auditTimestamp },
            ],
            showPrint: false, showSMS: false,
        });
        setShowAddMember(false);
        setNewMemberName('');
        setNewMemberAadhaar('');
        setNewMemberRelation('');
    };

    const allFamily = [...familyMembers, ...addedMembers];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 fast-fade-in">
            {/* ── Welcome Header ──────────────────────── */}
            <div className="glass-card rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4 fast-slide-left">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full gradient-citizen flex items-center justify-center text-white text-2xl font-black shadow-lg">
                        {initials}
                    </div>
                    <div>
                        <p className="text-white/60 text-sm">
                            {lang === 'hi' ? 'स्वागत है,' : lang === 'pa' ? 'ਜੀ ਆਇਆਂ ਨੂੰ,' : 'Welcome,'}
                        </p>
                        <h2 className="text-2xl font-bold text-white">{citizen?.name || 'Vivek Kumar'}</h2>
                        <p className="text-white/60 text-xs font-mono">{citizen?.aadhaar || 'XXXX-XXXX-4829'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onLogout}
                        className="px-4 py-2.5 bg-red-500/15 text-red-400 rounded-xl font-bold hover:bg-red-500/25 transition cursor-pointer border border-red-500/20 text-sm a11y-touch"
                        aria-label={lang === 'hi' ? 'लॉग आउट' : 'Log out of your account'}>
                        {t(lang, 'logout')}
                    </button>
                </div>
            </div>

            {/* ── Pending Intent Notice ──────────────────────── */}
            {showNaamChangeNotice && (
                <div className="glass-card rounded-2xl p-4 mb-6 bg-blue-500/10 border border-blue-500/30 flex items-start justify-between gap-4 fast-slide-left">
                    <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl mt-0.5">✏️</span>
                        <div>
                            <p className="text-blue-300 font-bold">{lang === 'hi' ? 'नाम बदलना' : 'Name Change'}</p>
                            <p className="text-white/70 text-sm">
                                {lang === 'hi' ? 'आप अपना नाम बदलना चाहते हैं। नीचे "Name Change" विकल्प पर क्लिक करें।' : 'You requested to change your name. Click "Name Change" below.'}
                            </p>
                        </div>
                    </div>
                    <button onClick={() => setShowNaamChangeNotice(false)} className="text-white/50 hover:text-white text-xl">✕</button>
                </div>
            )}

            {/* ── Tab Navigation (WCAG tablist pattern) ────────── */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1" role="tablist" aria-label={lang === 'hi' ? 'डैशबोर्ड सेक्शन' : 'Dashboard sections'}>
                {TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        role="tab"
                        id={`tab-${tab.key}`}
                        aria-selected={activeTab === tab.key}
                        aria-controls={`tabpanel-${tab.key}`}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer border transition-all whitespace-nowrap a11y-touch ${activeTab === tab.key
                            ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                            : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/8 hover:text-white/70'
                            }`}>
                        <span aria-hidden="true">{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Content Area ────────────────────────── */}
            <div className="min-h-[300px]">

                {/* Bills Tab */}
                {activeTab === 'bills' && (
                    <div className="space-y-3 fast-fade-in" role="tabpanel" id="tabpanel-bills" aria-labelledby="tab-bills">
                        {myBills.map((bill, i) => {
                            const sc = statusColors[bill.status];
                            return (
                                <button key={bill.id} onClick={() => navigate(bill.route)}
                                    className="w-full glass-card rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer border border-transparent hover:border-indigo-500/20 text-left hover:scale-[1.01] transition-transform fast-scale-in"
                                    style={{ animationDelay: `${i * 0.05}s` }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl" aria-hidden="true">{bill.icon}</div>
                                        <div>
                                            <p className="text-white font-bold">{bill.service}</p>
                                            <p className="text-white/60 text-xs font-mono">{bill.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div>
                                            <p className="text-white font-black text-xl">₹{bill.amount.toLocaleString()}</p>
                                            <p className="text-white/60 text-xs">Due: {bill.due}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Payment History Tab — with Filter & Download */}
                {activeTab === 'payments' && (
                    <div className="space-y-3 fast-fade-in" role="tabpanel" id="tabpanel-payments" aria-labelledby="tab-payments">
                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                                <h3 className="text-white font-bold text-lg">📊 {lang === 'hi' ? 'भुगतान इतिहास' : 'Payment & Transaction History'}</h3>
                                {/* Date Filter */}
                                <div className="flex gap-2">
                                    {[
                                        { key: 'all', label: 'All' },
                                        { key: '7d', label: '7 Days' },
                                        { key: '30d', label: '30 Days' },
                                        { key: '90d', label: '90 Days' },
                                    ].map(f => (
                                        <button key={f.key} onClick={() => setDateFilter(f.key)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer border transition-all ${dateFilter === f.key
                                                ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                                                : 'bg-white/5 border-white/10 text-white/40 hover:text-white/60'
                                                }`}>
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p className="text-white/30 text-xs mb-3">{filteredPayments.length} transactions</p>
                            {filteredPayments.map((p, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 fast-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-medium text-sm">{p.desc}</p>
                                        <p className="text-white/30 text-xs">{p.date} · {p.method} · <span className="font-mono">{p.txnId}</span></p>
                                    </div>
                                    <div className="flex items-center gap-3 ml-3">
                                        <span className="text-green-400 font-bold">₹{p.amount.toLocaleString()}</span>
                                        <button
                                            onClick={() => alert(`📥 Downloading receipt for ${p.txnId}`)}
                                            className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white text-xs cursor-pointer transition-all"
                                            title="Download Receipt">
                                            📥
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tracking Tab — Grievances + Applications with Timeline */}
                {activeTab === 'tracking' && (
                    <div className="space-y-4 fast-fade-in">
                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-white font-bold text-lg mb-3">📋 {lang === 'hi' ? 'शिकायत ट्रैकिंग' : 'Grievance Tracking'}</h3>
                            {myComplaints.map((comp, i) => {
                                const sc = statusColors[comp.status];
                                const isExpanded = expandedTicket === comp.ticketId;
                                return (
                                    <div key={comp.ticketId} className="border-b border-white/5 last:border-0">
                                        <button onClick={() => setExpandedTicket(isExpanded ? null : comp.ticketId)}
                                            className="w-full flex items-center justify-between py-3 cursor-pointer bg-transparent border-0 text-left fast-scale-in"
                                            style={{ animationDelay: `${i * 0.05}s` }}>
                                            <div>
                                                <p className="text-white font-medium text-sm">{comp.category}</p>
                                                <p className="text-white/30 text-xs font-mono">{comp.ticketId} · {comp.date}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                                                <span className="text-white/20 text-sm">{isExpanded ? '▲' : '▼'}</span>
                                            </div>
                                        </button>
                                        {isExpanded && (
                                            <div className="pl-4 pb-4 fast-fade-in">
                                                {comp.stages.map((stage, si) => (
                                                    <TimelineStep
                                                        key={si}
                                                        label={stage}
                                                        isCompleted={si < comp.stages.length - 1 || comp.status === 'resolved'}
                                                        isActive={si === comp.stages.length - 1 && comp.status !== 'resolved'}
                                                        index={si}
                                                        total={comp.stages.length}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                            <button onClick={() => navigate('/complaint')}
                                className="w-full mt-3 py-3 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 font-semibold cursor-pointer bg-transparent text-sm transition-all">
                                + {lang === 'hi' ? 'नई शिकायत दर्ज करें' : 'File New Complaint'}
                            </button>
                        </div>

                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-white font-bold text-lg mb-3">📑 {lang === 'hi' ? 'आवेदन ट्रैकिंग' : 'Application Tracking'}</h3>
                            {myApplications.map((app, i) => {
                                const sc = statusColors[app.status];
                                const isExpanded = expandedTicket === app.id;
                                return (
                                    <div key={app.id} className="border-b border-white/5 last:border-0">
                                        <button onClick={() => setExpandedTicket(isExpanded ? null : app.id)}
                                            className="w-full flex items-center justify-between py-3 cursor-pointer bg-transparent border-0 text-left fast-scale-in"
                                            style={{ animationDelay: `${i * 0.05}s` }}>
                                            <div>
                                                <p className="text-white font-medium text-sm">{app.type}</p>
                                                <p className="text-white/30 text-xs font-mono">{app.id} · {app.date}</p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                                                <span className="text-white/20 text-sm">{isExpanded ? '▲' : '▼'}</span>
                                            </div>
                                        </button>
                                        {isExpanded && (
                                            <div className="pl-4 pb-4 fast-fade-in">
                                                {app.stages.map((stage, si) => (
                                                    <TimelineStep
                                                        key={si}
                                                        label={stage}
                                                        isCompleted={si < app.stages.length - 1 || app.status === 'resolved'}
                                                        isActive={si === app.stages.length - 1 && app.status !== 'resolved'}
                                                        index={si}
                                                        total={app.stages.length}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Parivaar Link Tab — with Aadhaar Input */}
                {activeTab === 'parivaar' && (
                    <div className="space-y-4 fast-fade-in">
                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-white font-bold text-lg mb-2">👨‍👩‍👧‍👦 {lang === 'hi' ? 'परिवार लिंक' : 'Parivaar Link — Family Authorization'}</h3>
                            <p className="text-white/40 text-sm mb-4">
                                {lang === 'hi' ? 'अपने परिवार के सदस्यों को अपनी ओर से बिल भुगतान और सेवाओं का उपयोग करने के लिए अधिकृत करें।' : 'Authorize family members to pay bills and use services on your behalf.'}
                            </p>
                            {allFamily.map((m, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                                            {m.name.split(' ').map(w => w[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{m.name} <span className="text-white/30 text-xs">({m.relation})</span></p>
                                            <p className="text-white/20 text-xs font-mono">{m.aadhaar}</p>
                                            {m.addedAt && <p className="text-white/15 text-xs">Added: {m.addedAt}</p>}
                                        </div>
                                    </div>
                                    {m.authorized ? (
                                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-500/15 text-green-400 border border-green-500/20">✅ Authorized</span>
                                    ) : (
                                        <button onClick={() => setAuthorizingMember(m.name)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${authorizingMember === m.name ? 'bg-green-500/15 text-green-400 border border-green-500/20' : 'bg-amber-500/15 text-amber-400 border border-amber-500/20 hover:bg-amber-500/25'}`}>
                                            {authorizingMember === m.name ? '✅ Authorized!' : '🔗 Authorize'}
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Add Family Member Form */}
                            {!showAddMember ? (
                                <button onClick={() => setShowAddMember(true)}
                                    className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 font-semibold cursor-pointer bg-transparent text-sm transition-all">
                                    + {lang === 'hi' ? 'परिवार सदस्य जोड़ें' : 'Add Family Member'}
                                </button>
                            ) : (
                                <div className="mt-4 bg-white/5 border border-white/10 rounded-2xl p-5 fast-fade-in">
                                    <p className="text-white font-bold text-sm mb-3">Add New Family Member</p>
                                    <label className="text-white/50 text-xs mb-1 block">Full Name</label>
                                    <input value={newMemberName} onChange={e => setNewMemberName(e.target.value)}
                                        placeholder="e.g. Priya Kumar"
                                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 mb-3 text-sm" />
                                    <label className="text-white/50 text-xs mb-1 block">Aadhaar Number</label>
                                    <input value={newMemberAadhaar} onChange={e => setNewMemberAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                        placeholder="12-digit Aadhaar number"
                                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 mb-3 text-sm font-mono" />
                                    <label className="text-white/50 text-xs mb-1 block">Relation</label>
                                    <select value={newMemberRelation} onChange={e => setNewMemberRelation(e.target.value)}
                                        className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500/50 mb-3 text-sm cursor-pointer">
                                        <option value="" className="bg-gray-900">Select relation</option>
                                        <option value="Spouse" className="bg-gray-900">Spouse</option>
                                        <option value="Son" className="bg-gray-900">Son</option>
                                        <option value="Daughter" className="bg-gray-900">Daughter</option>
                                        <option value="Father" className="bg-gray-900">Father</option>
                                        <option value="Mother" className="bg-gray-900">Mother</option>
                                        <option value="Sibling" className="bg-gray-900">Sibling</option>
                                        <option value="Other" className="bg-gray-900">Other</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <button onClick={handleAddMember}
                                            disabled={!newMemberName || newMemberAadhaar.length < 12 || !newMemberRelation}
                                            className="flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold disabled:opacity-30 cursor-pointer border-0 transition-all text-sm">
                                            ✅ Link Member
                                        </button>
                                        <button onClick={() => setShowAddMember(false)}
                                            className="py-3 px-4 rounded-xl bg-white/5 border border-white/10 text-white/60 hover:text-white cursor-pointer transition-all text-sm">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 fast-fade-in">
                        {availableServices.map((svc, i) => (
                            <button key={svc.label}
                                onClick={() => {
                                    if (svc.label.includes('Name') || svc.label.includes('नाम')) clearPendingIntent?.();
                                    navigate(svc.route);
                                }}
                                className="glass-card rounded-2xl p-5 flex flex-col items-center gap-3 cursor-pointer border border-transparent hover:border-indigo-500/20 hover:scale-[1.02] transition-transform fast-scale-in"
                                style={{ animationDelay: `${i * 0.05}s` }}>
                                <span className="text-3xl">{svc.icon}</span>
                                <span className="text-white/80 font-semibold text-sm text-center">{lang === 'hi' ? svc.labelHi : svc.label}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Success Modal for Parivaar */}
            {successModal && (
                <SuccessModal
                    {...successModal}
                    onClose={() => setSuccessModal(null)}
                />
            )}
        </div>
    );
}
