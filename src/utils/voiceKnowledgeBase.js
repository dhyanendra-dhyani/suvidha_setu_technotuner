/**
 * ═══════════════════════════════════════════════════════════
 * Voice Knowledge Base v2 — Comprehensive
 *
 * Deep knowledge of every page, every feature, every field.
 * Handles 100+ questions instantly without API calls.
 *
 * PAGES COVERED:
 *   - IdleScreen: Language selection + voice/touch
 *   - GatewayScreen: Guest vs Citizen choice
 *   - HomeScreen: 4 services (electricity, water, gas, property tax)
 *   - BillPayment: 3 steps (input → bill → pay → success)
 *     - Numpad, QR scan, consumer ID
 *     - Payment methods: UPI, Card, Cash (note counting)
 *     - Receipt download + PDF
 *   - ComplaintForm: 3 steps (category → details → done)
 *     - 6 categories with keywords
 *     - Photo upload, location detect, voice description
 *     - Complaint receipt PDF
 *   - AuthScreen: 3 methods (thumb, iris, OTP)
 *     - Mock citizen: Vivek Kumar, Aadhaar XXXX-XXXX-4829
 *   - CitizenDashboard: Bills, complaints, services
 *
 * MOCK DATA:
 *   - PSEB-123456 → Electricity ₹450 (Rajesh Kumar)
 *   - PHED-789012 → Water ₹280 (Paramjit Singh)
 *   - GPL-345678  → Gas ₹620 (Sunita Devi)
 * ═══════════════════════════════════════════════════════════
 */

// ── CONVERSATION STATES ─────────────────────────────
export const CONV_STATES = {
    INITIAL: 'initial',
    WAIT_PATH: 'wait_path',
    GUEST_HOME: 'guest_home',
    CITIZEN_AUTH: 'citizen_auth',
    CITIZEN_DASH: 'citizen_dash',
    BILL_INPUT: 'bill_input',
    BILL_VIEW: 'bill_view',
    BILL_PAY: 'bill_pay',
    BILL_SUCCESS: 'bill_success',
    COMPLAINT_CAT: 'complaint_cat',
    COMPLAINT_DETAIL: 'complaint_detail',
    COMPLAINT_DONE: 'complaint_done',
    FREE_TALK: 'free_talk',
};

// ── INITIAL GREETING ────────────────────────────────
export const INITIAL_GREETINGS = {
    hi: 'नमस्ते! अपना बिल भरना है, या किसी और का?',
    en: 'Hello! Paying your own bill, or someone else\'s?',
};

// ── ALL KEYWORD SETS ────────────────────────────────

export const CITIZEN_KEYWORDS = [
    'apna', 'mera', 'aadhaar', 'aadhar', 'angootha', 'finger', 'thumb',
    'my own', 'meri', 'khud', 'haan ji', 'login', 'citizen', 'panjikaran',
    'register', 'अपना', 'मेरा', 'आधार', 'अंगूठा', 'खुद', 'हाँ जी',
    'पंजीकरण', 'लॉगिन', 'own', 'apne', 'apni', 'mujhe', 'mera hai',
];

export const GUEST_KEYWORDS = [
    'rishtedar', 'kisi aur', 'kisi ka', 'dusre', 'nahi', 'no', 'nah',
    'guest', 'bina login', 'bina', 'someone', 'else', 'other', 'quick',
    'jaldi', 'seedha', 'direct', 'quick pay', 'without', 'baghair',
    'रिश्तेदार', 'किसी और', 'किसी का', 'दूसरे', 'नहीं', 'बिना',
    'दूसरों', 'पड़ोसी', 'neighbour', 'padosi',
];

export const BILL_KEYWORDS = {
    electricity: [
        'bijli', 'electricity', 'electric', 'light', 'lite', 'bijlee',
        'बिजली', 'लाइट', 'बिजली का बिल', 'vij', 'PSEB', 'pseb',
        'powercom', 'meter', 'unit', 'kwh', 'current',
    ],
    water: [
        'paani', 'water', 'jal', 'pani', 'पानी', 'जल', 'पानी का बिल',
        'PHED', 'phed', 'neer', 'supply', 'tap', 'nal', 'नल',
    ],
    gas: [
        'gas', 'lpg', 'cylinder', 'rasoi', 'गैस', 'रसोई', 'सिलेंडर',
        'GPL', 'gpl', 'hp gas', 'indane', 'bharat gas', 'cooking',
    ],
};

export const COMPLAINT_KEYWORDS = [
    'complaint', 'shikayat', 'problem', 'samasya', 'issue', 'report',
    'शिकायत', 'समस्या', 'dikkat', 'taklif', 'kharab', 'tut', 'broken',
    'repair', 'fix', 'help', 'दिक्कत', 'तकलीफ', 'खराब', 'टूटा',
];

export const COMPLAINT_CATEGORY_KEYWORDS = {
    broken_streetlight: ['streetlight', 'light', 'dark', 'lamp', 'pole', 'roshni', 'andhera', 'रोशनी', 'अंधेरा', 'बत्ती'],
    water_supply: ['water', 'supply', 'pipe', 'leak', 'tap', 'pani', 'paani', 'jal', 'nal', 'पानी', 'नल', 'टपक'],
    garbage_collection: ['garbage', 'waste', 'trash', 'dump', 'kachra', 'safai', 'clean', 'गंदगी', 'कचरा', 'सफाई'],
    voltage_fluctuation: ['voltage', 'fluctuation', 'power', 'current', 'bijli', 'volt', 'बिजली', 'करंट', 'वोल्टेज'],
    road_damage: ['road', 'pothole', 'damage', 'crack', 'broken', 'sadak', 'gaddha', 'सड़क', 'गड्ढा', 'टूटी'],
};

export const BACK_KEYWORDS = ['back', 'peeche', 'wapas', 'vapas', 'पीछे', 'वापस', 'return', 'laut'];
export const HOME_KEYWORDS = ['home', 'ghar', 'shuru', 'होम', 'घर', 'start', 'menu', 'services'];
export const STOP_KEYWORDS = ['stop', 'band', 'ruko', 'chup', 'bye', 'बंद', 'रुको', 'touch mode', 'hatao', 'close'];

// ── Payment method keywords ────────────────────────
export const PAYMENT_KEYWORDS = {
    upi: ['upi', 'gpay', 'google pay', 'phonepe', 'paytm', 'bhim', 'यूपीआई'],
    card: ['card', 'debit', 'credit', 'atm', 'कार्ड', 'डेबिट'],
    cash: ['cash', 'naqad', 'paisa', 'note', 'कैश', 'नकद', 'पैसे'],
};

// ── Yes/No keywords ────────────────────────────────
export const YES_KEYWORDS = ['haan', 'ha', 'yes', 'ji', 'theek', 'thik', 'sahi', 'bilkul', 'ok', 'okay', 'chalega', 'हाँ', 'जी', 'ठीक', 'सही', 'चलेगा'];
export const NO_KEYWORDS = ['nahi', 'nah', 'no', 'mat', 'cancel', 'band', 'naa', 'not', 'नहीं', 'मत', 'ना'];

// ── CITIZEN-REQUIRED features (need Aadhaar login) ─
// These are services that ONLY work after citizen login
export const CITIZEN_REQUIRED_KEYWORDS = [
    'naam badal', 'naam badlo', 'name change', 'naam transfer', 'नाम बदल', 'नाम ट्रांसफर',
    'new connection', 'naya connection', 'नया कनेक्शन',
    'gas pipeline', 'pipeline', 'gas line', 'पाइपलाइन', 'गैस लाइन',
    'certificate', 'pramanpatra', 'प्रमाणपत्र', 'सर्टिफिकेट',
    'transfer', 'ownership', 'malik', 'मालिक',
    'meter change', 'meter badal', 'मीटर बदल',
    'subsidy', 'subsidi', 'सब्सिडी',
    'dashboard', 'history', 'record', 'itihas', 'इतिहास', 'रिकॉर्ड',
];

// ── RE-PROMPT: When user doesn't respond ───────────
export const RE_PROMPT_GREETINGS = [
    {
        hi: 'कोई बात नहीं, दोबारा बताइए — आपका अपना बिल है और आधार कार्ड है? या किसी और का बिल भरना है?',
        en: 'No worries, let me ask again — is this your own bill with Aadhaar? Or paying for someone else?',
    },
    {
        hi: 'अगर आपके पास आधार कार्ड है तो "अपना" बोलें। अगर किसी रिश्तेदार का बिल भरना है तो "रिश्तेदार का" बोलें। या सीधे बोलें "बिजली बिल" जो भरना हो।',
        en: 'If you have Aadhaar, say "my own". If paying for a relative, say "someone else". Or directly say which bill — "electricity bill".',
    },
    {
        hi: 'मैं सुन रहा हूँ! बस बोलिए — "अपना बिल है" या "किसी और का बिल भरना है"। आप सीधे "बिजली", "पानी", या "गैस" भी बोल सकते हैं।',
        en: 'I\'m listening! Just say "my own bill" or "someone else\'s". You can also say "electricity", "water", or "gas" directly.',
    },
];

// ── RESPONSE TEMPLATES ──────────────────────────────

