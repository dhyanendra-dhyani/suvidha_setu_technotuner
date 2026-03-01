/**
 * ═══════════════════════════════════════════════════════════
 * HomeScreen v10 — Guest/Citizen Mode Service Filtering
 *
 * 5 Departments (matching SUVIDHA Setu Spec):
 * ⚡ Electricity | 💧 Water & Sanitation | 🏛 Municipal
 * 🔥 LPG Gas | 👤 Citizen Dashboard
 *
 * Guest mode: only guest-tagged services shown
 * Citizen mode: all services shown
 * ═══════════════════════════════════════════════════════════
 */

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { t } from '../utils/i18n';
import { useVoice } from './VoiceContext';

const CATEGORIES = [
    {
        key: 'electricity', label: 'Electricity Department', labelHi: 'बिजली विभाग', icon: '⚡',
        gradient: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.02))',
        border: 'rgba(251,191,36,0.2)', color: '#FBBF24',
        services: [
            { key: 'elec-bill', icon: '💳', label: 'Utility Bill Payment', labelHi: 'बिजली बिल भुगतान', route: '/bill/electricity', mode: 'guest', action: 'Instant Receipt' },
            { key: 'meter-reading', icon: '📸', label: 'Meter Reading Submission', labelHi: 'मीटर रीडिंग', route: '/electricity-services', mode: 'guest', action: 'Logged' },
            { key: 'power-cut', icon: '⚠️', label: 'Power Cut / Fault Complaint', labelHi: 'पावर कट / खराबी शिकायत', route: '/electricity-services', mode: 'guest', action: 'Ticket Issued' },
            { key: 'wrong-bill', icon: '📝', label: 'Wrong Bill Dispute + Evidence', labelHi: 'गलत बिल विवाद', route: '/electricity-services', mode: 'citizen', action: 'Filed' },
            { key: 'new-elec', icon: '🔌', label: 'New Connection Application', labelHi: 'नया कनेक्शन आवेदन', route: '/new-connection', mode: 'citizen', action: 'Filed' },
        ],
    },
    {
        key: 'water', label: 'Water & Sanitation', labelHi: 'जल एवं स्वच्छता विभाग', icon: '💧',
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))',
        border: 'rgba(59,130,246,0.2)', color: '#3B82F6',
        services: [
            { key: 'water-bill', icon: '💧', label: 'Water Bill Payment', labelHi: 'पानी बिल भुगतान', route: '/bill/water', mode: 'guest', action: 'Instant Receipt' },
            { key: 'sewerage', icon: '🚰', label: 'Water Supply / Sewerage Complaint', labelHi: 'पानी / नाला शिकायत', route: '/complaint', mode: 'guest', action: 'Ticket Issued' },
        ],
    },
    {
        key: 'municipal', label: 'Municipal Department', labelHi: 'नगरपालिका विभाग', icon: '🏛',
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))',
        border: 'rgba(139,92,246,0.2)', color: '#8B5CF6',
        services: [
            { key: 'prop-tax', icon: '🏠', label: 'Property Tax Payment', labelHi: 'प्रॉपर्टी टैक्स भुगतान', route: '/bill/property-tax', mode: 'guest', action: 'Instant Receipt' },
            { key: 'civic-griev', icon: '🛣️', label: 'Civic Grievance (Road/Garbage/Light)', labelHi: 'नागरिक शिकायत', route: '/complaint', mode: 'guest', action: 'Ticket Issued' },
            { key: 'tax-exempt', icon: '📋', label: 'Property Tax Exemption', labelHi: 'टैक्स छूट आवेदन', route: '/municipal', mode: 'citizen', action: 'Filed' },
            { key: 'birth-death', icon: '📜', label: 'Birth/Death Certificate Print', labelHi: 'जन्म/मृत्यु प्रमाण पत्र', route: '/documents', mode: 'citizen', action: 'Physical Print' },
        ],
    },
    {
        key: 'lpg-gas', label: 'LPG Gas Department', labelHi: 'एलपीजी गैस विभाग', icon: '🔥',
        gradient: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))',
        border: 'rgba(249,115,22,0.2)', color: '#F97316',
        services: [
            { key: 'cylinder', icon: '🛢️', label: 'Cylinder Booking & Status', labelHi: 'सिलेंडर बुकिंग', route: '/gas-services', mode: 'guest', action: 'Instant' },
            { key: 'subsidy', icon: '💰', label: 'LPG Subsidy Status Check', labelHi: 'LPG सब्सिडी स्टेटस', route: '/gas-services', mode: 'guest', action: 'Instant' },
            { key: 'gas-conn', icon: '🔧', label: 'New Gas Connection Application', labelHi: 'नया गैस कनेक्शन', route: '/gas-services', mode: 'citizen', action: 'Filed' },
        ],
    },
    {
        key: 'dashboard', label: 'Citizen Dashboard', labelHi: 'नागरिक डैशबोर्ड', icon: '👤',
        citizenOnly: true, // Entire category hidden in guest mode
        gradient: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
        border: 'rgba(34,197,94,0.2)', color: '#22C55E',
        services: [
            { key: 'pay-history', icon: '📊', label: 'Payment & Transaction History', labelHi: 'भुगतान इतिहास', route: '/', mode: 'citizen', action: 'Instant' },
            { key: 'track-griev', icon: '📋', label: 'Grievance / Application Tracking', labelHi: 'शिकायत / आवेदन ट्रैकिंग', route: '/', mode: 'citizen', action: 'Instant' },
            { key: 'parivaar', icon: '👨‍👩‍👧‍👦', label: 'Parivaar Link — Family Auth', labelHi: 'परिवार लिंक', route: '/', mode: 'citizen', action: 'Instant' },
        ],
    },
];

