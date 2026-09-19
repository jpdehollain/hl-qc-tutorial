Drop your own icons in here as:

  icon-192.png  (192x192)
  icon-512.png  (512x512)

Both are referenced by manifest.json and index.html. Until they exist,
the manifest and favicon links will 404 in the browser console, which is
harmless during development but should be fixed before publishing.
