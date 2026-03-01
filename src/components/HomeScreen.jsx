/**
 * ═══════════════════════════════════════════════════════════
 * HomeScreen v9 — Restructured Category Dashboard
 *
 * 5 Categories matching the feature matrix:
 * ⚡ Electricity | 💧 Water & Municipal | 🔥 LPG Gas
 * 📜 Revenue & Welfare | 🛡️ Citizen Dashboard
 * ═══════════════════════════════════════════════════════════
 */

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { t } from '../utils/i18n';
import { useVoice } from './VoiceContext';

const CATEGORIES = [
    {
        key: 'electricity', label: 'Electricity', labelHi: 'बिजली', icon: '⚡',
        gradient: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.02))',
        border: 'rgba(251,191,36,0.2)', color: '#FBBF24',
        services: [
            { key: 'elec-bill', icon: '💳', label: 'Bill Payment', labelHi: 'बिल भुगतान', route: '/bill/electricity', mode: 'guest' },
            { key: 'meter-reading', icon: '📸', label: 'Meter Reading', labelHi: 'मीटर रीडिंग', route: '/electricity-services', mode: 'guest' },
            { key: 'power-cut', icon: '⚠️', label: 'Power Cut / Fault', labelHi: 'पावर कट शिकायत', route: '/electricity-services', mode: 'guest' },
            { key: 'wrong-bill', icon: '📝', label: 'Wrong Bill Dispute', labelHi: 'गलत बिल विवाद', route: '/electricity-services', mode: 'citizen' },
            { key: 'new-elec', icon: '🔌', label: 'New Connection', labelHi: 'नया कनेक्शन', route: '/new-connection', mode: 'citizen' },
        ],
    },
    {
        key: 'water-municipal', label: 'Water & Municipal', labelHi: 'पानी और नगरपालिका', icon: '💧',
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))',
        border: 'rgba(59,130,246,0.2)', color: '#3B82F6',
        services: [
            { key: 'water-bill', icon: '💧', label: 'Water / Tax Payment', labelHi: 'पानी / प्रॉपर्टी टैक्स', route: '/bill/water', mode: 'guest' },
            { key: 'civic-griev', icon: '🛣️', label: 'Civic Grievance', labelHi: 'नागरिक शिकायत', route: '/municipal', mode: 'guest' },
            { key: 'tax-exempt', icon: '📋', label: 'Tax Exemption', labelHi: 'टैक्स छूट आवेदन', route: '/municipal', mode: 'citizen' },
            { key: 'name-trans', icon: '✏️', label: 'Name / Ownership', labelHi: 'नाम / मालिकाना बदलाव', route: '/name-change', mode: 'citizen' },
        ],
    },
    {
        key: 'lpg-gas', label: 'LPG Gas', labelHi: 'एलपीजी गैस', icon: '🔥',
        gradient: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))',
        border: 'rgba(249,115,22,0.2)', color: '#F97316',
        services: [
            { key: 'cylinder', icon: '🛢️', label: 'Cylinder Booking', labelHi: 'सिलेंडर बुकिंग', route: '/gas-services', mode: 'guest' },
            { key: 'subsidy', icon: '💰', label: 'Subsidy Status', labelHi: 'सब्सिडी स्टेटस', route: '/gas-services', mode: 'guest' },
            { key: 'gas-conn', icon: '🔧', label: 'New Gas Connection', labelHi: 'नया गैस कनेक्शन', route: '/gas-services', mode: 'citizen' },
        ],
    },
    {
        key: 'revenue', label: 'Revenue & Welfare', labelHi: 'राजस्व और कल्याण', icon: '📜',
        gradient: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
        border: 'rgba(34,197,94,0.2)', color: '#22C55E',
        services: [
            { key: 'pm-schemes', icon: '🏛️', label: 'PM Scheme Status', labelHi: 'PM योजना स्टेटस', route: '/schemes', mode: 'guest' },
            { key: 'apply-cert', icon: '📝', label: 'Apply Certificate', labelHi: 'प्रमाण पत्र आवेदन', route: '/documents', mode: 'citizen' },
            { key: 'print-cert', icon: '🖨️', label: 'Print Certificates', labelHi: 'प्रमाण पत्र प्रिंट', route: '/documents', mode: 'citizen' },
            { key: 'bhulekh', icon: '🗺️', label: 'Land Records', labelHi: 'भूलेख जमीन रिकॉर्ड', route: '/bhulekh', mode: 'citizen' },
        ],
    },
    {
        key: 'dashboard', label: 'Citizen Dashboard', labelHi: 'नागरिक डैशबोर्ड', icon: '🛡️',
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))',
        border: 'rgba(139,92,246,0.2)', color: '#8B5CF6',
        services: [
            { key: 'pay-history', icon: '📊', label: 'Payment History', labelHi: 'भुगतान इतिहास', route: '/', mode: 'citizen', screen: 'citizen-dashboard' },
            { key: 'track-griev', icon: '📋', label: 'Track Grievance', labelHi: 'शिकायत ट्रैक करें', route: '/', mode: 'citizen', screen: 'citizen-dashboard' },
            { key: 'parivaar', icon: '👨‍👩‍👧‍👦', label: 'Parivaar Link', labelHi: 'परिवार लिंक', route: '/', mode: 'citizen', screen: 'citizen-dashboard' },
        ],
    },
];

