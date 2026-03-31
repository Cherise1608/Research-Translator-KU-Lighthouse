import React, { useState, useEffect } from 'react';
import { FileText, Loader2, User, Beaker, Target, HelpCircle, BookOpen, AlertCircle, ExternalLink, CheckCircle, Users, Lightbulb, TrendingUp } from 'lucide-react';

// Translations object for bilingual support (Danish/English)
const translations = {
  da: {
    // Header & general
    title: 'Research Translator',
    subtitle: 'Fra forskningssprog til forretningskontekst',
    publicDataOnly: 'Kun offentlig data',

    // Input form
    urlPlaceholder: 'Paste Pure URL her (f.eks. https://pure.ku.dk/da/persons/123456)',
    nameOptional: 'Eller søg efter navn',
    namePlaceholder: 'F.eks. Morten Axel Pedersen',
    urlOptional: 'Pure URL (anbefalet)',
    generateBriefing: '📊 Generer Briefing',
    processing: 'Analyserer',

    // Instructions
    howTo: 'Sådan bruger du værktøjet:',
    step1: '1. Gå til pure.ku.dk og find forskeren',
    step2: '2. Kopier URL fra browser (Ctrl+L, Ctrl+C)',
    step3: '3. Paste URL i feltet herunder',
    step4: '4. ELLER indtast forskerens fulde navn',
    step5: '5. Klik "Generer Briefing"',

    // Tabs
    tabs: {
      who: 'Hvem er de?',
      what: 'Hvad forsker de i?',
      publications: 'Publikationer',
      applications: 'Anvendelse',
      questions: 'Spørgsmål',
      sources: 'Kilder'
    },

    // Buttons
    backToSearch: 'Ny søgning',
    exportPDF: 'Download PDF',
    exportWord: 'Download Word',

    // Warnings
    warning: 'VIGTIGT: Dette værktøj bruger kun offentlige data fra KU Pure.',
    doNotUpload: 'Upload IKKE POC-ansøgninger eller interne dokumenter.',
    verifyInfo: 'Verificer altid informationen',
    verifyInfoDesc: 'AI-genereret indhold kan indeholde fejl. Tjek altid kilder og faktuelle oplysninger før brug i møder.',

    // Demo
    quickDemo: '⚡ Quick demo',
    orText: 'ELLER PRØV DEMO:',
    orDivider: 'ELLER',

    // Profile labels
    background: 'Baggrund',
    teaching: 'Undervisning',
    primaryFocus: 'Primært Fokusområde',
    currentProjects: 'Aktuelle Projekter',
    collaborationNetwork: 'Samarbejdsnetværk',
    frequentCoAuthors: 'Hyppige medforfattere:',
    collaboratingInstitutions: 'Samarbejdsinstitutioner:',
    commercialPotential: 'Kommercielt potentiale:',

    // Research tab
    researchLanguageToBusinessContext: 'Forskningssprog oversat til forretningskontekst',
    researchLanguage: 'Forskningssprog:',
    translatedToYourLanguage: 'Oversat til dit sprog:',
    whyItMatters: 'Hvorfor det betyder noget',

    // Publications tab
    recentPublications: 'Seneste Publikationer',
    twoMostRecent: 'De 2 seneste publikationer',
    noPublications: 'Ingen publikationer tilgængelige i denne briefing.',

    // Applications tab
    whoAndHow: 'Hvem har gavn af forskningen og hvordan bruges den?',
    whoBenefits: 'Hvem har gavn?',
    howUsed: 'Hvordan bruges det?',
    impactAreas: 'Impact Områder',
    keyStakeholders: 'Nøgle Stakeholders',
    marketAnalysis: 'Markedsanalyse',
    competitors: 'Konkurrenter:',
    marketTrends: 'Markedstendenser:',
    potentialPitfalls: 'Potentielle Faldgruber:',

    // Questions tab
    questionsSubtitle: '5 spørgsmål baseret på forskerens specifikke metoder og resultater',
    whyAskThis: 'Hvorfor stille dette:',

    // Sources tab
    primarySources: 'Primære kilder til briefingen',
    personProfile: 'Type: Personprofil',
    instituteWebsite: 'Type: Instituttets hjemmeside',
    publicationSearch: 'Type: Publikationssøgning',
    researcherNetwork: 'Type: Forskerprofil & netværk',
    dataSecurity: 'Datasikkerhed',
    dataSecurityDesc: 'Baseret på offentligt tilgængelige data fra KU Pure. Ingen automatisk data-indsamling af personlige oplysninger.',

    // Footer
    generatedBy: 'Genereret af Research Translator v4.0 - KU Lighthouse',
    humanValidation: 'Human validation påkrævet før brug i møder',

    // Export
    preparingPDF: 'Forbereder PDF...',
    popupBlocked: 'Popup blev blokeret. Tillad popups og prøv igen.',
    printDialogOpened: 'Print dialog åbnet',
    exportFailed: 'Eksport fejlede',
    creatingWord: 'Opretter Word-dokument...',
    wordDownloaded: 'Word-dokument downloaded',

    // Errors
    enterUrlOrName: 'Indtast venligst enten Pure URL eller forskerens fulde navn',
    attemptingToFind: 'Forsøger at finde forsker...',
    fetchingProfile: 'Henter profil...',
    fetchingFromPure: 'Henter data fra Pure via proxy...',
    analyzingProfile: 'Analyserer profil...',
    generatingBriefing: 'Genererer briefing...',
    couldNotFetch: 'Kunne ikke hente data. Prøv igen eller brug en anden URL.',
    couldNotParse: 'Kunne ikke parse resultatet. URL\'en er muligvis ikke tilgængelig.',
    analysisFailed: 'Analyse fejlede. Tjek at URL\'en er korrekt og tilgængelig.',

    // Demo loading
    loadingDemo: 'Loader demo...',
    analyzing: 'Analyserer...',

    // Misc
    experimentalFeature: 'Søger på pure.ku.dk efter matchende forskere',
    focus: 'Fokus',

    // Button tooltips
    printOrSaveAsPDF: 'Print eller gem som PDF',
    downloadAsWord: 'Download som Word',

    // Researcher selection (new)
    selectResearcher: 'Vælg forsker',
    multipleResultsFound: 'Vi fandt flere forskere der matcher din søgning',
    selectCorrectResearcher: 'Vælg den rigtige forsker for at fortsætte',
    searchingForResearcher: 'Søger efter forsker...',
    parsingResults: 'Analyserer søgeresultater...',
    noResultsFound: 'Ingen forskere fundet',
    noResultsFoundDesc: 'Vi kunne ikke finde nogen forskere med det navn. Prøv at:',
    noResultsTip1: 'Tjek stavningen af navnet',
    noResultsTip2: 'Brug det fulde navn (fornavn og efternavn)',
    noResultsTip3: 'Søg direkte på pure.ku.dk og brug URL-metoden',
    searchAgain: 'Søg igen',
    generateBriefingFor: 'Generer briefing'
  },
  en: {
    // Header & general
    title: 'Research Translator',
    subtitle: 'From research language to business context',
    publicDataOnly: 'Public data only',

    // Input form
    urlPlaceholder: 'Paste Pure URL here (e.g. https://pure.ku.dk/da/persons/123456)',
    nameOptional: 'Or search by name',
    namePlaceholder: 'E.g. Morten Axel Pedersen',
    urlOptional: 'Pure URL (recommended)',
    generateBriefing: '📊 Generate Briefing',
    processing: 'Analyzing',

    // Instructions
    howTo: 'How to use this tool:',
    step1: '1. Go to pure.ku.dk and find the researcher',
    step2: '2. Copy URL from browser (Ctrl+L, Ctrl+C)',
    step3: '3. Paste URL in the field below',
    step4: '4. OR enter researcher\'s full name',
    step5: '5. Click "Generate Briefing"',

    // Tabs
    tabs: {
      who: 'Who are they?',
      what: 'What do they research?',
      publications: 'Publications',
      applications: 'Applications',
      questions: 'Questions',
      sources: 'Sources'
    },

    // Buttons
    backToSearch: 'New search',
    exportPDF: 'Download PDF',
    exportWord: 'Download Word',

    // Warnings
    warning: 'IMPORTANT: This tool only uses public data from KU Pure.',
    doNotUpload: 'Do NOT upload POC applications or internal documents.',
    verifyInfo: 'Always verify information',
    verifyInfoDesc: 'AI-generated content may contain errors. Always check sources and factual information before use in meetings.',

    // Demo
    quickDemo: '⚡ Quick demo',
    orText: 'OR TRY DEMO:',
    orDivider: 'OR',

    // Profile labels
    background: 'Background',
    teaching: 'Teaching',
    primaryFocus: 'Primary Focus Area',
    currentProjects: 'Current Projects',
    collaborationNetwork: 'Collaboration Network',
    frequentCoAuthors: 'Frequent co-authors:',
    collaboratingInstitutions: 'Collaborating institutions:',
    commercialPotential: 'Commercial potential:',

    // Research tab
    researchLanguageToBusinessContext: 'Research language translated to business context',
    researchLanguage: 'Research language:',
    translatedToYourLanguage: 'Translated to your language:',
    whyItMatters: 'Why it matters',

    // Publications tab
    recentPublications: 'Recent Publications',
    twoMostRecent: 'The 2 most recent publications',
    noPublications: 'No publications available in this briefing.',

    // Applications tab
    whoAndHow: 'Who benefits from the research and how is it used?',
    whoBenefits: 'Who benefits?',
    howUsed: 'How is it used?',
    impactAreas: 'Impact Areas',
    keyStakeholders: 'Key Stakeholders',
    marketAnalysis: 'Market Analysis',
    competitors: 'Competitors:',
    marketTrends: 'Market Trends:',
    potentialPitfalls: 'Potential Pitfalls:',

    // Questions tab
    questionsSubtitle: '5 questions based on the researcher\'s specific methods and results',
    whyAskThis: 'Why ask this:',

    // Sources tab
    primarySources: 'Primary sources for the briefing',
    personProfile: 'Type: Person profile',
    instituteWebsite: 'Type: Institute website',
    publicationSearch: 'Type: Publication search',
    researcherNetwork: 'Type: Researcher profile & network',
    dataSecurity: 'Data Security',
    dataSecurityDesc: 'Based on publicly available data from KU Pure. No automatic collection of personal information.',

    // Footer
    generatedBy: 'Generated by Research Translator v4.0 - KU Lighthouse',
    humanValidation: 'Human validation required before use in meetings',

    // Export
    preparingPDF: 'Preparing PDF...',
    popupBlocked: 'Popup blocked. Allow popups and try again.',
    printDialogOpened: 'Print dialog opened',
    exportFailed: 'Export failed',
    creatingWord: 'Creating Word document...',
    wordDownloaded: 'Word document downloaded',

    // Errors
    enterUrlOrName: 'Please enter either Pure URL or researcher\'s full name',
    attemptingToFind: 'Attempting to find researcher...',
    fetchingProfile: 'Fetching profile...',
    fetchingFromPure: 'Fetching data from Pure via proxy...',
    analyzingProfile: 'Analyzing profile...',
    generatingBriefing: 'Generating briefing...',
    couldNotFetch: 'Could not fetch data. Try again or use another URL.',
    couldNotParse: 'Could not parse result. URL may not be accessible.',
    analysisFailed: 'Analysis failed. Check that URL is correct and accessible.',

    // Demo loading
    loadingDemo: 'Loading demo...',
    analyzing: 'Analyzing...',

    // Misc
    experimentalFeature: 'Searches pure.ku.dk for matching researchers',
    focus: 'Focus',

    // Button tooltips
    printOrSaveAsPDF: 'Print or save as PDF',
    downloadAsWord: 'Download as Word',

    // Researcher selection (new)
    selectResearcher: 'Select researcher',
    multipleResultsFound: 'We found multiple researchers matching your search',
    selectCorrectResearcher: 'Select the correct researcher to continue',
    searchingForResearcher: 'Searching for researcher...',
    parsingResults: 'Analyzing search results...',
    noResultsFound: 'No researchers found',
    noResultsFoundDesc: 'We could not find any researchers with that name. Try to:',
    noResultsTip1: 'Check the spelling of the name',
    noResultsTip2: 'Use the full name (first and last name)',
    noResultsTip3: 'Search directly on pure.ku.dk and use the URL method',
    searchAgain: 'Search again',
    generateBriefingFor: 'Generate briefing'
  }
};

