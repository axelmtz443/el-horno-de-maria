// Emoji representativo por ingrediente, usado en el configurador y su
// previsualizador. Se resuelve por id exacto primero (cubre los ingredientes
// sembrados en la migración 004); si no hay match, se busca por palabra clave
// en el nombre (cubre ingredientes personalizados creados desde el admin).
// Si nada coincide, se usa un ícono genérico de respaldo.

const EMOJI_POR_ID: Record<string, string> = {
  ajo: "🧄",
  "ajo-romero": "🧄",
  albahaca: "🌿",
  romero: "🌿",
  mejorana: "🌿",
  "ajonjoli-b": "⚪",
  "ajonjoli-n": "⚫",
  avena: "🌾",
  multigranos: "🌾",
  chia: "🌱",
  "chia-linaza": "🌱",
  linaza: "🌱",
  girasol: "🌻",
  pepitas: "🎃",
  queso: "🧀",
  "canela-azucar": "🟤",
  "pasas-canela": "🍇",
  "arandano-linaza": "🫐",
  "arandano-canela": "🫐",
  "arandano-nuez": "🫐",
  "choc-trad": "🍫",
  "choc-caca": "🍫",
  "choc-blanco": "🍫",
  "choc-almendra": "🍫",
  "nuez-azucar": "🌰",
  nuez: "🌰",
  capricho: "🎉",
  antojo: "😋",
  fino: "💅",
}

const EMOJI_POR_PALABRA_CLAVE: Array<[RegExp, string]> = [
  [/ajonjol/i, "⚪"],
  [/(avena|multigrano)/i, "🌾"],
  [/(chía|chia|linaza)/i, "🌱"],
  [/girasol/i, "🌻"],
  [/(pepita|calabaza)/i, "🎃"],
  [/queso/i, "🧀"],
  [/(albahaca|romero|mejorana|hierba)/i, "🌿"],
  [/ajo/i, "🧄"],
  [/(canela|mascabado)/i, "🟤"],
  [/pasa/i, "🍇"],
  [/ar[áa]ndano/i, "🫐"],
  [/cereza/i, "🍒"],
  [/chocolate/i, "🍫"],
  [/(nuez|almendra|cacahuate)/i, "🌰"],
  [/az[úu]car/i, "🍬"],
]

const EMOJI_RESPALDO = "✨"

export function emojiIngrediente(id: string, nombre: string): string {
  if (EMOJI_POR_ID[id]) return EMOJI_POR_ID[id]
  const match = EMOJI_POR_PALABRA_CLAVE.find(([re]) => re.test(nombre))
  return match ? match[1] : EMOJI_RESPALDO
}
