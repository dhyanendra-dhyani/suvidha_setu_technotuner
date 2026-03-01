/**
 * ═══════════════════════════════════════════════════════════
 * GovSchemes — Revenue & Welfare Portal
 * PM-KISAN, Ayushman Bharat, Pension, PDS, PM Awas, Ujjwala
 * ═══════════════════════════════════════════════════════════
 */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { pmKisanData, ayushmanData, jalJeevanData, pmAwasData, ujjwalaData, pensionData, pdsData } from '../utils/mockData';

const SCHEMES = [
    { key: 'pm-kisan', label: 'PM-KISAN', icon: '🌾', desc: 'Installment Status & Beneficiary Check', color: '#22C55E' },
    { key: 'ayushman', label: 'Ayushman Bharat', icon: '🏥', desc: 'Eligibility & Empanelled Hospitals', color: '#3B82F6' },
    { key: 'pension', label: 'Pension Status', icon: '🧓', desc: 'Old Age / Widow / Disability Pension', color: '#A855F7' },
    { key: 'pds', label: 'PDS Ration Card', icon: '🍚', desc: 'Ration Card Status & Entitlement', color: '#EAB308' },
    { key: 'pm-awas', label: 'PM Awas Yojana', icon: '🏠', desc: 'Application Status Tracking', color: '#8B5CF6' },
    { key: 'jal-jeevan', label: 'Jal Jeevan Mission', icon: '🚰', desc: 'Tap Connection Status', color: '#06B6D4' },
    { key: 'ujjwala', label: 'PM Ujjwala Yojana', icon: '🔥', desc: 'Free LPG for BPL Families', color: '#F97316' },
];

