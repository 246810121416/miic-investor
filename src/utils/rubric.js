// ===== RUBRIC DATA =====
// Source: MIIC Investor Signal framework

export const SIGNALS = {
  green: {
    id: 'green',
    label: 'Green',
    subtitle: 'Follow-up meeting',
    action: 'Ready to explore',
    color: '#1e7d3c',
    tagWhen: ['Money is coming in', 'Business survives Uganda\'s realities', 'Founder has grit', 'Ask is grounded'],
    nextSteps: ['Book 1:1 within 2 weeks', 'Request financials & pitch deck', 'Introduce to co-investors if relevant'],
    criteria: {
      rev: { title: 'Revenue & Traction', main: 'Earning real money from real customers. Not projections.', hint: 'e.g. UGX 5M+ monthly revenue, paying customers, or signed contracts' },
      unit: { title: 'Unit Economics', main: 'Price point works for the Ugandan customer. Margins visible even at small scale.', hint: 'e.g. cost to serve vs. what the customer actually pays' },
      founder: { title: 'Founder & Team', main: 'Has operated through real difficulties — power, internet, payment failures. Not a first idea.', hint: 'e.g. pivoted, lost a client, recovered, kept going' },
      market: { title: 'Market & Model', main: 'Understands the informal sector if relevant. Customer acquisition is not just digital assumptions.', hint: 'e.g. knows how their customer buys, not just who they are' },
      regulatory: { title: 'Regulatory Awareness', main: 'Knows what licenses, compliance, or sector rules apply. Not surprised by this question.', hint: 'e.g. BoU, UCC, NEMA, NDA depending on sector' },
      returnPath: { title: 'Return Path', main: 'Realistic about how investor gets money back — dividends, strategic acquisition, or buyback.', hint: 'Not just "we\'ll IPO" or "a big tech will buy us"' },
    }
  },
  yellow: {
    id: 'yellow',
    label: 'Yellow',
    subtitle: 'Needs traction',
    action: 'Watch & wait',
    color: '#efa824',
    tagWhen: ['Good idea, no proof yet', 'Revenue is too thin or inconsistent', 'Model unproven locally'],
    nextSteps: ['Re-engage in 3–6 months', 'Share specific milestones to hit first', 'Add to watchlist'],
    criteria: {
      rev: { title: 'Revenue & Traction', main: 'Pilot stage, friends & family customers, or pre-revenue. Nothing repeatable yet.', hint: 'Investor can\'t validate whether demand is real' },
      unit: { title: 'Unit Economics', main: 'Pricing hasn\'t been tested on real customers. Cost structure unclear at scale.', hint: 'e.g. subsidising early users or unclear delivery costs' },
      founder: { title: 'Founder & Team', main: 'Passion is clear but execution history is thin. Missing a key skill (tech, sales, finance).', hint: 'Solo founder with no clear co-founder plan is a flag' },
      market: { title: 'Market & Model', main: 'Modelled on a foreign case study without local adaptation. Customer validation is assumed.', hint: 'e.g. "It worked in Kenya so it\'ll work here"' },
      regulatory: { title: 'Regulatory Awareness', main: 'Vague or unaware of compliance requirements in their sector.', hint: 'Especially risky in fintech, health, agri, edtech' },
      returnPath: { title: 'Return Path', main: 'Hasn\'t thought through how investors exit or earn returns. Focused only on growth.', hint: 'Not necessarily a dealbreaker — but needs a conversation' },
    }
  },
  blue: {
    id: 'blue',
    label: 'Blue',
    subtitle: 'Ecosystem support',
    action: 'Refer & connect',
    color: '#d6402f',
    tagWhen: ['Not investment-ready', 'Outside investor\'s thesis', 'Needs non-financial support first'],
    nextSteps: ['Refer to Hive Colab, NSSF Hi-Innovator, or Founder Institute UG', 'Connect to a mentor in their sector', 'Flag to MIIC team for follow-up support'],
    criteria: {
      rev: { title: 'Revenue & Traction', main: 'Too early — idea or MVP stage only. Needs grant or incubation capital, not equity.', hint: 'e.g. better suited for NSSF Hi-Innovator, UNCDF, or Hive Colab' },
      unit: { title: 'Unit Economics', main: 'Business model is unclear or still being figured out. Not ready for investor scrutiny.', hint: '' },
      founder: { title: 'Founder & Team', main: 'Strong energy but needs mentorship, a co-founder, or sector expertise before raising.', hint: 'Investor can add value as a connector, not a check-writer' },
      market: { title: 'Market & Model', main: 'Problem is real but startup hasn\'t found the right model to monetise it yet.', hint: '' },
      regulatory: { title: 'Regulatory Awareness', main: 'Unaware of regulatory environment. Needs guidance before operating at scale.', hint: '' },
      returnPath: { title: 'Return Path', main: 'Seeking grant or non-dilutive funding — equity investment is not the right fit right now.', hint: '' },
    }
  }
};

export const CRITERIA_KEYS = ['rev', 'unit', 'founder', 'market', 'regulatory', 'returnPath'];

export const RATING_LABELS = {
  1: { label: '1 — Weak', short: '1' },
  2: { label: '2 — Moderate', short: '2' },
  3: { label: '3 — Strong', short: '3' },
};

export default SIGNALS;