// Cloudflare Worker proxy URL — set via .env file: REACT_APP_PROXY_URL=https://your-worker.workers.dev
const PROXY_URL = process.env.REACT_APP_PROXY_URL || 'https://research-translator-ku-lighthouse.aneg.workers.dev/';

// Helper function to fetch KU Pure data through the proxy
const fetchViaProxy = async (url) => {
  const proxyUrl = `${PROXY_URL}/fetch?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Proxy fetch failed: ${response.status}`);
  }
  return response.text();
};

// Helper function to call Anthropic API through the proxy (API key is stored in Worker)
const callAnthropicViaProxy = async (body) => {
  const response = await fetch(`${PROXY_URL}/api/anthropic`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API call failed: ${response.status} - ${errorText}`);
  }
  return response.json();
};

export default function ResearchTranslator() {
  const [lang, setLang] = useState('da');
  const [state, setState] = useState('input'); // 'input' | 'processing' | 'selection' | 'briefing'
  const [inputUrl, setInputUrl] = useState('');
  const [inputName, setInputName] = useState('');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [searchResults, setSearchResults] = useState([]); // Array of researcher matches from name search
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [activeTab, setActiveTab] = useState('who');
  const [error, setError] = useState('');
  const [exportStatus, setExportStatus] = useState('');

  // Get translations for current language
  const t = translations[lang];

  // Inject print styles on mount
  useEffect(() => {
    const printStyles = document.createElement('style');
    printStyles.id = 'research-translator-print-styles';
    printStyles.textContent = `
      @media print {
        body * {
          visibility: hidden;
        }
        .print-content, .print-content * {
          visibility: visible;
        }
        .print-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .no-print {
          display: none !important;
        }
        @page {
          margin: 15mm;
          size: A4;
        }
      }
    `;
    document.head.appendChild(printStyles);

    return () => {
      const existingStyles = document.getElementById('research-translator-print-styles');
      if (existingStyles) {
        existingStyles.remove();
      }
    };
  }, []);

  // Test data with collaboration and publications
  const testResearchers = {
    'morten': {
      id: 'morten_pedersen',
      name: 'Morten Axel Pedersen',
      title: 'Professor',
      institute: 'Institut for Antropologi & SODAS',
      field: 'Computational Anthropology & Social Data Science',
      pureUrl: 'https://researchprofiles.ku.dk/en/persons/morten-axel-pedersen/',
      instituteUrl: 'https://anthropology.ku.dk',
      profile: {
        background: lang === 'da'
          ? 'Dansk antropolog, PhD fra University of Cambridge. Medstifter og tidligere direktør for Copenhagen Centre for Social Data Science (SODAS).'
          : 'Danish anthropologist, PhD from University of Cambridge. Co-founder and former director of Copenhagen Centre for Social Data Science (SODAS).',
        focus: lang === 'da'
          ? 'Kombinerer langtids-etnografisk feltarbejde i Asien og Europa med mixed digital methods og computational etnografi. Forsker i forholdet mellem politiske former og kulturelle forestillinger.'
          : 'Combines long-term ethnographic fieldwork in Asia and Europe with mixed digital methods and computational ethnography. Researches the relationship between political forms and cultural imaginaries.',
        currentProjects: lang === 'da'
          ? 'PI på ERC Advanced Grant "The Political Economy of Attention". Har tidligere modtaget Sapere Aude forskningsleder-bevilling fra DFF.'
          : 'PI on ERC Advanced Grant "The Political Economy of Attention". Previously received Sapere Aude research leader grant from DFF.',
        teaching: lang === 'da'
          ? 'Social Antropologi, Social Data Science'
          : 'Social Anthropology, Social Data Science'
      },
      collaboration: {
        coAuthors: lang === 'da'
          ? ['Rane Willerslev (National Museum)', 'Anders Blok (KU Sociologi)', 'Brit Ross Winthereik (IT University)']
          : ['Rane Willerslev (National Museum)', 'Anders Blok (KU Sociology)', 'Brit Ross Winthereik (IT University)'],
        institutions: lang === 'da'
          ? ['SODAS (KU)', 'Max Planck Institute', 'Cambridge University', 'National Museum of Denmark']
          : ['SODAS (KU)', 'Max Planck Institute', 'Cambridge University', 'National Museum of Denmark'],
        commercialPotential: lang === 'da'
          ? 'Tværfagligt netværk mellem antropologi, sociologi og data science skaber mulighed for konsulentvirksomhed inden for digital etnografi til tech-industrien.'
          : 'Interdisciplinary network between anthropology, sociology and data science creates opportunity for consultancy in digital ethnography for tech industry.'
      },
      publications: [
        {
          title: lang === 'da'
            ? 'The Political Economy of Attention in the Age of Social Media'
            : 'The Political Economy of Attention in the Age of Social Media',
          year: 2024
        },
        {
          title: lang === 'da'
            ? 'Computational Ethnography: A New Method for Social Science'
            : 'Computational Ethnography: A New Method for Social Science',
          year: 2023
        }
      ],
      research: {
        technical: 'Mixed digital methods and computational ethnography combining anthropological fieldwork with large-scale social data analysis',
        translated: lang === 'da'
          ? 'Udvikler nye metoder der kombinerer klassisk antropologisk feltarbejde med big data-analyse. Undersøger hvordan opmærksomhedsøkonomien påvirker politiske og sociale processer.'
          : 'Develops new methods combining classical anthropological fieldwork with big data analysis. Investigates how the attention economy affects political and social processes.',
        whyItMatters: lang === 'da'
          ? 'I en verden domineret af sociale medier og digital opmærksomhed, giver hans forskning indsigt i hvordan teknologi former politik, kultur og sociale relationer. Relevant for tech-regulering og medieforståelse.'
          : 'In a world dominated by social media and digital attention, his research provides insights into how technology shapes politics, culture and social relations. Relevant for tech regulation and media understanding.'
      },
      applications: {
        beneficiaries: lang === 'da'
          ? ['Tech-virksomheder (platformsdesign)', 'Medier og journalistik', 'Policy-makers (tech-regulering)', 'Forskningsinstitutioner (nye metoder)']
          : ['Tech companies (platform design)', 'Media and journalism', 'Policy-makers (tech regulation)', 'Research institutions (new methods)'],
        howUsed: lang === 'da'
          ? 'Hans forskning informerer debatten om opmærksomhedsøkonomi og social media-regulering. Computational anthropology-metoderne bruges til at forstå digitale fællesskaber og politisk mobilisering på en måde, der kombinerer kvalitative og kvantitative tilgange.'
          : 'His research informs the debate on attention economy and social media regulation. Computational anthropology methods are used to understand digital communities and political mobilization in ways that combine qualitative and quantitative approaches.',
        impactAreas: lang === 'da'
          ? 'SCIENTIFIC (nye tværfaglige metoder), SOCIAL (forståelse af digital kultur), POLICY (tech-regulering og medielovgivning)'
          : 'SCIENTIFIC (new interdisciplinary methods), SOCIAL (understanding digital culture), POLICY (tech regulation and media legislation)',
        stakeholders: lang === 'da'
          ? ['EU Digital Services Act', 'Danske medier', 'Tech-industrien', 'DFF og forskningsråd']
          : ['EU Digital Services Act', 'Danish media', 'Tech industry', 'DFF and research councils'],
        marketAnalysis: {
          competitors: lang === 'da'
            ? 'Akademiske konkurrenter inkluderer MIT Media Lab og Oxford Internet Institute. Kommercielt konkurrerer metoden med traditionelle market research firms der nu tilbyder "digital ethnography".'
            : 'Academic competitors include MIT Media Lab and Oxford Internet Institute. Commercially, the method competes with traditional market research firms now offering "digital ethnography".',
          trends: lang === 'da'
            ? 'Stigende efterspørgsel efter etisk tech-design og platformsregulering. EU\'s Digital Services Act skaber behov for evidensbaseret rådgivning. Tech-virksomheder søger alternative metoder til Big Tech\'s egne analyser.'
            : 'Growing demand for ethical tech design and platform regulation. EU Digital Services Act creates need for evidence-based consulting. Tech companies seek alternatives to Big Tech\'s own analyses.',
          barriers: lang === 'da'
            ? 'Metodens kompleksitet kræver tværfaglige teams (antropologer + data scientists). Høj indgangspris for virksomheder. Risiko for at forskningsværdien reduceres til "konsulentprodukter".'
            : 'Method complexity requires interdisciplinary teams (anthropologists + data scientists). High entry cost for companies. Risk of research value being reduced to "consulting products".'
        }
      },
      questions: lang === 'da' ? [
        { q: 'I bruger "mixed digital methods" - kan du give et konkret eksempel på hvordan I kombinerede etnografi med big data i ERC-projektet?', why: 'Afklarer den specifikke metodologi og dens praktiske anvendelse' },
        { q: 'Jeres forskning viser at opmærksomhedsøkonomi påvirker politik - hvilke specifikke resultater har I fundet i Mongoliet-studiet?', why: 'Dykker ned i konkrete forskningsresultater fremfor generelle påstande' },
        { q: 'Hvilke virksomheder har allerede brugt computational anthropology baseret på jeres SODAS-metoder?', why: 'Validerer kommerciel anvendelse med konkrete eksempler' },
        { q: 'Hvad er den største tekniske barriere I stødte på da I integrerede feltarbejdsdata med social media-data?', why: 'Identificerer praktiske udfordringer og løsninger fra deres erfaring' },
        { q: 'Hvilke PhD-projekter under dig arbejder lige nu på noget der kunne blive til et spin-off?', why: 'Afdækker team-potentiale og pipeline for kommercialisering' }
      ] : [
        { q: 'You use "mixed digital methods" - can you give a concrete example of how you combined ethnography with big data in the ERC project?', why: 'Clarifies the specific methodology and its practical application' },
        { q: 'Your research shows attention economy affects politics - what specific findings did you have in the Mongolia study?', why: 'Dives into concrete research results rather than general claims' },
        { q: 'Which companies have already used computational anthropology based on your SODAS methods?', why: 'Validates commercial application with concrete examples' },
        { q: 'What was the biggest technical barrier when integrating fieldwork data with social media data?', why: 'Identifies practical challenges and solutions from their experience' },
        { q: 'Which PhD projects under you are currently working on something that could become a spin-off?', why: 'Uncovers team potential and pipeline for commercialization' }
      ]
    },
    'guido': {
      id: 'guido_makransky',
      name: 'Guido Makransky',
      title: 'Professor',
      institute: 'Institut for Psykologi',
      field: 'Educational Psychology & VR Learning',
      pureUrl: 'https://researchprofiles.ku.dk/da/persons/guido-makransky/',
      instituteUrl: 'https://psychology.ku.dk',
      profile: {
        background: lang === 'da'
          ? 'Professor i pædagogisk psykologi. Leder af Virtual Learning Lab ved Københavns Universitet. Specialist i læring i immersive miljøer.'
          : 'Professor of Educational Psychology. Head of Virtual Learning Lab at University of Copenhagen. Specialist in learning in immersive environments.',
        focus: lang === 'da'
          ? 'Udvikler evidensbaserede teorier om læring i Virtual Reality. Har skabt CAMIL-modellen (Cognitive Affective Model of Immersive Learning) som er internationalt anerkendt.'
          : 'Develops evidence-based theories of learning in Virtual Reality. Created the CAMIL model (Cognitive Affective Model of Immersive Learning) which is internationally recognized.',
        currentProjects: lang === 'da'
          ? 'Forsker i VR til klimaadfærdsændring, kollaborativ VR-læring, og generativ AI i uddannelse. Eurostars-bevilling på €1,175M.'
          : 'Researches VR for climate behavior change, collaborative VR learning, and generative AI in education. Eurostars grant of €1.175M.',
        teaching: lang === 'da'
          ? 'Pædagogisk Psykologi, Educational Technology'
          : 'Educational Psychology, Educational Technology'
      },
      collaboration: {
        coAuthors: lang === 'da'
          ? ['Richard Mayer (UC Santa Barbara)', 'Jeremy Bailenson (Stanford)', 'Mirjam Thrysøe (KU)']
          : ['Richard Mayer (UC Santa Barbara)', 'Jeremy Bailenson (Stanford)', 'Mirjam Thrysøe (KU)'],
        institutions: lang === 'da'
          ? ['Stanford Virtual Human Interaction Lab', 'Meta Reality Labs', 'UC Santa Barbara', 'Danish EdTech companies']
          : ['Stanford Virtual Human Interaction Lab', 'Meta Reality Labs', 'UC Santa Barbara', 'Danish EdTech companies'],
        commercialPotential: lang === 'da'
          ? 'Direkte samarbejde med Meta og EdTech-industrien. CAMIL-modellen bruges allerede af kommercielle aktører til VR-træningsdesign.'
          : 'Direct collaboration with Meta and EdTech industry. CAMIL model already used by commercial actors for VR training design.'
      },
      publications: [
        {
          title: lang === 'da'
            ? 'The CAMIL Model: Understanding Immersive Learning in Virtual Reality'
            : 'The CAMIL Model: Understanding Immersive Learning in Virtual Reality',
          year: 2024
        },
        {
          title: lang === 'da'
            ? 'Virtual Reality for Climate Education: Behavioral Change Through Immersion'
            : 'Virtual Reality for Climate Education: Behavioral Change Through Immersion',
          year: 2023
        }
      ],
      research: {
        technical: 'Cognitive Affective Model of Immersive Learning (CAMIL) and Theory of Immersive Collaborative Learning (TICOL) for VR-based education',
        translated: lang === 'da'
          ? 'Udvikler videnskabelige modeller for hvordan mennesker lærer bedst i Virtual Reality. Forskningen viser hvornår VR virker bedre end traditionel undervisning - og hvornår det ikke gør.'
          : 'Develops scientific models for how humans learn best in Virtual Reality. Research shows when VR works better than traditional teaching - and when it does not.',
        whyItMatters: lang === 'da'
          ? 'VR-markedet for uddannelse eksploderer, men mange investeringer fejler fordi de ikke er evidensbaserede. Guidos forskning giver konkrete guidelines for hvornår og hvordan VR skal bruges til læring.'
          : 'The VR education market is exploding, but many investments fail because they are not evidence-based. Guido\'s research provides concrete guidelines for when and how VR should be used for learning.'
      },
      applications: {
        beneficiaries: lang === 'da'
          ? ['EdTech-virksomheder (VR-læring)', 'Skoler og universiteter', 'Corporate training (virksomhedstræning)', 'Klimakommunikation']
          : ['EdTech companies (VR learning)', 'Schools and universities', 'Corporate training', 'Climate communication'],
        howUsed: lang === 'da'
          ? 'CAMIL-modellen bruges af EdTech-virksomheder til at designe effektive VR-læringsoplevelser. Forskningen anvendes også til klimakommunikation - VR-oplevelser der får folk til at ændre adfærd mod mere bæredygtige valg.'
          : 'The CAMIL model is used by EdTech companies to design effective VR learning experiences. Research is also applied to climate communication - VR experiences that get people to change behavior toward more sustainable choices.',
        impactAreas: lang === 'da'
          ? 'EDUCATIONAL (bedre læringsdesign), TECHNOLOGICAL (VR-guidelines), ENVIRONMENTAL (klimaadfærd gennem VR)'
          : 'EDUCATIONAL (better learning design), TECHNOLOGICAL (VR guidelines), ENVIRONMENTAL (climate behavior through VR)',
        stakeholders: lang === 'da'
          ? ['Meta/Oculus', 'Danske EdTech-virksomheder', 'Undervisningsministeriet', 'Corporate training-industrien']
          : ['Meta/Oculus', 'Danish EdTech companies', 'Ministry of Education', 'Corporate training industry'],
        marketAnalysis: {
          competitors: lang === 'da'
            ? 'Akademisk konkurrence fra Stanford Virtual Lab og UC Santa Barbara. Kommercielt konkurrerer med VR-udviklingsselskaber uden videnskabelig baggrund samt traditionelle e-learning platforme.'
            : 'Academic competition from Stanford Virtual Lab and UC Santa Barbara. Commercially competes with VR development companies without scientific background and traditional e-learning platforms.',
          trends: lang === 'da'
            ? 'Eksplosiv vækst i corporate VR training (forventet 30% årlig vækst til 2027). Apple Vision Pro demokratiserer adgang. ESG-rapporteringskrav driver efterspørgsel efter evidensbaseret klimakommunikation.'
            : 'Explosive growth in corporate VR training (expected 30% annual growth to 2027). Apple Vision Pro democratizes access. ESG reporting requirements drive demand for evidence-based climate communication.',
          barriers: lang === 'da'
            ? 'Høje udviklingsomkostninger for quality VR-content. "Tech-solutionism" bias - mange tror VR altid er bedre. Risk for "pilot purgatory" hvor virksomheder tester men ikke implementerer.'
            : 'High development costs for quality VR content. "Tech-solutionism" bias - many believe VR is always better. Risk of "pilot purgatory" where companies test but don\'t implement.'
        }
      },
      questions: lang === 'da' ? [
        { q: 'CAMIL-modellen nævner "cognitive load" - hvad er den optimale sessionsvarighed I fandt i jeres meta-analyse?', why: 'Spørger til specifikt forskningsresultat fra deres publicerede arbejde' },
        { q: 'I Eurostars-projektet om klimaadfærd - hvilken specifik adfærdsændring målte I, og hvor stor var effekten?', why: 'Kræver konkrete data fra deres igangværende forskning' },
        { q: 'Hvilke danske EdTech-virksomheder har licenseret eller implementeret CAMIL-modellen?', why: 'Validerer kommerciel anvendelse med navngivne partnere' },
        { q: 'Jeres meta-analyse viste hvornår VR IKKE virker - hvad er de tre vigtigste kontraindikationer?', why: 'Tester dybden af deres evidensbaserede tilgang' },
        { q: 'Hvad koster det typisk at udvikle 1 times VR-læring der følger CAMIL-principperne?', why: 'Giver konkret markedsforståelse og ROI-grundlag' }
      ] : [
        { q: 'The CAMIL model mentions "cognitive load" - what was the optimal session duration you found in your meta-analysis?', why: 'Asks about specific research finding from their published work' },
        { q: 'In the Eurostars project on climate behavior - what specific behavior change did you measure, and how large was the effect?', why: 'Requires concrete data from their ongoing research' },
        { q: 'Which Danish EdTech companies have licensed or implemented the CAMIL model?', why: 'Validates commercial application with named partners' },
        { q: 'Your meta-analysis showed when VR does NOT work - what are the three most important contraindications?', why: 'Tests the depth of their evidence-based approach' },
        { q: 'What does it typically cost to develop 1 hour of VR learning following CAMIL principles?', why: 'Provides concrete market understanding and ROI basis' }
      ]
    }
  };

  // Search for researchers by name using Claude with web_search
  const searchResearchers = async (name) => {
    setState('processing');
    setProgress(0);
    setCurrentStep(t.searchingForResearcher);
    setError('');

    try {
      setProgress(20);

      // Use Claude to search Pure for researchers
      const searchPrompt = `Search for researchers at University of Copenhagen (KU) on pure.ku.dk with the name "${name}".

Your task:
1. Search for this person on pure.ku.dk (Copenhagen University's research portal)
2. Find ALL researchers whose names match or are similar to "${name}"
3. For each match, extract: full name, academic title, institute/department, and their Pure profile URL

Return ONLY a valid JSON array (no markdown, no explanation, just the array):
[
  {
    "name": "Full Name",
    "title": "Academic Title (e.g., Professor, Associate Professor, Postdoc)",
    "institute": "Institute or Department name",
    "pureUrl": "https://pure.ku.dk/... or https://researchprofiles.ku.dk/..."
  }
]

If you find multiple people with similar names, include ALL of them (up to 7 results).
If you find exactly one person, still return an array with that one result.
If you find NO matches, return an empty array: []

Remember: Return ONLY the JSON array, nothing else.`;

      const searchData = await callClaudeWithTools([{
        role: "user",
        content: searchPrompt
      }]);

      setProgress(70);
      setCurrentStep(t.parsingResults);

      // Extract text from response
      let responseText = '';
      if (searchData.content) {
        for (const block of searchData.content) {
          if (block.type === 'text') {
            responseText += block.text;
          }
        }
      }

      // Parse the JSON array from the response
      let results = [];
      try {
        // Clean the response - remove markdown code blocks if present
        let cleanText = responseText.trim();
        cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        // Find the JSON array
        const arrayMatch = cleanText.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
          results = JSON.parse(arrayMatch[0]);
        }
      } catch (parseError) {
        console.error('Failed to parse search results:', parseError);
        results = [];
      }

      setProgress(100);

      // Filter out any invalid results
      results = results.filter(r => r.name && r.pureUrl);

      if (results.length === 0) {
        // No results found - show error state
        setSearchResults([]);
        setState('selection');
      } else if (results.length === 1) {
        // Single match - go directly to briefing
        setSearchResults(results);
        await generateBriefing(results[0].pureUrl);
      } else {
        // Multiple matches - show selection UI
        setSearchResults(results);
        setState('selection');
      }

    } catch (err) {
      console.error('Search error:', err);
      setError(t.analysisFailed);
      setState('input');
    }
  };

  const startAnalysis = async (isDemo = false, demoName = '') => {
    setError('');

    if (isDemo) {
      loadDemoData(demoName);
      return;
    }

    // Check if there's input
    if (!inputUrl && !inputName) {
      setError(t.enterUrlOrName);
      return;
    }

    // If URL is provided, go directly to briefing generation
    if (inputUrl) {
      await generateBriefing(inputUrl);
      return;
    }

    // If only name is provided, search for researchers first
    if (inputName) {
      await searchResearchers(inputName.trim());
    }
  };

  const loadDemoData = (name) => {
    setState('processing');
    setProgress(0);

    const steps = [
      t.loadingDemo,
      t.analyzing,
      t.generatingBriefing
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(steps[stepIndex]);
        setProgress((stepIndex + 1) * 33);
        stepIndex++;
      } else {
        clearInterval(interval);
        setProgress(100);
        setSelectedResearcher(testResearchers[name]);
        setState('briefing');
      }
    }, 400);
  };

  // Multi-turn API call helper function with proper tool handling
  // All API calls go through the Cloudflare Worker proxy (API key stored securely in Worker)
  const callClaudeWithTools = async (messages) => {
    const data = await callAnthropicViaProxy({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8000,
      tools: [
        {
          "type": "web_search_20250305",
          "name": "web_search"
        }
      ],
      messages: messages
    });

    // Check if Claude is using tools (needs continuation)
    if (data.stop_reason === 'tool_use') {
      // Find all tool_use blocks in the response
      const toolUses = data.content.filter(block => block.type === 'tool_use');

      // Add Claude's response with tool_use to conversation
      messages.push({
        role: 'assistant',
        content: data.content
      });

      // Create tool_result responses for each tool use
      // In a real implementation, we would execute the tool here
      // For now, we acknowledge the tool was "executed"
      const toolResults = toolUses.map(toolUse => ({
        type: "tool_result",
        tool_use_id: toolUse.id,
        content: "Search completed successfully. Please continue with your analysis based on the search results."
      }));

      // Add tool results as user message
      messages.push({
        role: 'user',
        content: toolResults
      });

      // Recursive call to continue conversation
      return await callClaudeWithTools(messages);
    }

    // We got a final response (stop_reason is 'end_turn' or 'max_tokens')
    return data;
  };

  const generateBriefing = async (pureUrl) => {
    setState('processing');
    setProgress(0);
    setCurrentStep(t.fetchingProfile);

    try {
      setProgress(20);
      setCurrentStep(t.fetchingFromPure);

      // Fetch Pure profile HTML through the Cloudflare Worker proxy
      let pureHtmlContent = '';
      try {
        pureHtmlContent = await fetchViaProxy(pureUrl);
        // Trim content to avoid token limits (keep first 50000 chars)
        if (pureHtmlContent.length > 50000) {
          pureHtmlContent = pureHtmlContent.substring(0, 50000) + '\n... [content truncated]';
        }
      } catch (proxyError) {
        console.warn('Proxy fetch failed, falling back to web_search:', proxyError);
        pureHtmlContent = null;
      }

      setProgress(40);
      setCurrentStep(t.analyzingProfile);

      // Build the initial message - use fetched content if available, otherwise fall back to web_search
      const initialMessages = [{
        role: "user",
        content: pureHtmlContent
          ? `I need you to analyze a KU Copenhagen researcher profile. Here is the HTML content from their Pure profile page (${pureUrl}):

<pure_profile_html>
${pureHtmlContent}
</pure_profile_html>

Please analyze this content and create a business briefing in ${lang === 'da' ? 'Danish' : 'English'}.`
          : `I need you to fetch and analyze a KU Copenhagen researcher profile.

Step 1: Use web_search to find and read this URL: ${pureUrl}

Step 2: After you have read the actual page content, analyze it and create a business briefing in ${lang === 'da' ? 'Danish' : 'English'}.

Start by searching for the URL now.`
      }];

      // First API call - analyze the content (or trigger web_search as fallback)
      const searchData = await callClaudeWithTools(initialMessages);

      setProgress(60);
      setCurrentStep(t.generatingBriefing);

      // Now ask Claude to generate the structured JSON based on what it found
      const analysisMessages = [
        {
          role: "user",
          content: pureHtmlContent
            ? `I need you to analyze a KU Copenhagen researcher profile. Here is the HTML content from their Pure profile page (${pureUrl}):

<pure_profile_html>
${pureHtmlContent}
</pure_profile_html>

Please analyze this content and create a business briefing in ${lang === 'da' ? 'Danish' : 'English'}.`
            : `I need you to fetch and analyze a KU Copenhagen researcher profile.

Step 1: Use web_search to find and read this URL: ${pureUrl}

Step 2: After you have read the actual page content, analyze it and create a business briefing in ${lang === 'da' ? 'Danish' : 'English'}.

Start by searching for the URL now.`
        },
        {
          role: 'assistant',
          content: searchData.content
        },
        {
          role: "user",
          content: `Perfect! Now based on what you found on that page, please generate a comprehensive briefing.

Return ONLY valid JSON (no markdown, no backticks):

{
  "name": "Full researcher name from the page",
  "title": "Academic title",
  "institute": "Full institute name",
  "field": "Research field in 5-10 words",
  "pureUrl": "${pureUrl}",
  "instituteUrl": "Construct from institute name (e.g., Institut for Kemi → https://chem.ku.dk)",
  "profile": {
    "background": "Background in 2-3 sentences",
    "focus": "Main research focus in 2-3 sentences",
    "currentProjects": "Current projects in 2-3 sentences",
    "teaching": "Teaching areas"
  },
  "collaboration": {
    "coAuthors": ["3-5 frequent co-authors with affiliations"],
    "institutions": ["3-5 collaborating institutions/universities"],
    "commercialPotential": "How this network could be leveraged (2-3 sentences)"
  },
  "publications": [
    {
      "title": "Title of first/most recent publication",
      "year": 2024
    },
    {
      "title": "Title of second most recent publication",
      "year": 2023
    }
  ],
  "research": {
    "technical": "Technical description in 1 sentence",
    "translated": "Business-friendly translation in 2-3 sentences",
    "whyItMatters": "Practical relevance in 2-3 sentences"
  },
  "applications": {
    "beneficiaries": ["3-4 specific groups who benefit - use concrete examples like company names"],
    "howUsed": "Real-world applications (2-3 sentences)",
    "impactAreas": "2-3 impact areas from: SCIENTIFIC, ECONOMIC, SOCIAL, CULTURAL, POLICY, ENVIRONMENTAL, EDUCATIONAL, TECHNOLOGICAL",
    "stakeholders": ["2-4 specific organizations by name"],
    "marketAnalysis": {
      "competitors": "Others in this space (2-3 sentences)",
      "trends": "Relevant trends (2-3 sentences)",
      "barriers": "Barriers to application (2-3 sentences)"
    }
  },
  "questions": [
    {"q": "Question derived from SPECIFIC methodology or technique mentioned in their publications", "why": "Explains what insight this question uncovers"},
    {"q": "Question about CONCRETE RESULTS or findings from a named project or study", "why": "Explains what insight this question uncovers"},
    {"q": "Question about SPECIFIC companies or partners who have used their research", "why": "Explains what insight this question uncovers"},
    {"q": "Question about a SPECIFIC technical challenge they addressed in their work", "why": "Explains what insight this question uncovers"},
    {"q": "Question about MEASURABLE outcomes or metrics from their research", "why": "Explains what insight this question uncovers"}
  ]
}

CRITICAL INSTRUCTIONS FOR QUESTIONS:
1. Each question MUST reference something SPECIFIC from the researcher's actual work (a methodology name, a project title, a publication finding, a technique, a dataset)
2. Questions must NOT be generic like "What are your main findings?" - they must be rooted in specific details you found
3. Example of GOOD question: "In your CAMIL model, you identify 'presence' as key - what threshold of presence score correlates with learning gains?"
4. Example of BAD question: "What is the practical relevance of your research?" (too vague)
5. Reference specific: method names, project names, publication titles, collaborator names, technical terms from their work
6. Keep questions conversational (max 20 words) but specific

CRITICAL INSTRUCTIONS FOR PUBLICATIONS:
1. Only include the 2 most recent publications
2. Only include title and year - no links, no analysis, no co-authors
3. Publications will be displayed as static text only

Return ONLY the JSON, nothing else.`
        }
      ];

      setProgress(70);
      setCurrentStep(t.generatingBriefing);

      // Second API call to get structured JSON
      const analysisData = await callClaudeWithTools(analysisMessages);

      // Extract text from response
      let text = '';
      if (analysisData.content) {
        for (const block of analysisData.content) {
          if (block.type === 'text') {
            text += block.text;
          }
        }
      }

      if (!text) {
        setError(t.couldNotFetch);
        setState('input');
        return;
      }

      // Clean and extract JSON
      let cleanText = text.trim();
      cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      cleanText = cleanText.replace(/^[^{]*/, '').replace(/[^}]*$/, '');

      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        setError(t.couldNotParse);
        setState('input');
        return;
      }

      const researcherData = JSON.parse(jsonMatch[0]);
      researcherData.id = `live_${Date.now()}`;

      setProgress(100);
      setSelectedResearcher(researcherData);
      setState('briefing');

    } catch (err) {
      console.error('Analysis error:', err);
      setError(t.analysisFailed);
      setState('input');
    }
  };

  const resetSearch = () => {
    setState('input');
    setInputUrl('');
    setInputName('');
    setSearchResults([]);
    setSelectedResearcher(null);
    setActiveTab('who');
    setError('');
  };

  const handleExportPDF = () => {
    try {
      setExportStatus(t.preparingPDF);

      const researcherData = selectedResearcher;

      // Create a new window with print-optimized content
      const printWindow = window.open('', '_blank', 'width=800,height=600');

      if (!printWindow) {
        setExportStatus(t.popupBlocked);
        setTimeout(() => setExportStatus(''), 4000);
        return;
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${researcherData.name} - Research Briefing</title>
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 40px 20px;
              line-height: 1.6;
              color: #1a1a1a;
            }
            h1 {
              color: #1e40af;
              border-bottom: 3px solid #3b82f6;
              padding-bottom: 10px;
              margin-bottom: 5px;
              font-size: 28px;
            }
            .subtitle {
              color: #6b7280;
              margin-bottom: 30px;
              font-size: 16px;
            }
            h2 {
              color: #1e40af;
              margin-top: 30px;
              font-size: 20px;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 8px;
            }
            h3 {
              color: #374151;
              margin-top: 20px;
              font-size: 16px;
            }
            .section {
              margin-bottom: 25px;
              padding: 15px;
              background: #f9fafb;
              border-radius: 8px;
              border: 1px solid #e5e7eb;
            }
            .publication {
              margin: 15px 0;
              padding: 12px 15px;
              background: white;
              border-left: 4px solid #6366f1;
              border-radius: 0 8px 8px 0;
            }
            .question {
              margin: 12px 0;
              padding: 12px;
              background: #fef3c7;
              border-radius: 6px;
              border: 1px solid #fcd34d;
            }
            .question-number {
              display: inline-block;
              width: 24px;
              height: 24px;
              background: #1e40af;
              color: white;
              border-radius: 50%;
              text-align: center;
              line-height: 24px;
              font-size: 12px;
              font-weight: bold;
              margin-right: 10px;
            }
            .label {
              font-size: 11px;
              text-transform: uppercase;
              color: #6b7280;
              font-weight: 600;
              letter-spacing: 0.5px;
            }
            .footer {
              text-align: center;
              color: #9ca3af;
              font-size: 12px;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e5e7eb;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .section {
                break-inside: avoid;
                page-break-inside: avoid;
              }
              .question {
                break-inside: avoid;
                page-break-inside: avoid;
              }
              @page {
                margin: 15mm;
                size: A4;
              }
            }
          </style>
        </head>
        <body>
          <h1>${researcherData.name}</h1>
          <p class="subtitle"><strong>${researcherData.title}</strong> | ${researcherData.institute}</p>

          <div class="section">
            <h2>${t.tabs.who}</h2>
            <p><span class="label">${t.background}:</span><br>${researcherData.profile?.background || ''}</p>
            <p><span class="label">${t.focus}:</span><br>${researcherData.profile?.focus || ''}</p>
          </div>

          <div class="section">
            <h2>${t.tabs.what}</h2>
            <p>${researcherData.research?.translated || ''}</p>
            <p><span class="label">${t.whyItMatters}:</span><br>${researcherData.research?.whyItMatters || ''}</p>
          </div>

          ${researcherData.publications && researcherData.publications.length > 0 ? `
          <div class="section">
            <h2>${t.recentPublications}</h2>
            ${researcherData.publications.slice(0, 2).map((pub, idx) => `
              <div class="publication">
                <strong>${idx + 1}. ${pub.title}</strong> (${pub.year})
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="section">
            <h2>${t.tabs.questions}</h2>
            ${researcherData.questions?.map((q, idx) => `
              <div class="question">
                <span class="question-number">${idx + 1}</span>
                <strong>${q.q}</strong>
                <p style="font-size: 13px; color: #92400e; margin: 8px 0 0 34px;">${t.whyAskThis} ${q.why}</p>
              </div>
            `).join('') || ''}
          </div>

          <div class="section">
            <h2>${t.tabs.sources}</h2>
            ${researcherData.pureUrl ? `<p>Pure Profil: <a href="${researcherData.pureUrl}">${researcherData.pureUrl}</a></p>` : ''}
          </div>

          <p class="footer">
            ${t.generatedBy}
          </p>
        </body>
        </html>
      `;

      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then trigger print
      printWindow.onload = function() {
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 250);
      };

      setExportStatus(t.printDialogOpened);
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus(t.exportFailed);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  const handleExportWord = () => {
    try {
      setExportStatus(t.creatingWord);

      const researcherData = selectedResearcher;

      // Create Word-compatible HTML with proper encoding
      const wordHTML = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
<meta charset='utf-8'>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>${researcherData.name} - Research Briefing</title>
<!--[if gte mso 9]>
<xml>
<w:WordDocument>
<w:View>Print</w:View>
<w:Zoom>100</w:Zoom>
<w:DoNotOptimizeForBrowser/>
</w:WordDocument>
</xml>
<![endif]-->
<style>
body { font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 40px; }
h1 { color: #1e40af; font-size: 20pt; border-bottom: 2pt solid #3b82f6; padding-bottom: 6pt; margin-bottom: 6pt; }
h2 { color: #1e40af; font-size: 14pt; margin-top: 18pt; margin-bottom: 8pt; }
h3 { color: #374151; font-size: 12pt; margin-top: 12pt; }
p { margin: 6pt 0; }
.section { margin-bottom: 14pt; }
.publication { margin: 8pt 0; padding-left: 12pt; border-left: 3pt solid #6366f1; }
.question { margin: 10pt 0; padding: 8pt; background-color: #fef3c7; }
</style>
</head>
<body>
<h1>${researcherData.name}</h1>
<p><strong>${researcherData.title}</strong> | ${researcherData.institute}</p>

<div class="section">
<h2>${t.tabs.who}</h2>
<p><strong>${t.background}:</strong> ${researcherData.profile?.background || ''}</p>
<p><strong>${t.focus}:</strong> ${researcherData.profile?.focus || ''}</p>
</div>

<div class="section">
<h2>${t.tabs.what}</h2>
<p>${researcherData.research?.translated || ''}</p>
<p><strong>${t.whyItMatters}:</strong> ${researcherData.research?.whyItMatters || ''}</p>
</div>

${researcherData.publications && researcherData.publications.length > 0 ? `
<div class="section">
<h2>${t.recentPublications}</h2>
${researcherData.publications.slice(0, 2).map((pub, idx) => `
<div class="publication">
<p><strong>${idx + 1}. ${pub.title}</strong> (${pub.year})</p>
</div>
`).join('')}
</div>
` : ''}

<div class="section">
<h2>${t.tabs.questions}</h2>
${researcherData.questions?.map((q, idx) => `
<div class="question">
<p><strong>${idx + 1}. ${q.q}</strong></p>
<p style="color: #92400e; font-size: 10pt;">${t.whyAskThis} ${q.why}</p>
</div>
`).join('') || ''}
</div>

<div class="section">
<h2>${t.tabs.sources}</h2>
${researcherData.pureUrl ? `<p>Pure Profil: ${researcherData.pureUrl}</p>` : ''}
</div>

<p style="text-align: center; color: #666; margin-top: 24pt;">
${t.generatedBy}
</p>
</body>
</html>`;

      // Create Blob with proper MIME type for Word
      const blob = new Blob([wordHTML], {
        type: 'application/msword;charset=utf-8'
      });

      // Create download URL and trigger download
      const url = URL.createObjectURL(blob);
      const filename = `${researcherData.name.replace(/[^a-zA-Z0-9æøåÆØÅ\s]/g, '').replace(/\s+/g, '_')}_briefing.doc`;

      // Create and click download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = filename;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      }, 100);

      setExportStatus(t.wordDownloaded);
      setTimeout(() => setExportStatus(''), 3000);
    } catch (error) {
      console.error('Export error:', error);
      setExportStatus(t.exportFailed);
      setTimeout(() => setExportStatus(''), 3000);
    }
  };

  // INPUT STATE
  if (state === 'input') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <div style={{ display: 'none' }} className="inline-flex bg-white rounded-lg border border-gray-200 p-1">
              <button style={{ display: 'none' }}
                onClick={() => setLang('da')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  lang === 'da' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dansk
              </button>
              <button style={{ display: 'none' }}
                onClick={() => setLang('en')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{t.title}</h1>
            <p className="text-lg text-gray-600">{t.subtitle}</p>
            <div className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-50 rounded-full text-sm text-green-700 font-medium border border-green-200">
              <CheckCircle className="w-4 h-4" />
              {t.publicDataOnly}
            </div>
          </div>

          <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-6 h-6 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-blue-900 mb-2">{t.howTo}</p>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>{t.step1}</li>
                  <li>{t.step2}</li>
                  <li>{t.step3}</li>
                  <li>{t.step4}</li>
                  <li>{t.step5}</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-yellow-900 mb-1">{t.warning}</p>
                <p className="text-sm text-yellow-800">{t.doNotUpload}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-700" />
                <p className="text-red-800 font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-6">
            {/* URL Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                {t.urlOptional}
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="Indtast URL (Kræves for præcision)"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm"
              />
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="text-gray-500 text-sm font-medium">{t.orDivider}</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                {t.nameOptional}
              </label>
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder={t.namePlaceholder}
                disabled
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t.experimentalFeature}
              </p>
            </div>

            <div className="mt-4 flex items-center justify-end">
              <button
                onClick={() => startAnalysis(false)}
                disabled={!inputUrl && !inputName}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-lg"
              >
                {t.generateBriefing}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            <p className="text-center text-gray-500 font-medium mb-4">{t.orText}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => startAnalysis(true, 'morten')}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-bold rounded-lg transition-all shadow-lg"
              >
                {t.quickDemo}: Morten (Antropologi)
              </button>
              <button
                onClick={() => startAnalysis(true, 'guido')}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold rounded-lg transition-all shadow-lg"
              >
                {t.quickDemo}: Guido (VR/EdTech)
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // PROCESSING STATE
  if (state === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-xl w-full">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.processing}</h2>
              <p className="text-gray-600">{currentStep}</p>
            </div>

            <div className="relative">
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-3">{progress}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // SELECTION STATE - Choose from multiple researcher matches
  if (state === 'selection') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Language selector */}
          <div className="flex justify-end mb-4">
            <div className="inline-flex bg-white rounded-lg border border-gray-200 p-1">
              <button
                onClick={() => setLang('da')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  lang === 'da' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dansk
              </button>
              <button
                onClick={() => setLang('en')}
                className={`px-4 py-2 rounded text-sm font-medium transition-all ${
                  lang === 'en' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.selectResearcher}</h1>
            {searchResults.length > 0 ? (
              <p className="text-lg text-gray-600">{t.multipleResultsFound}</p>
            ) : (
              <p className="text-lg text-gray-600">{t.noResultsFound}</p>
            )}
          </div>

          {/* Results or No Results */}
          {searchResults.length > 0 ? (
            <>
              <p className="text-center text-gray-500 mb-6">{t.selectCorrectResearcher}</p>

              {/* Researcher cards */}
              <div className="space-y-3 mb-8">
                {searchResults.map((researcher, idx) => (
                  <button
                    key={idx}
                    onClick={() => generateBriefing(researcher.pureUrl)}
                    className="w-full p-5 text-left bg-white rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm hover:shadow-md group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 mb-1">
                          {researcher.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {researcher.title && <span className="font-medium">{researcher.title}</span>}
                          {researcher.title && researcher.institute && <span className="mx-2">•</span>}
                          {researcher.institute && <span>{researcher.institute}</span>}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {researcher.pureUrl}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <div className="w-10 h-10 bg-blue-100 group-hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors">
                          <ExternalLink className="w-5 h-5 text-blue-600 group-hover:text-white" />
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* No results found */
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-yellow-900 mb-2">{t.noResultsFoundDesc}</p>
                  <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
                    <li>{t.noResultsTip1}</li>
                    <li>{t.noResultsTip2}</li>
                    <li>{t.noResultsTip3}</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Back button */}
          <div className="text-center">
            <button
              onClick={() => {
                setState('input');
                setSearchResults([]);
              }}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-all"
            >
              ← {t.searchAgain}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // BRIEFING STATE
  if (state === 'briefing' && selectedResearcher) {
    const r = selectedResearcher;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50">
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10 no-print">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={resetSearch}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <FileText className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{r.name}</h1>
                  <p className="text-sm text-gray-500">{r.title} • {r.institute}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {exportStatus && (
                  <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm font-medium text-blue-700 flex items-center gap-2">
                    <span>{exportStatus}</span>
                  </div>
                )}
                <button
                  onClick={() => setLang(lang === 'da' ? 'en' : 'da')}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-all"
                >
                  {lang === 'da' ? 'English' : 'Dansk'}
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                  title={t.printOrSaveAsPDF}
                >
                  <FileText className="w-4 h-4" />
                  PDF
                </button>
                <button
                  onClick={handleExportWord}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                  title={t.downloadAsWord}
                >
                  <FileText className="w-4 h-4" />
                  Word
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Data verification disclaimer */}
        <div className="max-w-7xl mx-auto px-6 pt-6 no-print">
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-700 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-yellow-900 mb-1">
                {t.verifyInfo}
              </p>
              <p className="text-xs text-yellow-800">
                {t.verifyInfoDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 briefing-content print-content">
          <div className="grid grid-cols-12 gap-6">

            <div className="col-span-12 lg:col-span-3 no-print">
              <div className="bg-white rounded-xl border border-gray-200 p-2 shadow-sm sticky top-24">
                {[
                  { id: 'who', icon: User, label: t.tabs.who },
                  { id: 'what', icon: Beaker, label: t.tabs.what },
                  { id: 'publications', icon: BookOpen, label: t.tabs.publications },
                  { id: 'applications', icon: Target, label: t.tabs.applications },
                  { id: 'questions', icon: HelpCircle, label: t.tabs.questions },
                  { id: 'sources', icon: ExternalLink, label: t.tabs.sources }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-12 lg:col-span-9">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

                {activeTab === 'who' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.tabs.who}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-xs text-blue-700 uppercase mb-1 font-semibold">
                          {t.background}
                        </div>
                        <div className="text-sm text-gray-900">{r.profile.background}</div>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-xs text-purple-700 uppercase mb-1 font-semibold">
                          {t.teaching}
                        </div>
                        <div className="text-sm text-gray-900">{r.profile.teaching}</div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200">
                      <h3 className="font-bold text-gray-900 mb-3">
                        {t.primaryFocus}
                      </h3>
                      <p className="text-gray-800 leading-relaxed">{r.profile.focus}</p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                      <h3 className="font-bold text-green-900 mb-3">
                        {t.currentProjects}
                      </h3>
                      <p className="text-green-800 leading-relaxed">{r.profile.currentProjects}</p>
                    </div>

                    {/* Collaboration Signals */}
                    {r.collaboration && (
                      <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                        <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          {t.collaborationNetwork}
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                              {t.frequentCoAuthors}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {r.collaboration.coAuthors.map((author, idx) => (
                                <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm text-yellow-900 border border-yellow-300">
                                  {author}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                              {t.collaboratingInstitutions}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {r.collaboration.institutions.map((inst, idx) => (
                                <span key={idx} className="bg-white px-3 py-1 rounded-full text-sm text-yellow-900 border border-yellow-300">
                                  {inst}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-yellow-300">
                            <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                              <Lightbulb className="w-4 h-4" />
                              {t.commercialPotential}
                            </h4>
                            <p className="text-sm text-yellow-900">{r.collaboration.commercialPotential}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'what' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.tabs.what}</h2>
                      <p className="text-gray-600">
                        {t.researchLanguageToBusinessContext}
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-300">
                      <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
                        {t.researchLanguage}
                      </h3>
                      <p className="text-gray-700 italic font-mono text-sm">{r.research.technical}</p>
                    </div>

                    <div className="flex items-center justify-center py-2">
                      <div className="text-2xl">↓</div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-300">
                      <h3 className="text-sm font-bold text-blue-700 uppercase mb-2">
                        {t.translatedToYourLanguage}
                      </h3>
                      <p className="text-blue-900 leading-relaxed">{r.research.translated}</p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-300">
                      <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {t.whyItMatters}
                      </h3>
                      <p className="text-yellow-800 leading-relaxed">{r.research.whyItMatters}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'publications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.tabs.publications}</h2>
                      <p className="text-gray-600">
                        {t.twoMostRecent}
                      </p>
                    </div>

                    {r.publications && r.publications.length > 0 ? (
                      <div className="space-y-4">
                        {r.publications.slice(0, 2).map((pub, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 text-lg">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-lg font-bold text-indigo-900">{pub.title}</h3>
                                  <span className="text-sm font-semibold text-indigo-700 bg-white px-3 py-1 rounded-full ml-4 flex-shrink-0">
                                    {pub.year}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                        <p className="text-gray-600">
                          {t.noPublications}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'applications' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.tabs.applications}</h2>
                      <p className="text-gray-600">
                        {t.whoAndHow}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-5 h-5 text-green-600" />
                        {t.whoBenefits}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {r.applications.beneficiaries.map((beneficiary, idx) => (
                          <div key={idx} className="bg-green-50 rounded-lg p-4 border border-green-200">
                            <div className="text-sm font-medium text-green-900">{beneficiary}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                      <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        {t.howUsed}
                      </h3>
                      <p className="text-blue-800 leading-relaxed">{r.applications.howUsed}</p>
                    </div>

                    <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
                      <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {t.impactAreas}
                      </h3>
                      <p className="text-yellow-800 leading-relaxed">{r.applications.impactAreas}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-purple-600" />
                        {t.keyStakeholders}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {r.applications.stakeholders.map((stakeholder, idx) => (
                          <div key={idx} className="bg-purple-50 rounded-full px-4 py-2 border border-purple-200">
                            <div className="text-sm font-medium text-purple-900">{stakeholder}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Market Analysis */}
                    {r.applications.marketAnalysis && (
                      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border-2 border-red-200">
                        <h3 className="font-bold text-red-900 mb-4 flex items-center gap-2 text-xl">
                          <AlertCircle className="w-6 h-6" />
                          {t.marketAnalysis}
                        </h3>
                        <div className="space-y-4">
                          {r.applications.marketAnalysis.competitors && (
                            <div className="bg-white rounded-lg p-4 border border-red-200">
                              <h4 className="text-sm font-bold text-red-800 uppercase mb-2">
                                {t.competitors}
                              </h4>
                              <p className="text-sm text-gray-800">{r.applications.marketAnalysis.competitors}</p>
                            </div>
                          )}

                          {r.applications.marketAnalysis.trends && (
                            <div className="bg-white rounded-lg p-4 border border-orange-200">
                              <h4 className="text-sm font-bold text-orange-800 uppercase mb-2">
                                {t.marketTrends}
                              </h4>
                              <p className="text-sm text-gray-800">{r.applications.marketAnalysis.trends}</p>
                            </div>
                          )}

                          {r.applications.marketAnalysis.barriers && (
                            <div className="bg-white rounded-lg p-4 border border-red-300">
                              <h4 className="text-sm font-bold text-red-800 uppercase mb-2">
                                {t.potentialPitfalls}
                              </h4>
                              <p className="text-sm text-gray-800">{r.applications.marketAnalysis.barriers}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'questions' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.tabs.questions}</h2>
                      <p className="text-gray-600">
                        {t.questionsSubtitle}
                      </p>
                    </div>

                    {r.questions.map((question, idx) => (
                      <div key={idx} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-lg font-bold text-gray-900 mb-3">{question.q}</p>
                            <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                              <p className="text-xs text-blue-700 uppercase font-semibold mb-1">
                                {t.whyAskThis}
                              </p>
                              <p className="text-sm text-gray-700">{question.why}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'sources' && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.tabs.sources}</h2>
                      <p className="text-gray-600">
                        {t.primarySources}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {r.pureUrl && (
                        <a
                          href={r.pureUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-lg transition-all group"
                        >
                          <div>
                            <div className="font-semibold text-blue-900 group-hover:text-blue-600">
                              [1] {r.name}'s Pure Profil
                            </div>
                            <div className="text-xs text-blue-700 mt-1">
                              {t.personProfile}
                            </div>
                          </div>
                          <ExternalLink className="w-5 h-5 text-blue-400 group-hover:text-blue-600" />
                        </a>
                      )}

                      {r.instituteUrl && (
                        <a
                          href={r.instituteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-lg transition-all group"
                        >
                          <div>
                            <div className="font-semibold text-purple-900 group-hover:text-purple-600">
                              [2] {r.institute}
                            </div>
                            <div className="text-xs text-purple-700 mt-1">
                              {t.instituteWebsite}
                            </div>
                          </div>
                          <ExternalLink className="w-5 h-5 text-purple-400 group-hover:text-purple-600" />
                        </a>
                      )}

                      {/* Google Scholar search */}
                      <a
                        href={`https://scholar.google.com/scholar?q="${encodeURIComponent(r.name)}"+KU`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg transition-all group"
                      >
                        <div>
                          <div className="font-semibold text-green-900 group-hover:text-green-600">
                            [3] Google Scholar - {r.name}
                          </div>
                          <div className="text-xs text-green-700 mt-1">
                            {t.publicationSearch}
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-green-400 group-hover:text-green-600" />
                      </a>

                      {/* ResearchGate search */}
                      <a
                        href={`https://www.researchgate.net/search/researcher?q=${encodeURIComponent(r.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-teal-50 hover:bg-teal-100 border-2 border-teal-200 rounded-lg transition-all group"
                      >
                        <div>
                          <div className="font-semibold text-teal-900 group-hover:text-teal-600">
                            [4] ResearchGate - {r.name}
                          </div>
                          <div className="text-xs text-teal-700 mt-1">
                            {t.researcherNetwork}
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-teal-400 group-hover:text-teal-600" />
                      </a>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                      <h3 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        {t.dataSecurity}
                      </h3>
                      <p className="text-green-800 text-sm leading-relaxed">
                        {t.dataSecurityDesc}
                      </p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 mt-12 no-print">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-gray-500">
            <p>
              {t.generatedBy}
            </p>
            <p className="mt-1 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              {t.humanValidation}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
