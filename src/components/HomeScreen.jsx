/**
 * ═══════════════════════════════════════════════════════════
 * HomeScreen v12 — Guest Mode: Large Cards, Big Icons, No Complaints
 *
 * Guest: 4 large, bold department cards with oversized icons
 * and payment-only quick actions. NO complaints in guest mode.
 *
 * Citizen: Full expanded service tiles (unchanged).
 * ═══════════════════════════════════════════════════════════
 */

import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { t } from '../utils/i18n';
import { useVoice } from './VoiceContext';

/* ── GUEST MODE: Department Cards (NO complaints) ─── */
const GUEST_DEPARTMENTS = [
    {
        key: 'electricity', label: 'Electricity', labelHi: 'बिजली विभाग',
        subtitle: 'PSEB · BBPS', subtitleHi: 'PSEB · BBPS',
        icon: '⚡', logo: '🏭',
        gradient: 'linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(251,191,36,0.03) 100%)',
        border: 'rgba(251,191,36,0.3)', color: '#FBBF24', glow: 'rgba(251,191,36,0.12)',
        actions: [
            { icon: '💳', label: 'Pay Electricity Bill', labelHi: 'बिजली बिल भुगतान', route: '/bill/electricity' },
            { icon: '📸', label: 'Submit Meter Reading', labelHi: 'मीटर रीडिंग जमा करें', route: '/electricity-services' },
            { icon: '⚡', label: 'Smart Meter Recharge', labelHi: 'स्मार्ट मीटर रिचार्ज', route: '/electricity-services' },
        ],
    },
    {
        key: 'water', label: 'Water & Sanitation', labelHi: 'जल एवं स्वच्छता',
        subtitle: 'PHED · BBPS', subtitleHi: 'PHED · BBPS',
        icon: '💧', logo: '🚿',
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.03) 100%)',
        border: 'rgba(59,130,246,0.3)', color: '#3B82F6', glow: 'rgba(59,130,246,0.12)',
        actions: [
            { icon: '💳', label: 'Pay Water Bill', labelHi: 'पानी बिल भुगतान', route: '/bill/water' },
        ],
    },
    {
        key: 'municipal', label: 'Municipal / Nagar Palika', labelHi: 'नगरपालिका विभाग',
        subtitle: 'Property Tax · Civic', subtitleHi: 'प्रॉपर्टी टैक्स',
        icon: '🏛', logo: '🏢',
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15) 0%, rgba(139,92,246,0.03) 100%)',
        border: 'rgba(139,92,246,0.3)', color: '#8B5CF6', glow: 'rgba(139,92,246,0.12)',
        actions: [
            { icon: '🏠', label: 'Pay Property Tax', labelHi: 'प्रॉपर्टी टैक्स भुगतान', route: '/bill/property-tax' },
        ],
    },
    {
        key: 'lpg-gas', label: 'LPG Gas', labelHi: 'एलपीजी गैस',
        subtitle: 'HP · Indane · Bharat Gas', subtitleHi: 'HP · इंडेन · भारत गैस',
        icon: '🔥', logo: '🛢️',
        gradient: 'linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(249,115,22,0.03) 100%)',
        border: 'rgba(249,115,22,0.3)', color: '#F97316', glow: 'rgba(249,115,22,0.12)',
        actions: [
            { icon: '🛢️', label: 'Book LPG Cylinder', labelHi: 'सिलेंडर बुक करें', route: '/gas-services' },
            { icon: '💰', label: 'Check Subsidy Status', labelHi: 'सब्सिडी स्टेटस जांचें', route: '/gas-services' },
        ],
    },
];

