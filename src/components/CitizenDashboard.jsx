/**
 * ═══════════════════════════════════════════════════════════
 * CitizenDashboard v4.0 — Enhanced with Payment History,
 * Grievance Tracking, and Parivaar Link
 * ═══════════════════════════════════════════════════════════
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../utils/i18n';

// ── Mock Data ──────────────────────────────────────
const myBills = [
    { service: 'Electricity', icon: '⚡', id: 'PSEB-123456', amount: 1200, due: '2026-02-28', status: 'due', route: '/bill/electricity' },
    { service: 'Water', icon: '💧', id: 'PHED-789012', amount: 280, due: '2026-03-05', status: 'paid', route: '/bill/water' },
    { service: 'Gas', icon: '🔥', id: 'GPL-345678', amount: 620, due: '2026-03-10', status: 'due', route: '/bill/gas' },
];

const myComplaints = [
    { ticketId: 'COMP-2026-00909', category: 'Broken Streetlight', status: 'resolved', date: '2026-01-28' },
    { ticketId: 'COMP-2026-00915', category: 'Water Supply', status: 'in-progress', date: '2026-02-10' },
    { ticketId: 'ELEC-0008A2F', category: 'Voltage Fluctuation', status: 'in-progress', date: '2026-02-25' },
    { ticketId: 'MUNI-0009B3E', category: 'Road Pothole', status: 'resolved', date: '2026-02-18' },
];

const myApplications = [
    { id: 'CONN-PB-2026-001', type: 'New Electricity Connection', status: 'in-progress', date: '2026-02-15', stage: 'Site Survey Scheduled' },
    { id: 'INC-PB-2026-00789', type: 'Income Certificate', status: 'resolved', date: '2026-03-01', stage: 'Ready for Print' },
    { id: 'TAX-EX-54321', type: 'SC/ST Tax Exemption (50%)', status: 'in-progress', date: '2026-02-20', stage: 'Under Verification' },
];

const paymentHistory = [
    { date: '2026-02-28', desc: 'Electricity Bill (PSEB-123456)', amount: 450, method: 'UPI', txnId: 'TXN-20260228-54321' },
    { date: '2026-02-20', desc: 'FASTag Recharge (PB-10-AB-1234)', amount: 500, method: 'Cash', txnId: 'FTAG-TXN-K8F4' },
    { date: '2026-02-15', desc: 'Water Bill (PHED-789012)', amount: 280, method: 'Card', txnId: 'TXN-20260215-67890' },
    { date: '2026-02-10', desc: 'LPG Cylinder Booking (HP Gas)', amount: 1103, method: 'UPI', txnId: 'LPG-HP-78901' },
    { date: '2026-02-01', desc: 'Property Tax (PROP-LDH-00123)', amount: 3500, method: 'Cash', txnId: 'TXN-20260201-11111' },
];

const familyMembers = [
    { name: 'Sita Devi', relation: 'Spouse', aadhaar: '****-****-5679', authorized: true },
    { name: 'Arjun Kumar', relation: 'Son', aadhaar: '****-****-5680', authorized: false },
];

const availableServices = [
    { label: 'Apply New Connection', labelHi: 'नया कनेक्शन', icon: '🆕', route: '/new-connection' },
    { label: 'Name Change', labelHi: 'नाम बदलना', icon: '✏️', route: '/name-change' },
    { label: 'Print Certificate', labelHi: 'प्रमाण पत्र', icon: '🖨️', route: '/documents' },
    { label: 'Report Issue', labelHi: 'शिकायत', icon: '📝', route: '/complaint' },
    { label: 'Land Records', labelHi: 'भूलेख', icon: '🗺️', route: '/bhulekh' },
    { label: 'Tax Exemption', labelHi: 'टैक्स छूट', icon: '📋', route: '/municipal' },
    { label: 'PM Schemes', labelHi: 'PM योजनाएं', icon: '🏛️', route: '/schemes' },
    { label: 'FASTag', labelHi: 'FASTag', icon: '🚗', route: '/fastag' },
];

const statusColors = {
    'due': { bg: 'rgba(239,68,68,0.15)', text: '#F87171', label: 'Due' },
    'paid': { bg: 'rgba(16,185,129,0.15)', text: '#34D399', label: 'Paid' },
    'resolved': { bg: 'rgba(16,185,129,0.15)', text: '#34D399', label: 'Resolved' },
    'in-progress': { bg: 'rgba(245,158,11,0.15)', text: '#FBBF24', label: 'In Progress' },
};

export default function CitizenDashboard({ lang, citizen, onLogout, isOnline, pendingIntent, clearPendingIntent }) {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('bills');
    const [showNaamChangeNotice, setShowNaamChangeNotice] = useState(pendingIntent === 'naam_change');
    const [authorizingMember, setAuthorizingMember] = useState(null);

    const initials = citizen?.name?.split(' ').map(w => w[0]).join('') || 'VK';

    const TABS = [
        { key: 'bills', icon: '💰', label: lang === 'hi' ? 'मेरे बिल' : 'My Bills' },
        { key: 'payments', icon: '📊', label: lang === 'hi' ? 'भुगतान इतिहास' : 'Payment History' },
        { key: 'tracking', icon: '📋', label: lang === 'hi' ? 'ट्रैकिंग' : 'Tracking' },
        { key: 'parivaar', icon: '👨‍👩‍👧‍👦', label: lang === 'hi' ? 'परिवार लिंक' : 'Parivaar Link' },
        { key: 'services', icon: '🏛️', label: lang === 'hi' ? 'सेवाएँ' : 'Services' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 py-6 fast-fade-in">
            {/* ── Welcome Header ──────────────────────── */}
            <div className="glass-card rounded-2xl p-6 mb-6 flex flex-wrap items-center justify-between gap-4 fast-slide-left">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full gradient-citizen flex items-center justify-center text-white text-2xl font-black shadow-lg">
                        {initials}
                    </div>
                    <div>
                        <p className="text-white/50 text-sm">
                            {lang === 'hi' ? 'स्वागत है,' : lang === 'pa' ? 'ਜੀ ਆਇਆਂ ਨੂੰ,' : 'Welcome,'}
                        </p>
                        <h2 className="text-2xl font-bold text-white">{citizen?.name || 'Vivek Kumar'}</h2>
                        <p className="text-white/30 text-xs font-mono">{citizen?.aadhaar || 'XXXX-XXXX-4829'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onLogout}
                        className="px-4 py-2.5 bg-red-500/15 text-red-400 rounded-xl font-bold hover:bg-red-500/25 transition cursor-pointer border border-red-500/20 text-sm">
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

            {/* ── Tab Navigation ──────────────────────── */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                {TABS.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm cursor-pointer border transition-all whitespace-nowrap ${activeTab === tab.key
                            ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
                            : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/8 hover:text-white/70'
                            }`}>
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Content Area ────────────────────────── */}
            <div className="min-h-[300px]">

                {/* Bills Tab */}
                {activeTab === 'bills' && (
                    <div className="space-y-3 fast-fade-in">
                        {myBills.map((bill, i) => {
                            const sc = statusColors[bill.status];
                            return (
                                <button key={bill.id} onClick={() => navigate(bill.route)}
                                    className="w-full glass-card rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer border border-transparent hover:border-indigo-500/20 text-left hover:scale-[1.01] transition-transform fast-scale-in"
                                    style={{ animationDelay: `${i * 0.05}s` }}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl">{bill.icon}</div>
                                        <div>
                                            <p className="text-white font-bold">{bill.service}</p>
                                            <p className="text-white/30 text-xs font-mono">{bill.id}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex items-center gap-4">
                                        <div>
                                            <p className="text-white font-black text-xl">₹{bill.amount.toLocaleString()}</p>
                                            <p className="text-white/30 text-xs">Due: {bill.due}</p>
                                        </div>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Payment History Tab */}
                {activeTab === 'payments' && (
                    <div className="space-y-3 fast-fade-in">
                        <div className="glass-card rounded-2xl p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-white font-bold text-lg">📊 {lang === 'hi' ? 'भुगतान इतिहास' : 'Payment & Transaction History'}</h3>
                                <span className="text-white/30 text-xs">{paymentHistory.length} transactions</span>
                            </div>
                            {paymentHistory.map((p, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 fast-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                    <div>
                                        <p className="text-white font-medium text-sm">{p.desc}</p>
                                        <p className="text-white/30 text-xs">{p.date} · {p.method} · <span className="font-mono">{p.txnId}</span></p>
                                    </div>
                                    <span className="text-green-400 font-bold">₹{p.amount.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tracking Tab — Grievances + Applications */}
                {activeTab === 'tracking' && (
                    <div className="space-y-4 fast-fade-in">
                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-white font-bold text-lg mb-3">📋 {lang === 'hi' ? 'शिकायत ट्रैकिंग' : 'Grievance Tracking'}</h3>
                            {myComplaints.map((comp, i) => {
                                const sc = statusColors[comp.status];
                                return (
                                    <div key={comp.ticketId} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 fast-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div>
                                            <p className="text-white font-medium text-sm">{comp.category}</p>
                                            <p className="text-white/30 text-xs font-mono">{comp.ticketId} · {comp.date}</p>
                                        </div>
                                        <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
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
                                return (
                                    <div key={app.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0 fast-scale-in" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div>
                                            <p className="text-white font-medium text-sm">{app.type}</p>
                                            <p className="text-white/30 text-xs font-mono">{app.id} · {app.date}</p>
                                            <p className="text-amber-400/60 text-xs mt-0.5">{app.stage}</p>
                                        </div>
                                        <span className="px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: sc.bg, color: sc.text }}>{sc.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Parivaar Link Tab */}
                {activeTab === 'parivaar' && (
                    <div className="space-y-4 fast-fade-in">
                        <div className="glass-card rounded-2xl p-5">
                            <h3 className="text-white font-bold text-lg mb-2">👨‍👩‍👧‍👦 {lang === 'hi' ? 'परिवार लिंक' : 'Parivaar Link — Family Authorization'}</h3>
                            <p className="text-white/40 text-sm mb-4">
                                {lang === 'hi' ? 'अपने परिवार के सदस्यों को अपनी ओर से बिल भुगतान और सेवाओं का उपयोग करने के लिए अधिकृत करें।' : 'Authorize family members to pay bills and use services on your behalf.'}
                            </p>
                            {familyMembers.map((m, i) => (
                                <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                                            {m.name.split(' ').map(w => w[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm">{m.name} <span className="text-white/30 text-xs">({m.relation})</span></p>
                                            <p className="text-white/20 text-xs font-mono">{m.aadhaar}</p>
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
                            <button className="w-full mt-4 py-3 rounded-xl border-2 border-dashed border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 font-semibold cursor-pointer bg-transparent text-sm transition-all">
                                + {lang === 'hi' ? 'परिवार सदस्य जोड़ें' : 'Add Family Member'}
                            </button>
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
        </div>
    );
}
