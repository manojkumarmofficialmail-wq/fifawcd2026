// Maps each team name to an ISO flag code (for flag-icons) and kit colours
// (for the jersey graphic). Keys MUST match the team names in the database.
const TEAM_META = {
  // ---- Hosts ----
  Mexico: { code: 'mx', colors: ['#006847', '#FFFFFF'] },
  Canada: { code: 'ca', colors: ['#FF0000', '#FFFFFF'] },
  USA: { code: 'us', colors: ['#FFFFFF', '#1B2F5E'] },

  // ---- UEFA ----
  Austria: { code: 'at', colors: ['#ED2939', '#FFFFFF'] },
  Belgium: { code: 'be', colors: ['#E30613', '#000000'] },
  'Bosnia and Herzegovina': { code: 'ba', colors: ['#002395', '#FFD100'] },
  Croatia: { code: 'hr', colors: ['#E81E25', '#FFFFFF'] },
  Czechia: { code: 'cz', colors: ['#D7141A', '#FFFFFF'] },
  England: { code: 'gb-eng', colors: ['#FFFFFF', '#C8102E'] },
  France: { code: 'fr', colors: ['#21304F', '#FFFFFF'] },
  Germany: { code: 'de', colors: ['#FFFFFF', '#111111'] },
  Netherlands: { code: 'nl', colors: ['#FF6B00', '#FFFFFF'] },
  Norway: { code: 'no', colors: ['#BA0C2F', '#FFFFFF'] },
  Portugal: { code: 'pt', colors: ['#C8102E', '#006847'] },
  Scotland: { code: 'gb-sct', colors: ['#0065BF', '#FFFFFF'] },
  Spain: { code: 'es', colors: ['#C60B1E', '#FFC400'] },
  Sweden: { code: 'se', colors: ['#FECC02', '#006AA7'] },
  Switzerland: { code: 'ch', colors: ['#D52B1E', '#FFFFFF'] },
  Turkey: { code: 'tr', colors: ['#E30A17', '#FFFFFF'] },

  // ---- CAF (Africa) ----
  Algeria: { code: 'dz', colors: ['#FFFFFF', '#006233'] },
  'Cape Verde': { code: 'cv', colors: ['#003893', '#FFFFFF'] },
  'DR Congo': { code: 'cd', colors: ['#007FFF', '#F7D618'] },
  'Ivory Coast': { code: 'ci', colors: ['#FF8200', '#009E60'] },
  Egypt: { code: 'eg', colors: ['#CE1126', '#FFFFFF'] },
  Ghana: { code: 'gh', colors: ['#FFFFFF', '#006B3F'] },
  Morocco: { code: 'ma', colors: ['#C1272D', '#006233'] },
  Senegal: { code: 'sn', colors: ['#00853F', '#FDEF42'] },
  'South Africa': { code: 'za', colors: ['#007749', '#FFB81C'] },
  Tunisia: { code: 'tn', colors: ['#E70013', '#FFFFFF'] },

  // ---- AFC (Asia) ----
  Australia: { code: 'au', colors: ['#FFB81C', '#00843D'] },
  Iraq: { code: 'iq', colors: ['#FFFFFF', '#007A3D'] },
  Iran: { code: 'ir', colors: ['#FFFFFF', '#239F40'] },
  Japan: { code: 'jp', colors: ['#1A2A6C', '#FFFFFF'] },
  Jordan: { code: 'jo', colors: ['#FFFFFF', '#CE1126'] },
  'South Korea': { code: 'kr', colors: ['#E4002B', '#003478'] },
  Qatar: { code: 'qa', colors: ['#8A1538', '#FFFFFF'] },
  'Saudi Arabia': { code: 'sa', colors: ['#006C35', '#FFFFFF'] },
  Uzbekistan: { code: 'uz', colors: ['#FFFFFF', '#0072CE'] },

  // ---- CONMEBOL (South America) ----
  Argentina: { code: 'ar', colors: ['#75AADB', '#FFFFFF'] },
  Brazil: { code: 'br', colors: ['#FFDF00', '#009C3B'] },
  Colombia: { code: 'co', colors: ['#FCD116', '#003893'] },
  Ecuador: { code: 'ec', colors: ['#FFD100', '#0033A0'] },
  Paraguay: { code: 'py', colors: ['#D52B1E', '#0038A8'] },
  Uruguay: { code: 'uy', colors: ['#4FA8E0', '#FFFFFF'] },

  // ---- CONCACAF (non-host) ----
  'Curaçao': { code: 'cw', colors: ['#002B7F', '#F9D616'] },
  Haiti: { code: 'ht', colors: ['#00209F', '#D21034'] },
  Panama: { code: 'pa', colors: ['#DA121A', '#072357'] },

  // ---- OFC (Oceania) ----
  'New Zealand': { code: 'nz', colors: ['#FFFFFF', '#000000'] },
};

const DEFAULT_META = { code: '', colors: ['#8FA0B3', '#FFFFFF'] };

export function metaFor(name) {
  return TEAM_META[name] || DEFAULT_META;
}

export default TEAM_META;
