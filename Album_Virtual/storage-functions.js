// Obtener fotos del localStorage
function getPhotosFromStorage(category) {
  const stored = localStorage.getItem(`elegant_photos_${category}`)
  return stored ? JSON.parse(stored) : []
}

// Guardar fotos en localStorage
function savePhotosToStorage(category, photos) {
  localStorage.setItem(`elegant_photos_${category}`, JSON.stringify(photos))
}

// Cargar fondos guardados
function loadSavedBackgrounds() {
  const categories = ["familiar", "personal", "viajes", "amigos"]
  categories.forEach((cat) => {
    const savedBg = localStorage.getItem(`elegant_bg-${cat}`)
    if (savedBg) {
      const circle = document.getElementById(`circle-${cat}`)
      circle.style.backgroundImage = `url(${savedBg})`
    }
  })
}

// Aplicar imagen seleccionada
const selectedGalleryImage = null
const currentEditingCategory = null
function applySelectedImage() {
  if (!selectedGalleryImage || !currentEditingCategory) {
    showNotification("Por favor, selecciona una imagen", "error")
    return
  }

  const circle = document.getElementById(`circle-${currentEditingCategory}`)
  circle.style.backgroundImage = `url(${selectedGalleryImage})`

  // Guardar en localStorage con prefijo elegant_
  localStorage.setItem(`elegant_bg-${currentEditingCategory}`, selectedGalleryImage)

  closeGallery()
  showNotification("Fondo actualizado correctamente", "success")
}

// Manejar subida de archivo
function handleFileUpload(e) {
  const file = e.target.files[0]
  if (!file || !currentEditingCategory) return

  const reader = new FileReader()
  reader.onload = (e) => {
    const circle = document.getElementById(`circle-${currentEditingCategory}`)
    circle.style.backgroundImage = `url(${e.target.result})`

    // Guardar en localStorage con prefijo elegant_
    localStorage.setItem(`elegant_bg-${currentEditingCategory}`, e.target.result)

    showNotification("Imagen subida exitosamente", "success")
  }
  reader.readAsDataURL(file)
}

// Restaurar fondos originales
function resetBackgrounds() {
  const categories = ["familiar", "personal", "viajes", "amigos"]
  categories.forEach((cat) => {
    const circle = document.getElementById(`circle-${cat}`)
    circle.style.backgroundImage = ""
    localStorage.removeItem(`elegant_bg-${cat}`)
  })

  document.getElementById("configDropdown").classList.remove("active")
  showNotification("Fondos restaurados", "success")
}

// Compartir foto
const currentPhotoIndex = null
const currentGalleryCategory = null
let currentShareLink = null
function sharePhoto() {
  if (currentPhotoIndex === null) return

  const photos = getPhotosFromStorage(currentGalleryCategory)
  const photo = photos[currentPhotoIndex]

  // Generar link único para compartir
  const shareId = generateShareId()
  const shareData = {
    id: shareId,
    photo: photo,
    category: currentGalleryCategory,
    sharedAt: new Date().toISOString(),
  }

  // Guardar datos de compartir con prefijo elegant_
  localStorage.setItem(`elegant_share_${shareId}`, JSON.stringify(shareData))

  // Generar URL de compartir
  const baseUrl = window.location.origin + window.location.pathname
  currentShareLink = `${baseUrl}?share=${shareId}`

  // Mostrar modal de compartir
  document.getElementById("shareLinkContainer").textContent = currentShareLink
  document.getElementById("shareModal").classList.remove("hidden")
}

// Verificar si hay un link compartido al cargar la página
function checkSharedPhoto() {
  const urlParams = new URLSearchParams(window.location.search)
  const shareId = urlParams.get("share")

  if (shareId) {
    const shareData = localStorage.getItem(`elegant_share_${shareId}`)
    if (shareData) {
      const data = JSON.parse(shareData)
      showSharedPhoto(data)
    } else {
      showNotification("El link compartido no es válido o ha expirado", "error")
    }
  }
}

// Funciones auxiliares
function showNotification(message, type) {
  console.log(`Notification (${type}): ${message}`)
}

function closeGallery() {
  console.log("Gallery closed")
}

function generateShareId() {
  return Math.random().toString(36).substr(2, 9)
}

function showSharedPhoto(data) {
  console.log("Shared photo:", data)
}