export const RESPONSES = {
    citizen_chosen: {
        hi: 'बहुत अच्छा! चलिए पंजीकरण करते हैं। आपके सामने तीन तरीके हैं — अंगूठा लगाइए, आँख स्कैन कराइए, या OTP से लॉगिन करें। सबसे आसान अंगूठा है — बस लगाइए और हो जाएगा।',
        en: 'Great! Let\'s register. Three options — thumbprint, iris scan, or OTP login. Thumbprint is easiest — just place your finger.',
    },
    guest_chosen: {
        hi: 'ठीक है, बिना लॉगिन के भी सारे काम हो जाएँगे! बताइए कौन सा बिल भरना है — बिजली का, पानी का, या गैस का? अगर कोई शिकायत दर्ज करनी है तो वो भी हो जाएगी। Property Tax भी भर सकते हैं।',
        en: 'No problem! You can do everything without login. Which bill — electricity, water, or gas? You can also file a complaint or pay property tax.',
    },
    stopping: {
        hi: 'ठीक है, बंद कर रहा हूँ। फिर से बात करनी हो तो माइक बटन दबाएं। धन्यवाद!',
        en: 'Okay, stopping. Press the mic button to talk again. Thank you!',
    },
    not_understood: {
        hi: 'माफ कीजिए, मैं समझ नहीं पाया। आप बोल सकते हैं — "बिजली का बिल", "पानी का बिल", "गैस का बिल", "शिकायत", या "वापस"।',
        en: 'Sorry, I didn\'t understand. You can say — "electricity bill", "water bill", "gas bill", "complaint", or "go back".',
    },

    // ── Citizen-required feature redirect ──────────
    citizen_required_redirect: {
        hi: 'अच्छा, इसके लिए आपको आधार कार्ड से लॉगिन करना होगा। अगर आपके पास आधार कार्ड है तो अंगूठा लगाकर या OTP से लॉगिन कर सकते हैं। मैं आपको लॉगिन पेज पर ले जा रहा हूँ।',
        en: 'For this, you\'ll need to login with your Aadhaar card. You can use thumbprint or OTP. I\'m taking you to the login page.',
    },
    citizen_required_naam: {
        hi: 'अच्छा, नाम बदलवाना है! इसके लिए आधार कार्ड से लॉगिन ज़रूरी है। अगर आपके नाम से करवाना है तो fingerprint से भी हो जाएगा। चलिए, मैं आपको लॉगिन पेज पर ले जाता हूँ।',
        en: 'You want a name change! For this, Aadhaar login is required. If it\'s in your name, fingerprint will work too. Let me take you to the login page.',
    },
    citizen_required_pipeline: {
        hi: 'अच्छा, गैस पाइपलाइन जुड़वानी है! इसके लिए आधार कार्ड से लॉगिन करना होगा — अपने नाम से कराना है तो अंगूठा लगा दीजिए, बहुत आसान है। मैं आपको लॉगिन पेज पर ले जा रहा हूँ।',
        en: 'You want a gas pipeline connection! Aadhaar login is needed for this. Thumbprint is the easiest way. Let me take you to login.',
    },
    citizen_required_connection: {
        hi: 'अच्छा, नया कनेक्शन लगवाना है! इसके लिए आधार कार्ड से लॉगिन ज़रूरी है। अंगूठा लगाइए या OTP डालिए — 2-3 सेकंड में हो जाएगा। चलिए।',
        en: 'New connection! Aadhaar login is required. Thumbprint or OTP — just 2-3 seconds. Let\'s go.',
    },

    // ── Page-specific guidance ──────────────────────

    page_guidance: {
        '/': {
            hi: 'होम पेज खुल गया। यहाँ चार विभाग हैं — बिल भुगतान, PM सरकारी योजनाएं, नगरपालिका सेवाएं, और दस्तावेज़ सेवाएं। बोलें कौन सी सेवा चाहिए — जैसे बिजली बिल, PM किसान, FASTag, या शिकायत।',
            en: 'Home page is open. Four departments — Bill Payments, PM Schemes, Municipal Services, and Documents. Say which service you need — like electricity bill, PM KISAN, FASTag, or complaint.',
        },
        '/bill/electricity': {
            hi: 'बिजली बिल का पेज खुल गया। अब अपनी खाता संख्या डालें — यह आपके पुराने बिजली बिल पर ऊपर बाईं तरफ लिखी होती है, जैसे PSEB-123456। नीचे नंबर पैड से डालें या QR कोड स्कैन करें।',
            en: 'Electricity bill page is open. Enter your consumer number using the keypad below. It\'s on your previous bill, like PSEB-123456. You can also scan QR.',
        },
        '/bill/water': {
            hi: 'पानी बिल का पेज खुल गया। अपनी खाता संख्या डालें — जैसे PHED-789012। यह आपके पिछले बिल पर लिखी होती है। नीचे नंबर पैड से डालें या QR स्कैन करें।',
            en: 'Water bill page is open. Enter your consumer number like PHED-789012. Use the keypad or scan QR.',
        },
        '/bill/gas': {
            hi: 'गैस बिल का पेज खुल गया। LPG ID या खाता संख्या डालें — जैसे GPL-345678। यह आपकी गैस बुक या सिलेंडर रसीद पर लिखी होती है।',
            en: 'Gas bill page is open. Enter your LPG ID like GPL-345678. It\'s on your gas book or cylinder.',
        },
        '/bill/property-tax': {
            hi: 'Property Tax का पेज खुल गया। अपनी Property ID या खाता संख्या डालें — यह आपकी पिछली टैक्स रसीद पर या नगरपालिका ऑफिस से मिलेगी। नीचे नंबर पैड से डालें।',
            en: 'Property Tax page is open. Enter your Property ID from your previous tax receipt or municipal office. Use the keypad below.',
        },
        '/complaint': {
            hi: 'शिकायत का पेज खुल गया। नीचे छह श्रेणियां हैं — टूटी स्ट्रीटलाइट, पानी सप्लाई, कचरा, बिजली वोल्टेज, सड़क गड्ढा, या अन्य। बोलें क्या समस्या है, मैं खुद श्रेणी चुन लूँगा। फोटो भी लगा सकते हैं।',
            en: 'Complaint page is open. Six categories — broken streetlight, water supply, garbage, voltage, road damage, or other. Tell me your issue and I\'ll pick the category. You can also attach a photo.',
        },
        '/name-change': {
            hi: 'नाम बदलाव का फॉर्म खुल गया है। यहाँ आप कनेक्शन का प्रकार चुनें — बिजली, पानी, या गैस। फिर पुराना नाम और नया नाम डालें। ज़रूरी दस्तावेज़ अपलोड करें — अफिडेविट, नो ऑब्जेक्शन सर्टिफिकेट। सब भरा हो जाए तो सबमिट दबाएं।',
            en: 'Name change form is open. Select connection type — electricity, water, or gas. Enter old name and new name. Upload required documents like affidavit and no-objection certificate. Then submit.',
        },
        '/new-connection': {
            hi: 'नया कनेक्शन का फॉर्म खुल गया है। पहले कनेक्शन का प्रकार चुनें — बिजली, पानी, या गैस। फिर DigiLocker से दस्तावेज़ लिए जाएंगे। फॉर्म भरें — नाम, पता, फोन नंबर। दस्तावेज़ वेरिफाई करें और सबमिट दबाएं। 7-15 दिन में कनेक्शन हो जाएगा।',
            en: 'New connection form is open. Select connection type — electricity, water, or gas. Documents will be fetched from DigiLocker. Fill the form with name, address, and phone. Verify documents and submit. Connection in 7-15 days.',
        },
        '/schemes': {
            hi: 'सरकारी योजनाओं का पेज खुल गया। पाँच योजनाएं हैं — PM किसान, आयुष्मान भारत, जल जीवन मिशन, PM आवास, और PM उज्ज्वला। बोलें कौन सी योजना की जानकारी चाहिए।',
            en: 'Government schemes page is open. Five schemes — PM KISAN, Ayushman Bharat, Jal Jeevan Mission, PM Awas, and PM Ujjwala. Tell me which scheme you want.',
        },
        '/documents': {
            hi: 'दस्तावेज़ सेवाओं का पेज खुल गया। चार प्रमाण पत्र — आय, निवास, जाति, जन्म प्रमाण पत्र। e-Hastakshar से डिजिटल हस्ताक्षरित, QR से वेरिफाई होंगे। बोलें कौन सा प्रमाण पत्र चाहिए।',
            en: 'Document services page open. Four certificates — Income, Residence, Caste, Birth. Digitally signed via e-Hastakshar, QR-verifiable. Say which certificate you need.',
        },
        '/gas-services': {
            hi: 'गैस सेवाओं का पेज खुल गया। सिलेंडर बुकिंग, सब्सिडी स्टेटस, पाइपलाइन कनेक्शन, और उज्ज्वला योजना। बोलें क्या करना है।',
            en: 'Gas services page open. Cylinder booking, subsidy status, pipeline connection, and Ujjwala scheme. Tell me what you need.',
        },
        '/electricity-services': {
            hi: 'बिजली सेवाओं का पेज खुल गया। बिल भुगतान, मीटर रीडिंग, स्मार्ट मीटर रिचार्ज, मीटर शिकायत, वोल्टेज शिकायत, गलत बिल, और स्लैब कैलकुलेटर। बोलें क्या करना है।',
            en: 'Electricity services page open. Bill payment, meter reading, smart meter recharge, complaints, wrong bill dispute, and slab calculator.',
        },
        '/municipal': {
            hi: 'नगरपालिका सेवाओं का पेज खुल गया। Property Tax, पानी बिल, नाला शिकायत, सड़क शिकायत, स्ट्रीटलाइट, कचरा, FASTag, और जन्म प्रमाण पत्र। बोलें क्या करना है।',
            en: 'Municipal services page open. Property tax, water bill, sewerage, road, streetlight, garbage complaints, FASTag, and birth certificate.',
        },
        '/fastag': {
            hi: 'FASTag रिचार्ज का पेज खुल गया। अपनी गाड़ी का नंबर या FASTag ID डालें। बैलेंस दिखेगा और रिचार्ज कर सकते हैं — UPI, Cash, या Card से।',
            en: 'FASTag recharge page open. Enter your vehicle number or FASTag ID. Check balance and recharge via UPI, Cash, or Card.',
        },
        '/admin': {
            hi: 'एडमिन डैशबोर्ड खुल गया है। यहाँ सभी लेनदेन, शिकायतें, और किओस्क स्थिति दिखती है। सामान्य उपयोगकर्ताओं को इसकी ज़रूरत नहीं होती।',
            en: 'Admin dashboard is open. Shows all transactions, complaints, and kiosk status. Regular users don\'t need this.',
        },
    },

    // ── Bill step guidance (after consumer number) ───

    bill_found: {
        hi: 'बिल मिल गया! स्क्रीन पर बिल की जानकारी दिख रही है — नाम, राशि, और ड्यू डेट। "आगे बढ़ें" बटन दबाएं भुगतान के लिए, या बोलें "भुगतान करो"।',
        en: 'Bill found! The details are shown — name, amount, and due date. Press "Proceed" or say "pay" to make payment.',
    },
    bill_payment_options: {
        hi: 'भुगतान कैसे करना है? तीन तरीके हैं — UPI (GPay, PhonePe), कार्ड (Debit/Credit), या कैश (नोट डालें)। बोलें या बटन दबाएं।',
        en: 'How would you like to pay? Three options — UPI (GPay, PhonePe), Card (Debit/Credit), or Cash. Say the method or tap the button.',
    },
    bill_success: {
        hi: 'भुगतान सफल! 🎉 रसीद तैयार है — "Download Receipt" बटन से PDF डाउनलोड कर सकते हैं, या "Print" से प्रिंट करें। और कोई बिल भरना है?',
        en: 'Payment successful! 🎉 Receipt is ready — download as PDF or print. Want to pay another bill?',
    },

    // ── Complaint step guidance ─────────────────────

    complaint_category: {
        hi: 'श्रेणी चुन लीजिए। छह विकल्प हैं: 1. टूटी स्ट्रीटलाइट, 2. पानी सप्लाई, 3. कचरा, 4. बिजली वोल्टेज, 5. सड़क गड्ढा, 6. अन्य। बोलें या बटन दबाएं।',
        en: 'Choose a category: 1. Broken Streetlight, 2. Water Supply, 3. Garbage, 4. Voltage, 5. Road Damage, 6. Other.',
    },
    complaint_details: {
        hi: 'अब समस्या का विवरण लिखें या बोलें। फोटो भी लगा सकते हैं — "📸 फोटो" बटन है। लोकेशन अपने आप पकड़ लेगा। सब हो जाए तो "शिकायत दर्ज करें" बोलें या बटन दबाएं।',
        en: 'Describe the issue — type or speak. Add a photo if you want. Location is auto-detected. Then say "submit" or press the button.',
    },
    complaint_done: {
        hi: 'शिकायत दर्ज हो गई! टिकट नंबर स्क्रीन पर है — इसे लिख लीजिए। PDF भी डाउनलोड कर सकते हैं। 48 घंटे में कार्रवाई होगी।',
        en: 'Complaint filed! Your ticket number is on screen — note it down. You can also download the PDF. Action within 48 hours.',
    },

    // ── Auth guidance ───────────────────────────────

    auth_thumb: {
        hi: 'Thumb lagao → Scanner pe rakho',
        en: 'Thumb → Scanner',
    },
    auth_iris: {
        hi: 'Camera ke samne dekho',
        en: 'Look at camera',
    },
    auth_otp: {
        hi: 'Mobile number → OTP aayega → Enter karo',
        en: 'Mobile → OTP → Enter',
    },

    // ── Dashboard guidance ──────────────────────────

    citizen_dashboard: {
        hi: 'आपका डैशबोर्ड खुल गया है, नमस्ते! यहाँ तीन सेक्शन हैं — आपके बिल (जो बकाया हैं), आपकी शिकायतें (पुरानी + नई), और अतिरिक्त सेवाएं जैसे नया कनेक्शन, नाम बदलाव, प्रमाणपत्र। बोलें क्या करना है?',
        en: 'Your dashboard is open! Three sections — your pending bills, your complaints (old + new), and extra services like new connection, name change, certificates. What would you like to do?',
    },
};

