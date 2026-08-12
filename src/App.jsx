import { useState, useEffect } from 'react'
import { analyzeText } from './api/carbonAnalysis'
import ChatInput from './components/ChatInput'
import ResultCard from './components/ResultCard'
import HistoryPanel from './components/HistoryPanel'
import styles from './App.module.css'

const STORAGE_KEY = 'ecotrack_history'
const MAX_HISTORY = 10

export default function App() {
  const [result, setResult] = useState(null)
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const handleAnalyze = async (text) => {
    setError(null); setIsLoading(true); setResult(null); setInputText(text)
    await new Promise(r => setTimeout(r, 900))
    try {
      const res = analyzeText(text)
      if (!res) {
        setError('No pude detectar actividades con consumo energético o de transporte. Intenta incluir datos como kWh, camionetas, litros de combustible, etc.')
      } else {
        setResult(res)
        setHistory(prev => [{ id: Date.now(), text, result: res }, ...prev].slice(0, MAX_HISTORY))
      }
    } catch (err) {
      setError('Ocurrió un error al analizar. Por favor intenta de nuevo.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => { setResult(null); setError(null); setInputText('') }

  return (
    <div className={styles.app} id="app-root">

      {/* Header */}
      <header className={styles.header} role="banner">
        <div className={styles.logo}>
          <span className={styles.icon} aria-hidden="true">🌍</span>
          <div>
            <h1 className={styles.name}>EcoTrack <span className={styles.ai}>AI</span></h1>
            <p className={styles.tag}>Huella de carbono para tu negocio</p>
          </div>
        </div>
        <nav className={styles.nav} aria-label="Navegacion">
          <a href="#how-it-works" className={styles.link} id="nav-how">¿Cómo funciona?</a>
          <a href="#factors" className={styles.link} id="nav-factors">Factores</a>
          <span className={styles.beta}>Beta</span>
        </nav>
      </header>

      {/* Hero */}
      <section className={styles.hero} aria-labelledby="hero-h">
        <div className={styles.heroBadge}><span>✨</span> Análisis con Inteligencia Artificial</div>
        <h2 id="hero-h" className={styles.heroTitle}>
          Mide tu impacto<br /><span className={styles.grad}>en segundos</span>
        </h2>
        <p className={styles.heroSub}>
          Describe las actividades de tu negocio en lenguaje natural. Nuestro motor de IA extrae los datos y calcula automáticamente las emisiones de CO₂ equivalente.
        </p>
        <div className={styles.stats} aria-label="Estadisticas">
          <div className={styles.stat} id="stat-cats"><span className={styles.sn}>8+</span><span className={styles.sl}>categorías detectadas</span></div>
          <div className={styles.sdiv} aria-hidden="true" />
          <div className={styles.stat} id="stat-ipcc"><span className={styles.sn}>IPCC</span><span className={styles.sl}>factores de emisión</span></div>
          <div className={styles.sdiv} aria-hidden="true" />
          <div className={styles.stat} id="stat-speed"><span className={styles.sn}>&lt;1s</span><span className={styles.sl}>tiempo de análisis</span></div>
        </div>
      </section>

      {/* Main */}
      <main className={styles.main} id="main-content" role="main">
        <div className={styles.grid}>
          <div className={styles.col}>
            <section className={`${styles.card} glass-card`} aria-labelledby="input-h">
              <h2 id="input-h" className={styles.cardTitle}>Describe las actividades de hoy</h2>
              <p className={styles.cardSub}>Usa lenguaje natural: electricidad (kWh), vehículos, combustible, gas, vuelos…</p>
              <ChatInput onAnalyze={handleAnalyze} isLoading={isLoading} />
            </section>
            {error && <div className={styles.err} role="alert" id="error-message"><span>⚠️</span> {error}</div>}
            {result && <ResultCard result={result} inputText={inputText} onReset={reset} />}
          </div>

          <aside className={styles.side}>
            <HistoryPanel history={history} onSelect={e => { setInputText(e.text); setResult(e.result); setError(null) }} onClear={() => setHistory([])} />
            <div className={`${styles.info} glass-card`} id="how-it-works" aria-labelledby="info-h">
              <h3 id="info-h" className={styles.infoTitle}>¿Cómo funciona?</h3>
              <ol className={styles.steps}>
                <li><span>1</span>Describe tus actividades en lenguaje natural</li>
                <li><span>2</span>La IA extrae cantidades y categorías automáticamente</li>
                <li><span>3</span>Se aplican factores de emisión del IPCC</li>
                <li><span>4</span>Recibes un desglose y recomendaciones</li>
              </ol>
            </div>
            <div className={`${styles.info} glass-card`} id="factors" aria-labelledby="fac-h">
              <h3 id="fac-h" className={styles.infoTitle}>📐 Categorías detectadas</h3>
              <ul className={styles.facs}>
                {['⚡ Electricidad (kWh)', '🚚 Camionetas / furgonetas', '🚗 Autos / carros',
                  '🔥 Gas natural (m³)', '🛢️ Diésel (litros)', '⛽ Gasolina (litros)', '✈️ Vuelos (horas)'].map(f => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer} role="contentinfo">
        <p>EcoTrack AI · Proyecto Integrador Vibe Coding · Factores basados en <abbr title="Intergovernmental Panel on Climate Change">IPCC</abbr> AR6 · <span className={styles.fhl}>Solo para fines demostrativos</span></p>
      </footer>
    </div>
  )
}
