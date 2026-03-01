/**
 * ═══════════════════════════════════════════════════════════
 * GasServices — Expanded Gas Portal
 * LPG booking, Subsidy check, Pipeline connection
 * ═══════════════════════════════════════════════════════════
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { gasProvidersData } from '../utils/mockData';

const SERVICES = [
    { key: 'bill', label: 'Gas Bill Payment', icon: '💳', desc: 'Pay via BBPS', route: '/bill/gas' },
    { key: 'booking', label: 'LPG Cylinder Booking', icon: '🛢️', desc: 'HP Gas / Indane / Bharat Gas' },
    { key: 'subsidy', label: 'Subsidy Status', icon: '💰', desc: 'Check Aadhaar–bank linking' },
    { key: 'pipeline', label: 'New Pipeline Connection', icon: '🔧', desc: 'Domestic gas connection application' },
    { key: 'ujjwala', label: 'PM Ujjwala Yojana', icon: '🔥', desc: 'Free LPG for BPL families', route: '/schemes/ujjwala' },
];

export default function GasServices({ lang }) {
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(null);
    const [booked, setBooked] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [pipelineApplied, setPipelineApplied] = useState(false);

    const handleClick = (svc) => {
        if (svc.route) { navigate(svc.route); return; }
        setActiveService(svc.key);
        setBooked(false);
        setSelectedProvider(null);
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

                {activeService === 'booking' && (
                    <div className="space-y-4">
                        {!booked ? (<>
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
                                <button onClick={() => setBooked(true)}
                                    className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg cursor-pointer transition-all fast-fade-in">
                                    🛢️ Book Cylinder — {selectedProvider}
                                </button>
                            )}
                        </>) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center fast-fade-in">
                                <p className="text-green-400 text-5xl mb-3">✅</p>
                                <p className="text-green-400 font-bold text-lg">Cylinder Booked!</p>
                                <p className="text-white/40 text-sm mt-2">Provider: {selectedProvider}</p>
                                <p className="text-white/40 text-sm">Expected delivery: 3–5 working days</p>
                                <p className="text-white/30 text-xs mt-2">Booking ID: LPG-{Date.now().toString(36).toUpperCase()}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeService === 'subsidy' && (
                    <div className="space-y-4">
                        <div className={`rounded-2xl p-5 border ${gasProvidersData.subsidyStatus.linked ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                            <p className={`font-bold mb-3 ${gasProvidersData.subsidyStatus.linked ? 'text-green-400' : 'text-red-400'}`}>
                                {gasProvidersData.subsidyStatus.linked ? '✅ Aadhaar–Bank Linked' : '❌ Not Linked'}
                            </p>
                            <Row label="Bank" value={gasProvidersData.subsidyStatus.bankName} />
                            <Row label="A/C ending" value={`****${gasProvidersData.subsidyStatus.lastFourDigits}`} />
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
                    </div>
                )}

                {activeService === 'pipeline' && (
                    <div className="space-y-4">
                        {!pipelineApplied ? (<>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <p className="text-white font-bold mb-3">📋 Requirements</p>
                                {['Aadhaar Card', 'Property Ownership Proof', 'NOC from Society/Landlord', 'Passport Photo', 'Address Proof'].map((d, i) => (
                                    <p key={i} className="text-white/50 text-sm py-1">📌 {d}</p>
                                ))}
                            </div>
                            <button onClick={() => setPipelineApplied(true)}
                                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-all">
                                Apply for Pipeline Connection
                            </button>
                        </>) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center fast-fade-in">
                                <p className="text-green-400 text-5xl mb-3">✅</p>
                                <p className="text-green-400 font-bold text-lg">Application Submitted!</p>
                                <p className="text-white/40 text-sm mt-2">Ref: PIPE-PB-{Math.floor(10000 + Math.random() * 90000)}</p>
                                <p className="text-white/30 text-xs mt-2">Site survey will be scheduled within 15 working days</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
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
