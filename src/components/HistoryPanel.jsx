import styles from './HistoryPanel.module.css'

export default function HistoryPanel({ history, onSelect, onClear }) {
  if (!history || history.length === 0) return null
  return (
    <aside className={`${styles.panel} glass-card`} id="history-panel" aria-label="Historial de analisis">
      <div className={styles.head}>
        <h3 className={styles.title}>📋 Historial reciente</h3>
        <button id="clear-history-btn" className="btn-ghost" onClick={onClear}>🗑 Limpiar</button>
      </div>
      <ul className={styles.list} role="list">
        {history.map((entry, i) => (
          <li key={entry.id} role="listitem">
            <button id={`history-item-${i}`} className={styles.item} onClick={() => onSelect(entry)} title={entry.text}>
              <span>{entry.result.ratingEmoji}</span>
              <div className={styles.content}>
                <p className={styles.text}>{entry.text.length > 55 ? entry.text.slice(0, 55) + '…' : entry.text}</p>
                <p className={styles.meta}>{entry.result.totalKgCO2e.toFixed(2)} kg CO₂e · {new Date(entry.result.analyzedAt).toLocaleTimeString('es-MX', { timeStyle: 'short' })}</p>
              </div>
              <span className={styles.arrow}>›</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
