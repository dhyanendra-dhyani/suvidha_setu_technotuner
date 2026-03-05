/**
 * ═══════════════════════════════════════════════════════════
 * MunicipalServices — Nagar Palika / PHED Hub v2.0
 * Property Tax, Civic Grievance, Tax Exemption via DigiLocker
 * Now with SuccessModal, DigiLockerFetch, and issue selection
 * ═══════════════════════════════════════════════════════════
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyTaxExemptions } from '../utils/mockData';
import SuccessModal from './SuccessModal';
import DigiLockerFetch from './DigiLockerFetch';

const ALL_SERVICES = [
    { key: 'property-tax', label: 'Property Tax Payment', icon: '🏠', desc: 'Pay by Property ID via BBPS', route: '/bill/property-tax', mode: 'guest' },
    { key: 'civic-grievance', label: 'Civic Grievance', icon: '🏗️', desc: 'Road, Garbage, Streetlight issues', mode: 'citizen' },
    { key: 'water-bill', label: 'Water Bill Payment', icon: '💧', desc: 'PHED Consumer Number', route: '/bill/water', mode: 'guest' },
    { key: 'tax-exemption', label: 'Tax Exemption Application', icon: '📋', desc: 'Apply via DigiLocker / e-Pramaan', mode: 'citizen' },
    { key: 'fastag', label: 'FASTag Recharge', icon: '🚗', desc: 'BBPS toll recharge', route: '/fastag', mode: 'citizen' },
    { key: 'birth-cert', label: 'Birth Certificate Reprint', icon: '👶', desc: 'Municipal records', route: '/documents/birth', mode: 'citizen' },
];

const CIVIC_CATEGORIES = [
    { key: 'road', label: 'Road / Pothole', icon: '🛣️', desc: 'Damaged road, pothole, broken pavement' },
    { key: 'garbage', label: 'Garbage / Sanitation', icon: '🗑️', desc: 'Missed pickup, open dumping' },
    { key: 'streetlight', label: 'Streetlight Fault', icon: '💡', desc: 'Non-working street lamp' },
    { key: 'sewerage', label: 'Sewerage / Drain', icon: '🚽', desc: 'Blocked drain, overflow' },
    { key: 'other', label: 'Other Civic Issue', icon: '📝', desc: 'Any other municipal problem' },
];

// Mock pre-filled data from DigiLocker
const MOCK_PREFILLED = {
    name: 'Vivek Kumar',
    aadhaar: 'XXXX-XXXX-4829',
    propertyId: 'PROP-LDH-00123',
    address: 'Block-C, Sector 42, Ludhiana, Punjab - 141001',
    mobile: '98765-43210',
};

export default function MunicipalServices({ lang, isCitizen = false }) {
    const SERVICES = isCitizen ? ALL_SERVICES : ALL_SERVICES.filter(s => s.mode === 'guest');
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(null);
    const [successModal, setSuccessModal] = useState(null);

    // Civic grievance
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [grievanceLocation, setGrievanceLocation] = useState('');
    const [grievanceDesc, setGrievanceDesc] = useState('');

    // Tax exemption via DigiLocker
    const [selectedExemption, setSelectedExemption] = useState(null);
    const [showDigiLocker, setShowDigiLocker] = useState(false);
    const [digiComplete, setDigiComplete] = useState(false);

    const genId = useCallback((prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`, []);

    const handleClick = (svc) => {
        if (svc.route) { navigate(svc.route); return; }
        setActiveService(svc.key);
        setSuccessModal(null); setSelectedCategory(null);
        setGrievanceLocation(''); setGrievanceDesc('');
        setSelectedExemption(null); setShowDigiLocker(false); setDigiComplete(false);
    };

    // Submit civic grievance
    const handleGrievanceSubmit = () => {
        setSuccessModal({
            title: 'Ticket Issued',
            refLabel: 'Tracking Number',
            refId: genId('MUNI'),
            subtitle: '48-hour resolution tracking enabled. SMS updates on registered mobile.',
            details: [
                { label: 'Category', value: selectedCategory?.label },
                { label: 'Location', value: grievanceLocation || 'Not specified' },
                { label: 'Date', value: new Date().toLocaleDateString('en-IN') },
            ],
            showPrint: true, showSMS: true,
        });
    };

    // Submit tax exemption
    const handleExemptionSubmit = () => {
        setSuccessModal({
            title: 'Application Filed',
            refLabel: 'Application ID',
            refId: genId('TAX-EX'),
            subtitle: 'Verification in progress. Expected 7–10 working days.',
            details: [
                { label: 'Exemption', value: selectedExemption },
                { label: 'Property ID', value: MOCK_PREFILLED.propertyId },
                { label: 'Documents', value: 'Verified via DigiLocker' },
                { label: 'Date', value: new Date().toLocaleDateString('en-IN') },
            ],
            showPrint: true, showSMS: true,
        });
    };

    // ── SERVICE LIST ──
    if (!activeService) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                        <div>
                            <h2 className="text-2xl font-black text-white">🏢 Municipal Services</h2>
                            <p className="text-white/40 text-sm">Nagar Palika — PHED — Municipal Corp.</p>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        {SERVICES.map(s => (
                            <button key={s.key} onClick={() => handleClick(s)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-purple-500/30 hover:bg-white/8 transition-all cursor-pointer text-left">
                                <span className="text-3xl">{s.icon}</span>
                                <div className="flex-1">
                                    <p className="text-white font-bold">{s.label}</p>
                                    <p className="text-white/40 text-sm">{s.desc}</p>
                                </div>
                                <span className="text-white/20 text-lg">→</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const meta = SERVICES.find(s => s.key === activeService);

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setActiveService(null)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                    <h2 className="text-xl font-black text-white">{meta?.icon} {meta?.label}</h2>
                </div>

                {/* ── CIVIC GRIEVANCE ─────────────────── */}
                {activeService === 'civic-grievance' && !successModal && (
                    <div className="space-y-4">
                        {/* Category Selection */}
                        <p className="text-white/50 text-sm">Select complaint category:</p>
                        <div className="grid gap-2">
                            {CIVIC_CATEGORIES.map(cat => (
                                <button key={cat.key} onClick={() => setSelectedCategory(cat)}
                                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border transition-all cursor-pointer text-left ${selectedCategory?.key === cat.key
                                        ? 'bg-purple-500/15 border-purple-500/40'
                                        : 'bg-white/5 border-white/10 hover:border-white/20'
                                        }`}>
                                    <span className="text-2xl">{cat.icon}</span>
                                    <div>
                                        <p className="text-white font-bold text-sm">{cat.label}</p>
                                        <p className="text-white/40 text-xs">{cat.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {selectedCategory && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 fast-fade-in">
                                <label className="text-white/60 text-sm mb-2 block">Location / Address</label>
                                <input value={grievanceLocation} onChange={e => setGrievanceLocation(e.target.value)}
                                    placeholder="e.g. Near Sector 5 Market, Ludhiana"
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 mb-3" />
                                <label className="text-white/60 text-sm mb-2 block">Describe the problem</label>
                                <textarea rows={3} value={grievanceDesc} onChange={e => setGrievanceDesc(e.target.value)}
                                    placeholder="Provide details about the issue..."
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none resize-none mb-3" />
                                <button className="w-full py-3 rounded-xl bg-white/10 border border-dashed border-white/20 text-white/40 hover:text-white cursor-pointer transition-all mb-3 text-sm">
                                    📸 Upload Photo Evidence
                                </button>
                                <button onClick={handleGrievanceSubmit}
                                    className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer transition-all text-lg">
                                    Submit Complaint
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ── TAX EXEMPTION (DigiLocker) ──────── */}
                {activeService === 'tax-exemption' && !successModal && (
                    <div className="space-y-4">
                        {!digiComplete ? (
                            <>
                                <p className="text-white/50 text-sm mb-2">Select your exemption category:</p>
                                {propertyTaxExemptions.map(ex => (
                                    <button key={ex.category} onClick={() => setSelectedExemption(ex.category)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${selectedExemption === ex.category ? 'bg-purple-500/15 border-purple-500/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-white font-bold">{ex.category}</span>
                                            <span className="text-green-400 font-bold text-lg">{ex.discount}% OFF</span>
                                        </div>
                                        <p className="text-white/40 text-sm">{ex.description}</p>
                                        <div className="flex gap-2 mt-2 flex-wrap">
                                            {ex.docsRequired.map(d => <span key={d} className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/50">📄 {d}</span>)}
                                        </div>
                                    </button>
                                ))}
                                {selectedExemption && (
                                    <button onClick={() => setShowDigiLocker(true)}
                                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-all text-lg fast-fade-in">
                                        🔐 Fetch via DigiLocker / e-Pramaan
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="space-y-4 fast-fade-in">
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-2 text-center">
                                    <p className="text-green-400 text-sm font-bold">✅ Documents fetched from DigiLocker</p>
                                </div>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                    <p className="text-white font-bold mb-3">📋 Pre-filled Application</p>
                                    <Row label="Name" value={MOCK_PREFILLED.name} />
                                    <Row label="Aadhaar" value={MOCK_PREFILLED.aadhaar} />
                                    <Row label="Property ID" value={MOCK_PREFILLED.propertyId} />
                                    <Row label="Address" value={MOCK_PREFILLED.address} />
                                    <Row label="Exemption" value={selectedExemption} />
                                </div>
                                <button onClick={handleExemptionSubmit}
                                    className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer transition-all text-lg">
                                    ✅ Submit Exemption Application
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* DigiLocker Animation */}
            <DigiLockerFetch
                active={showDigiLocker}
                connectionType={`Tax Exemption — ${selectedExemption}`}
                onComplete={() => { setShowDigiLocker(false); setDigiComplete(true); }}
            />

            {/* Success Modal */}
            {successModal && (
                <SuccessModal
                    {...successModal}
                    onHome={() => navigate('/')}
                    onClose={() => { setSuccessModal(null); setActiveService(null); }}
                />
            )}
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex justify-between items-center py-1.5">
            <span className="text-white/50 text-sm">{label}</span>
            <span className="text-white font-medium text-sm">{value}</span>
        </div>
    );
}
