/**
 * ═══════════════════════════════════════════════════════════
 * ElectricityServices — Expanded Electricity Portal
 * Meter reading, Smart meter, Complaints, Slab calculator
 * ═══════════════════════════════════════════════════════════
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { electricitySlabRates, smartMeterData, meterReadingHistory } from '../utils/mockData';

const SERVICES = [
    { key: 'bill', label: 'Bill Payment (BBPS)', icon: '💳', desc: 'Pay via Consumer Number or QR', route: '/bill/electricity' },
    { key: 'meter-reading', label: 'Meter Reading Submission', icon: '📸', desc: 'Submit photo or manual entry' },
    { key: 'smart-meter', label: 'Smart Meter Recharge', icon: '⚡', desc: 'Prepaid balance top-up' },
    { key: 'new-connection', label: 'New Connection', icon: '🔌', desc: 'Apply for new electricity', route: '/new-connection' },
    { key: 'meter-fault', label: 'Meter Fault Complaint', icon: '🔧', desc: 'Report faulty / dead meter' },
    { key: 'voltage', label: 'Voltage / Power Cut', icon: '⚠️', desc: 'Report fluctuation or outage' },
    { key: 'dispute', label: 'Wrong Bill Dispute', icon: '📝', desc: 'Billing correction request' },
    { key: 'slab-calc', label: 'Slab Rate Calculator', icon: '🧮', desc: 'Check tariff by consumption' },
];

export default function ElectricityServices({ lang }) {
    const navigate = useNavigate();
    const [activeService, setActiveService] = useState(null);
    const [reading, setReading] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [rechargeAmt, setRechargeAmt] = useState('');
    const [recharged, setRecharged] = useState(false);
    const [complaintFiled, setComplaintFiled] = useState(false);
    const [calcUnits, setCalcUnits] = useState('');

    const handleClick = (svc) => {
        if (svc.route) { navigate(svc.route); return; }
        setActiveService(svc.key);
        setSubmitted(false); setRecharged(false); setComplaintFiled(false);
    };

    if (!activeService) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 fast-fade-in">
                <div className="w-full max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg">←</button>
                        <div>
                            <h2 className="text-2xl font-black text-white">⚡ Electricity Services</h2>
                            <p className="text-white/40 text-sm">Bill payment, meter reading, complaints & more</p>
                        </div>
                    </div>
                    <div className="grid gap-3">
                        {SERVICES.map(s => (
                            <button key={s.key} onClick={() => handleClick(s)}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 hover:bg-white/8 transition-all cursor-pointer text-left">
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

                {activeService === 'meter-reading' && (
                    <div className="space-y-4">
                        {!submitted ? (<>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <label className="text-white/60 text-sm mb-2 block">Enter Current Meter Reading</label>
                                <input value={reading} onChange={e => setReading(e.target.value)} placeholder="e.g. 45763" type="number"
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 mb-3" />
                                <button className="w-full py-3 rounded-xl bg-white/10 border border-dashed border-white/20 text-white/40 hover:text-white cursor-pointer transition-all mb-3">
                                    📸 Upload Meter Photo (optional)
                                </button>
                                <button onClick={() => setSubmitted(true)} disabled={!reading}
                                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold disabled:opacity-30 cursor-pointer transition-all">
                                    Submit Reading
                                </button>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <p className="text-white font-bold mb-3">📋 Previous Readings</p>
                                {meterReadingHistory.map((r, i) => (
                                    <div key={i} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                                        <span className="text-white/60 text-sm">{r.month}</span>
                                        <span className="text-white text-sm">{r.reading} ({r.units} kWh)</span>
                                    </div>
                                ))}
                            </div>
                        </>) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center fast-fade-in">
                                <p className="text-green-400 text-5xl mb-3">✅</p>
                                <p className="text-green-400 font-bold text-lg">Reading Submitted!</p>
                                <p className="text-white/40 text-sm mt-2">Reading: {reading} kWh</p>
                                <p className="text-white/30 text-xs mt-2">Your bill will be generated based on this reading</p>
                            </div>
                        )}
                    </div>
                )}

                {activeService === 'smart-meter' && (
                    <div className="space-y-4">
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
                            <p className="text-amber-400 font-bold mb-3">⚡ Smart Meter Status</p>
                            <div className="flex justify-between py-1.5"><span className="text-white/50 text-sm">Meter ID</span><span className="text-white font-medium text-sm">{smartMeterData.meterId}</span></div>
                            <div className="flex justify-between py-1.5"><span className="text-white/50 text-sm">Current Balance</span><span className="text-green-400 font-bold text-lg">₹{smartMeterData.currentBalance}</span></div>
                            <div className="flex justify-between py-1.5"><span className="text-white/50 text-sm">Daily Avg Usage</span><span className="text-white text-sm">{smartMeterData.dailyAvgUsage} kWh/day</span></div>
                            <div className="flex justify-between py-1.5"><span className="text-white/50 text-sm">Estimated Days Left</span><span className="text-amber-400 font-bold text-sm">{smartMeterData.estimatedDaysLeft} days</span></div>
                        </div>
                        {!recharged ? (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <label className="text-white/60 text-sm mb-2 block">Recharge Amount (₹)</label>
                                <div className="flex gap-2 mb-3 flex-wrap">
                                    {[100, 200, 500, 1000].map(a => (
                                        <button key={a} onClick={() => setRechargeAmt(String(a))}
                                            className={`px-4 py-2 rounded-xl border cursor-pointer transition-all text-sm font-bold ${rechargeAmt === String(a) ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-white/5 border-white/10 text-white/60 hover:text-white'}`}>
                                            ₹{a}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setRecharged(true)} disabled={!rechargeAmt}
                                    className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold disabled:opacity-30 cursor-pointer transition-all">
                                    Recharge ₹{rechargeAmt || '0'}
                                </button>
                            </div>
                        ) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center fast-fade-in">
                                <p className="text-green-400 text-5xl mb-3">✅</p>
                                <p className="text-green-400 font-bold">Recharge Successful!</p>
                                <p className="text-white/40 text-sm mt-1">₹{rechargeAmt} added to Smart Meter</p>
                                <p className="text-white/30 text-xs mt-2">New Balance: ₹{smartMeterData.currentBalance + Number(rechargeAmt)}</p>
                            </div>
                        )}
                    </div>
                )}

                {(activeService === 'meter-fault' || activeService === 'voltage' || activeService === 'dispute') && (
                    <div className="space-y-4">
                        {!complaintFiled ? (<>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                                <label className="text-white/60 text-sm mb-2 block">Consumer Number</label>
                                <input placeholder="PSEB-XXXXXX" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-red-500/50 mb-3" />
                                <label className="text-white/60 text-sm mb-2 block">Describe the issue</label>
                                <textarea rows={3} placeholder={activeService === 'meter-fault' ? 'e.g. Meter display is blank' : activeService === 'voltage' ? 'e.g. Frequent power cuts since 3 days' : 'e.g. Bill shows 500 units but actual usage is 200'}
                                    className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none resize-none mb-3" />
                                <button className="w-full py-3 rounded-xl bg-white/10 border border-dashed border-white/20 text-white/40 hover:text-white cursor-pointer transition-all mb-3">
                                    📸 Attach Photo (optional)
                                </button>
                                <button onClick={() => setComplaintFiled(true)}
                                    className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold cursor-pointer transition-all">
                                    Submit Complaint
                                </button>
                            </div>
                        </>) : (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center fast-fade-in">
                                <p className="text-green-400 text-5xl mb-3">✅</p>
                                <p className="text-green-400 font-bold text-lg">Complaint Filed!</p>
                                <p className="text-white/40 text-sm mt-2">Ticket: ELEC-{Date.now().toString(36).toUpperCase()}</p>
                                <p className="text-white/30 text-xs mt-2">Expected resolution within 48 hours</p>
                            </div>
                        )}
                    </div>
                )}

                {activeService === 'slab-calc' && (
                    <div className="space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <label className="text-white/60 text-sm mb-2 block">Enter Monthly Consumption (kWh)</label>
                            <input value={calcUnits} onChange={e => setCalcUnits(e.target.value)} placeholder="e.g. 250" type="number"
                                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50" />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                            <p className="text-white font-bold mb-3">📊 Applicable Tariff Slabs</p>
                            <div className="grid grid-cols-3 gap-2 mb-3 text-xs font-bold text-white/40 border-b border-white/10 pb-2">
                                <span>Slab</span><span className="text-right">Rate/kWh</span><span className="text-right">Fixed</span>
                            </div>
                            {electricitySlabRates.map((s, i) => (
                                <div key={i} className="grid grid-cols-3 gap-2 py-1.5 text-sm">
                                    <span className="text-white/60">{s.range}</span>
                                    <span className="text-amber-400 text-right font-medium">₹{s.rate.toFixed(2)}</span>
                                    <span className="text-white/40 text-right">₹{s.fixedCharge}</span>
                                </div>
                            ))}
                        </div>
                        {calcUnits && Number(calcUnits) > 0 && (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 fast-fade-in">
                                <p className="text-amber-400 font-bold mb-2">💡 Estimated Bill for {calcUnits} kWh</p>
                                <p className="text-white text-3xl font-black">₹{calculateBill(Number(calcUnits))}</p>
                                <p className="text-white/30 text-xs mt-1">Approximate. Actual bill may vary.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function calculateBill(units) {
    let total = 0;
    const slabs = electricitySlabRates;
    if (units <= 100) { total = units * slabs[0].rate + slabs[0].fixedCharge; }
    else if (units <= 300) { total = 100 * slabs[0].rate + (units - 100) * slabs[1].rate + slabs[1].fixedCharge; }
    else if (units <= 500) { total = 100 * slabs[0].rate + 200 * slabs[1].rate + (units - 300) * slabs[2].rate + slabs[2].fixedCharge; }
    else { total = 100 * slabs[0].rate + 200 * slabs[1].rate + 200 * slabs[2].rate + (units - 500) * slabs[3].rate + slabs[3].fixedCharge; }
    return Math.round(total);
}