export default function HomeScreen({ lang, setLang, onBack, isCitizen }) {
    const navigate = useNavigate();
    const { voiceMode, isActive, setPageData, blindMode } = useVoice();
    const [expandedCat, setExpandedCat] = useState(null);

    // Filter categories and services based on mode
    const visibleCategories = CATEGORIES
        .filter(cat => !cat.citizenOnly || isCitizen) // Hide citizen-only categories in guest
        .map(cat => ({
            ...cat,
            services: isCitizen ? cat.services : cat.services.filter(s => s.mode === 'guest'),
        }))
        .filter(cat => cat.services.length > 0); // Hide empty categories

    useEffect(() => {
        const allServices = visibleCategories.flatMap(c => c.services.map(s => ({ ...s, category: c.key })));
        setPageData?.({
            page: 'home_services',
            mode: isCitizen ? 'citizen' : 'guest',
            categories: visibleCategories.map(c => ({ key: c.key, label: c.label, serviceCount: c.services.length })),
            availableServices: allServices,
            canFileComplaint: true,
        });
        return () => setPageData?.(null);
    }, [setPageData, isCitizen]);

    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 gap-4 fast-fade-in">
            {/* Header */}
            <div className="w-full max-w-3xl flex items-center gap-4 mb-1">
                {onBack && (
                    <button onClick={onBack} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg hover:scale-105 transition-transform a11y-touch" aria-label="Back">←</button>
                )}
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white">
                        {lang === 'hi' ? 'सेवा चुनें' : lang === 'pa' ? 'ਸੇਵਾ ਚੁਣੋ' : 'Select a Service'}
                    </h1>
                    <p className="text-white/60 text-sm">
                        {isCitizen
                            ? (lang === 'hi' ? '🔐 नागरिक मोड — सभी सेवाएं उपलब्ध' : '🔐 Citizen Mode — All services available')
                            : (lang === 'hi' ? '👤 अतिथि मोड — सीमित सेवाएं' : '👤 Guest Mode — Limited services')}
                    </p>
                </div>
            </div>

            {/* Mode banner */}
            {!isCitizen && (
                <div className="w-full max-w-3xl flex items-center gap-3 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                    <span className="text-amber-400 text-lg" aria-hidden="true">🔒</span>
                    <p className="text-amber-300 text-sm font-medium flex-1">
                        {lang === 'hi'
                            ? 'कुछ सेवाएं सिर्फ नागरिक लॉगिन के बाद उपलब्ध हैं।'
                            : 'Some services require Citizen login for security.'}
                    </p>
                </div>
            )}

            {/* Voice mode indicator */}
            {voiceMode && isActive && (
                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2 w-full max-w-3xl" role="status" aria-live="polite">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" aria-hidden="true" />
                    <span className="text-indigo-300 text-sm font-medium">
                        {lang === 'hi' ? '🎙️ बोलें — बिजली बिल, पानी बिल, या शिकायत' : '🎙️ Say — electricity bill, water bill, or complaint'}
                    </span>
                </div>
            )}

            {/* Category sections */}
            <div className="w-full max-w-3xl space-y-3">
                {visibleCategories.map((cat, ci) => {
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
                                            aria-label={`${lang === 'hi' ? svc.labelHi : svc.label}`}>
                                            <span className="text-2xl group-hover:scale-110 transition-transform" aria-hidden="true">{svc.icon}</span>
                                            <span className="text-white/80 text-xs font-medium text-center leading-tight">
                                                {lang === 'hi' ? svc.labelHi : svc.label}
                                            </span>
                                            {/* Action badge */}
                                            <span className={`text-[7px] font-bold px-1.5 py-0.5 rounded-full ${svc.action === 'Instant Receipt' || svc.action === 'Instant'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : svc.action === 'Ticket Issued' || svc.action === 'Logged'
                                                        ? 'bg-blue-500/20 text-blue-400'
                                                        : 'bg-amber-500/20 text-amber-400'
                                                }`} aria-hidden="true">
                                                {svc.action === 'Instant Receipt' ? '✅ Receipt' : svc.action === 'Instant' ? '✅' : svc.action === 'Ticket Issued' ? '📋 Ticket' : svc.action === 'Logged' ? '📋' : svc.action === 'Physical Print' ? '🖨️ Print' : '📝 Filed'}
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
