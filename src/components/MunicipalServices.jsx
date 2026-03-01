/**
 * ═══════════════════════════════════════════════════════════
 * MunicipalServices — Nagar Palika / PHED Hub
 * Sewerage, Road, Streetlight, Garbage, Tax Exemption
 * ═══════════════════════════════════════════════════════════
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyTaxExemptions } from '../utils/mockData';

const SERVICES = [
    { key: 'property-tax', label: 'Property Tax Payment', icon: '🏠', desc: 'Pay by Property ID via BBPS', route: '/bill/property-tax' },
    { key: 'tax-exemption', label: 'Tax Exemption Application', icon: '📋', desc: 'SC/ST, Senior Citizen, Widow' },
    { key: 'water-bill', label: 'Water Bill Payment', icon: '💧', desc: 'PHED Consumer Number', route: '/bill/water' },
    { key: 'sewerage', label: 'Sewerage Complaint', icon: '🚽', desc: 'Blocked drain, contaminated water' },
    { key: 'road', label: 'Road Condition Complaint', icon: '🛣️', desc: 'Pothole, damaged pavement' },
    { key: 'streetlight', label: 'Streetlight Fault', icon: '💡', desc: 'Non-working street lamp' },
    { key: 'garbage', label: 'Garbage / Sanitation', icon: '🗑️', desc: 'Missed pickup, open dumping' },
    { key: 'fastag', label: 'FASTag Recharge', icon: '🚗', desc: 'BBPS toll recharge', route: '/fastag' },
    { key: 'birth-cert', label: 'Birth Certificate Reprint', icon: '👶', desc: 'Municipal records', route: '/documents/birth' },
];

export default function MunicipalServices({ lang }) {
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(null);
    const [complaintFiled, setComplaintFiled] = useState(false);
    const [exemptionApplied, setExemptionApplied] = useState(false);
    const [selectedExemption, setSelectedExemption] = useState(null);

    const handleClick = (svc) => {
        if (svc.route) { navigate(svc.route); return; }
        setActiveService(svc.key);
        setComplaintFiled(false);
        setExemptionApplied(false);
    };

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
    const isComplaint = ['sewerage', 'road', 'streetlight', 'garbage'].includes(activeService);

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => setActiveService(null)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                    <h2 className="text-xl font-black text-white">{meta?.icon} {meta?.label}</h2>
                </div>

                {isComplaint && (
                    <div className="space-y-4">
                        {!complaintFiled ? (<>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <label className="text-white/60 text-sm mb-2 block">Location / Address</label>
                                <input placeholder="e.g. Near Sector 5 Market, Ludhiana"
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 mb-3" />
                                <label className="text-white/60 text-sm mb-2 block">Describe the problem</label>
                                <textarea rows={3} placeholder={
                                    activeService === 'sewerage' ? 'e.g. Main sewer line blocked since 2 days, water overflowing' :
                                        activeService === 'road' ? 'e.g. Large pothole on main road, dangerous for vehicles' :
                                            activeService === 'streetlight' ? 'e.g. Street lamp not working for a week, dark area' :
                                                'e.g. Garbage not collected for 3 days, dumped in open'
                                }
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none resize-none mb-3" />
                                <button className="w-full py-3 rounded-xl bg-white/10 border border-dashed border-white/20 text-white/40 hover:text-white cursor-pointer transition-all mb-3">
                                    📸 Upload Photo Evidence
                                </button>
                                <button onClick={() => setComplaintFiled(true)}
                                    className="w-full py-4 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer transition-all text-lg">
                                    Submit Complaint
                                </button>
                            </div>
                        </>) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center fast-fade-in">
                                <p className="text-green-400 text-5xl mb-3">✅</p>
                                <p className="text-green-400 font-bold text-lg">Complaint Registered!</p>
                                <p className="text-white/50 text-sm mt-2">Category: {meta?.label}</p>
                                <p className="text-white font-medium mt-1">Ticket: MUNI-{Date.now().toString(36).toUpperCase()}</p>
                                <p className="text-white/30 text-xs mt-2">48-hour resolution tracking enabled. SMS updates on registered mobile.</p>
                            </div>
                        )}
                    </div>
                )}

                {activeService === 'tax-exemption' && (
                    <div className="space-y-4">
                        {!exemptionApplied ? (<>
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
                                <div className="space-y-3 fast-fade-in">
                                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                        <label className="text-white/60 text-sm mb-2 block">Property ID</label>
                                        <input placeholder="e.g. PROP-LDH-XXXXX"
                                            className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-purple-500/50 mb-3" />
                                        <button className="w-full py-3 rounded-xl bg-white/10 border border-dashed border-white/20 text-white/40 hover:text-white cursor-pointer transition-all mb-3">
                                            📎 Upload Required Documents
                                        </button>
                                    </div>
                                    <button onClick={() => setExemptionApplied(true)}
                                        className="w-full py-4 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-bold cursor-pointer transition-all text-lg">
                                        Apply for {selectedExemption} Exemption
                                    </button>
                                </div>
                            )}
                        </>) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center fast-fade-in">
                                <p className="text-green-400 text-5xl mb-3">✅</p>
                                <p className="text-green-400 font-bold text-lg">Exemption Applied!</p>
                                <p className="text-white/50 text-sm mt-2">Category: {selectedExemption}</p>
                                <p className="text-white font-medium mt-1">Ref: TAX-EX-{Math.floor(10000 + Math.random() * 90000)}</p>
                                <p className="text-white/30 text-xs mt-2">Verification in progress. Expected 7–10 working days.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