/* ── CITIZEN MODE: Full category listing ────────────── */
const CITIZEN_CATEGORIES = [
    {
        key: 'electricity', label: 'Electricity Department', labelHi: 'बिजली विभाग', icon: '⚡',
        gradient: 'linear-gradient(135deg, rgba(251,191,36,0.08), rgba(251,191,36,0.02))',
        border: 'rgba(251,191,36,0.2)', color: '#FBBF24',
        services: [
            { key: 'elec-bill', icon: '💳', label: 'Utility Bill Payment', labelHi: 'बिजली बिल भुगतान', route: '/bill/electricity', action: 'Instant Receipt' },
            { key: 'meter-reading', icon: '📸', label: 'Meter Reading Submission', labelHi: 'मीटर रीडिंग', route: '/electricity-services', action: 'Logged' },
            { key: 'power-cut', icon: '⚠️', label: 'Power Cut / Fault Complaint', labelHi: 'पावर कट / खराबी शिकायत', route: '/electricity-services', action: 'Ticket Issued' },
            { key: 'wrong-bill', icon: '📝', label: 'Wrong Bill Dispute + Evidence', labelHi: 'गलत बिल विवाद', route: '/electricity-services', action: 'Filed' },
            { key: 'new-elec', icon: '🔌', label: 'New Connection Application', labelHi: 'नया कनेक्शन आवेदन', route: '/new-connection', action: 'Filed' },
        ],
    },
    {
        key: 'water', label: 'Water & Sanitation', labelHi: 'जल एवं स्वच्छता विभाग', icon: '💧',
        gradient: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(59,130,246,0.02))',
        border: 'rgba(59,130,246,0.2)', color: '#3B82F6',
        services: [
            { key: 'water-bill', icon: '💧', label: 'Water Bill Payment', labelHi: 'पानी बिल भुगतान', route: '/bill/water', action: 'Instant Receipt' },
            { key: 'sewerage', icon: '🚰', label: 'Water Supply / Sewerage Complaint', labelHi: 'पानी / नाला शिकायत', route: '/water-services', action: 'Ticket Issued' },
        ],
    },
    {
        key: 'municipal', label: 'Municipal Department', labelHi: 'नगरपालिका विभाग', icon: '🏛',
        gradient: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(139,92,246,0.02))',
        border: 'rgba(139,92,246,0.2)', color: '#8B5CF6',
        services: [
            { key: 'prop-tax', icon: '🏠', label: 'Property Tax Payment', labelHi: 'प्रॉपर्टी टैक्स भुगतान', route: '/bill/property-tax', action: 'Instant Receipt' },
            { key: 'civic-griev', icon: '🛣️', label: 'Civic Grievance (Road/Garbage/Light)', labelHi: 'नागरिक शिकायत', route: '/municipal', action: 'Ticket Issued' },
            { key: 'tax-exempt', icon: '📋', label: 'Property Tax Exemption', labelHi: 'टैक्स छूट आवेदन', route: '/municipal', action: 'Filed' },
            { key: 'birth-death', icon: '📜', label: 'Birth/Death Certificate Print', labelHi: 'जन्म/मृत्यु प्रमाण पत्र', route: '/documents', action: 'Physical Print' },
        ],
    },
    {
        key: 'lpg-gas', label: 'LPG Gas Department', labelHi: 'एलपीजी गैस विभाग', icon: '🔥',
        gradient: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))',
        border: 'rgba(249,115,22,0.2)', color: '#F97316',
        services: [
            { key: 'cylinder', icon: '🛢️', label: 'Cylinder Booking & Status', labelHi: 'सिलेंडर बुकिंग', route: '/gas-services', action: 'Instant' },
            { key: 'subsidy', icon: '💰', label: 'LPG Subsidy Status Check', labelHi: 'LPG सब्सिडी स्टेटस', route: '/gas-services', action: 'Instant' },
            { key: 'gas-conn', icon: '🔧', label: 'New Gas Connection Application', labelHi: 'नया गैस कनेक्शन', route: '/gas-services', action: 'Filed' },
        ],
    },
    {
        key: 'dashboard', label: 'Citizen Dashboard', labelHi: 'नागरिक डैशबोर्ड', icon: '👤',
        gradient: 'linear-gradient(135deg, rgba(34,197,94,0.08), rgba(34,197,94,0.02))',
        border: 'rgba(34,197,94,0.2)', color: '#22C55E',
        services: [
            { key: 'pay-history', icon: '📊', label: 'Payment & Transaction History', labelHi: 'भुगतान इतिहास', route: '/', action: 'Instant' },
            { key: 'track-griev', icon: '📋', label: 'Grievance / Application Tracking', labelHi: 'शिकायत / आवेदन ट्रैकिंग', route: '/', action: 'Instant' },
            { key: 'parivaar', icon: '👨‍👩‍👧‍👦', label: 'Parivaar Link — Family Auth', labelHi: 'परिवार लिंक', route: '/', action: 'Instant' },
        ],
    },
];

