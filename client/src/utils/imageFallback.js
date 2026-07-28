export const useCoverFallback = (event) => {
  const image = event?.currentTarget
  if (!image || image.dataset.fallbackApplied === 'true') return

  image.dataset.fallbackApplied = 'true'
  image.src = '/spacesoul_logo.png'
  image.classList.add('cover-fallback-image')
}
