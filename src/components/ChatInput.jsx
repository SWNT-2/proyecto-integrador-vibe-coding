import { useState, useRef, useEffect } from 'react'
import styles from './ChatInput.module.css'

const EXAMPLES = [
  'Hoy usamos 5 camionetas de reparto y gastamos 200kWh de luz',
  'Consumimos 50 litros de diesel y 150kWh de electricidad',
  'Tres autos de empresa y 80m3 de gas natural',
  'Dos vuelos de 3 horas y 400kWh electricos',
]

export default function ChatInput({ onAnalyze, isLoading }) {
  const [text, setText] = useState('')
  const ref = useRef(null)
  const MAX = 500

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = ref.current.scrollHeight + 'px'
    }
  }, [text])

  const submit = (e) => {
    e.preventDefault()
    if (text.trim().length < 5 || isLoading) return
    onAnalyze(text.trim())
  }

  return (
    <div className={styles.wrap}>
      <form onSubmit={submit} className={styles.form} id="activity-form">
        <div className={styles.inputBox}>
          <span className={styles.leaf} aria-hidden="true">🌱</span>
          <textarea
            ref={ref}
            id="activity-input"
            className={styles.textarea}
            placeholder="Describe las actividades de tu negocio hoy… (ej: '5 camionetas de reparto, 200kWh de electricidad')"
            value={text}
            onChange={e => setText(e.target.value.slice(0, MAX))}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(e) }}
            rows={3}
            disabled={isLoading}
            aria-label="Descripcion de actividades del negocio"
          />
          <div className={styles.footer}>
            <span className={`${styles.count} ${text.length > MAX * 0.85 ? styles.warn : ''}`}>{text.length}/{MAX}</span>
            <span className={styles.hint}>Ctrl+Enter para analizar</span>
          </div>
        </div>
        <button id="analyze-btn" type="submit" className="btn-primary" disabled={text.trim().length < 5 || isLoading}>
          {isLoading
            ? <><span className={`${styles.spinner} animate-spin`} aria-hidden="true" />Analizando…</>
            : <><span aria-hidden="true">📊</span>Calcular huella</>}
        </button>
      </form>

      <div className={styles.examples}>
        <p className={styles.exLabel}>💡 Prueba con un ejemplo:</p>
        <div className={styles.chips}>
          {EXAMPLES.map((ex, i) => (
            <button key={i} id={`example-${i}`} className={styles.chip}
              onClick={() => { setText(ex); ref.current?.focus() }}
              disabled={isLoading} type="button">
              {ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
