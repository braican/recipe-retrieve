import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import pb from '../lib/pocketbase'
import { useAuth } from '../lib/auth'
import styles from './RecipeDetail.module.css'

export default function RecipeDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    fetchRecipe()
  }, [id])

  async function fetchRecipe() {
    try {
      const result = await pb.collection('recipes').getOne(id, { requestKey: null })
      setRecipe(result)
    } catch {
      navigate('/', { replace: true })
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirmDelete) { setConfirmDelete(true); return }
    setDeleting(true)
    try {
      await pb.collection('recipes').delete(id)
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Delete failed', err)
      setDeleting(false)
    }
  }

  if (loading) return <div className={styles.loading}><span className={styles.spinner} /></div>
  if (!recipe) return null

  const imageUrl = recipe.image
    ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/recipes/${recipe.id}/${recipe.image}`
    : null

  const isOwner = recipe.owner === user?.id

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <Link to="/" className={styles.back}>← Collection</Link>
        {isOwner && (
          <button
            className={`${styles.deleteBtn} ${confirmDelete ? styles.confirm : ''}`}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : confirmDelete ? 'Confirm delete' : 'Delete'}
          </button>
        )}
      </div>

      {imageUrl && (
        <div className={styles.heroWrap}>
          <img src={imageUrl} alt={recipe.title} className={styles.hero} />
        </div>
      )}

      <div className={styles.content}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>{recipe.title}</h1>
          {recipe.source_type === 'instagram' && recipe.source_url && (
            <a
              href={recipe.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceLink}
            >
              View on Instagram ↗
            </a>
          )}
        </div>

        {recipe.description && (
          <p className={styles.description}>{recipe.description}</p>
        )}

        <div className={styles.metaRow}>
          {recipe.prep_time && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Prep</span>
              <span>{recipe.prep_time}</span>
            </div>
          )}
          {recipe.cook_time && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Cook</span>
              <span>{recipe.cook_time}</span>
            </div>
          )}
          {recipe.servings && (
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Serves</span>
              <span>{recipe.servings}</span>
            </div>
          )}
        </div>

        {recipe.tags?.length > 0 && (
          <div className={styles.tags}>
            {recipe.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}

        <div className={styles.sections}>
          {recipe.ingredients?.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Ingredients</h2>
              <ul className={styles.ingredientList}>
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className={styles.ingredient}>
                    <span className={styles.bullet}>—</span>
                    {ing}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {recipe.steps?.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Method</h2>
              <ol className={styles.stepList}>
                {recipe.steps.map((step, i) => (
                  <li key={i} className={styles.step}>
                    <span className={styles.stepNum}>{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>
          )}

          {recipe.notes && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Notes</h2>
              <p className={styles.notes}>{recipe.notes}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
