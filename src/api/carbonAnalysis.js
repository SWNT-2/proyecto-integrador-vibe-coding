const EMISSION_FACTORS = {
  electricity: { factor: 0.000233, label: 'Electricidad' },
  truck:       { factor: 0.025,    label: 'Camioneta/Camion' },
  car:         { factor: 0.012,    label: 'Auto/Carro' },
  gas:         { factor: 0.00202,  label: 'Gas Natural' },
  diesel:      { factor: 0.00268,  label: 'Diesel' },
  gasoline:    { factor: 0.00232,  label: 'Gasolina' },
  flight:      { factor: 0.090,    label: 'Vuelo' },
}

const WORD_NUMS = {
  un:1, uno:1, una:1, dos:2, tres:3, cuatro:4, cinco:5,
  seis:6, siete:7, ocho:8, nueve:9, diez:10,
  one:1, two:2, three:3, four:4, five:5,
  six:6, seven:7, eight:8, nine:9, ten:10,
}

function extractQty(text, patterns) {
  let total = 0
  const lower = text.toLowerCase()
  const words = Object.keys(WORD_NUMS).join('|')
  for (const p of patterns) {
    const rx = new RegExp(`(\\d+(?:[.,]\\d+)?|${words})\\s*${p}`, 'gi')
    let m
    while ((m = rx.exec(lower)) !== null) {
      const raw = m[1].toLowerCase().replace(',', '.')
      const v = WORD_NUMS[raw] ?? parseFloat(raw)
      if (!isNaN(v)) total += v
    }
  }
  return total
}

export function analyzeText(text) {
  const items = []
  const add = (key, icon, qty, unit, tco2) =>
    items.push({
      category: key,
      label: EMISSION_FACTORS[key].label,
      quantity: qty,
      unit,
      tCO2e: tco2,
      icon,
    })

  const kwh = extractQty(text, ['kwh', 'kw[/\\-]?h', 'kilowatt[s]?', 'electricidad'])
  if (kwh > 0) add('electricity', '⚡', kwh, 'kWh', kwh * EMISSION_FACTORS.electricity.factor)

  const trucks = extractQty(text, ['camioneta[s]?', 'camion(?:es)?', 'truck[s]?', 'van[s]?', 'furgon(?:eta[s]?)?'])
  if (trucks > 0) add('truck', '🚚', trucks, 'unidades', trucks * EMISSION_FACTORS.truck.factor)

  const cars = extractQty(text, ['auto[s]?', 'carro[s]?', 'coche[s]?', 'car[s]?'])
  if (cars > 0) add('car', '🚗', cars, 'unidades', cars * EMISSION_FACTORS.car.factor)

  const gasM3 = extractQty(text, ['m3\\s*(?:de\\s)?gas', 'gas\\s?natural', 'metros\\s?cubicos'])
  if (gasM3 > 0) add('gas', '🔥', gasM3, 'm3', gasM3 * EMISSION_FACTORS.gas.factor)

  const diesel = extractQty(text, ['litro[s]?\\s(?:de\\s)?die?sel', 'die?sel\\s?litros?'])
  if (diesel > 0) add('diesel', '🛢️', diesel, 'litros', diesel * EMISSION_FACTORS.diesel.factor)

  const gaso = extractQty(text, ['litro[s]?\\s(?:de\\s)?gasolina', 'litro[s]?\\s(?:de\\s)?bencina'])
  if (gaso > 0) add('gasoline', '⛽', gaso, 'litros', gaso * EMISSION_FACTORS.gasoline.factor)

  const flight = extractQty(text, ['hora[s]?\\s(?:de\\s)?vuelo', 'flight[s]?', 'vuelo[s]?\\sde'])
  if (flight > 0) add('flight', '✈️', flight, 'horas', flight * EMISSION_FACTORS.flight.factor)

  if (items.length === 0) return null

  const totalTCO2e = items.reduce((s, i) => s + i.tCO2e, 0)
  let rating, ratingColor, ratingEmoji, tip

  if (totalTCO2e < 0.05) {
    rating = 'Muy bajo'; ratingColor = '#34d399'; ratingEmoji = '🌿'
    tip = 'Excelente desempeño ambiental. Considera energía solar para reducir aún más.'
  } else if (totalTCO2e < 0.15) {
    rating = 'Bajo'; ratingColor = '#6ee7b7'; ratingEmoji = '✅'
    tip = 'Buen nivel. Optimiza rutas de reparto y usa iluminación LED.'
  } else if (totalTCO2e < 0.35) {
    rating = 'Moderado'; ratingColor = '#fbbf24'; ratingEmoji = '⚠️'
    tip = 'Nivel moderado. Evalúa fuentes de energía renovable y vehículos eléctricos.'
  } else if (totalTCO2e < 0.75) {
    rating = 'Alto'; ratingColor = '#f97316'; ratingEmoji = '🔶'
    tip = 'Huella significativa. Prioriza la transición energética y eficiencia en transporte.'
  } else {
    rating = 'Muy alto'; ratingColor = '#ef4444'; ratingEmoji = '🚨'
    tip = 'Huella crítica. Consulta un especialista en sostenibilidad para un plan urgente.'
  }

  return {
    items,
    totalTCO2e,
    totalKgCO2e: totalTCO2e * 1000,
    rating, ratingColor, ratingEmoji, tip,
    equivalencies: {
      trees: Math.round(totalTCO2e * 45),
      kmDriven: Math.round(totalTCO2e * 4400),
      mobileCharges: Math.round(totalTCO2e * 121000),
    },
    analyzedAt: new Date().toISOString(),
  }
}
