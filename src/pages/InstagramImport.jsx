import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import pb from '../lib/pocketbase'
import { useAuth } from '../lib/auth'
import { parseInstagramRecipe } from '../lib/parseRecipe'
import RecipeForm from '../components/RecipeForm'
import styles from './InstagramImport.module.css'

const STEP_INPUT = 'input'
const STEP_PARSING = 'parsing'
const STEP_REVIEW = 'review'
const STEP_SAVING = 'saving'

export default function InstagramImport() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Prefill from Web Share Target (via router state or sessionStorage)
  const sharePayload = (() => {
    if (location.state?.url) return location.state
    try {
      const stored = sessionStorage.getItem('share-payload')
      if (stored) { sessionStorage.removeItem('share-payload'); return JSON.parse(stored) }
    } catch {}
    return {}
  })()

  const [step, setStep] = useState(STEP_INPUT)
  const [url, setUrl] = useState(sharePayload.url || '')
  const [caption, setCaption] = useState(sharePayload.caption || sharePayload.text || '')
  const [parsed, setParsed] = useState(null)
  const [error, setError] = useState('')

  async function handleParse(e) {
    e.preventDefault()
    if (!url) return
    setError('')
    setStep(STEP_PARSING)
    try {
      const result = await parseInstagramRecipe({ url, caption })
      // Normalize arrays in case AI returns strings
      if (typeof result.ingredients === 'string')
        result.ingredients = result.ingredients.split('\n').filter(Boolean)
      if (typeof result.steps === 'string')
        result.steps = result.steps.split('\n').filter(Boolean)
      if (!Array.isArray(result.ingredients)) result.ingredients = []
      if (!Array.isArray(result.steps)) result.steps = []
      // Flatten tags for RecipeForm (expects comma string)
      if (Array.isArray(result.tags)) result.tags = result.tags.join(', ')
      setParsed(result)
      setStep(STEP_REVIEW)
    } catch (err) {
      setError(err.message || 'Failed to parse recipe')
      setStep(STEP_INPUT)
    }
  }

  async function handleSave(data) {
    setStep(STEP_SAVING)
    try {
      const record = await pb.collection('recipes').create({
        ...data,
        source_type: 'instagram',
        source_url: url,
        owner: user.id,
      })
      navigate(`/recipe/${record.id}`, { replace: true })
    } catch (err) {
      console.error(err)
      setError('Failed to save recipe. Please try again.')
      setStep(STEP_REVIEW)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/add" className={styles.back}>← Add Recipe</Link>
        <h1 className={styles.title}>Import from Instagram</h1>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {(step === STEP_INPUT || step === STEP_PARSING) && (
        <form onSubmit={handleParse} className={styles.inputForm}>
          <div className={styles.field}>
            <label className={styles.label}>Instagram Post URL *</label>
            <input
              required
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/p/..."
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Caption / Description</label>
            <p className={styles.hint}>
              Instagram blocks direct scraping, so paste the post caption here.
              Claude will extract the recipe from it.
            </p>
            <textarea
              rows={6}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Paste the post caption or any recipe text here…"
            />
          </div>

          <button
            type="submit"
            className={styles.parseBtn}
            disabled={step === STEP_PARSING || !url}
          >
            {step === STEP_PARSING ? (
              <><span className={styles.spinner} /> Parsing with AI…</>
            ) : (
              '✦ Extract Recipe'
            )}
          </button>
        </form>
      )}

      {step === STEP_REVIEW && parsed && (
        <div className={styles.review}>
          <div className={styles.reviewBanner}>
            <span>✓</span> Recipe extracted — review and edit before saving
          </div>
          <RecipeForm
            initial={parsed}
            onSubmit={handleSave}
            submitting={step === STEP_SAVING}
          />
        </div>
      )}
    </div>
  )
}
