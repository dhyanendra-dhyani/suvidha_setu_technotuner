/**
 * ═══════════════════════════════════════════════════════════
 * WaterServices — Water & Sanitation Department Hub
 * Water bill, supply complaints, sewerage issues
 * ═══════════════════════════════════════════════════════════
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessModal from './SuccessModal';

const SERVICES = [
    { key: 'bill', label: 'Water Bill Payment (PHED/BBPS)', icon: '💳', desc: 'Pay via Consumer Number', route: '/bill/water', mode: 'guest' },
    { key: 'supply', label: 'Water Supply Complaint', icon: '🚰', desc: 'No water, low pressure, contamination', mode: 'citizen' },
    { key: 'sewerage', label: 'Sewerage Complaint', icon: '🚽', desc: 'Blocked drain, overflow, odour', mode: 'citizen' },
];

const WATER_ISSUES = [
    'No water supply since 24+ hours',
    'Low water pressure',
    'Contaminated / dirty water',
    'Pipe leakage / burst',
    'Irregular supply timing',
    'Other',
];

const SEWERAGE_ISSUES = [
    'Blocked drain / sewer line',
    'Sewage overflow on road',
    'Foul odour from drain',
    'Manhole cover missing/broken',
    'Waterlogging after rain',
    'Other',
];

export default function WaterServices({ lang, isCitizen = false }) {
    const visibleServices = isCitizen ? SERVICES : SERVICES.filter(s => s.mode === 'guest');
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(null);
    const [selectedIssue, setSelectedIssue] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [successModal, setSuccessModal] = useState(null);

    const genId = useCallback((prefix) => `${prefix}-${Date.now().toString(36).toUpperCase()}`, []);

    const handleClick = (svc) => {
        if (svc.route) { navigate(svc.route); return; }
        setActiveService(svc.key);
        setSelectedIssue(''); setLocation(''); setDescription('');
        setSuccessModal(null);
    };

    const handleSubmit = () => {
        const prefix = activeService === 'supply' ? 'WATER' : 'SEW';
        setSuccessModal({
            title: 'Ticket Issued',
            refLabel: 'Tracking Number',
            refId: genId(prefix),
            subtitle: '48-hour resolution tracking enabled',
            details: [
                { label: 'Category', value: activeService === 'supply' ? 'Water Supply' : 'Sewerage' },
                { label: 'Issue', value: selectedIssue },
                { label: 'Location', value: location || 'Not specified' },
                { label: 'Date', value: new Date().toLocaleDateString('en-IN') },
            ],
            showPrint: true, showSMS: true,
        });
    };

    const issues = activeService === 'supply' ? WATER_ISSUES : SEWERAGE_ISSUES;

    if (!activeService) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                        <div>
                            <h2 className="text-2xl font-black text-white">💧 Water & Sanitation</h2>
                            <p className="text-white/40 text-sm">PHED — Bill payment, supply & sewerage complaints</p>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        {visibleServices.map(s => (
                            <button key={s.key} onClick={() => handleClick(s)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/30 hover:bg-white/8 transition-all cursor-pointer text-left">
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

                {!successModal && (
                    <div className="space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <label className="text-white/60 text-sm mb-2 block">Select Issue</label>
                            <div className="grid gap-2 mb-4">
                                {issues.map(issue => (
                                    <button key={issue} onClick={() => setSelectedIssue(issue)}
                                        className={`w-full text-left p-3 rounded-xl border cursor-pointer transition-all text-sm ${selectedIssue === issue
                                            ? 'bg-blue-500/15 border-blue-500/40 text-blue-300'
                                            : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:border-white/20'
                                            }`}>
                                        {issue}
                                    </button>
                                ))}
                            </div>

                            <label className="text-white/60 text-sm mb-2 block">Location / Address</label>
                            <input value={location} onChange={e => setLocation(e.target.value)}
                                placeholder="e.g. Near Sector 5 Market, Ludhiana"
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500/50 mb-3" />

                            <label className="text-white/60 text-sm mb-2 block">Additional Details (optional)</label>
                            <textarea rows={2} value={description} onChange={e => setDescription(e.target.value)}
                                placeholder="Any additional information..."
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none resize-none mb-3" />

                            <button className="w-full py-3 rounded-xl bg-white/10 border border-dashed border-white/20 text-white/40 hover:text-white cursor-pointer transition-all mb-3 text-sm">
                                📸 Upload Photo Evidence (optional)
                            </button>

                            <button onClick={handleSubmit} disabled={!selectedIssue}
                                className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold cursor-pointer transition-all text-lg disabled:opacity-30">
                                Submit Complaint
                            </button>
                        </div>
                    </div>
                )}
            </div>

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
