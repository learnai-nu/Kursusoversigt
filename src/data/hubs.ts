import type { Course } from '../lib/types';
import { getAllCourses } from '../lib/courses';

export type HubSlug = 'chatgpt' | 'ledelse' | 'teams' | 'gratis';

export interface HubSection {
  heading: string;
  body: string;
}

export interface HubDefinition {
  slug: HubSlug;
  /** Short SEO / nav label */
  title: string;
  /** Full-sentence H1 ending with period */
  h1: string;
  description: string;
  /** Claim-first intro paragraphs */
  intro: string[];
  sections: HubSection[];
  relatedArticleSlugs: string[];
  catalogFilterHref?: string;
  catalogFilterLabel?: string;
  softCta: { title: string; text: string; campaign: string };
  /** Optional note keyed by course slug (shown near that card) */
  courseNotes?: Record<string, string>;
  match: (course: Course) => boolean;
  /** Prefer these slugs first when sorting matches */
  preferSlugs?: string[];
  maxCourses?: number;
}

const ACADEMY_PROVIDERS = new Set([
  'claude-academy',
  'openai-academy',
  'google-ai-skills',
]);

const CHATGPT_KNOWN = new Set([
  'digital-forlomme-chatgpt',
  'digital-forlomme-copilot',
  'digital-forlomme-claude',
  'digital-forlomme-gemini',
  'promptly-ai-grundkursus',
  'promptly-avanceret-chatgpt',
  'promptly-ai-masterclass-agenter',
  'montus-ai-i-arbejdsdagen',
  'dania-chatgpt-for-kontoret',
  'ibc-ai-kursus',
  'kea-prompt-engineering',
  'ti-generativ-ai-i-praksis',
  'openai-academy-applied-ai',
  'ai-savvy-ai-boost',
]);

const TEAMS_KNOWN = new Set([
  'learnai-team-workshop',
  'ti-ai-academy-firma',
  'ida-ai-i-virksomheden',
  'dania-digital-transformation',
  'dania-chatgpt-for-kontoret',
  'montus-ai-i-arbejdsdagen',
  'claude-human-agent-teams',
  'digital-forlomme-chatgpt',
  'digital-forlomme-copilot',
  'promptly-ai-grundkursus',
  'ti-ai-i-produktion',
]);

const TOOL_RE = /chatgpt|copilot|prompt|gemini|claude/i;

function haystack(c: Course): string {
  return [c.slug, c.title, c.description, ...(c.tags || [])].join(' ');
}

