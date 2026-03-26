import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import pb from '../lib/pocketbase'
import { useAuth } from '../lib/auth'
import RecipeForm from '../components/RecipeForm'
import styles from './AddRecipe.module.css'

export default function AddRecipe() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(data) {
    setSubmitting(true)
    setError('')
    try {
      const record = await pb.collection('recipes').create({
        ...data,
        source_type: 'manual',
        owner: user.id,
      })
      navigate(`/recipe/${record.id}`, { replace: true })
    } catch (err) {
      console.error(err)
      setError('Failed to save recipe. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link to="/" className={styles.back}>← Collection</Link>
        <h1 className={styles.title}>Add Recipe</h1>
        <p className={styles.subtitle}>
          Adding manually —{' '}
          <Link to="/add/instagram" className={styles.switchLink}>
            import from Instagram instead ↗
          </Link>
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <RecipeForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}
