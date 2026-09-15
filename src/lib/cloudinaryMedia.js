const CLOUD_NAME =
  import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

const UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

const MAX_SOURCE_BYTES =
  10 * 1024 * 1024

const TYPE_CONFIG = {
  product: {
    folder: 'elola/products',
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.82
  },
  offer: {
    folder: 'elola/offers',
    maxWidth: 1600,
    maxHeight: 1600,
    quality: 0.82
  },
  slider: {
    folder: 'elola/slider',
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.86
  },
  service: {
    folder: 'elola/services',
    maxWidth: 1600,
    maxHeight: 1200,
    quality: 0.84
  },
  tender: {
    folder: 'elola/tenders',
    maxWidth: 2000,
    maxHeight: 2000,
    quality: 0.86
  }
}

function getTypeConfig(type) {
  return TYPE_CONFIG[type] || TYPE_CONFIG.product
}

function getOutputSize(
  width,
  height,
  maxWidth,
  maxHeight
) {
  const scale =
    Math.min(
      1,
      maxWidth / width,
      maxHeight / height
    )

  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  }
}

async function createCompressedImage(
  file,
  config
) {
  if (!(file instanceof File)) {
    throw new Error('Invalid image file')
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file is not an image')
  }

  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error('Image is larger than 10 MB')
  }

  let bitmap = null

  try {
    if (
      typeof createImageBitmap === 'function'
    ) {
      bitmap = await createImageBitmap(file)

      const size =
        getOutputSize(
          bitmap.width,
          bitmap.height,
          config.maxWidth,
          config.maxHeight
        )

      const canvas =
        document.createElement('canvas')

      canvas.width = size.width
      canvas.height = size.height

      const context =
        canvas.getContext('2d', {
          alpha: true
        })

      if (!context) {
        throw new Error('Canvas is not available')
      }

      context.drawImage(
        bitmap,
        0,
        0,
        size.width,
        size.height
      )

      const blob =
        await new Promise((resolve, reject) => {
          canvas.toBlob(
            result =>
              result
                ? resolve(result)
                : reject(
                    new Error(
                      'Image compression failed'
                    )
                  ),
            'image/webp',
            config.quality
          )
        })

      return new File(
        [blob],
        `${file.name.replace(/\.[^.]+$/, '')}.webp`,
        {
          type: 'image/webp',
          lastModified: Date.now()
        }
      )
    }

    const objectUrl =
      URL.createObjectURL(file)

    try {
      const image =
        await new Promise(
          (resolve, reject) => {
            const img =
              new Image()

            img.onload = () =>
              resolve(img)

            img.onerror = () =>
              reject(
                new Error(
                  'Image could not be decoded'
                )
              )

            img.src = objectUrl
          }
        )

      const size =
        getOutputSize(
          image.naturalWidth,
          image.naturalHeight,
          config.maxWidth,
          config.maxHeight
        )

      const canvas =
        document.createElement('canvas')

      canvas.width = size.width
      canvas.height = size.height

      const context =
        canvas.getContext('2d', {
          alpha: true
        })

      if (!context) {
        throw new Error('Canvas is not available')
      }

      context.drawImage(
        image,
        0,
        0,
        size.width,
        size.height
      )

      const blob =
        await new Promise((resolve, reject) => {
          canvas.toBlob(
            result =>
              result
                ? resolve(result)
                : reject(
                    new Error(
                      'Image compression failed'
                    )
                  ),
            'image/webp',
            config.quality
          )
        })

      return new File(
        [blob],
        `${file.name.replace(/\.[^.]+$/, '')}.webp`,
        {
          type: 'image/webp',
          lastModified: Date.now()
        }
      )
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  } finally {
    if (bitmap) {
      bitmap.close()
    }
  }
}

export async function uploadImageToCloudinary(
  file,
  type = 'product'
) {
  if (!CLOUD_NAME) {
    throw new Error(
      'VITE_CLOUDINARY_CLOUD_NAME is missing'
    )
  }

  if (!UPLOAD_PRESET) {
    throw new Error(
      'VITE_CLOUDINARY_UPLOAD_PRESET is missing'
    )
  }

  const config =
    getTypeConfig(type)

  const compressedFile =
    await createCompressedImage(
      file,
      config
    )

  const formData =
    new FormData()

  formData.append(
    'file',
    compressedFile
  )

  formData.append(
    'upload_preset',
    UPLOAD_PRESET
  )

  formData.append(
    'folder',
    config.folder
  )

  const response =
    await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

  if (!response.ok) {
    let message =
      'Cloudinary upload failed'

    try {
      const error =
        await response.json()

      message =
        error?.error?.message ||
        message
    } catch {
      // Keep the generic upload error.
    }

    throw new Error(message)
  }

  const result =
    await response.json()

  if (!result?.secure_url) {
    throw new Error(
      'Cloudinary did not return an image URL'
    )
  }

  return result.secure_url
}


/**
 * Upload a non-image tender document directly to Cloudinary.
 *
 * Images must continue through uploadImageToCloudinary().
 * Documents use Cloudinary raw/upload and are stored as URL only.
 */
const DOCUMENT_UPLOAD_PRESET =
  import.meta.env.VITE_CLOUDINARY_DOCUMENT_UPLOAD_PRESET ||
  'elola_documents'

const DOCUMENT_MAX_SIZE =
  10 * 1024 * 1024

const sanitizeDocumentFileName = value =>
  String(value || 'file')
    .replace(/[^\w\u0600-\u06FF.\- ]/g, '_')

const uploadDocumentToCloudinary = async (
  file,
  type = 'tender'
) => {

  if (!file) {
    throw new Error('No file selected.')
  }

  if (!(file instanceof File)) {
    throw new Error('Invalid file.')
  }

  if (file.size > DOCUMENT_MAX_SIZE) {
    throw new Error(
      'Document size exceeds the 10 MB application limit.'
    )
  }

  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

  if (!cloudName) {
    throw new Error(
      'VITE_CLOUDINARY_CLOUD_NAME is not configured.'
    )
  }

  if (!DOCUMENT_UPLOAD_PRESET) {
    throw new Error(
      'VITE_CLOUDINARY_DOCUMENT_UPLOAD_PRESET is not configured.'
    )
  }

  const folder =
    type === 'tender'
      ? 'elola/tenders'
      : `elola/${type}`

  const formData =
    new FormData()

  formData.append(
    'file',
    file,
    sanitizeDocumentFileName(file.name)
  )

  formData.append(
    'upload_preset',
    DOCUMENT_UPLOAD_PRESET
  )

  formData.append(
    'folder',
    folder
  )

  const response =
    await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      {
        method: 'POST',
        body: formData
      }
    )

  if (!response.ok) {

    let message =
      `Cloudinary document upload failed (${response.status}).`

    try {

      const errorData =
        await response.json()

      if (errorData?.error?.message) {
        message =
          errorData.error.message
      }

    } catch {
      // Keep the generic HTTP error.
    }

    throw new Error(message)
  }

  const result =
    await response.json()

  if (!result?.secure_url) {
    throw new Error(
      'Cloudinary did not return a document URL.'
    )
  }

  return result.secure_url
}
export {
  uploadDocumentToCloudinary
}

export default uploadImageToCloudinary