export default function HomeScreen({ lang, setLang, onBack }) {
    const navigate = useNavigate();
    const { voiceMode, isActive, setPageData, blindMode } = useVoice();
    const [expandedCat, setExpandedCat] = useState(null);

    useEffect(() => {
        const allServices = CATEGORIES.flatMap(c => c.services.map(s => ({ ...s, category: c.key })));
        setPageData?.({
            page: 'home_services',
            categories: CATEGORIES.map(c => ({ key: c.key, label: c.label, serviceCount: c.services.length })),
            availableServices: allServices,
            canFileComplaint: true,
        });
        return () => setPageData?.(null);
    }, [setPageData]);

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 gap-4 fast-fade-in">
            {/* Header */}
            <div className="w-full max-w-3xl flex items-center gap-4 mb-1">
                {onBack && (
                    <button onClick={onBack} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg hover:scale-105 transition-transform" aria-label="Back">←</button>
                )}
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white">
                        {lang === 'hi' ? 'सेवा चुनें' : lang === 'pa' ? 'ਸੇਵਾ ਚੁਣੋ' : 'Select a Service'}
                    </h1>
                    <p className="text-white/60 text-sm">
                        {voiceMode
                            ? (lang === 'hi' ? 'बोलें या नीचे से चुनें' : 'Speak or tap below')
                            : (lang === 'hi' ? 'नीचे से सेवा चुनें' : 'Tap below to choose')}
                    </p>
                </div>
            </div>

            {/* Voice mode indicator */}
            {voiceMode && isActive && (
                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2 w-full max-w-3xl">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                    <span className="text-indigo-300 text-sm font-medium">
                        {lang === 'hi' ? '🎙️ बोलें — बिजली, पानी, गैस, PM किसान, या शिकायत' : '🎙️ Say — electricity, water, gas, PM KISAN, or complaint'}
                    </span>
                </div>
            )}

            {/* Category sections */}
            <div className="w-full max-w-3xl space-y-3">
                {CATEGORIES.map((cat, ci) => {
                    const isExpanded = expandedCat === cat.key || expandedCat === null;
                    return (
                        <div key={cat.key}
                            className="rounded-2xl border overflow-hidden transition-all fast-scale-in"
                            role="region"
                            aria-label={lang === 'hi' ? cat.labelHi : cat.label}
                            style={{
                                background: cat.gradient,
                                borderColor: isExpanded ? cat.border : 'rgba(255,255,255,0.05)',
                                animationDelay: `${ci * 0.08}s`,
                            }}>
                            <button onClick={() => setExpandedCat(expandedCat === cat.key ? null : cat.key)}
                                className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer text-left"
                                aria-expanded={isExpanded}
                                aria-controls={`panel-${cat.key}`}>
                                <span className="text-2xl" aria-hidden="true">{cat.icon}</span>
                                <div className="flex-1">
                                    <p className="text-white font-bold text-base">{lang === 'hi' ? cat.labelHi : cat.label}</p>
                                    <p className="text-white/60 text-xs">{cat.services.length} {lang === 'hi' ? 'सेवाएं' : 'services'}</p>
                                </div>
                                <span className={`text-white/60 text-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true">▾</span>
                            </button>
                            {isExpanded && (
                                <div id={`panel-${cat.key}`} className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 pb-4" role="group" aria-label={`${lang === 'hi' ? cat.labelHi : cat.label} services`}>
                                    {cat.services.map((svc, si) => (
                                        <button key={svc.key} onClick={() => navigate(svc.route)}
                                            className="group rounded-xl p-3 cursor-pointer border border-transparent hover:border-white/10 flex flex-col items-center gap-2 transition-all hover:bg-white/5 active:scale-95 fast-scale-in relative a11y-touch"
                                            style={{ animationDelay: `${(ci * 0.08) + (si * 0.04)}s` }}
                                            aria-label={`${lang === 'hi' ? svc.labelHi : svc.label} (${svc.mode === 'citizen' ? 'Citizen login required' : 'Guest access'})`}>
                                            <span className="text-2xl group-hover:scale-110 transition-transform" aria-hidden="true">{svc.icon}</span>
                                            <span className="text-white/80 text-xs font-medium text-center leading-tight">
                                                {lang === 'hi' ? svc.labelHi : svc.label}
                                            </span>
                                            {/* Guest/Citizen badge */}
                                            <span className={`absolute top-1 right-1 text-[8px] font-bold px-1.5 py-0.5 rounded-full ${svc.mode === 'citizen' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`} aria-hidden="true">
                                                {svc.mode === 'citizen' ? '🔐' : '👤'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
