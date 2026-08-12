import { useEffect, useRef } from 'react'
import styles from './ResultCard.module.css'

function Bar({ value, max }) {
  const pct = Math.min((value / (max || 1)) * 100, 100)
  return (
    <div className={styles.track} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={styles.fill} style={{ width: pct + '%' }} />
    </div>
  )
}

export default function ResultCard({ result, inputText, onReset }) {
  const ref = useRef(null)
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [result])

  if (!result) return null

  const maxItem = Math.max(...result.items.map(i => i.tCO2e), 0.001)
  const displayTotal = result.totalKgCO2e < 1
    ? result.totalKgCO2e.toFixed(2) + ' kg'
    : result.totalTCO2e.toFixed(3) + ' t'

  return (
    <div ref={ref} className={`${styles.card} glass-card animate-fade-in-up`} id="result-card" aria-live="polite">

      {/* Header */}
      <div className={styles.head}>
        <div className={styles.headLeft}>
          <span className={styles.emoji}>{result.ratingEmoji}</span>
          <div>
            <h2 className={styles.title}>Análisis completado</h2>
            <p className={styles.sub} title={inputText}>
              "{inputText.length > 70 ? inputText.slice(0, 70) + '…' : inputText}"
            </p>
          </div>
        </div>
        <button id="reset-btn" className="btn-ghost" onClick={onReset}>↩ Nueva consulta</button>
      </div>

      {/* Gauge + Meta */}
      <div className={styles.total}>
        <div className={`${styles.gauge} animate-pulse-glow`} style={{ '--rc': result.ratingColor }}>
          <span className={styles.gVal}>{displayTotal}</span>
          <span className={styles.gLbl}>CO₂ equivalente</span>
        </div>
        <div className={styles.meta}>
          <div className={styles.badge} style={{ color: result.ratingColor, borderColor: result.ratingColor }}>
            Nivel: <strong>{result.rating}</strong>
          </div>
          <p className={styles.tip}>{result.tip}</p>
          <p className={styles.ts}>📅 {new Date(result.analyzedAt).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        </div>
      </div>

      {/* Breakdown */}
      <div>
        <h3 className={styles.sec}>Desglose por categoría</h3>
        <div className={styles.list}>
          {result.items.map((item, i) => (
            <div key={i} className={styles.row}>
              <div className={styles.rowHead}>
                <span>{item.icon}</span>
                <span className={styles.rowLabel}>{item.label}</span>
                <span className={styles.rowQty}>{item.quantity.toFixed(1)} {item.unit}</span>
                <span className={styles.rowVal}>{(item.tCO2e * 1000).toFixed(2)} kg CO₂e</span>
              </div>
              <Bar value={item.tCO2e} max={maxItem} />
            </div>
          ))}
        </div>
      </div>

      {/* Equivalencies */}
      <div>
        <h3 className={styles.sec}>¿Qué significa esto?</h3>
        <div className={styles.eqs}>
          <div className={styles.eq} id="eq-trees">
            <span>🌳</span>
            <strong>{result.equivalencies.trees.toLocaleString()}</strong>
            <span>árboles para absorber esto en un año</span>
          </div>
          <div className={styles.eq} id="eq-km">
            <span>🚗</span>
            <strong>{result.equivalencies.kmDriven.toLocaleString()}</strong>
            <span>km conducidos en auto promedio</span>
          </div>
          <div className={styles.eq} id="eq-phone">
            <span>📱</span>
            <strong>{result.equivalencies.mobileCharges.toLocaleString()}</strong>
            <span>cargas de smartphone</span>
          </div>
        </div>
      </div>
    </div>
  )
}