export default function HomeScreen({ lang, setLang, onBack, isCitizen }) {
    const navigate = useNavigate();
    const { voiceMode, isActive, setPageData } = useVoice();

    useEffect(() => {
        const allServices = isCitizen
            ? CITIZEN_CATEGORIES.flatMap(c => c.services.map(s => ({ ...s, category: c.key })))
            : GUEST_DEPARTMENTS.flatMap(c => c.actions.map(a => ({ ...a, category: c.key })));
        setPageData?.({
            page: 'home_services',
            mode: isCitizen ? 'citizen' : 'guest',
            availableServices: allServices,
        });
        return () => setPageData?.(null);
    }, [setPageData, isCitizen]);

    /* ═══ GUEST MODE — 4 Large Bold Cards ═══ */
    if (!isCitizen) {
        return (
            <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 gap-5 fast-fade-in">
                {/* Header */}
                <div className="w-full max-w-3xl flex items-center gap-4 mb-2">
                    {onBack && (
                        <button onClick={onBack} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg hover:scale-105 transition-transform a11y-touch" aria-label="Back">←</button>
                    )}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                            {lang === 'hi' ? '⚡ त्वरित सेवा' : '⚡ Quick Access'}
                        </h1>
                        <p className="text-white/50 text-base mt-1">
                            {lang === 'hi' ? 'बिना लॉगिन — तुरंत बिल भुगतान' : 'No login required — instant bill payment'}
                        </p>
                    </div>
                </div>

                {/* Voice hint */}
                {voiceMode && isActive && (
                    <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2.5 w-full max-w-3xl" role="status" aria-live="polite">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" aria-hidden="true" />
                        <span className="text-indigo-300 text-base font-semibold">
                            {lang === 'hi' ? '🎙️ बोलें — "बिजली बिल" या "पानी बिल"' : '🎙️ Say — "electricity bill" or "water bill"'}
                        </span>
                    </div>
                )}

                {/* 4 Department Cards — Large, Bold, Touch-Friendly */}
                <div className="w-full max-w-3xl grid gap-5">
                    {GUEST_DEPARTMENTS.map((dept, di) => (
                        <div key={dept.key}
                            className="rounded-3xl border overflow-hidden transition-all fast-scale-in"
                            role="region"
                            aria-label={lang === 'hi' ? dept.labelHi : dept.label}
                            style={{
                                background: dept.gradient,
                                borderColor: dept.border,
                                animationDelay: `${di * 0.1}s`,
                                boxShadow: `0 12px 40px ${dept.glow}`,
                            }}>
                            {/* Department Header — BIG */}
                            <div className="px-6 pt-6 pb-3 flex items-center gap-5">
                                <div className="w-18 h-18 rounded-2xl flex items-center justify-center relative"
                                    style={{
                                        background: `${dept.color}18`,
                                        border: `2px solid ${dept.color}35`,
                                        width: '72px', height: '72px',
                                    }}>
                                    <span className="text-4xl" aria-hidden="true">{dept.icon}</span>
                                    <span className="absolute -bottom-1 -right-1 text-lg" aria-hidden="true">{dept.logo}</span>
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                                        {lang === 'hi' ? dept.labelHi : dept.label}
                                    </h2>
                                    <p className="text-white/40 text-sm mt-0.5">
                                        {lang === 'hi' ? dept.subtitleHi : dept.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Quick Action Buttons — LARGE TEXT */}
                            <div className="px-5 pb-6 grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(dept.actions.length, 3)}, 1fr)` }}>
                                {dept.actions.map((action, ai) => (
                                    <button key={ai} onClick={() => navigate(action.route)}
                                        className="group rounded-2xl p-5 cursor-pointer border border-white/8 hover:border-white/20 flex flex-col items-center gap-3 transition-all hover:bg-white/8 active:scale-[0.96] bg-white/[0.03] a11y-touch fast-scale-in"
                                        style={{ animationDelay: `${(di * 0.1) + (ai * 0.06)}s` }}
                                        aria-label={lang === 'hi' ? action.labelHi : action.label}>
                                        <span className="text-4xl group-hover:scale-110 transition-transform" aria-hidden="true">{action.icon}</span>
                                        <span className="text-white text-sm md:text-base font-bold text-center leading-snug">
                                            {lang === 'hi' ? action.labelHi : action.label}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    /* ═══ CITIZEN MODE — Full Expanded View ═══ */
    return (
        <div className="min-h-[calc(100vh-160px)] flex flex-col items-center px-4 py-6 gap-4 fast-fade-in">
            <div className="w-full max-w-3xl flex items-center gap-4 mb-1">
                {onBack && (
                    <button onClick={onBack} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white cursor-pointer text-lg hover:scale-105 transition-transform a11y-touch" aria-label="Back">←</button>
                )}
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-white">
                        {lang === 'hi' ? 'सेवा चुनें' : 'Select a Service'}
                    </h1>
                    <p className="text-white/60 text-sm">
                        {voiceMode
                            ? (lang === 'hi' ? 'बोलें या नीचे से चुनें' : 'Speak or tap below')
                            : (lang === 'hi' ? 'नीचे से सेवा चुनें' : 'Tap below to choose')}
                    </p>
                </div>
            </div>

            {voiceMode && isActive && (
                <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-4 py-2 w-full max-w-3xl" role="status" aria-live="polite">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" aria-hidden="true" />
                    <span className="text-indigo-300 text-sm font-medium">
                        {lang === 'hi' ? '🎙️ बोलें — बिजली बिल, पानी बिल, या शिकायत' : '🎙️ Say — electricity bill, water bill, or complaint'}
                    </span>
                </div>
            )}

            <div className="w-full max-w-3xl space-y-3">
                {CITIZEN_CATEGORIES.map((cat, ci) => (
                    <div key={cat.key}
                        className="rounded-2xl border overflow-hidden transition-all fast-scale-in"
                        role="region"
                        aria-label={lang === 'hi' ? cat.labelHi : cat.label}
                        style={{
                            background: cat.gradient,
                            borderColor: cat.border,
                            animationDelay: `${ci * 0.08}s`,
                        }}>
                        <div className="w-full flex items-center gap-3 px-5 py-4 text-left">
                            <span className="text-2xl" aria-hidden="true">{cat.icon}</span>
                            <div className="flex-1">
                                <p className="text-white font-bold text-base">{lang === 'hi' ? cat.labelHi : cat.label}</p>
                                <p className="text-white/60 text-xs">{cat.services.length} {lang === 'hi' ? 'सेवाएं' : 'services'}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 px-4 pb-4" role="group">
                            {cat.services.map((svc, si) => (
                                <button key={svc.key} onClick={() => navigate(svc.route)}
                                    className="group rounded-xl p-3 cursor-pointer border border-transparent hover:border-white/10 flex flex-col items-center gap-2 transition-all hover:bg-white/5 active:scale-95 fast-scale-in relative a11y-touch"
                                    style={{ animationDelay: `${(ci * 0.08) + (si * 0.04)}s` }}
                                    aria-label={lang === 'hi' ? svc.labelHi : svc.label}>
                                    <span className="text-2xl group-hover:scale-110 transition-transform" aria-hidden="true">{svc.icon}</span>
                                    <span className="text-white/80 text-xs font-medium text-center leading-tight">
                                        {lang === 'hi' ? svc.labelHi : svc.label}
                                    </span>
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
                    </div>
                ))}
            </div>
        </div>
    );
}
