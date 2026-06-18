// Maps each team name to an ISO flag code (for flag-icons) and kit colours
// (for the jersey graphic). Keys MUST match the team names in the database.
const TEAM_META = {
  Argentina: { code: 'ar', colors: ['#75AADB', '#FFFFFF'] },
  Brazil: { code: 'br', colors: ['#FFDF00', '#009C3B'] },
  France: { code: 'fr', colors: ['#21304F', '#FFFFFF'] },
  England: { code: 'gb-eng', colors: ['#FFFFFF', '#C8102E'] },
  Spain: { code: 'es', colors: ['#C60B1E', '#FFC400'] },
  Germany: { code: 'de', colors: ['#FFFFFF', '#111111'] },
  Portugal: { code: 'pt', colors: ['#C8102E', '#006847'] },
  Netherlands: { code: 'nl', colors: ['#FF6B00', '#FFFFFF'] },
  Italy: { code: 'it', colors: ['#1E4DA1', '#FFFFFF'] },
  Belgium: { code: 'be', colors: ['#E30613', '#000000'] },
  Croatia: { code: 'hr', colors: ['#E81E25', '#FFFFFF'] },
  Uruguay: { code: 'uy', colors: ['#4FA8E0', '#FFFFFF'] },
  USA: { code: 'us', colors: ['#FFFFFF', '#1B2F5E'] },
  Mexico: { code: 'mx', colors: ['#006847', '#FFFFFF'] },
  Canada: { code: 'ca', colors: ['#FF0000', '#FFFFFF'] },
  Japan: { code: 'jp', colors: ['#1A2A6C', '#FFFFFF'] },
  'South Korea': { code: 'kr', colors: ['#E4002B', '#003478'] },
  Morocco: { code: 'ma', colors: ['#C1272D', '#006233'] },
  Senegal: { code: 'sn', colors: ['#00853F', '#FDEF42'] },
  Switzerland: { code: 'ch', colors: ['#D52B1E', '#FFFFFF'] },
  Denmark: { code: 'dk', colors: ['#C8102E', '#FFFFFF'] },
  Colombia: { code: 'co', colors: ['#FCD116', '#003893'] },
  Australia: { code: 'au', colors: ['#FFB81C', '#00843D'] },
  Poland: { code: 'pl', colors: ['#FFFFFF', '#DC143C'] },
  Serbia: { code: 'rs', colors: ['#C6363C', '#FFFFFF'] },
  Ecuador: { code: 'ec', colors: ['#FFD100', '#0033A0'] },
  Ghana: { code: 'gh', colors: ['#FFFFFF', '#006B3F'] },
  Nigeria: { code: 'ng', colors: ['#008751', '#FFFFFF'] },
  Cameroon: { code: 'cm', colors: ['#007A33', '#CE1126'] },
  Tunisia: { code: 'tn', colors: ['#E70013', '#FFFFFF'] },
  Egypt: { code: 'eg', colors: ['#CE1126', '#FFFFFF'] },
  'Saudi Arabia': { code: 'sa', colors: ['#006C35', '#FFFFFF'] },
  Iran: { code: 'ir', colors: ['#FFFFFF', '#239F40'] },
  Qatar: { code: 'qa', colors: ['#8A1538', '#FFFFFF'] },
  'Costa Rica': { code: 'cr', colors: ['#FFFFFF', '#002B7F'] },
  Peru: { code: 'pe', colors: ['#FFFFFF', '#D91023'] },
  Chile: { code: 'cl', colors: ['#D52B1E', '#0039A6'] },
  Paraguay: { code: 'py', colors: ['#D52B1E', '#0038A8'] },
  Sweden: { code: 'se', colors: ['#FECC02', '#006AA7'] },
  Norway: { code: 'no', colors: ['#BA0C2F', '#FFFFFF'] },
  Austria: { code: 'at', colors: ['#ED2939', '#FFFFFF'] },
  Wales: { code: 'gb-wls', colors: ['#C8102E', '#FFFFFF'] },
  Scotland: { code: 'gb-sct', colors: ['#0065BF', '#FFFFFF'] },
  Turkey: { code: 'tr', colors: ['#E30A17', '#FFFFFF'] },
  Ukraine: { code: 'ua', colors: ['#FFD500', '#005BBB'] },
  Greece: { code: 'gr', colors: ['#0D5EAF', '#FFFFFF'] },
  Algeria: { code: 'dz', colors: ['#FFFFFF', '#006233'] },
  'Ivory Coast': { code: 'ci', colors: ['#FF8200', '#009E60'] },
};

const DEFAULT_META = { code: '', colors: ['#8FA0B3', '#FFFFFF'] };

export function metaFor(name) {
  return TEAM_META[name] || DEFAULT_META;
}

export default TEAM_META;