// ── COMPREHENSIVE Q&A ───────────────────────────────
// Covers every possible question a user might ask

export const COMMON_QA = [
    // ── Consumer Number ──
    {
        keywords: ['consumer number', 'consumer', 'number kahan', 'kaha se', 'kaise milega', 'id kahan', 'कंज्यूमर', 'नंबर कहाँ', 'कहाँ से', 'आईडी', 'id number'],
        answer: {
            hi: 'PSEB-XXXXXX, PHED-XXXXXX, या GPL-XXXXXX',
            en: 'PSEB-XXXXXX, PHED-XXXXXX, or GPL-XXXXXX',
        },
    },
    // ── QR scan ──
    {
        keywords: ['qr', 'scan', 'qr code', 'barcode', 'स्कैन', 'क्यू आर'],
        answer: {
            hi: 'QR स्कैन करने के लिए नीचे "📷 QR Scan" बटन दबाएं। बिल पर जो QR कोड है उसे कैमरे के सामने रखें, consumer number अपने आप भर जाएगा।',
            en: 'Press the "📷 QR Scan" button below. Hold your bill\'s QR code in front of the camera — the consumer number will auto-fill.',
        },
    },
    // ── Bill amount ──
    {
        keywords: ['kitna paisa', 'kitna', 'amount', 'bill kitna', 'कितना', 'कितने पैसे', 'rashi', 'राशि', 'total', 'due'],
        answer: {
            hi: 'Number डालें → Fetch Bill',
            en: 'Enter number → Fetch Bill',
        },
    },
    // ── Payment methods ──
    {
        keywords: ['upi', 'card', 'cash', 'payment', 'bhugtan', 'kaise pay', 'pay kaise', 'भुगतान', 'कैसे', 'gpay', 'phonepe', 'paytm'],
        answer: {
            hi: 'UPI / Card / Cash',
            en: 'UPI / Card / Cash',
        },
    },
    // ── Receipt / PDF ──
    {
        keywords: ['receipt', 'raseed', 'download', 'print', 'pdf', 'रसीद', 'प्रिंट', 'डाउनलोड'],
        answer: {
            hi: 'Download Receipt बटन दबाएं',
            en: 'Press Download Receipt button',
        },
    },
    // ── Due date ──
    {
        keywords: ['due date', 'last date', 'kab tak', 'deadline', 'akhri', 'अंतिम', 'आखिरी', 'ड्यू', 'तारीख'],
        answer: {
            hi: 'बिल पर लिखी। Fetch Bill से दिखेगी।',
            en: 'On bill. Shown after Fetch Bill.',
        },
    },
    // ── Units / consumption ──
    {
        keywords: ['unit', 'units', 'consumption', 'kitna use', 'meter', 'reading', 'यूनिट', 'मीटर', 'रीडिंग', 'खपत'],
        answer: {
            hi: 'Bijli: kWh, Pani: KL, Gas: Cylinder',
            en: 'Electricity: kWh, Water: KL, Gas: Cylinders',
        },
    },
    // ── Help / what can I do ──
    {
        keywords: ['help', 'madad', 'sahayata', 'kya kar', 'kya kya', 'feature', 'service', 'sewa', 'मदद', 'सहायता', 'क्या कर', 'सेवा'],
        answer: {
            hi: 'Bill (Bijli/Pani/Gas), Tax, Complaint, Receipt',
            en: 'Bills, Tax, Complaints, Receipts',
        },
    },
    // ── Complaint filing ──
    {
        keywords: ['shikayat kaise', 'complaint kaise', 'शिकायत कैसे', 'file complaint', 'report kaise'],
        answer: {
            hi: 'Category chuno → Details likho → Photo upload (optional) → Submit',
            en: 'Choose category → describe → photo → submit',
        },
    },
    // ── Complaint categories ──
    {
        keywords: ['category', 'shreni', 'श्रेणी', 'kaun kaun', 'type', 'prakar', 'प्रकार', 'categories'],
        answer: {
            hi: 'शिकायत की छह श्रेणियां: 1. टूटी स्ट्रीटलाइट — बत्ती नहीं जल रही 2. पानी सप्लाई — पानी नहीं आ रहा, पाइप लीक 3. कचरा — कचरा नहीं उठा 4. बिजली वोल्टेज — करंट कम-ज्यादा 5. सड़क गड्ढा — सड़क टूटी 6. अन्य',
            en: 'Six complaint categories: 1. Broken Streetlight 2. Water Supply 3. Garbage 4. Voltage 5. Road Damage 6. Other',
        },
    },
    // ── Complaint status ──
    {
        keywords: ['complaint status', 'ticket', 'shikayat status', 'kya hua', 'kab hoga', 'progress', 'स्टेटस', 'टिकट'],
        answer: {
            hi: 'शिकायत का स्टेटस देखने के लिए Citizen Login करें — डैशबोर्ड में "My Complaints" सेक्शन में सब दिखेगा। हरा = हल हो गई, पीला = प्रगति में। अभी डेमो में दो शिकायतें हैं।',
            en: 'Login as Citizen to check complaint status in "My Complaints". Green = resolved, yellow = in progress.',
        },
    },
    // ── Photo for complaint ──
    {
        keywords: ['photo', 'camera', 'tasvir', 'image', 'picture', 'फोटो', 'कैमरा', 'तस्वीर'],
        answer: {
            hi: 'शिकायत में फोटो लगाने के लिए "📸 Photo" बटन दबाएं। कैमरा खुलेगा या गैलरी से चुनें। फोटो लगाने से शिकायत जल्दी हल होती है।',
            en: 'Press "📸 Photo" button to attach a photo. Use camera or gallery. Adding a photo helps resolve complaints faster.',
        },
    },
    // ── Location ──
    {
        keywords: ['location', 'jagah', 'kahan', 'address', 'pata', 'जगह', 'कहाँ', 'पता', 'स्थान'],
        answer: {
            hi: 'शिकायत में Location अपने आप पकड़ लेता है GPS से। अगर GPS नहीं है तो Ludhiana डिफ़ॉल्ट सेट होता है। बिल में पता भी दिखता है।',
            en: 'Location is auto-detected via GPS for complaints. Bill address is shown after entering consumer number.',
        },
    },
    // ── Login methods ──
    {
        keywords: ['login', 'sign in', 'कैसे लॉगिन', 'login kaise', 'kaise login'],
        answer: {
            hi: 'लॉगिन के तीन तरीके: 1. अंगूठा 👆 — बायोमेट्रिक स्कैनर पर लगाएं (सबसे आसान) 2. आँख 👁️ — कैमरे में देखें 3. OTP 📱 — मोबाइल पर कोड आएगा, डालें। आधार कार्ड ज़रूरी है।',
            en: 'Three login methods: 1. Thumb 👆 2. Iris 👁️ 3. OTP 📱. Aadhaar card is required for all methods.',
        },
    },
    // ── e-Pramaan / Aadhaar ──
    {
        keywords: ['aadhaar', 'aadhar', 'e-pramaan', 'epramaan', 'identity', 'pehchan', 'आधार', 'ई-प्रमाण', 'पहचान'],
        answer: {
            hi: 'SUVIDHA Setu e-Pramaan यानी डिजिटल पहचान से काम करता है। आधार कार्ड से लॉगिन होता है — अंगूठा, आँख, या OTP से। एक बार लॉगिन के बाद सारे बिल और शिकायतें एक जगह दिखेंगी।',
            en: 'SUVIDHA Setu uses e-Pramaan digital identity. Login via Aadhaar — thumb, iris, or OTP. Once logged in, all your bills and complaints are in one place.',
        },
    },
    // ── Offline / internet ──
    {
        keywords: ['offline', 'internet', 'network', 'no signal', 'बिना नेट', 'ऑफलाइन'],
        answer: {
            hi: 'हाँ, ऑफलाइन भी काम कर सकते हैं! बिल भुगतान और शिकायत सेव हो जाएगी, इंटरनेट आने पर सिंक हो जाएगी। ऊपर "Offline" बैज दिखेगा।',
            en: 'Yes, it works offline too! Bills and complaints are saved locally and sync when internet returns. You\'ll see an "Offline" badge.',
        },
    },
    // ── Property tax ──
    {
        keywords: ['property', 'tax', 'property tax', 'ghar ka tax', 'house tax', 'प्रॉपर्टी', 'टैक्स', 'घर का'],
        answer: {
            hi: 'Property Tax भी भर सकते हैं — होम पेज पर 🏠 बटन दबाएं या बोलें "Property Tax"। Demo में इलेक्ट्रिसिटी बिल पेज से भरा जा सकता है।',
            en: 'You can pay Property Tax too — press the 🏠 button on home page or say "Property Tax".',
        },
    },
    // ── This kiosk / system ──
    {
        keywords: ['suvidha', 'setu', 'kiosk', 'system', 'app', 'yeh kya', 'क्या है', 'सुविधा', 'सेतु', 'किओस्क'],
        answer: {
            hi: 'SUVIDHA Setu एक Smart Civic Kiosk है — C-DAC द्वारा बनाया गया। इससे बिजली, पानी, गैस बिल भर सकते हैं, शिकायत दर्ज कर सकते हैं, और सरकारी सेवाएं ले सकते हैं। आवाज़ और टच दोनों से काम करता है।',
            en: 'SUVIDHA Setu is a Smart Civic Kiosk by C-DAC. Pay utility bills, file complaints, and access government services. Works with voice and touch.',
        },
    },
    // ── Demo data ──
    {
        keywords: ['demo', 'test', 'try', 'example', 'sample', 'डेमो', 'टेस्ट'],
        answer: {
            hi: 'Demo के लिए ये consumer numbers डालें: बिजली → PSEB-123456 (₹450), पानी → PHED-789012 (₹280), गैस → GPL-345678 (₹620)। कोई भी number डालें तो random बिल बनेगा।',
            en: 'For demo, use: Electricity → PSEB-123456 (₹450), Water → PHED-789012 (₹280), Gas → GPL-345678 (₹620). Any number generates a random bill.',
        },
    },
    // ── Language ──
    {
        keywords: ['bhasha', 'language', 'hindi', 'english', 'punjabi', 'change language', 'भाषा', 'बदलो'],
        answer: {
            hi: 'भाषा शुरू में चुनी गई थी। अभी हिंदी में बात कर रहे हैं। भाषा बदलने के लिए "वापस" बोलें और शुरू से आएं। या आप किसी भी भाषा में बोलें, मैं समझने की कोशिश करूँगा।',
            en: 'Language was selected at the start. You\'re currently using the voice in your chosen language. Say "go back" to change, or speak in any language.',
        },
    },
    // ── What is voice mode ──
    {
        keywords: ['voice mode', 'awaz', 'आवाज़', 'बोल', 'mic', 'माइक'],
        answer: {
            hi: 'वॉइस मोड चालू है — आप बोलकर सब काम कर सकते हैं। "बिजली बिल" बोलें, "शिकायत" बोलें, "वापस" बोलें। मैं हमेशा सुन रहा हूँ। बंद करना हो तो "बंद करो" बोलें।',
            en: 'Voice mode is ON — do everything by speaking. Say "electricity bill", "complaint", "go back". I\'m always listening. Say "stop" to turn off.',
        },
    },
    // ── Admin ──
    {
        keywords: ['admin', 'dashboard', 'manage', 'एडमिन', 'प्रशासक'],
        answer: {
            hi: 'Admin Dashboard अधिकारियों के लिए है — सभी लेनदेन, शिकायतें, और किओस्क की स्थिति दिखती है। सामान्य उपयोगकर्ता इसका इस्तेमाल नहीं करते।',
            en: 'Admin Dashboard is for officials — shows all transactions, complaints, and kiosk status. Regular users don\'t need this.',
        },
    },
    // ── Security / safety ──
    {
        keywords: ['safe', 'secure', 'suraksha', 'data', 'privacy', 'सुरक्षा', 'डेटा', 'प्राइवेसी'],
        answer: {
            hi: 'आपकी जानकारी सुरक्षित है। आधार वेरिफिकेशन e-Pramaan से होता है। बिल भुगतान का रिकॉर्ड ऑफलाइन भी सेव रहता है। किसी और को आपकी जानकारी नहीं दिखती।',
            en: 'Your information is secure. Aadhaar verification uses e-Pramaan. Payment records are saved even offline. Your data stays private.',
        },
    },
    // ── Numpad ──
    {
        keywords: ['numpad', 'number pad', 'keyboard', 'type', 'kaise likhe', 'number daale', 'नंबर कैसे', 'कैसे डालें'],
        answer: {
            hi: '0-9 buttons, ⌫ mita, C clear',
            en: '0-9 buttons, ⌫ delete, C clear',
        },
    },
    // ── New connection ──
    {
        keywords: ['new connection', 'naya', 'apply', 'naya connection', 'नया कनेक्शन', 'अप्लाई'],
        answer: {
            hi: 'Login → Dashboard → Apply New',
            en: 'Login → Dashboard → Apply',
        },
    },
    // ── Name change ──
    {
        keywords: ['name change', 'naam badlo', 'naam', 'mujhe naam badalna', 'naam badalna hai', 'transfer', 'नाम बदलो', 'नाम', 'नाम बदलना', 'मुझे नाम बदलना', 'naam badal do'],
        answer: {
            hi: 'ठीक है, पहले आधार से लॉगिन करना होगा। फिर नाम बदला सकते हैं। आइए, लॉगिन कर लेते हैं।',
            en: 'Okay, I\'ll take you to login first. Then you can change your name. Let\'s login.',
        },
        action: 'navigate_naam_change',
    },
    // ── Certificate ──
    {
        keywords: ['certificate', 'pramanpatra', 'print certificate', 'प्रमाणपत्र', 'सर्टिफिकेट'],
        answer: {
            hi: 'Login → Dashboard → Print',
            en: 'Login → Dashboard → Print',
        },
    },
    // ── Existing bill details ──
    {
        keywords: ['electricity bill details', 'water bill details', 'gas bill details', 'bijli bill', 'pani bill', 'gas bill details'],
        answer: {
            hi: 'डेमो बिल: बिजली: PSEB-123456, राजेश कुमार, ₹450, 85 kWh, ड्यू 28 Feb। पानी: PHED-789012, परमजीत सिंह, ₹280, 12 KL, ड्यू 5 Mar। गैस: GPL-345678, सुनीता देवी, ₹620, 3 सिलेंडर, ड्यू 10 Mar।',
            en: 'Demo bills: Electricity: PSEB-123456, Rajesh Kumar, ₹450, 85 kWh. Water: PHED-789012, Paramjit Singh, ₹280. Gas: GPL-345678, Sunita Devi, ₹620.',
        },
    },
    // ── Payment confirmation ──
    {
        keywords: ['payment ho gaya', 'paid', 'successful', 'ho gaya', 'भुगतान हो गया', 'paid kya'],
        answer: {
            hi: 'भुगतान सफल होने पर हरे रंग की स्क्रीन दिखती है "Payment Successful" लिखा होता है। Transaction ID मिलता है। रसीद डाउनलोड कर लीजिए।',
            en: 'After successful payment, you\'ll see a green "Payment Successful" screen with a Transaction ID. Download the receipt.',
        },
    },
];

