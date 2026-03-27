import { useState } from 'react'
import styles from './RecipeForm.module.css'

const EMPTY = {
  title: '',
  description: '',
  servings: '',
  prep_time: '',
  cook_time: '',
  ingredients: [''],
  steps: [''],
  tags: '',
  notes: '',
  source_url: '',
}

export default function RecipeForm({ initial = {}, onSubmit, submitting }) {
  const merged = { ...EMPTY, ...initial }
  const [form, setForm] = useState(
    Object.fromEntries(Object.entries(merged).map(([k, v]) => [k, v ?? EMPTY[k]]))
  )

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function setListItem(field, index, value) {
    setForm((f) => {
      const arr = [...f[field]]
      arr[index] = value
      return { ...f, [field]: arr }
    })
  }

  function addListItem(field) {
    setForm((f) => ({ ...f, [field]: [...f[field], ''] }))
  }

  function removeListItem(field, index) {
    setForm((f) => {
      const arr = f[field].filter((_, i) => i !== index)
      return { ...f, [field]: arr.length ? arr : [''] }
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    const payload = {
      ...form,
      ingredients: form.ingredients.filter(Boolean),
      steps: form.steps.filter(Boolean),
      tags: form.tags
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Title *</label>
        <input
          required
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="e.g. Lemon Butter Pasta"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          placeholder="A short description of the dish"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Prep time</label>
          <input
            value={form.prep_time}
            onChange={(e) => set('prep_time', e.target.value)}
            placeholder="e.g. 15 mins"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Cook time</label>
          <input
            value={form.cook_time}
            onChange={(e) => set('cook_time', e.target.value)}
            placeholder="e.g. 30 mins"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Servings</label>
          <input
            value={form.servings}
            onChange={(e) => set('servings', e.target.value)}
            placeholder="e.g. 4"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Ingredients</label>
        <div className={styles.listField}>
          {form.ingredients.map((ing, i) => (
            <div key={i} className={styles.listRow}>
              <input
                value={ing}
                onChange={(e) => setListItem('ingredients', i, e.target.value)}
                placeholder={`Ingredient ${i + 1}`}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeListItem('ingredients', i)}
              >×</button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addItemBtn}
            onClick={() => addListItem('ingredients')}
          >+ Add ingredient</button>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Steps</label>
        <div className={styles.listField}>
          {form.steps.map((step, i) => (
            <div key={i} className={styles.listRow}>
              <div className={styles.stepNum}>{i + 1}</div>
              <textarea
                rows={2}
                value={step}
                onChange={(e) => setListItem('steps', i, e.target.value)}
                placeholder={`Step ${i + 1}`}
              />
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => removeListItem('steps', i)}
              >×</button>
            </div>
          ))}
          <button
            type="button"
            className={styles.addItemBtn}
            onClick={() => addListItem('steps')}
          >+ Add step</button>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Notes</label>
        <textarea
          rows={2}
          value={form.notes}
          onChange={(e) => set('notes', e.target.value)}
          placeholder="Any extra tips or variations"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Tags</label>
        <input
          value={form.tags}
          onChange={(e) => set('tags', e.target.value)}
          placeholder="e.g. pasta, quick, vegetarian (comma separated)"
        />
      </div>

      {form.source_url !== undefined && (
        <div className={styles.field}>
          <label className={styles.label}>Source URL</label>
          <input
            type="url"
            value={form.source_url}
            onChange={(e) => set('source_url', e.target.value)}
            placeholder="https://..."
          />
        </div>
      )}

      <button type="submit" className={styles.submitBtn} disabled={submitting}>
        {submitting ? 'Saving…' : 'Save Recipe'}
      </button>
    </form>
  )
}
