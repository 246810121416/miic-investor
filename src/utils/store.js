// ===== DATA STORE =====
// In production, replace with actual API calls to a backend (Node.js/Express + SQLite or Postgres)

const Store = {
  // ---- STARTUPS ----
  startups: [
    { id: 1, name: "Eazy Sacco / Sozoume Limited", sector: "Fintech", ask: "UGX 500M", description: "Digital SACCO management platform for informal savings groups" },
    { id: 2, name: "Ciphyr Digital Solutions", sector: "Cybersecurity", ask: "UGX 300M", description: "Affordable cyber threat detection for SMEs in East Africa" },
    { id: 3, name: "THIINKG", sector: "EdTech", ask: "UGX 250M", description: "AI-powered critical thinking curriculum for secondary schools" },
    { id: 4, name: "Christech Diagnostic and Medical Supplies", sector: "HealthTech", ask: "UGX 800M", description: "Last-mile diagnostic equipment distribution and maintenance" },
    { id: 5, name: "Speedbird", sector: "Logistics", ask: "UGX 600M", description: "Drone-enabled last-mile delivery for rural Uganda" },
    { id: 6, name: "Viridi Growth Limited", sector: "AgriTech", ask: "UGX 400M", description: "Soil health monitoring and smart irrigation advisory for smallholders" },
    { id: 7, name: "Keyaverse", sector: "PropTech", ask: "UGX 350M", description: "Virtual property tours and digital mortgage processing in Uganda" },
    { id: 8, name: "Truth", sector: "Media", ask: "UGX 200M", description: "Verified local news aggregation with misinformation flagging" },
    { id: 9, name: "Go Poa Limited", sector: "CleanTech", ask: "UGX 450M", description: "Affordable solar-powered cold storage for agricultural produce" },
    { id: 10, name: "Aviyo Plant-Based Nutrition Ltd", sector: "FoodTech", ask: "UGX 300M", description: "Plant-based protein products tailored for the Ugandan palate" },
    { id: 11, name: "Lumi Oils Ltd", sector: "FMCG", ask: "UGX 280M", description: "Specialty cold-pressed cooking oils from locally sourced seeds" },
    { id: 12, name: "Bubwa Cocoa Estates", sector: "AgriTech", ask: "UGX 700M", description: "Premium cocoa farming with direct export chain to global buyers" },
    { id: 13, name: "InstantDoc Health Services App", sector: "HealthTech", ask: "UGX 400M", description: "Telemedicine and e-prescriptions for underserved communities" },
    { id: 14, name: "Revmake Tech Company Ltd", sector: "Automotive", ask: "UGX 500M", description: "EV conversion kits and maintenance services for Kampala fleets" },
    { id: 15, name: "Novitas Diagnostics Limited", sector: "HealthTech", ask: "UGX 600M", description: "Rapid diagnostic tests for tropical diseases at clinic level" },
    { id: 16, name: "Tuwaye AI", sector: "AI / SaaS", ask: "UGX 350M", description: "AI-powered mental health support in local languages" },
    { id: 17, name: "MINDBRIDGE", sector: "EdTech", ask: "UGX 250M", description: "Peer mentorship marketplace connecting youth with professionals" },
    { id: 18, name: "Domus Dei Uganda", sector: "Social Enterprise", ask: "UGX 300M", description: "Affordable housing finance and construction management for low-income families" },
    { id: 19, name: "Impala Healthtech", sector: "HealthTech", ask: "UGX 550M", description: "Hospital supply chain visibility and anti-counterfeit drug tracking" },
    { id: 20, name: "Otic Group", sector: "Fintech", ask: "UGX 400M", description: "Embedded insurance products for gig economy workers" },
    { id: 21, name: "ZEXA Friends for Nature Conservation", sector: "Climate / Conservation", ask: "UGX 200M", description: "Community-based carbon credit generation from forest conservation" },
    { id: 22, name: "Golden Peafowl Co Ltd", sector: "Tourism", ask: "UGX 350M", description: "Eco-tourism experiences and luxury camp management in western Uganda" },
    { id: 23, name: "Feasts Consultants International Ltd", sector: "F&B", ask: "UGX 280M", description: "Cloud kitchen infrastructure and catering management platform" },
    { id: 24, name: "Divine Servers Company", sector: "IT Services", ask: "UGX 250M", description: "Managed cloud hosting and IT support for NGOs and SMEs" },
    { id: 25, name: "JOMOK Factory Limited", sector: "Manufacturing", ask: "UGX 900M", description: "Recycled plastic products for construction and furniture markets" },
    { id: 26, name: "Skality Limited", sector: "SaaS", ask: "UGX 300M", description: "Quality assurance automation tools for East African manufacturers" },
    { id: 27, name: "CNS Confectionery Ltd", sector: "F&B", ask: "UGX 350M", description: "Artisan confectionery using locally sourced honey and tropical fruits" },
    { id: 28, name: "CBM Group", sector: "Construction", ask: "UGX 800M", description: "Affordable building materials and prefab housing solutions" },
    { id: 29, name: "KlassApp", sector: "EdTech", ask: "UGX 200M", description: "School management system with offline capability for low-connectivity schools" },
    { id: 30, name: "AsiliChain Protocol", sector: "Blockchain", ask: "UGX 400M", description: "African artisan supply chain transparency on blockchain" },
    { id: 31, name: "Sema Life", sector: "HealthTech", ask: "UGX 300M", description: "Community health worker digital toolkit for primary care in rural areas" },
    { id: 32, name: "Zaga Technologies Ltd", sector: "Fintech", ask: "UGX 450M", description: "Cross-border micro-remittances using mobile money corridors" },
  ],

  // ---- INVESTORS ----
  investors: [
    { id: 1, name: "Sarah Namukasa", email: "s.namukasa@miic.ug", pin: "1234", role: "investor" },
    { id: 2, name: "David Kiggundu", email: "d.kiggundu@miic.ug", pin: "2345", role: "investor" },
    { id: 3, name: "Grace Apio", email: "g.apio@miic.ug", pin: "3456", role: "investor" },
  ],

  // ---- ADMINS ----
  admins: [
    { id: 1, name: "MIIC Admin", email: "admin@miic.ug", password: "miic2024", role: "admin" },
  ],

  // ---- SCORES ----
  // { id, investorId, startupId, signal: 'green'|'yellow'|'blue', criteria: {rev, unit, founder, market, regulatory, returnPath}, notes, topPick, createdAt }
  scores: [],

  // ---- HELPERS ----
  getStartup(id) { return this.startups.find(s => s.id === parseInt(id)); },
  getInvestor(id) { return this.investors.find(i => i.id === parseInt(id)); },

  hasScored(investorId, startupId) {
    return this.scores.some(s => s.investorId === investorId && s.startupId === parseInt(startupId));
  },

  addScore(score) {
    const existing = this.scores.findIndex(s => s.investorId === score.investorId && s.startupId === score.startupId);
    if (existing >= 0) {
      this.scores[existing] = { ...this.scores[existing], ...score };
    } else {
      this.scores.push({ id: Date.now(), ...score, createdAt: new Date().toISOString() });
    }
    this.persist();
  },

  getStartupStats(startupId) {
    const ss = this.scores.filter(s => s.startupId === parseInt(startupId));
    return {
      green: ss.filter(s => s.signal === 'green').length,
      yellow: ss.filter(s => s.signal === 'yellow').length,
      blue: ss.filter(s => s.signal === 'blue').length,
      topPicks: ss.filter(s => s.topPick).length,
      total: ss.length,
      notes: ss.map(s => s.notes).filter(Boolean),
    };
  },

  getAllStats() {
    return {
      totalScores: this.scores.length,
      green: this.scores.filter(s => s.signal === 'green').length,
      yellow: this.scores.filter(s => s.signal === 'yellow').length,
      blue: this.scores.filter(s => s.signal === 'blue').length,
      topPicks: this.scores.filter(s => s.topPick).length,
    };
  },

  persist() {
    try { localStorage.setItem('miic_scores', JSON.stringify(this.scores)); } catch(e) {}
    try { localStorage.setItem('miic_startups', JSON.stringify(this.startups)); } catch(e) {}
    try { localStorage.setItem('miic_investors', JSON.stringify(this.investors)); } catch(e) {}
  },

  load() {
    try {
      const s = localStorage.getItem('miic_scores');
      if (s) this.scores = JSON.parse(s);
      const st = localStorage.getItem('miic_startups');
      if (st) this.startups = JSON.parse(st);
      const inv = localStorage.getItem('miic_investors');
      if (inv) this.investors = JSON.parse(inv);
    } catch(e) {}
  },
};

export default Store;