// ══════════════════════════════════════════════════════
// EXPANDED ENTRIES — Greetings, Casual, Errors, FASTag, etc.
// ══════════════════════════════════════════════════════

export const EXPANDED_QA = [
    // ── GREETINGS ──
    {
        keywords: ['namaste', 'namaskar', 'hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'नमस्ते', 'नमस्कार', 'प्रणाम', 'ram ram', 'राम राम', 'sat sri akal', 'jai hind', 'जय हिंद'],
        answer: { hi: 'नमस्ते! 🙏 मैं SUVIDHA Setu हूँ। बताइए — बिल भरना है, शिकायत दर्ज करनी है, या कुछ और?', en: 'Hello! 🙏 I\'m SUVIDHA Setu. Pay a bill, file a complaint, or something else?' },
    },
    {
        keywords: ['thank', 'thanks', 'shukriya', 'dhanyavad', 'धन्यवाद', 'शुक्रिया', 'thankyou', 'bohot acha', 'bahut accha', 'बहुत अच्छा', 'badiya', 'बढ़िया'],
        answer: { hi: 'आपका धन्यवाद! 🙏 और कोई काम हो तो बताइए।', en: 'You\'re welcome! 🙏 Need anything else?' },
    },
    {
        keywords: ['bye', 'goodbye', 'alvida', 'chalte hain', 'bas', 'aur nahi', 'अलविदा', 'बस', 'done', 'finish', 'khatam', 'खत्म'],
        answer: { hi: 'धन्यवाद! फिर कभी ज़रूरत हो तो स्क्रीन छुएं। 🙏', en: 'Thank you! Touch the screen anytime. 🙏' },
    },
    {
        keywords: ['kaise ho', 'kaisa hai', 'how are', 'theek ho', 'कैसे हो', 'ठीक हो', 'aap kaun', 'kaun ho', 'tum kaun', 'आप कौन', 'who are you'],
        answer: { hi: 'मैं SUVIDHA Setu का assistant हूँ — हमेशा तैयार! 😊 बताइए क्या करना है?', en: 'I\'m SUVIDHA Setu\'s assistant — always ready! 😊 What can I do?' },
    },
    {
        keywords: ['repeat', 'dubara', 'dobara', 'fir se', 'phir se', 'again', 'kya bola', 'samjha nahi', 'दुबारा', 'दोबारा', 'फिर से', 'समझा नहीं', 'ek bar', 'pardon'],
        answer: { hi: 'ज़रूर! बिजली/पानी/गैस बिल भरें, शिकायत दर्ज करें, या Property Tax। बोलिए क्या करना है?', en: 'Sure! Pay bills, complaints, or property tax. What would you like?' },
    },
    {
        keywords: ['confused', 'pata nahi', 'nahi pata', 'dont know', 'samajh nahi', 'kuch nahi', 'पता नहीं', 'समझ नहीं', 'kya karu', 'क्या करूं', 'not sure'],
        answer: { hi: 'कोई बात नही! "बिजली", "पानी", "गैस" बोलें बिल के लिए। "शिकायत" बोलें रिपोर्ट के लिए।', en: 'No worries! Say "electricity", "water", "gas" for bills. "complaint" to report.' },
    },

    // ── FASTag, LPG, Meter ──
    {
        keywords: ['fastag', 'fast tag', 'toll', 'highway', 'फास्टैग', 'टोल', 'हाईवे', 'recharge fastag', 'tag balance'],
        answer: { hi: 'FASTag रीचार्ज — Citizen Login करें, डैशबोर्ड में विकल्प है।', en: 'FASTag recharge — login as Citizen, option on dashboard.' },
    },
    {
        keywords: ['lpg', 'subsidy', 'subsidi', 'gas subsidy', 'एलपीजी', 'सब्सिडी', 'cylinder subsidy', 'ujjwala', 'उज्ज्वला'],
        answer: { hi: 'LPG सब्सिडी स्टेटस Citizen Login से देखें। सब्सिडी सीधे बैंक में आती है।', en: 'LPG subsidy — login as Citizen. Subsidy to bank directly.' },
    },
    {
        keywords: ['meter reading', 'reading submit', 'reading dena', 'reading bhejo', 'मीटर रीडिंग', 'self reading'],
        answer: { hi: 'मीटर रीडिंग — Citizen Login करें, फोटो खींचें या नंबर डालें।', en: 'Meter reading — login as Citizen, photo or manual entry.' },
    },

    // ── ERROR SCENARIOS ──
    {
        keywords: ['payment fail', 'fail ho gaya', 'nahi hua', 'error', 'decline', 'reject', 'फेल', 'नहीं हुआ', 'एरर'],
        answer: { hi: 'भुगतान फेल? चिंता न करें! 24-48 घंटे में वापस आ जाएगा। दुबारा कोशिश करें।', en: 'Payment failed? Refund in 24-48 hours. Try again.' },
    },
    {
        keywords: ['otp nahi aaya', 'otp not received', 'code nahi', 'ओटीपी नहीं', 'otp expire', 'otp galat', 'wrong otp'],
        answer: { hi: 'OTP नहीं? 30 सेकंड रुकें, "Resend OTP" दबाएं। मोबाइल आधार से लिंक होना चाहिए।', en: 'No OTP? Wait 30 sec, "Resend OTP". Mobile must be Aadhaar-linked.' },
    },
    {
        keywords: ['session', 'timeout', 'expire', 'logout', 'सेशन', 'टाइमआउट', 'time out'],
        answer: { hi: '2 मिनट बाद session बंद हो जाता है। स्क्रीन छुएं, फिर से शुरू।', en: 'Session expires after 2 min. Touch screen to restart.' },
    },
    {
        keywords: ['network error', 'no internet', 'signal nahi', 'net nahi', 'नेटवर्क', 'सिग्नल नहीं', 'wifi'],
        answer: { hi: 'नेटवर्क समस्या? ऑफलाइन मोड चालू — भुगतान सेव होगा, बाद में सिंक।', en: 'Network issue? Offline mode — payments saved, sync later.' },
    },
    {
        keywords: ['wrong number', 'galat number', 'गलत नंबर', 'bill nahi mila', 'not found', 'nahi mila', 'नहीं मिला'],
        answer: { hi: 'बिल नहीं मिला? Number चेक करें। Demo: कोई भी number चलेगा।', en: 'Not found? Check number. Demo: any number works.' },
    },

    // ── CASH, REFUND ──
    {
        keywords: ['cash kaise', 'note kaise', 'paisa dalu', 'नोट कैसे', 'कैश कैसे', 'cash machine'],
        answer: { hi: 'Cash: नोट एक-एक डालें (₹10-500)। पूरा amount पर "Pay" दबाएं।', en: 'Cash: Insert notes (₹10-500). Press "Pay" when done.' },
    },
    {
        keywords: ['refund', 'wapas', 'paisa wapas', 'रिफंड', 'पैसा वापस', 'extra paisa'],
        answer: { hi: 'रिफंड 24-48 घंटे में बैंक में। Transaction ID से track करें।', en: 'Refund 24-48 hrs to bank. Track via Transaction ID.' },
    },

    // ── HINGLISH BILL PHRASES WITH ACTIONS ──
    {
        keywords: ['bill bharna', 'bill bharna hai', 'बिल भरना', 'bill pay karna', 'bill dena', 'बिल देना'],
        answer: { hi: 'ज़रूर! कौन सा? बिजली, पानी, या गैस?', en: 'Sure! Electricity, Water, or Gas?' },
    },
    {
        keywords: ['bijli ka bill', 'bijli bill bharo', 'light bill', 'बिजली का बिल', 'बिजली बिल भरो', 'लाइट बिल', 'electricity bill pay', 'bijli ka bil bharna', 'bijli ka bill bharna'],
        answer: {
            hi: 'ठीक है, बिजली बिल भरने का पेज खोल रहा हूँ। इसमें खाता संख्या डालें जो आपको यहाँ से मिली होगी आपके पास होगी — आपके पुराने बिजली बिल पर ऊपर बाईं तरफ लिखी होती है, जैसे PSEB-123456। नीचे नंबर पैड से डालें या QR कोड स्कैन करें।',
            en: 'Opening electricity bill page. Enter your account number like PSEB-123456 from your previous bill. Use keypad or scan QR.',
        },
        action: 'navigate_bill_electricity',
    },
    {
        keywords: ['pani ka bill', 'pani bill bharo', 'water bill pay', 'पानी का बिल', 'पानी बिल भरो', 'pani ka bil bharna', 'pani ka bill bharna'],
        answer: {
            hi: 'ठीक है, पानी बिल भरने का पेज खोल रहा हूँ। इसमें खाता संख्या डालें जो आपके पानी के बिल पर ऊपर लिखी होती है — जैसे PHED-789012। नंबर पैड से डालें या QR स्कैन करें।',
            en: 'Opening water bill page. Enter your account number like PHED-789012 from your water bill. Use keypad or scan QR.',
        },
        action: 'navigate_bill_water',
    },
    {
        keywords: ['gas ka bill', 'gas bill bharo', 'गैस का बिल', 'गैस बिल भरो', 'rasoi gas', 'gas bill pay', 'gas ka bil bharna', 'gas ka bill bharna'],
        answer: {
            hi: 'ठीक है, गैस बिल भरने का पेज खोल रहा हूँ। इसमें LPG ID या खाता संख्या डालें — जैसे GPL-345678। यह आपकी गैस बुक या सिलेंडर रसीद पर लिखी होती है। नंबर पैड से डालें।',
            en: 'Opening gas bill page. Enter your LPG ID like GPL-345678 from your gas book or cylinder receipt. Use keypad.',
        },
        action: 'navigate_bill_gas',
    },

    // ── ACCESSIBILITY ──
    {
        keywords: ['blind', 'netra', 'nazar', 'dikh nahi', 'accessibility', 'नेत्र', 'दिखाई नहीं', 'दृष्टिबाधित'],
        answer: { hi: 'Accessibility: ♿ बटन दबाएं (header)। मैं सब बोलकर बताऊंगा।', en: 'Press ♿ in header. I\'ll describe everything.' },
    },

    // ── SPECIFIC COMPLAINTS ──
    {
        keywords: ['light nahi jal rahi', 'bulb kharab', 'andhera', 'roshni nahi', 'streetlight', 'लाइट नहीं', 'अंधेरा'],
        answer: { hi: 'स्ट्रीटलाइट: "शिकायत" → "Broken Streetlight" → जगह → फोटो।', en: 'Streetlight: "complaint" → "Broken Streetlight" → location → photo.' },
    },
    {
        keywords: ['pani nahi aa raha', 'tap band', 'pipe tuta', 'nal se pani nahi', 'leak', 'पानी नहीं', 'नल बंद', 'लीक'],
        answer: { hi: 'पानी: "शिकायत" → "Water Supply" → समस्या बताएं → फोटो।', en: 'Water: "complaint" → "Water Supply" → describe → photo.' },
    },
    {
        keywords: ['sadak tuti', 'gaddha', 'road kharab', 'pothole', 'सड़क टूटी', 'गड्ढा'],
        answer: { hi: 'सड़क: "शिकायत" → "Road Damage" → जगह → फोटो।', en: 'Road: "complaint" → "Road Damage" → location → photo.' },
    },
    {
        keywords: ['kachra', 'garbage', 'gandagi', 'safai nahi', 'कचरा', 'गंदगी', 'सफाई नहीं'],
        answer: { hi: 'कचरा: "शिकायत" → "Garbage Collection" → कहाँ → फोटो।', en: 'Garbage: "complaint" → "Garbage Collection" → where → photo.' },
    },
    {
        keywords: ['voltage kam', 'bijli aa jaa rahi', 'current problem', 'बिजली कम ज्यादा', 'वोल्टेज'],
        answer: { hi: 'वोल्टेज: "शिकायत" → "Voltage Fluctuation" → कब से → कितनी बार।', en: 'Voltage: "complaint" → "Voltage Fluctuation" → since when → how often.' },
    },

    // ── GATEWAY ──
    {
        keywords: ['citizen kya', 'guest kya', 'fark kya', 'difference', 'सिटिज़न', 'गेस्ट', 'फ़र्क', 'अंतर'],
        answer: { hi: 'Citizen = आधार लॉगिन (सारी सेवाएं)। Guest = बिना लॉगिन (बिल + शिकायत)।', en: 'Citizen = Aadhaar login (all). Guest = no login (bills + complaints).' },
    },
    {
        keywords: ['guest chalo', 'bina login', 'seedha bill', 'guest mode', 'बिना लॉगिन', 'सीधा बिल'],
        answer: { hi: 'Guest mode — बिना लॉगिन बिल भुगतान। कौन सा बिल?', en: 'Guest mode — bills without login. Which bill?' },
        action: 'set_screen_guest',
    },
    {
        keywords: ['citizen chalo', 'login karo', 'aadhaar lagao', 'angootha lagao', 'लॉगिन करो', 'अंगूठा लगाओ'],
        answer: { hi: 'चलिए आधार से लॉगिन — अंगूठा सबसे आसान।', en: 'Let\'s login — thumb is easiest.' },
        action: 'set_screen_citizen_auth',
    },

    // ── MISC ──
    {
        keywords: ['time', 'timing', 'kab tak khula', 'working hours', 'समय', 'khula hai'],
        answer: { hi: 'कियोस्क 24/7 है — कभी भी आएं!', en: 'Kiosk is 24/7!' },
    },
    {
        keywords: ['balance', 'baki', 'bakaya', 'बैलेंस', 'बकाया', 'बाकी'],
        answer: { hi: 'बकाया: consumer number डालें → "Fetch Bill"।', en: 'Balance: consumer number → "Fetch Bill".' },
    },
    {
        keywords: ['kitne paise', 'total kitna', 'amount btao', 'कितने पैसे', 'अमाउंट बताओ'],
        answer: { hi: 'राशि: consumer number डालें — मैं बोलकर बता दूंगा।', en: 'Amount: enter consumer number — I\'ll read it.' },
    },
    {
        keywords: ['upload fail', 'document fail', 'अपलोड नहीं'],
        answer: { hi: 'फोटो 5MB से कम। दुबारा "📸 Photo" दबाएं।', en: 'Photo under 5MB. Try "📸 Photo" again.' },
    },
    {
        keywords: ['account not found', 'khata nahi', 'अकाउंट नहीं'],
        answer: { hi: 'Number/Aadhaar दोबारा चेक करें।', en: 'Recheck number/Aadhaar.' },
    },
    {
        keywords: ['aage', 'next', 'आगे', 'proceed', 'continue', 'आगे बढ़ो'],
        answer: { hi: '"Continue" या "Proceed" बटन दबाएं।', en: 'Press "Continue" or "Proceed".' },
    },
    {
        keywords: ['peeche jao', 'wapas jao', 'वापस', 'पीछे', 'go back', 'laut'],
        answer: { hi: 'ठीक है, पिछले पेज पर चलते हैं।', en: 'Going back.' },
        action: 'go_back',
    },
    {
        keywords: ['home jao', 'ghar chalo', 'main page', 'shuru se', 'होम', 'main menu'],
        answer: { hi: 'होम पेज पर चलते हैं — सारी सेवाएं वहाँ हैं।', en: 'Going to home page — all services there.' },
        action: 'navigate_home',
    },
];

// ══════════════════════════════════════════════════════
// MEGA KB — 60+ entries: step-by-step flows, edge cases,
// conversational, contextual, blind-mode, elderly help
// ══════════════════════════════════════════════════════

export const MEGA_QA = [
    // ── STEP-BY-STEP BILL PAYMENT ──
    {
        keywords: ['bill kaise bhare', 'bill kaise bharna', 'बिल कैसे भरें', 'how to pay bill', 'bill bharna sikhao', 'process kya hai'],
        answer: { hi: 'बिल भरने के 4 स्टेप: 1️⃣ बिल टाइप चुनें (बिजली/पानी/गैस) 2️⃣ Consumer Number डालें 3️⃣ बिल देखें और \"Pay\" दबाएं 4️⃣ UPI/Card/Cash से भुगतान करें। बस! रसीद मिल जाएगी।', en: '4 steps: 1️⃣ Choose bill type 2️⃣ Enter consumer number 3️⃣ View bill & press Pay 4️⃣ Pay via UPI/Card/Cash. Done! Receipt generated.' }
    },
    {
        keywords: ['consumer number kaise dale', 'number type kaise kare', 'number kaise likhe', 'कंज्यूमर नंबर कैसे डालें'],
        answer: { hi: 'नीचे नंबर पैड दिख रहा है — 0-9 बटन से नंबर डालें। PSEB- जैसे अक्षर ऊपर टेक्स्ट बॉक्स में टाइप करें। ⌫ से मिटाएं, C से सब साफ।', en: 'Use the number pad below (0-9). Type letters like PSEB- in the text box above. ⌫ to delete, C to clear all.' }
    },
    {
        keywords: ['fetch bill', 'bill lao', 'bill dikhao', 'बिल लाओ', 'बिल दिखाओ', 'bill nikalo'],
        answer: { hi: 'Consumer number डालने के बाद \"Fetch Bill\" बटन दबाएं — 2-3 सेकंड में बिल आ जाएगा। नाम, राशि, यूनिट, ड्यू डेट सब दिखेगा।', en: 'After entering consumer number, press \"Fetch Bill\" — bill loads in 2-3 seconds with name, amount, units, due date.' }
    },
    {
        keywords: ['pay kaise kare', 'bhugtan kaise', 'payment kaise karu', 'भुगतान कैसे करूं', 'kaise pay hoga'],
        answer: { hi: 'बिल दिखने के बाद \"Pay Now\" दबाएं। 3 तरीके: UPI (QR स्कैन करें), Card (नंबर डालें), Cash (नोट मशीन में डालें)। 2-3 सेकंड में हो जाएगा।', en: 'After bill shows, press \"Pay Now\". 3 ways: UPI (scan QR), Card (enter details), Cash (insert notes). Takes 2-3 seconds.' }
    },

    // ── AADHAAR AUTH DETAILS ──
    {
        keywords: ['angootha kaise lagaye', 'fingerprint kaise', 'thumb kahan lagaye', 'अंगूठा कैसे लगाएं', 'scanner kahan hai'],
        answer: { hi: 'नीचे बायोमेट्रिक स्कैनर है — उस पर अंगूठा या उंगली रखें। 2-3 सेकंड तक रखें, हरी लाइट आएगी तो हो गया। अंगूठा साफ और सूखा होना चाहिए।', en: 'Place thumb on the scanner below. Hold 2-3 seconds until green light. Keep thumb clean and dry.' }
    },
    {
        keywords: ['iris kaise', 'aankh kaise', 'eye scan', 'आँख स्कैन कैसे', 'aankh dikhao'],
        answer: { hi: 'कैमरे की तरफ सीधा देखें — आँख खुली रखें, चश्मा उतार दें। 2-3 सेकंड में स्कैन हो जाएगा। अगर नहीं हो तो OTP पर जाएं।', en: 'Look straight at camera, eye open, remove glasses. 2-3 seconds. If it fails, try OTP instead.' }
    },
    {
        keywords: ['otp kaise use kare', 'otp process', 'mobile number dalu', 'ओटीपी कैसे', 'otp kahan dale'],
        answer: { hi: 'OTP: 1️⃣ आधार से लिंक मोबाइल नंबर डालें 2️⃣ \"Send OTP\" दबाएं 3️⃣ फोन पर 6 अंक का कोड आएगा 4️⃣ कोड डालें → लॉगिन! 2 मिनट में expire होता है।', en: 'OTP: 1️⃣ Enter Aadhaar-linked mobile 2️⃣ Press Send OTP 3️⃣ Enter 6-digit code from phone 4️⃣ Login! Expires in 2 min.' }
    },
    {
        keywords: ['biometric fail', 'angootha nahi laga', 'scan fail', 'बायोमेट्रिक फेल', 'finger not working'],
        answer: { hi: 'अंगूठा नहीं लगा? अंगूठा साफ करें, ज़ोर से दबाएं। नहीं हो तो Iris (आँख) या OTP ट्राई करें — तीनों तरीके हैं।', en: 'Thumb failed? Clean and press firmly. Try Iris or OTP — all 3 methods available.' }
    },

    // ── DASHBOARD NAVIGATION ──
    {
        keywords: ['dashboard me kya hai', 'dashboard dikhao', 'डॅशबोर्ड', 'mera account', 'mere bills', 'मेरे बिल'],
        answer: { hi: 'डैशबोर्ड में 3 भाग: 1️⃣ Your Bills — बकाया बिल दिखते हैं 2️⃣ Your Complaints — पुरानी शिकायतें 3️⃣ Services — नया कनेक्शन, नाम बदलाव, सर्टिफिकेट। बोलें क्या देखना है!', en: 'Dashboard has 3 sections: 1️⃣ Your Bills 2️⃣ Your Complaints 3️⃣ Services (new connection, name change, cert). What to see?' }
    },
    {
        keywords: ['pending bill', 'bakaya bill', 'unpaid', 'बकाया बिल', 'kitna bacha', 'koi bill bacha'],
        answer: { hi: 'बकाया बिल डैशबोर्ड में \"Your Bills\" सेक्शन में दिखते हैं — लाल = overdue, पीला = जल्दी भरें, हरा = भर दिया। किसी पर क्लिक करें भुगतान के लिए।', en: 'Pending bills in \"Your Bills\" — red = overdue, yellow = due soon, green = paid. Click any to pay.' }
    },

    // ── PAYMENT CONFIRMATION & RECEIPT ──
    {
        keywords: ['transaction id', 'ट्रांजैक्शन', 'reference number', 'ref number', 'payment proof'],
        answer: { hi: 'Transaction ID भुगतान सफल होने पर मिलता है — TXN- से शुरू होता है। रसीद में भी लिखा होता है। इसे लिख लें या PDF डाउनलोड करें।', en: 'Transaction ID starts with TXN- after payment. It\'s on the receipt. Note it down or download PDF.' }
    },
    {
        keywords: ['receipt kahan', 'raseed kahan', 'pdf kahan', 'रसीद कहाँ', 'download kahan se'],
        answer: { hi: 'भुगतान के बाद हरी स्क्रीन पर \"📥 Download Receipt\" बटन दिखता है — वहाँ से PDF मिलेगी। प्रिंट भी कर सकते हैं।', en: 'After payment, green screen shows \"📥 Download Receipt\" button — get PDF there. Print option also available.' }
    },
    {
        keywords: ['print kaise', 'छापो', 'printer', 'प्रिंट कैसे', 'print receipt'],
        answer: { hi: '\"🖨️ Print\" बटन दबाएं — रसीद प्रिंट हो जाएगी। अगर प्रिंटर नहीं है तो PDF डाउनलोड करें।', en: 'Press \"🖨️ Print\" button. If no printer, download PDF instead.' }
    },

    // ── DOUBLE/PARTIAL PAYMENT EDGE CASES ──
    {
        keywords: ['double payment', 'do baar', 'दो बार', 'duplicate', 'dobara cut', 'paisa kat gaya'],
        answer: { hi: 'दो बार कट गया? चिंता न करें — Transaction ID नोट करें, 48 घंटे में extra amount refund हो जाएगा। शिकायत भी दर्ज कर सकते हैं।', en: 'Double charged? Note Transaction ID — extra refunded in 48 hours. Can also file a complaint.' }
    },
    {
        keywords: ['partial payment', 'aadha pay', 'kam pay', 'आधा', 'कम भरना', 'can i pay less'],
        answer: { hi: 'पूरा बिल भरना ज़रूरी है — आधा भुगतान नहीं हो सकता। पूरी राशि UPI, Card, या Cash से भरें।', en: 'Full amount required — partial payment not allowed. Pay full via UPI, Card, or Cash.' }
    },
    {
        keywords: ['late fee', 'jur', 'fine', 'penalty', 'जुर्माना', 'लेट फीस', 'surcharge'],
        answer: { hi: 'ड्यू डेट के बाद जुर्माना लग सकता है (2-5%)। समय पर भरें! बिल में ड्यू डेट लिखी होती है।', en: 'Late fee 2-5% after due date. Pay on time! Due date shown on bill.' }
    },

    // ── CONVERSATIONAL — FRUSTRATION, URGENCY ──
    {
        keywords: ['kaam nahi kar raha', 'काम नहीं कर रहा', 'not working', 'problem hai', 'stuck', 'अटक गया', 'hang ho gaya'],
        answer: { hi: 'माफ़ कीजिए! स्क्रीन छुएं और शुरू से आएं, या \"वापस\" बोलें। अगर फिर भी अटके तो मुझसे बोलें — मैं गाइड करूँगा।', en: 'Sorry! Touch screen to restart, or say \"go back\". If still stuck, tell me — I\'ll guide you.' }
    },
    {
        keywords: ['jaldi karo', 'जल्दी', 'hurry', 'fast', 'quick', 'time nahi hai', 'urgent'],
        answer: { hi: 'जी हाँ! सीधे बोलें — \"बिजली बिल\" या \"पानी बिल\"। मैं तुरंत ले जाऊंगा, कोई wait नहीं!', en: 'Yes! Just say \"electricity bill\" or \"water bill\". I\'ll take you directly, no wait!' }
    },
    {
        keywords: ['bore ho gaya', 'बोर', 'bored', 'boring', 'bekaar', 'बेकार'],
        answer: { hi: 'अरे! 😄 चलो जल्दी काम निपटा लेते हैं — बिल भरें या शिकायत दर्ज करें। 2 मिनट में हो जाएगा!', en: 'Hey! 😄 Let\'s finish quickly — pay a bill or file a complaint. Done in 2 minutes!' }
    },
    {
        keywords: ['acha nahi laga', 'pasand nahi', 'पसंद नहीं', 'not good', 'improve karo', 'बहतर करो'],
        answer: { hi: 'आपकी राय ज़रूरी है! \"शिकायत\" में \"Other\" → feedback लिखें। हम सुधारेंगे। 🙏', en: 'Your feedback matters! \"Complaint\" → \"Other\" → write feedback. We\'ll improve. 🙏' }
    },

    // ── ELDERLY & FIRST-TIME USERS ──
    {
        keywords: ['pehli baar', 'first time', 'naya hoon', 'पहली बार', 'नया हूँ', 'sikhao', 'सिखाओ', 'kaise use kare'],
        answer: { hi: 'कोई बात नहीं, मैं हूँ ना! 😊 बस बोलिए क्या करना है — \"बिजली बिल भरना है\", \"शिकायत करनी है\"। मैं हर स्टेप पर गाइड करूँगा। डरिए मत!', en: 'No worries, I\'m here! 😊 Just say what you need — I\'ll guide every step. Don\'t worry!' }
    },
    {
        keywords: ['samajh nahi aata', 'mushkil', 'difficult', 'complex', 'मुश्किल', 'complicated', 'confusing'],
        answer: { hi: 'बिल्कुल आसान है! बस 3 बातें: 1️⃣ बोलें क्या करना है 2️⃣ Consumer number डालें 3️⃣ Pay करें। मैं हर कदम बोलकर बताऊंगा।', en: 'Super easy! 3 things: 1️⃣ Tell me what to do 2️⃣ Enter number 3️⃣ Pay. I\'ll guide every step.' }
    },
    {
        keywords: ['budhe', 'old', 'senior citizen', 'बुजुर्ग', 'dada ji', 'nani', 'grandfather', 'grandmother'],
        answer: { hi: 'बुजुर्गों के लिए सबसे आसान — बोलकर सब हो जाएगा! \"बिजली बिल\" बोलें, बाकी सब मैं करा दूंगा। ♿ बटन दबाएं तो और आसान हो जाएगा।', en: 'Easiest for seniors — just speak! Say \"electricity bill\", I\'ll handle the rest. Press ♿ for extra guidance.' }
    },

    // ── BLIND MODE SPECIFIC ──
    {
        keywords: ['blind mode kya', 'ब्लाइंड मोड क्या', 'accessibility kya', 'drishti badhit', 'visually impaired'],
        answer: { hi: 'Blind Mode में मैं सब कुछ बोलकर बताता हूँ — स्क्रीन पर क्या है, कितने पैसे हैं, कौन सा बटन दबाना है। ♿ बटन दबाएं ऊपर दाईं तरफ।', en: 'Blind Mode: I describe everything — screen content, amounts, which button to press. Press ♿ button top-right.' }
    },
    {
        keywords: ['screen pe kya hai', 'kya dikh raha', 'स्क्रीन पर क्या है', 'batao kya hai', 'screen padhke batao'],
        answer: { hi: 'Blind Mode चालू करें (♿ बटन) — मैं स्क्रीन की हर चीज़ बोलकर बताऊंगा। या बोलें \"मदद\" — मैं बताऊंगा क्या हो रहा है।', en: 'Enable Blind Mode (♿). I\'ll read everything on screen. Or say \"help\" — I\'ll describe what\'s happening.' }
    },

    // ── SPECIFIC BILL QUERIES ──
    {
        keywords: ['bijli kitni aayi', 'electricity kitna', 'unit kitne', 'बिजली कितनी', 'consumption kitna'],
        answer: { hi: 'Consumer number डालें → \"Fetch Bill\" → यूनिट्स और राशि दोनों दिखेंगी। Demo: PSEB-123456 = 85 kWh, ₹450।', en: 'Enter consumer number → Fetch Bill → units and amount shown. Demo: PSEB-123456 = 85 kWh, ₹450.' }
    },
    {
        keywords: ['pani kitna', 'water bill kitna', 'पानी कितना', 'water consumption'],
        answer: { hi: 'पानी बिल: Consumer number (PHED-XXXXXX) डालें → Fetch Bill। Demo: PHED-789012 = 12 KL, ₹280।', en: 'Water bill: enter PHED-XXXXXX → Fetch Bill. Demo: PHED-789012 = 12 KL, ₹280.' }
    },
    {
        keywords: ['gas kitna', 'cylinder kitna', 'गैस कितना', 'lpg bill kitna'],
        answer: { hi: 'गैस बिल: LPG ID (GPL-XXXXXX) डालें → Fetch Bill। Demo: GPL-345678 = 3 सिलेंडर, ₹620।', en: 'Gas bill: enter GPL-XXXXXX → Fetch Bill. Demo: GPL-345678 = 3 cylinders, ₹620.' }
    },

    // ── UPI SPECIFIC ──
    {
        keywords: ['upi kaise kare', 'upi se kaise', 'qr scan kaise', 'यूपीआई कैसे', 'gpay se kaise', 'phonepe se kaise'],
        answer: { hi: 'UPI: 1️⃣ \"UPI\" बटन दबाएं 2️⃣ QR कोड दिखेगा 3️⃣ GPay/PhonePe/Paytm से QR स्कैन करें 4️⃣ Amount डालें → Pay। 10 सेकंड में हो जाएगा!', en: 'UPI: 1️⃣ Press UPI 2️⃣ QR shown 3️⃣ Scan with GPay/PhonePe/Paytm 4️⃣ Enter amount → Pay. 10 seconds!' }
    },
    {
        keywords: ['card se kaise', 'debit card', 'credit card', 'कार्ड से कैसे', 'card swipe'],
        answer: { hi: 'Card: 1️⃣ \"Card\" बटन दबाएं 2️⃣ कार्ड स्वाइप करें या नंबर डालें 3️⃣ PIN डालें → Pay। Debit और Credit दोनों चलते हैं।', en: 'Card: 1️⃣ Press Card 2️⃣ Swipe or enter number 3️⃣ Enter PIN → Pay. Debit & Credit both work.' }
    },
    {
        keywords: ['cash se kaise', 'note kaise dalu', 'paisa machine me', 'कैश से कैसे', 'नोट डालने'],
        answer: { hi: 'Cash: 1️⃣ \"Cash\" बटन दबाएं 2️⃣ नोट एक-एक करके मशीन में डालें (₹10-500) 3️⃣ पूरी राशि डालें → \"Confirm\" दबाएं। बाकी पैसे मशीन वापस देगी।', en: 'Cash: 1️⃣ Press Cash 2️⃣ Insert notes one by one (₹10-500) 3️⃣ Full amount → Confirm. Machine returns change.' }
    },

    // ── COMPLAINT FOLLOW-UPS ──
    {
        keywords: ['shikayat kab hogi', 'complaint kab solve', 'kitne din', 'शिकायत कब', 'action kab'],
        answer: { hi: '48 घंटे में कार्रवाई होती है। Citizen Login से \"My Complaints\" में स्टेटस देखें। हरा = हो गया, पीला = चल रहा है।', en: 'Action within 48 hours. Check status in \"My Complaints\" after login. Green = done, yellow = in progress.' }
    },
    {
        keywords: ['shikayat cancel', 'complaint cancel', 'शिकायत कैंसल', 'hata do', 'delete complaint'],
        answer: { hi: 'शिकायत कैंसल करने के लिए Citizen Login करें → \"My Complaints\" → शिकायत खोलें → \"Cancel\" बटन।', en: 'To cancel: Login → My Complaints → open complaint → Cancel button.' }
    },
    {
        keywords: ['ek aur shikayat', 'one more complaint', 'और शिकायत', 'nai shikayat', 'another complaint'],
        answer: { hi: 'ज़रूर! \"शिकायत\" बोलें या बटन दबाएं — नई शिकायत दर्ज करें। कितनी भी शिकायतें कर सकते हैं!', en: 'Sure! Say \"complaint\" — file as many as you want!' }
    },

    // ── NAVIGATION COMMANDS ──
    {
        keywords: ['electricity page', 'bijli page', 'बिजली पेज', 'electricity pe le jao', 'bijli wala page'],
        answer: { hi: 'बिजली बिल पेज पर ले जा रहा हूँ! Consumer number तैयार रखें।', en: 'Going to electricity bill page! Keep consumer number ready.' },
        action: 'navigate_bill_electricity'
    },
    {
        keywords: ['water page', 'pani page', 'पानी पेज', 'water pe le jao', 'pani wala page'],
        answer: { hi: 'पानी बिल पेज पर ले जा रहा हूँ! Consumer number तैयार रखें।', en: 'Going to water bill page! Keep consumer number ready.' },
        action: 'navigate_bill_water'
    },
    {
        keywords: ['gas page', 'gas pe le jao', 'गैस पेज', 'gas wala page'],
        answer: { hi: 'गैस बिल पेज पर ले जा रहा हूँ! LPG ID तैयार रखें।', en: 'Going to gas bill page! Keep LPG ID ready.' },
        action: 'navigate_bill_gas'
    },
    {
        keywords: ['complaint page', 'shikayat page', 'शिकायत पेज', 'complaint pe le jao'],
        answer: { hi: 'शिकायत पेज पर ले जा रहा हूँ! बताइए क्या समस्या है।', en: 'Going to complaint page! Tell me the issue.' },
        action: 'navigate_complaint'
    },

    // ── WHAT IF QUESTIONS ──
    {
        keywords: ['galat bill', 'wrong bill', 'गलत बिल', 'bill galat hai', 'amount galat'],
        answer: { hi: 'बिल गलत लग रहा है? शिकायत दर्ज करें — \"शिकायत\" → \"Other\" → \"Bill amount incorrect\" लिखें। Consumer number ज़रूर डालें।', en: 'Wrong bill? File complaint → Other → \"Bill amount incorrect\". Include consumer number.' }
    },
    {
        keywords: ['bill nahi aaya', 'bill generate nahi', 'बिल नहीं आया', 'no bill', 'bill missing'],
        answer: { hi: 'बिल नहीं आया? Consumer number डालें, अगर बिल generate नहीं हुआ तो बिजली/पानी ऑफिस से संपर्क करें। या शिकायत दर्ज करें।', en: 'No bill? Enter consumer number. If not generated, contact utility office or file complaint.' }
    },
    {
        keywords: ['kisi aur ka bill', 'dusre ka bill', 'someone else', 'किसी और का', 'relative ka', 'padosi ka', 'neighbor'],
        answer: { hi: 'किसी और का बिल? Guest Mode से भरें — बस उनका Consumer Number डालें। लॉगिन ज़रूरी नहीं! \"Guest\" बोलें।', en: 'Someone else\'s bill? Use Guest Mode — just enter their consumer number. No login needed! Say \"Guest\".' }
    },

    // ── PROPERTY TAX SPECIFIC ──
    {
        keywords: ['property tax kaise', 'ghar ka tax kaise', 'प्रॉपर्टी टैक्स कैसे', 'house tax kaise bhare', 'tax process'],
        answer: { hi: 'Property Tax: 1️⃣ होम पेज पर 🏠 बटन 2️⃣ Property ID डालें 3️⃣ Tax amount दिखेगा 4️⃣ UPI/Card/Cash से भरें। साल में एक बार भरना होता है।', en: 'Property Tax: 1️⃣ Press 🏠 on home 2️⃣ Enter Property ID 3️⃣ See amount 4️⃣ Pay via UPI/Card/Cash. Once a year.' }
    },
    {
        keywords: ['property id kahan', 'property number', 'प्रॉपर्टी आईडी', 'ghar ka number', 'tax id'],
        answer: { hi: 'Property ID आपके पिछले टैक्स रसीद पर या नगरपालिका ऑफिस से मिलेगी। Demo में कोई भी number चलेगा।', en: 'Property ID is on your previous tax receipt or from municipal office. Demo: any number works.' }
    },

    // ── EMOTIONAL & POLITE ──
    {
        keywords: ['maaf', 'sorry', 'galti', 'माफ', 'mistake', 'गलती'],
        answer: { hi: 'कोई बात नहीं! 😊 गलती हो सकती है। \"वापस\" बोलें और फिर से शुरू करें। मैं यहाँ हूँ।', en: 'No worries! 😊 Mistakes happen. Say \"go back\" and start again. I\'m here.' }
    },
    {
        keywords: ['bahut acha', 'great', 'awesome', 'amazing', 'बहुत अच्छा', 'excellent', 'perfect', 'shandar', 'शानदार'],
        answer: { hi: 'शुक्रिया! 😊 और कोई काम हो तो बताइए — मैं हमेशा तैयार हूँ!', en: 'Thanks! 😊 Need anything else? I\'m always ready!' }
    },
    {
        keywords: ['haso', 'joke', 'mazak', 'funny', 'hasao', 'मज़ाक', 'हंसाओ'],
        answer: { hi: 'एक बिल भरो, एक मुस्कान मुफ्त! 😄 चलो कोई बिल भर दें?', en: 'Pay one bill, get one smile free! 😄 Shall we pay a bill?' }
    },

    // ── MULTI-BILL ──
    {
        keywords: ['sab bill', 'all bills', 'सब बिल', 'sabka bill', 'ek saath', 'together', 'एक साथ'],
        answer: { hi: 'एक-एक करके भर सकते हैं — पहले बिजली, फिर पानी, फिर गैस। हर बार \"और बिल\" बोल दीजिए, मैं अगले पर ले जाऊंगा।', en: 'Pay one by one — electricity, then water, then gas. Say \"another bill\" after each. I\'ll navigate.' }
    },
    {
        keywords: ['aur bill', 'ek aur', 'another bill', 'और बिल', 'एक और', 'next bill', 'dusra bill'],
        answer: { hi: 'ज़रूर! कौन सा — बिजली, पानी, या गैस?', en: 'Sure! Which — electricity, water, or gas?' }
    },

    // ── NEW CONNECTION DETAILS ──
    {
        keywords: ['naya bijli connection', 'new electricity', 'नया बिजली कनेक्शन', 'meter lagwana'],
        answer: { hi: 'नया बिजली कनेक्शन: Citizen Login → Dashboard → \"New Connection\" → फॉर्म भरें → दस्तावेज अपलोड करें। 7-10 दिन में कनेक्शन।', en: 'New electricity: Login → Dashboard → New Connection → form → upload documents. Connected in 7-10 days.' }
    },
    {
        keywords: ['naya pani connection', 'new water', 'नया पानी कनेक्शन', 'nal lagwana'],
        answer: { hi: 'नया पानी कनेक्शन: Citizen Login → Dashboard → \"New Connection\" → Water चुनें → फॉर्म → दस्तावेज। 10-15 दिन।', en: 'New water: Login → Dashboard → New Connection → Water → form → docs. 10-15 days.' }
    },
    {
        keywords: ['naya gas connection', 'new gas', 'नया गैस कनेक्शन', 'gas lagwana', 'pipeline lagwana'],
        answer: { hi: 'नया गैस कनेक्शन: Citizen Login → Dashboard → \"New Connection\" → Gas/Pipeline चुनें। आधार, एड्रेस प्रूफ ज़रूरी। 15-20 दिन।', en: 'New gas: Login → Dashboard → New Connection → Gas/Pipeline. Aadhaar + address proof needed. 15-20 days.' }
    },

    // ── DOCUMENTS NEEDED ──
    {
        keywords: ['document chahiye', 'kya kya chahiye', 'दस्तावेज', 'papers', 'kaagaz', 'कागज़', 'documents required'],
        answer: { hi: 'दस्तावेज: 1️⃣ आधार कार्ड (ज़रूरी) 2️⃣ एड्रेस प्रूफ (बिजली बिल/राशन कार्ड) 3️⃣ पासपोर्ट फोटो। नया कनेक्शन/नाम बदलाव के लिए।', en: 'Documents: 1️⃣ Aadhaar (required) 2️⃣ Address proof 3️⃣ Passport photo. For new connection/name change.' }
    },

    // ── SAFETY & TRUST ──
    {
        keywords: ['dhokha', 'fraud', 'scam', 'fake', 'धोखा', 'फ्रॉड', 'cheat'],
        answer: { hi: 'SUVIDHA Setu सरकारी है — C-DAC द्वारा बना। भुगतान सुरक्षित है, Transaction ID मिलता है। किसी को OTP या PIN न बताएं!', en: 'SUVIDHA Setu is government-backed by C-DAC. Payments are secure with Transaction ID. Never share OTP/PIN!' }
    },
    {
        keywords: ['data safe', 'information safe', 'डेटा सेफ', 'meri jaankari', 'privacy'],
        answer: { hi: 'आपका डेटा 100% सुरक्षित — e-Pramaan encrypted है। बायोमेट्रिक data store नहीं होता। आधार सिर्फ verify के लिए।', en: 'Your data is 100% secure — e-Pramaan encrypted. Biometrics not stored. Aadhaar only for verification.' }
    },

    // ── GENERAL GREETINGS (more variations) ──
    {
        keywords: ['jai shri ram', 'jay shree krishna', 'radhe radhe', 'waheguru', 'जय श्री राम', 'राधे राधे', 'वाहेगुरु'],
        answer: { hi: 'जी 🙏 स्वागत है SUVIDHA Setu पर! बताइए क्या सेवा चाहिए?', en: 'Welcome to SUVIDHA Setu! 🙏 What service do you need?' }
    },
    {
        keywords: ['shubh prabhat', 'good night', 'शुभ प्रभात', 'शुभ रात्रि', 'suprabhat'],
        answer: { hi: 'शुभकामनाएं! 🙏 SUVIDHA Setu 24/7 उपलब्ध है। बताइए क्या करना है?', en: 'Greetings! 🙏 SUVIDHA Setu is 24/7. What can I do?' }
    },

    // ── LANGUAGE HELP ──
    {
        keywords: ['hindi me bolo', 'hindi mein', 'हिंदी में बोलो', 'hindi samjhao'],
        answer: { hi: 'जी, मैं हिंदी में बात कर रहा हूँ! बताइए क्या करना है?', en: 'Sure, switching to Hindi context! Tell me what you need?' }
    },
    {
        keywords: ['english me bolo', 'english mein', 'अंग्रेजी में', 'english please'],
        answer: { hi: 'Okay, I\'ll speak in English. What would you like to do?', en: 'Sure! What would you like to do?' }
    },
];

// ── HELPER FUNCTIONS ────────────────────────────────

export function matchesKeywords(text, keywords) {
    const lower = text.toLowerCase();
    return keywords.some(k => lower.includes(k));
}

export function detectBillType(text) {
    const lower = text.toLowerCase();
    for (const [type, words] of Object.entries(BILL_KEYWORDS)) {
        if (words.some(w => lower.includes(w))) return type;
    }
    return null;
}

export function detectComplaintCategory(text) {
    const lower = text.toLowerCase();
    for (const [cat, words] of Object.entries(COMPLAINT_CATEGORY_KEYWORDS)) {
        if (words.some(w => lower.includes(w))) return cat;
    }
    return null;
}

export function detectPaymentMethod(text) {
    const lower = text.toLowerCase();
    for (const [method, words] of Object.entries(PAYMENT_KEYWORDS)) {
        if (words.some(w => lower.includes(w))) return method;
    }
    return null;
}

/**
 * LAYER 2: Knowledge Base search with fuse.js fuzzy matching
 * Optimized for SHORT spoken inputs (1-3 words)
 *
 * Algorithm:
 * 1. Clean input (deduplicate, trim)
 * 2. Try exact keyword match (fast path)
 * 3. Use fuse.js with SHORT-INPUT optimized config
 * 4. Return best match if score acceptable
 */

import Fuse from 'fuse.js';

// Cache for fuse indices
let fuse_cache_short = null;  // Optimized for 1-3 word inputs
let fuse_cache_long = null;   // Optimized for full sentences

function getShortFuseIndex() {
    if (fuse_cache_short) return fuse_cache_short;

    const allQA = [...COMMON_QA, ...EXPANDED_QA, ...MEGA_QA];
    const documents = allQA.map((qa, idx) => ({
        idx,
        combined: qa.keywords.join(' '),
    }));

    // Config optimized for SHORT inputs (1-3 words like "bijli" or "water bill")
    fuse_cache_short = new Fuse(documents, {
        keys: ['combined'],
        threshold: 0.6,  // More lenient for short words
        minMatchCharLength: 1,  // Allow single-char matches
        distance: 100,  // Tolerance for character distance
        ignoreLocation: false,  // Match anywhere in string
        includeScore: true,
    });

    return fuse_cache_short;
}

function getLongFuseIndex() {
    if (fuse_cache_long) return fuse_cache_long;

    const allQA = [...COMMON_QA, ...EXPANDED_QA, ...MEGA_QA];
    const documents = allQA.map((qa, idx) => ({
        idx,
        combined: qa.keywords.join(' '),
    }));

    // Config for longer queries (full sentences)
    fuse_cache_long = new Fuse(documents, {
        keys: ['combined'],
        threshold: 0.3,  // Stricter for full sentences
        minMatchCharLength: 2,
        distance: 200,
        ignoreLocation: true,
        includeScore: true,
    });

    return fuse_cache_long;
}

/**
 * Clean KB input (same as speech processor)
 */
function cleanKBInput(text) {
    if (!text) return '';
    let cleaned = text.toLowerCase().trim();
    cleaned = cleaned.replace(/^[?!.,:;'"]+|[?!.,:;'"]+$/g, '');
    const words = cleaned.split(/\s+/).filter(w => w.length > 0);
    const deduped = [];
    let lastWord = '';
    for (const word of words) {
        if (word !== lastWord) {
            deduped.push(word);
            lastWord = word;
        }
    }
    return deduped.join(' ').trim();
}

export function findCommonAnswer(text, lang) {
    if (!text || text.trim().length === 0) return null;

    const cleaned = cleanKBInput(text);
    const lower = cleaned.toLowerCase();
    const allQA = [...COMMON_QA, ...EXPANDED_QA, ...MEGA_QA];

    // FAST PATH: Exact keyword match (most reliable)
    for (const qa of allQA) {
        if (qa.keywords.some(k => lower.includes(k.toLowerCase()))) {
            console.log(`[KB] Exact match found for "${cleaned}"`);
            return {
                text: qa.answer[lang] || qa.answer.en,
                action: qa.action || null,
            };
        }
    }

    // Determine if input is SHORT or LONG
    const wordCount = cleaned.split(/\s+/).length;
    const isShortInput = wordCount <= 3;

    // FUZZY PATH: Use appropriate fuse.js config
    try {
        const fuse = isShortInput ? getShortFuseIndex() : getLongFuseIndex();
        const results = fuse.search(lower);

        if (results.length > 0) {
            const topResult = results[0];
            const score = topResult.score;

            // Score threshold depends on input length
            const threshold = isShortInput ? 0.7 : 0.4;

            if (score < threshold) {
                console.log(`[KB] Fuzzy match (${isShortInput ? 'SHORT' : 'LONG'}) for "${cleaned}" (score: ${score.toFixed(2)})`);
                const qa = allQA[topResult.item.idx];
                return {
                    text: qa.answer[lang] || qa.answer.en,
                    action: qa.action || null,
                };
            }
        }
    } catch (err) {
        console.warn('[KB] Fuse.js search error:', err);
    }

    // No match found
    console.log(`[KB] No match for "${cleaned}"`);
    return null;
}

export function getPageGuidance(route, lang) {
    const g = RESPONSES.page_guidance[route];
    return g ? (g[lang] || g.en) : null;
}

export function getResponse(key, lang) {
    const r = RESPONSES[key];
    return r ? (r[lang] || r.en) : null;
}

export function getInitialGreeting(lang) {
    return INITIAL_GREETINGS[lang] || INITIAL_GREETINGS.en;
}
