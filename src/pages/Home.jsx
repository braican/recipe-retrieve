import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import pb from '../lib/pocketbase'
import { useAuth } from '../lib/auth'
import RecipeCard from '../components/RecipeCard'
import styles from './Home.module.css'

export default function Home() {
  const { user } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchRecipes()
  }, [user])

  async function fetchRecipes() {
    setLoading(true)
    try {
      const result = await pb.collection('recipes').getFullList({
        filter: `owner = "${user.id}"`,
        sort: '-created',
        requestKey: null,
      })
      setRecipes(result)
    } catch (err) {
      console.error('Failed to fetch recipes', err)
    } finally {
      setLoading(false)
    }
  }

  const filtered = recipes.filter((r) =>
    !search ||
    r.title.toLowerCase().includes(search.toLowerCase()) ||
    r.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Your Collection</h1>
          {!loading && (
            <p className={styles.count}>
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
            </p>
          )}
        </div>
        <Link to="/add" className={styles.addBtn}>
          + Add Recipe
        </Link>
      </div>

      <div className={styles.toolbar}>
        <input
          type="search"
          placeholder="Search recipes or tags…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.search}
        />
      </div>

      {loading ? (
        <div className={styles.loadingGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          {recipes.length === 0 ? (
            <>
              <span className={styles.emptyIcon}>✦</span>
              <p>Your collection is empty.</p>
              <p className={styles.emptyHint}>
                Add your first recipe manually or import from Instagram.
              </p>
              <Link to="/add" className={styles.emptyBtn}>Get started</Link>
            </>
          ) : (
            <>
              <span className={styles.emptyIcon}>⌕</span>
              <p>No recipes match your search.</p>
            </>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </div>
  )
}