export default function GovSchemes({ lang }) {
    const { schemeType } = useParams();
    const navigate = useNavigate();
    const [activeScheme, setActiveScheme] = useState(schemeType || null);
    const [searched, setSearched] = useState(false);
    const [inputId, setInputId] = useState('');

    const doSearch = () => {
        if (inputId.length >= 4) setSearched(true);
    };

    if (!activeScheme) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                        <div>
                            <h2 className="text-2xl font-black text-white">📜 Revenue & Welfare</h2>
                            <p className="text-white/40 text-sm">PM Schemes, Pension, PDS & welfare status checks</p>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        {SCHEMES.map(s => (
                            <button key={s.key} onClick={() => setActiveScheme(s.key)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all cursor-pointer text-left">
                                <span className="text-3xl">{s.icon}</span>
                                <div className="flex-1">
                                    <p className="text-white font-bold">{s.label}</p>
                                    <p className="text-white/40 text-sm">{s.desc}</p>
                                </div>
                                <div className="w-2 h-8 rounded-full" style={{ background: s.color }} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    const renderScheme = () => {
        switch (activeScheme) {
            case 'pm-kisan': return <PMKisanView searched={searched} inputId={inputId} setInputId={setInputId} onSearch={doSearch} />;
            case 'ayushman': return <AyushmanView searched={searched} inputId={inputId} setInputId={setInputId} onSearch={doSearch} />;
            case 'pension': return <PensionView searched={searched} inputId={inputId} setInputId={setInputId} onSearch={doSearch} />;
            case 'pds': return <PDSView searched={searched} inputId={inputId} setInputId={setInputId} onSearch={doSearch} />;
            case 'jal-jeevan': return <JalJeevanView searched={searched} inputId={inputId} setInputId={setInputId} onSearch={doSearch} />;
            case 'pm-awas': return <PMAwasView searched={searched} inputId={inputId} setInputId={setInputId} onSearch={doSearch} />;
            case 'ujjwala': return <UjjwalaView />;
            default: return null;
        }
    };

    const schemeMeta = SCHEMES.find(s => s.key === activeScheme);

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
            <div className="w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => { setActiveScheme(null); setSearched(false); setInputId(''); }}
                        className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                    <div>
                        <h2 className="text-xl font-black text-white">{schemeMeta?.icon} {schemeMeta?.label}</h2>
                        <p className="text-white/40 text-sm">{schemeMeta?.desc}</p>
                    </div>
                </div>
                {renderScheme()}
            </div>
        </div>
    );
}

function SearchBox({ label, placeholder, inputId, setInputId, onSearch }) {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
            <label className="text-white/60 text-sm mb-2 block">{label}</label>
            <div className="flex gap-2">
                <input value={inputId} onChange={e => setInputId(e.target.value)} placeholder={placeholder}
                    className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50" />
                <button onClick={onSearch} disabled={inputId.length < 4}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all">
                    Search
                </button>
            </div>
        </div>
    );
}

function InfoRow({ label, value, color }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
            <span className="text-white/50 text-sm">{label}</span>
            <span className={`font-bold text-sm ${color || 'text-white'}`}>{value}</span>
        </div>
    );
}

function PMKisanView({ searched, inputId, setInputId, onSearch }) {
    const d = pmKisanData;
    return (<>
        <SearchBox label="Enter Aadhaar Number" placeholder="XXXX-XXXX-XXXX" inputId={inputId} setInputId={setInputId} onSearch={onSearch} />
        {searched && (
            <div className="space-y-4 fast-fade-in">
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                    <p className="text-green-400 font-bold mb-3">✅ Beneficiary Found</p>
                    <InfoRow label="Name" value={d.beneficiary.name} />
                    <InfoRow label="Aadhaar" value={d.beneficiary.aadhaar} />
                    <InfoRow label="District" value={d.beneficiary.district} />
                    <InfoRow label="Total Received" value={`₹${d.totalReceived.toLocaleString()}`} color="text-green-400" />
                    <InfoRow label="Next Installment" value={d.nextInstallment} color="text-amber-400" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white font-bold mb-3">📋 Last 3 Installments</p>
                    {d.installments.map((inst, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                            <span className="text-white/60 text-sm">#{inst.installment} — {inst.date}</span>
                            <span className="text-green-400 font-bold text-sm">₹{inst.amount} ({inst.status})</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>);
}

function AyushmanView({ searched, inputId, setInputId, onSearch }) {
    const d = ayushmanData;
    return (<>
        <SearchBox label="Enter Aadhaar Number" placeholder="XXXX-XXXX-XXXX" inputId={inputId} setInputId={setInputId} onSearch={onSearch} />
        {searched && (
            <div className="space-y-4 fast-fade-in">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                    <p className="text-blue-400 font-bold mb-3">✅ Eligible for PM-JAY</p>
                    <InfoRow label="Family ID" value={d.familyId} />
                    <InfoRow label="Coverage" value={`₹${(d.coverageAmount / 100000).toFixed(0)} Lakh per family/year`} color="text-blue-400" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white font-bold mb-3">👨‍👩‍👧 Family Members</p>
                    {d.members.map((m, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                            <span className="text-white/60 text-sm">{m.name} ({m.relation}, {m.age}yr)</span>
                            <span className="text-white/40 text-sm">{m.cardNo}</span>
                        </div>
                    ))}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white font-bold mb-3">🏥 Empanelled Hospitals</p>
                    {d.hospitals.map((h, i) => (
                        <div key={i} className="py-3 border-b border-white/5 last:border-0">
                            <div className="flex justify-between"><span className="text-white font-medium text-sm">{h.name}</span><span className="text-white/40 text-xs">{h.distance}</span></div>
                            <div className="flex gap-2 mt-1">{h.specialities.map(s => <span key={s} className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-white/60">{s}</span>)}</div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>);
}

function JalJeevanView({ searched, inputId, setInputId, onSearch }) {
    const d = jalJeevanData;
    return (<>
        <SearchBox label="Enter House ID / Aadhaar" placeholder="JJM-XX-XXX-XXXXX" inputId={inputId} setInputId={setInputId} onSearch={onSearch} />
        {searched && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5 fast-fade-in">
                <p className="text-cyan-400 font-bold mb-3">🚰 Connection Status</p>
                <InfoRow label="House ID" value={d.houseId} />
                <InfoRow label="Status" value={d.status} color="text-green-400" />
                <InfoRow label="Connection Date" value={d.connectionDate} />
                <InfoRow label="Tap Type" value={d.tapType} />
                <InfoRow label="Water Quality" value={d.waterQuality} color="text-green-400" />
                <InfoRow label="Village" value={d.village} />
                <InfoRow label="Gram Panchayat" value={d.gram_panchayat} />
            </div>
        )}
    </>);
}

function PMAwasView({ searched, inputId, setInputId, onSearch }) {
    const d = pmAwasData;
    return (<>
        <SearchBox label="Enter Application ID" placeholder="PMAY-XX-XXXX-XXXXX" inputId={inputId} setInputId={setInputId} onSearch={onSearch} />
        {searched && (
            <div className="space-y-4 fast-fade-in">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
                    <p className="text-purple-400 font-bold mb-3">🏠 Application Found</p>
                    <InfoRow label="Application ID" value={d.applicationId} />
                    <InfoRow label="Name" value={d.applicantName} />
                    <InfoRow label="Category" value={d.category} />
                    <InfoRow label="Sanctioned Amount" value={`₹${d.sanctionedAmount.toLocaleString()}`} color="text-purple-400" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white font-bold mb-3">📊 Progress Tracker</p>
                    {d.stages.map((s, i) => (
                        <div key={i} className="flex items-center gap-3 py-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.status === 'completed' ? 'bg-green-500 text-white' : s.status === 'in_progress' ? 'bg-amber-500 text-white animate-pulse' : 'bg-white/10 text-white/30'}`}>
                                {s.status === 'completed' ? '✓' : s.status === 'in_progress' ? '◉' : i + 1}
                            </div>
                            <div className="flex-1">
                                <span className={`text-sm ${s.status === 'completed' ? 'text-green-400' : s.status === 'in_progress' ? 'text-amber-400' : 'text-white/30'}`}>{s.stage}</span>
                                {s.date && <span className="text-white/30 text-xs ml-2">{s.date}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>);
}

function UjjwalaView() {
    const d = ujjwalaData;
    const [applied, setApplied] = useState(false);
    return (
        <div className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-5">
                <p className="text-orange-400 font-bold mb-3">🔥 Who is Eligible?</p>
                {d.eligibleCategories.map((c, i) => <p key={i} className="text-white/60 text-sm py-1">• {c}</p>)}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white font-bold mb-3">🎁 Benefits</p>
                {d.benefits.map((b, i) => <p key={i} className="text-green-400/80 text-sm py-1">✅ {b}</p>)}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-white font-bold mb-3">📄 Documents Required</p>
                {d.documentsRequired.map((doc, i) => <p key={i} className="text-white/50 text-sm py-1">📌 {doc}</p>)}
            </div>
            {!applied ? (
                <button onClick={() => setApplied(true)} className="w-full py-4 rounded-2xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-lg cursor-pointer transition-all">
                    Apply for Ujjwala Connection
                </button>
            ) : (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 text-center fast-fade-in">
                    <p className="text-green-400 text-4xl mb-2">✅</p>
                    <p className="text-green-400 font-bold">Application Submitted!</p>
                    <p className="text-white/40 text-sm mt-1">Reference: UJJ-PB-2026-{Math.floor(10000 + Math.random() * 90000)}</p>
                    <p className="text-white/30 text-xs mt-2">Visit your nearest LPG distributor with documents within 15 days</p>
                </div>
            )}
        </div>
    );
}

function PensionView({ searched, inputId, setInputId, onSearch }) {
    const d = pensionData;
    return (<>
        <SearchBox label="Enter Aadhaar / PPO Number" placeholder="XXXX-XXXX-XXXX" inputId={inputId} setInputId={setInputId} onSearch={onSearch} />
        {searched && (
            <div className="space-y-4 fast-fade-in">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-5">
                    <p className="text-purple-400 font-bold mb-3">🧓 Pension Details</p>
                    <InfoRow label="Name" value={d.name} />
                    <InfoRow label="Scheme" value={d.scheme} />
                    <InfoRow label="PPO Number" value={d.ppoNumber} />
                    <InfoRow label="Monthly Amount" value={`₹${d.monthlyAmount}`} color="text-green-400" />
                    <InfoRow label="Bank" value={d.bankName} />
                    <InfoRow label="Status" value={d.status} color="text-green-400" />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white font-bold mb-3">💰 Last 3 Payments</p>
                    {d.payments.map((p, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                            <span className="text-white/60 text-sm">{p.month}</span>
                            <span className="text-green-400 font-bold text-sm">₹{p.amount} — {p.status}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>);
}

function PDSView({ searched, inputId, setInputId, onSearch }) {
    const d = pdsData;
    return (<>
        <SearchBox label="Enter Ration Card Number" placeholder="PB-RC-XXXXXXXX" inputId={inputId} setInputId={setInputId} onSearch={onSearch} />
        {searched && (
            <div className="space-y-4 fast-fade-in">
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5">
                    <p className="text-yellow-400 font-bold mb-3">🍚 Ration Card Details</p>
                    <InfoRow label="Head of Family" value={d.headOfFamily} />
                    <InfoRow label="Card Type" value={d.cardType} color="text-yellow-400" />
                    <InfoRow label="Card Number" value={d.cardNumber} />
                    <InfoRow label="Members" value={`${d.members} persons`} />
                    <InfoRow label="FPS Shop" value={d.fpsShop} />
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white font-bold mb-3">📦 Monthly Entitlement</p>
                    {d.entitlement.map((e, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                            <span className="text-white/60 text-sm">{e.item}</span>
                            <span className="text-white font-medium text-sm">{e.quantity} @ ₹{e.rate}/kg</span>
                        </div>
                    ))}
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                    <p className="text-white font-bold mb-3">📋 Distribution History</p>
                    {d.distribution.map((dist, i) => (
                        <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                            <span className="text-white/60 text-sm">{dist.month}</span>
                            <span className={`font-bold text-sm ${dist.collected ? 'text-green-400' : 'text-red-400'}`}>{dist.collected ? '✅ Collected' : '❌ Not Collected'}</span>
                        </div>
                    ))}
                </div>
            </div>
        )}
    </>);
}
