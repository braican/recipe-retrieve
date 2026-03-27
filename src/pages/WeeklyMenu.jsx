import { useState, useEffect } from 'react'
import pb from '../lib/pocketbase'
import { useAuth } from '../lib/auth'
import RecipeCard from '../components/RecipeCard'
import styles from './WeeklyMenu.module.css'

export default function WeeklyMenu() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [cookedIds, setCookedIds] = useState(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMenu()
  }, [user])

  async function fetchMenu() {
    setLoading(true)
    try {
      const [menuEntries, cooked] = await Promise.all([
        pb.collection('weekly_menu').getFullList({
          filter: `user = "${user.id}"`,
          expand: 'recipe',
          requestKey: null,
        }),
        pb.collection('cooked_recipes').getFullList({
          filter: `user = "${user.id}"`,
          requestKey: null,
        }),
      ])
      setRecipes(menuEntries.map((e) => e.expand.recipe))
      setCookedIds(new Set(cooked.map((c) => c.recipe)))
    } catch (err) {
      console.error('Failed to fetch weekly menu', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>This Week's Menu</h1>
        {!loading && (
          <p className={styles.count}>
            {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
          </p>
        )}
      </div>

      {loading ? (
        <div className={styles.loadingGrid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : recipes.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>✦</span>
          <p>No recipes on the menu yet.</p>
          <p className={styles.emptyHint}>Open a recipe and add it to this week's menu.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} cooked={cookedIds.has(recipe.id)} onMenu />
          ))}
        </div>
      )}
    </div>
  )
}
