/**
 * ═══════════════════════════════════════════════════════════
 * GasServices — Expanded Gas Portal v2.0
 * LPG booking, Subsidy check, New connection via DigiLocker
 * Now with SuccessModal and DigiLockerFetch
 * ═══════════════════════════════════════════════════════════
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { gasProvidersData } from '../utils/mockData';
import SuccessModal from './SuccessModal';
import DigiLockerFetch from './DigiLockerFetch';

const ALL_SERVICES = [
    { key: 'bill', label: 'Gas Bill Payment', icon: '💳', desc: 'Pay via BBPS', route: '/bill/gas', mode: 'guest' },
    { key: 'booking', label: 'LPG Cylinder Booking', icon: '🛢️', desc: 'HP Gas / Indane / Bharat Gas', mode: 'guest' },
    { key: 'subsidy', label: 'Subsidy Status Check', icon: '💰', desc: 'Check Aadhaar–bank linking & tier', mode: 'guest' },
    { key: 'new-connection', label: 'New Gas Connection', icon: '🔧', desc: 'Apply via DigiLocker / e-Pramaan', mode: 'citizen' },
    { key: 'ujjwala', label: 'PM Ujjwala Yojana', icon: '🔥', desc: 'Free LPG for BPL families', route: '/schemes/ujjwala', mode: 'citizen' },
];

// Mock pre-filled data from DigiLocker
const MOCK_PREFILLED = {
    name: 'Vivek Kumar',
    aadhaar: 'XXXX-XXXX-4829',
    address: 'Block-C, Sector 42, Ludhiana, Punjab - 141001',
    mobile: '98765-43210',
    rationCard: 'PB-LD-2026-00456',
};

export default function GasServices({ lang, isCitizen = false }) {
    const SERVICES = isCitizen ? ALL_SERVICES : ALL_SERVICES.filter(s => s.mode === 'guest');
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(null);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [successModal, setSuccessModal] = useState(null);

    // DigiLocker flow
    const [showDigiLocker, setShowDigiLocker] = useState(false);
    const [digiComplete, setDigiComplete] = useState(false);
    const [gasType, setGasType] = useState('lpg');

    const genId = useCallback((prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`, []);

    const handleClick = (svc) => {
        if (svc.route) { navigate(svc.route); return; }
        setActiveService(svc.key);
        setSelectedProvider(null);
        setSuccessModal(null);
        setShowDigiLocker(false);
        setDigiComplete(false);
    };

    // Cylinder booking submit
    const handleBooking = () => {
        setSuccessModal({
            title: 'Cylinder Booked!',
            refLabel: 'Booking Reference Number',
            refId: genId('LPG'),
            subtitle: 'Expected delivery: 3–5 working days',
            details: [
                { label: 'Provider', value: selectedProvider },
                { label: 'Date', value: new Date().toLocaleDateString('en-IN') },
            ],
            showPrint: true, showSMS: true,
        });
    };

    // New connection via DigiLocker
    const handleNewConnectionSubmit = () => {
        setSuccessModal({
            title: 'Application Filed',
            refLabel: 'Application ID',
            refId: genId('GAS-APP'),
            subtitle: 'Site survey will be scheduled within 15 working days',
            details: [
                { label: 'Connection Type', value: gasType === 'lpg' ? 'LPG Connection' : 'Pipeline Connection' },
                { label: 'Applicant', value: MOCK_PREFILLED.name },
                { label: 'Documents', value: 'Verified via DigiLocker' },
                { label: 'Date', value: new Date().toLocaleDateString('en-IN') },
            ],
            showPrint: true, showSMS: true,
        });
    };

    if (!activeService) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                        <div>
                            <h2 className="text-2xl font-black text-white">🔥 Gas Services</h2>
                            <p className="text-white/40 text-sm">LPG bill, booking, subsidy & connections</p>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        {SERVICES.map(s => (
                            <button key={s.key} onClick={() => handleClick(s)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-orange-500/30 hover:bg-white/8 transition-all cursor-pointer text-left">
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

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setActiveService(null)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                    <h2 className="text-xl font-black text-white">{SERVICES.find(s => s.key === activeService)?.icon} {SERVICES.find(s => s.key === activeService)?.label}</h2>
                </div>

                {/* ── CYLINDER BOOKING ────────────────── */}
                {activeService === 'booking' && !successModal && (
                    <div className="space-y-4">
                        <p className="text-white/50 text-sm mb-3">Select your LPG provider:</p>
                        {gasProvidersData.providers.map(p => (
                            <button key={p.name} onClick={() => setSelectedProvider(p.name)}
                                className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer text-left ${selectedProvider === p.name ? 'bg-orange-500/15 border-orange-500/40' : 'bg-white/5 border-white/10 hover:border-white/20'}`}>
                                <span className="text-3xl">{p.icon}</span>
                                <div className="flex-1">
                                    <p className="text-white font-bold">{p.name}</p>
                                    <p className="text-white/40 text-xs">{p.distributors} distributors nationwide</p>
                                </div>
                            </button>
                        ))}
                        {selectedProvider && (
                            <button onClick={handleBooking}
                                className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg cursor-pointer transition-all fast-fade-in">
                                🛢️ Book Cylinder — {selectedProvider}
                            </button>
                        )}
                    </div>
                )}

                {/* ── SUBSIDY STATUS ──────────────────── */}
                {activeService === 'subsidy' && (
                    <div className="space-y-4">
                        <div className={`rounded-2xl p-5 border ${gasProvidersData.subsidyStatus.linked ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <p className={`font-bold mb-3 ${gasProvidersData.subsidyStatus.linked ? 'text-green-400' : 'text-red-400'}`}>
                                {gasProvidersData.subsidyStatus.linked ? '✅ Aadhaar–Bank Linked' : '❌ Not Linked'}
                            </p>
                            <Row label="Bank" value={gasProvidersData.subsidyStatus.bankName} />
                            <Row label="A/C ending" value={`****${gasProvidersData.subsidyStatus.lastFourDigits}`} />
                        </div>

                        {/* Current Subsidy Tier */}
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
                            <p className="text-amber-400 font-bold mb-2">📊 Current Subsidy Tier</p>
                            <p className="text-white text-3xl font-black">₹{gasProvidersData.subsidyStatus.lastSubsidy.amount} <span className="text-white/40 text-lg">per cylinder</span></p>
                            <p className="text-white/40 text-xs mt-1">Category: APL (Above Poverty Line)</p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <p className="text-white font-bold mb-3">💰 Last Subsidy</p>
                            <Row label="Amount" value={`₹${gasProvidersData.subsidyStatus.lastSubsidy.amount}`} />
                            <Row label="Date" value={gasProvidersData.subsidyStatus.lastSubsidy.date} />
                            <Row label="Cylinder" value={gasProvidersData.subsidyStatus.lastSubsidy.cylinderNo} />
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <p className="text-white font-bold mb-3">📋 Booking History</p>
                            {gasProvidersData.bookingHistory.map((b, i) => (
                                <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                                    <span className="text-white/60 text-sm">{b.date} — {b.provider}</span>
                                    <span className="text-green-400 text-sm">{b.status} (₹{b.subsidy})</span>
                                </div>
                            ))}
                        </div>

                        {/* Send to SMS button */}
                        <button
                            onClick={() => alert('📱 Subsidy status SMS sent to registered mobile')}
                            className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-all text-lg">
                            📱 Send Subsidy Status to SMS
                        </button>
                    </div>
                )}

                {/* ── NEW GAS CONNECTION (DigiLocker) ── */}
                {activeService === 'new-connection' && !successModal && (
                    <div className="space-y-4">
                        {!digiComplete ? (
                            <>
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                                    <p className="text-white font-bold mb-2">Select Connection Type</p>
                                    <div className="flex gap-2 mb-4">
                                        <button onClick={() => setGasType('lpg')}
                                            className={`flex-1 py-3 rounded-xl font-bold cursor-pointer transition-all text-sm border ${gasType === 'lpg' ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                            🛢️ LPG
                                        </button>
                                        <button onClick={() => setGasType('pipeline')}
                                            className={`flex-1 py-3 rounded-xl font-bold cursor-pointer transition-all text-sm border ${gasType === 'pipeline' ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-white/5 border-white/10 text-white/60'}`}>
                                            🔧 Pipeline
                                        </button>
                                    </div>
                                    <p className="text-white/30 text-xs mb-4">Your documents will be fetched automatically via DigiLocker</p>
                                    <button onClick={() => setShowDigiLocker(true)}
                                        className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-all text-lg">
                                        🔐 Fetch via DigiLocker / e-Pramaan
                                    </button>
                                </div>
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
                                    <Row label="Address" value={MOCK_PREFILLED.address} />
                                    <Row label="Mobile" value={MOCK_PREFILLED.mobile} />
                                    <Row label="Ration Card" value={MOCK_PREFILLED.rationCard} />
                                    <Row label="Connection" value={gasType === 'lpg' ? 'LPG Cylinder' : 'Pipeline Gas'} />
                                </div>
                                <button onClick={handleNewConnectionSubmit}
                                    className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer transition-all text-lg">
                                    ✅ Submit Application
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* DigiLocker Animation */}
            <DigiLockerFetch
                active={showDigiLocker}
                connectionType={gasType === 'lpg' ? 'LPG Connection' : 'Pipeline Connection'}
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