export const hubs: HubDefinition[] = [
  {
    slug: 'chatgpt',
    title: 'ChatGPT & generative værktøjer',
    h1: 'ChatGPT- og generative AI-kurser: vælg værktøjsforløb der lander i hverdagen.',
    description:
      'Emnehub for ChatGPT, Copilot, Claude, Gemini og prompt-praksis i Danmark — kurser, guider og hvornår academy er nok.',
    intro: [
      '“ChatGPT-kursus” dækker alt fra en dags workshop til længere prompt-forløb. Det, der adskiller et nyttigt forløb fra en demo, er overførsel: klare instruktioner, review, dataregler og konkrete opgaver fra jeres uge. Uden det ender I med slides — ikke vaner.',
      'Denne hub samler praktiske værktøjskurser i kataloget — ikke hele kataloget. Vi prioriterer danske hold og workshops med lokal kontekst. Lederstrategi og firmakurser har egne hubs; gratis vendor-academy ligger under Gratis, så I ikke blander produktfundament med værktøjspraksis.',
    ],
    sections: [
      {
        heading: 'Hvad denne hub dækker',
        body: 'Her finder du danske og praktiske forløb, hvor ChatGPT, Microsoft Copilot, Claude, Gemini eller systematisk prompting er i centrum. Kort sagt: kurser, der træner brug — ikke strategi for hele organisationen. Digital Forlomme, Promptly, Montus, Dania, IBC og KEA ligger typisk her, sammen med bredere generativ AI-praksis hos Teknologisk Institut. OpenAI Applied er med som selektivt academy-spor, når I vil have officielt produktfokus oven på en dansk workshop.',
      },
      {
        heading: 'Sådan vælger du værktøjskursus',
        body: 'Start med resultatet: spare tid i mail, bedre kundesvar, eller interne guides? Match derefter niveau — begynder-workshop og avanceret prompting hører sjældent på samme hold uden plan. Ét dagsformat kan sætte i gang; længere forløb skaber vaner. Aftal på forhånd, hvad der må indtastes i værktøjerne, og hvordan I kvalitetstjekker svar. Ukendte priser står som Ukendt her. Vi gætter ikke — tjek altid udbyderens side via kursussiden.',
      },
      {
        heading: 'Hvornår denne hub ikke er nok',
        body: 'Skal I beslutte AI-strategi, governance eller risikostyring, er et lederforløb bedre end en værktøjsdag. Skal hele afdelingen have fælles sprog og opfølgning, kig teams-hubben. Skal I kun have produktfundament på engelsk i eget tempo, start under gratis academies — og planlæg overførsel bagefter. Kursusoversigt rangerer ikke betalte placeringer; I vælger selv.',
      },
    ],
    relatedArticleSlugs: [
      'chatgpt-kurser-danmark',
      'generativ-ai-pa-arbejdspladsen',
      'vaelg-ai-kursus-danmark',
    ],
    catalogFilterHref: '/ai-kurser?category=praktisk',
    catalogFilterLabel: 'Se praktiske kurser i kataloget',
    softCta: {
      title: 'Når værktøjskataloget er for bredt',
      text: 'LearnAI hjælper dig med at matche ChatGPT-/Copilot-forløb til konkrete opgaver i teamet.',
      campaign: 'hub-chatgpt',
    },
    preferSlugs: [
      'digital-forlomme-chatgpt',
      'promptly-ai-grundkursus',
      'promptly-avanceret-chatgpt',
      'montus-ai-i-arbejdsdagen',
      'dania-chatgpt-for-kontoret',
      'digital-forlomme-copilot',
      'kea-prompt-engineering',
      'ibc-ai-kursus',
      'ti-generativ-ai-i-praksis',
      'digital-forlomme-claude',
      'digital-forlomme-gemini',
      'promptly-ai-masterclass-agenter',
      'openai-academy-applied-ai',
      'ai-savvy-ai-boost',
    ],
    maxCourses: 14,
    match: (c) => {
      if (CHATGPT_KNOWN.has(c.slug)) return true;
      if (ACADEMY_PROVIDERS.has(c.provider_slug) && c.slug !== 'openai-academy-applied-ai') {
        return false;
      }
      return TOOL_RE.test(haystack(c)) && c.category === 'praktisk';
    },
  },
  {
    slug: 'ledelse',
    title: 'AI for ledere',
    h1: 'AI-kurser for ledere: beslutningsrammer frem for dyb læring.',
    description:
      'Emnehub for AI-kurser til ledere og beslutningstagere i Danmark — strategi, governance, transformation og projektledelse.',
    intro: [
      'Som leder behøver du sjældent et kursus i dyb læring. Du har brug for beslutningsrammer, risikostyring og evnen til at prioritere anvendelser — så I siger ja eller nej med åbne øjne, og så organisationen ved, hvad der er tilladt.',
      'Hubben samler katalogets lederkategori: fra korte overblik hos ITU og LearnAI til strategi hos CBS, Aros og Teknologisk Institut, plus governance for bestyrelser. Ét globalt academy-forløb om menneske–agent-teams er med som online-alternativ, ikke som dansk hold med lokal underviser.',
    ],
    sections: [
      {
        heading: 'Hvad denne hub dækker',
        body: 'Kurser med kategori ledelse: overblik og beslutningskraft, strategi og forretningsværdi, governance og ansvar, samt overgang fra beslutning til eksekvering (projektleder og transformation). ITU, LearnAI og IDA giver typisk første overblik; CBS Strategy, Aros Mini MBA og TI Strategi går dybere i forretningsværdi; CBS Governance og beslægtede forløb rammer bestyrelse og compliance. Filtrer også direkte i kataloget under ledelse, når du vil se den rå liste uden hub-udvalg.',
      },
      {
        heading: 'Sådan vælger du som leder',
        body: 'Spørg først: skal du kunne sige ja/nej til AI-initiativer, styre risiko, eller drive et program? Undgå rene værktøjsdage, hvis målet er strategi — og omvendt. Firmakurser og team-workshops skaber fælles sprog hurtigere end enkeltbilletter, når ledelsesteamet skal med sammen. Tjek altid pris, dato og niveau hos udbyderen; Ukendt her betyder, at vi ikke gætter.',
      },
      {
        heading: 'Hvornår du skal vælge en anden hub',
        body: 'Skal medarbejderne bruge ChatGPT eller Copilot i mail og møder, start under ChatGPT & generative værktøjer. Skal hele afdelingen have fælles praksis og opfølgning, se teams-hubben. Skal I kun have gratis fundament før budgetgodkendelse, se gratis academies. EU AI Act og compliance-behov hører ofte her — se også artiklerne under hubben, før I booker et rent teknisk forløb.',
      },
    ],
    relatedArticleSlugs: [
      'ai-kurser-for-ledere-2026',
      'ai-for-ledere-guide',
      'ai-act-og-kursusbehov',
    ],
    catalogFilterHref: '/ai-kurser?category=ledelse',
    catalogFilterLabel: 'Filtrer kataloget på ledelse',
    softCta: {
      title: 'Når lederkataloget er for bredt',
      text: 'LearnAI hjælper dig med at matche lederkursus, governance-forløb eller en blandet kompetenceplan.',
      campaign: 'hub-ledelse',
    },
    courseNotes: {
      'claude-human-agent-teams':
        'Online/global Claude Academy — ikke et dansk hold med lokal underviser.',
    },
    maxCourses: 12,
    match: (c) => c.category === 'ledelse',
  },
  {
    slug: 'teams',
    title: 'Teams & virksomheder',
    h1: 'AI-kurser til teams og virksomheder: fælles praksis frem for enkeltbilletter.',
    description:
      'Emnehub for firmakurser, team-workshops og kompetenceløft i danske virksomheder — fra LearnAI og TI til IDA og praktiske ChatGPT-hold.',
    intro: [
      'En individuel billet giver personlig færdighed — men sjældent fælles praksis. Teams har brug for fælles sprog, konkrete anvendelser, en simpel datapolitik og opfølgning. Ellers bliver gevinsten hos den ene medarbejder, der prøvede ChatGPT, mens resten af afdelingen står stille.',
      'Her samler vi firmakurser, team-workshops og forløb, der typisk købes til hold eller afdelinger: LearnAI, TI AI Academy, IDA, Dania, Montus og udvalgte værktøjsdage. Claude Academy-forløbet om human–agent-teams er med som online/global note — ikke som dansk firmakursus.',
    ],
    sections: [
      {
        heading: 'Hvad denne hub dækker',
        body: 'Fælles opstart (LearnAI team-workshop, TI AI Academy firma), kontorværktøjer til hold (Dania, Montus, Digital Forlomme, Promptly), ledelse og implementering i virksomheden (IDA, Dania transformation), samt branchevinkler som AI i produktion hos Teknologisk Institut. Kategorien virksomhed er smal i kataloget — derfor matcher vi også udvalgte slugs, så hubben ikke bliver tom for firmabehov.',
      },
      {
        heading: 'Sådan vælger I som virksomhed',
        body: 'Resultat først: fælles sprog, tid i kontorværktøjer, et pilotprojekt — eller risiko og governance? Åbne hold er fine til 1–3 personer; firmakursus, når afdelingen skal med samtidig. Aftal dataregler (hvad må indtastes?) før workshoppen, og book intern øvelse efter — ellers bliver indsigter til slides. SMV’er har ofte mest glæde af korte, praktiske hold med klar opfølgning frem for lange executive-forløb.',
      },
      {
        heading: 'Hvornår I skal kigge andetsteds',
        body: 'Én persons værktøjsopkvalificering hører under ChatGPT-hubben. Ren lederstrategi uden holdfokus hører under ledelse. Gratis academy i eget tempo er et godt første skridt, men erstatter ikke fælles praksis — se gratis-hubben, og planlæg overførsel til jeres egne opgaver. Kursusoversigt er et uafhængigt overblik; vi driver ikke kurserne.',
      },
    ],
    relatedArticleSlugs: [
      'ai-kurser-til-teams-virksomheder',
      'ai-kompetencer-i-smv',
      'generativ-ai-pa-arbejdspladsen',
    ],
    catalogFilterHref: '/ai-kurser?category=virksomhed',
    catalogFilterLabel: 'Se firmakurser (kategori virksomhed)',
    softCta: {
      title: 'Når teamkataloget er for bredt',
      text: 'LearnAI hjælper jer med at matche team-workshop, firmakursus eller en blandet kompetenceplan.',
      campaign: 'hub-teams',
    },
    courseNotes: {
      'claude-human-agent-teams':
        'Online/global Claude Academy om menneske–agent-teams — ikke et dansk firmakursus.',
    },
    preferSlugs: [
      'learnai-team-workshop',
      'ti-ai-academy-firma',
      'ida-ai-i-virksomheden',
      'dania-digital-transformation',
      'dania-chatgpt-for-kontoret',
      'montus-ai-i-arbejdsdagen',
      'digital-forlomme-chatgpt',
      'digital-forlomme-copilot',
      'promptly-ai-grundkursus',
      'ti-ai-i-produktion',
      'claude-human-agent-teams',
    ],
    maxCourses: 14,
    match: (c) => {
      if (TEAMS_KNOWN.has(c.slug)) return true;
      return c.category === 'virksomhed';
    },
  },
  {
    slug: 'gratis',
    title: 'Gratis academies',
    h1: 'Gratis AI-kurser: Claude, OpenAI og Google i eget tempo.',
    description:
      'Emnehub for gratis og vendor-nære AI-forløb fra Claude Academy, OpenAI Academy og Google Learn AI Skills — og hvornår et dansk hold er bedre.',
    intro: [
      '“Gratis AI-kursus” betyder ofte materiale i eget tempo fra de store model-leverandører — ikke et dansk hold med underviser. Det kan stadig være nyttigt: produktnært indhold, engelsk fagterminologi og et fundament, før I investerer i workshops eller firmakurser.',
      'Priser og adgang kan ændre sig. Vi markerer ofte prisen som Ukendt eller “se academy”. Forløbene er globale og online. Vi driver dem ikke. Tjek altid kildeadressen på kursussiden, før I planlægger tid eller certificeringskrav ind i en kompetenceplan.',
    ],
    sections: [
      {
        heading: 'Hvad denne hub dækker',
        body: 'Alle academy-kurser i kataloget fra Claude Academy (Anthropic), OpenAI Academy og Google Learn AI Skills — fra foundations og capabilities til Workspace-powerups, certifikater og agent-bygning. Det er vendor-sporet, ikke det danske holdkatalog. Brug det til at matche det værktøj I faktisk bruger, før I booker et betalt hold.',
      },
      {
        heading: 'Hvornår gratis academy giver mening',
        body: 'I skal i gang i dag uden budgetgodkendelse. Målet er fundament: hvad kan LLM’er — og hvad kan de ikke. I vil have officielt produktfokus på ChatGPT, Claude eller Gemini/Workspace. Teamet kan arbejde asynkront på engelsk. Sæt et tidsskema og et konkret outputmål — ellers bliver “gratis” til “aldrig færdig”, og academy-timerne forsvinder i kalenderen.',
      },
      {
        heading: 'Hvornår I skal vælge et dansk hold i stedet',
        body: 'Vælg dansk ChatGPT-/værktøjskursus eller leder-/teamforløb, når I vil have dialog, danske cases, holddynamik eller et styret forløb med underviser. Mange teams kombinerer: academy først, derefter workshop. Planlæg overførsel — hvad skal ændre sig i jeres uge efter forløbet? Se ChatGPT-, ledelse- og teams-hubbene, når I er klar til næste lag.',
      },
    ],
    relatedArticleSlugs: ['gratis-ai-kurser', 'chatgpt-kurser-danmark'],
    catalogFilterHref: '/ai-kurser?q=academy',
    catalogFilterLabel: 'Søg academy i kataloget',
    softCta: {
      title: 'Fra gratis læring til konkret plan',
      text: 'LearnAI hjælper dig med at oversætte academy-fundament til en kompetenceplan for teamet.',
      campaign: 'hub-gratis',
    },
    maxCourses: 16,
    match: (c) => ACADEMY_PROVIDERS.has(c.provider_slug),
  },
];

export function getHubBySlug(slug: string): HubDefinition | undefined {
  return hubs.find((h) => h.slug === slug);
}

export function getAllHubs(): HubDefinition[] {
  return hubs;
}

export function matchCoursesForHub(hub: HubDefinition): Course[] {
  const all = getAllCourses();
  const matched = all.filter(hub.match);
  const prefer = hub.preferSlugs || [];
  matched.sort((a, b) => {
    const ai = prefer.indexOf(a.slug);
    const bi = prefer.indexOf(b.slug);
    const ap = ai === -1 ? 999 : ai;
    const bp = bi === -1 ? 999 : bi;
    if (ap !== bp) return ap - bp;
    return a.title.localeCompare(b.title, 'da');
  });
  const cap = hub.maxCourses ?? 16;
  return matched.slice(0, cap);
}
