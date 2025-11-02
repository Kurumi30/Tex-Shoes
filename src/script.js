function openModal(modal) {
  if (!modal) return

  modal.classList.add('active')
  modal.setAttribute('aria-hidden', 'false')
}

function closeModal(modal) {
  if (!modal) return

  modal.classList.remove('active')
  modal.setAttribute('aria-hidden', 'true')
}

document.addEventListener('DOMContentLoaded', () => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel)
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel))

  const menuToggle = $('#menu-toggle')
  const navMenu = $('#nav-menu')
  const navLinks = $$('.nav-link')

  const categoryLinks = $$('.category-card')
  const productCards = $$('.product-card')

  const imageModal = $('#image-modal')
  const imageModalImg = $('#modal-image')
  const imageModalClose = imageModal ? $('.modal-close', imageModal) : null

  const sizeGuideModal = $('#size-guide-modal')
  const sizeGuideLinks = $$('.size-guide-link')
  const sizeGuideClose = sizeGuideModal ? $('.size-guide-close', sizeGuideModal) : null

  const purchaseModal = $('#purchase-modal')
  const purchaseProductName = $('#purchase-product-name')
  const purchaseWhatsapp = $('#purchase-whatsapp')
  const purchaseInstagram = $('#purchase-instagram')
  const purchaseClose = purchaseModal ? $('.purchase-close', purchaseModal) : null

  if (purchaseModal) {
    $$('.product-card .button').forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault()

        const card = btn.closest('.product-card')
        const name = card ? $('.product-name', card)?.textContent.trim() : 'produto'
        const price = card ? $('.product-price', card)?.textContent.trim() : ''

        if (purchaseProductName) purchaseProductName.textContent = `${name} ${price}`

        const whatsappText = encodeURIComponent(`Olá, gostaria de comprar: ${name} ${price}`)
        if (purchaseWhatsapp) purchaseWhatsapp.href = `https://wa.me/5511910076475?text=${whatsappText}`

        if (purchaseInstagram) purchaseInstagram.href = 'https://www.instagram.com/texshoes_/'

        openModal(purchaseModal)
      })
    })

    if (purchaseClose) purchaseClose.addEventListener('click', () => closeModal(purchaseModal))

    purchaseModal.addEventListener('click', e => {
      if (e.target === purchaseModal) closeModal(purchaseModal)
    })
  }

  const closeAllModals = () => {
    closeModal(imageModal)
    closeModal(sizeGuideModal)
    closeModal(purchaseModal)
  }

  const setMenuIcons = open => {
    if (!menuToggle) return

    menuToggle.classList.toggle('fa-times', open)
    menuToggle.classList.toggle('fa-bars', !open)
  }

  const closeMobileMenu = () => {
    if (!navMenu) return

    navMenu.classList.remove('active')

    setMenuIcons(false)
  }

  if (imageModal && imageModalImg) {
    $$('.product-image-wrapper').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const img = $('.product-image', wrapper)

        if (!img || !img.src) return

        imageModalImg.src = img.src
        imageModalImg.alt = img.alt || ''
        imageModalImg.classList.remove('zoomed')

        openModal(imageModal)
      })
    })

    if (imageModalClose) imageModalClose.addEventListener('click', () => {
      if (imageModalImg) imageModalImg.classList.remove('zoomed')
      closeModal(imageModal)
    })

    imageModalImg.addEventListener('click', (e) => {
      e.stopPropagation()

      imageModalImg.classList.toggle('zoomed')
    })

    imageModal.addEventListener('click', (ev) => {
      if (ev.target === imageModal) {
        if (imageModalImg) imageModalImg.classList.remove('zoomed')

        closeModal(imageModal)
      }
    })
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const opening = !navMenu.classList.contains('active')

      navMenu.classList.toggle('active')

      setMenuIcons(opening)
    })
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('active')) closeMobileMenu()
    })
  })

  // FILTRAGEM DE CATEGORIAS
  if (categoryLinks.length && productCards.length) {
    const clearActive = () => categoryLinks.forEach(l => l.classList.remove('active-category'))

    categoryLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()

        clearActive()

        link.classList.add('active-category')

        const selected = link.dataset.category

        productCards.forEach(card => {
          const cat = card.dataset.category

          card.classList.toggle('hidden', !(selected === 'all' || selected === cat))
        })

        if (navMenu && navMenu.classList.contains('active')) closeMobileMenu()
      })
    })
  }

  // MODAL DE IMAGEM (Lightbox)
  if (imageModal && imageModalImg) {
    $$('.product-image-wrapper').forEach(wrapper => {
      wrapper.addEventListener('click', () => {
        const img = $('.product-image', wrapper)

        if (!img || !img.src) return

        imageModalImg.src = img.src

        openModal(imageModal)
      })
    })

    if (imageModalClose) imageModalClose.addEventListener('click', () => closeModal(imageModal))

    imageModal.addEventListener('click', (ev) => {
      if (ev.target === imageModal) closeModal(imageModal)
    })
  }

  if (sizeGuideModal && sizeGuideLinks.length) {
    sizeGuideLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()

        openModal(sizeGuideModal)
      })
    })

    if (sizeGuideClose) sizeGuideClose.addEventListener('click', () => closeModal(sizeGuideModal))

    sizeGuideModal.addEventListener('click', e => {
      if (e.target === sizeGuideModal) closeModal(sizeGuideModal)
    })
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals()
  })
})
