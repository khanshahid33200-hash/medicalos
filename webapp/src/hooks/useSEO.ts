import { useEffect } from 'react'

interface SEOOptions {
  title: string
  description?: string
  ogImage?: string
}

export function useSEO({ title, description, ogImage }: SEOOptions) {
  useEffect(() => {
    // 1. Update Title
    const formattedTitle = title.includes('MedTech Fixaters')
      ? title
      : `${title} | MedTech Fixaters`
    document.title = formattedTitle

    // 2. Update Meta Description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]')
      if (!metaDesc) {
        metaDesc = document.createElement('meta')
        metaDesc.setAttribute('name', 'description')
        document.head.appendChild(metaDesc)
      }
      metaDesc.setAttribute('content', description)
    }

    // 3. Update OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) {
      ogTitle.setAttribute('content', formattedTitle)
    }

    // 4. Update OG Description
    if (description) {
      let ogDesc = document.querySelector('meta[property="og:description"]')
      if (ogDesc) {
        ogDesc.setAttribute('content', description)
      }
    }

    // 5. Update OG Image
    if (ogImage) {
      let ogImg = document.querySelector('meta[property="og:image"]')
      if (ogImg) {
        ogImg.setAttribute('content', ogImage)
      }
    }
  }, [title, description, ogImage])
}
