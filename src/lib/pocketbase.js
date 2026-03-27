import PocketBase from 'pocketbase'

const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL)

// Keep auth store in sync across tabs
pb.authStore.onChange(() => {
  window.dispatchEvent(new Event('pb-auth-change'))
})

export default pb
