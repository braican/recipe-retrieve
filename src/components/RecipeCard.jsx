import { Link } from 'react-router-dom'
import styles from './RecipeCard.module.css'

export default function RecipeCard({ recipe }) {
  const imageUrl = recipe.image
    ? `${import.meta.env.VITE_POCKETBASE_URL}/api/files/recipes/${recipe.id}/${recipe.image}`
    : null

  return (
    <Link to={`/recipe/${recipe.id}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {imageUrl ? (
          <img src={imageUrl} alt={recipe.title} className={styles.image} />
        ) : (
          <div className={styles.imagePlaceholder}>
            <span>✦</span>
          </div>
        )}
        {recipe.source_type === 'instagram' && (
          <span className={styles.badge}>IG</span>
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{recipe.title}</h3>
        {recipe.description && (
          <p className={styles.desc}>{recipe.description}</p>
        )}
        <div className={styles.meta}>
          {recipe.cook_time && <span>{recipe.cook_time}</span>}
          {recipe.servings && <span>{recipe.servings}</span>}
        </div>
        {recipe.tags?.length > 0 && (
          <div className={styles.tags}>
            {recipe.tags.slice(0, 3).map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
