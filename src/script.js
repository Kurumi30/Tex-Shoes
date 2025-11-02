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

document.addEventListener('DOMContentLoaded', async () => {
  const $ = (sel, ctx = document) => ctx.querySelector(sel)
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel))

  const menuToggle = $('#menu-toggle')
  const navMenu = $('#nav-menu')
  const navLinks = $$('.nav-link')

  const imageModal = $('#image-modal')
  const imageModalImg = $('#modal-image')
  const imageModalClose = imageModal ? $('.modal-close', imageModal) : null

  const sizeGuideModal = $('#size-guide-modal')
  const sizeGuideClose = sizeGuideModal ? $('.size-guide-close', sizeGuideModal) : null

  const purchaseModal = $('#purchase-modal')
  const purchaseProductName = $('#purchase-product-name')
  const purchaseWhatsapp = $('#purchase-whatsapp')
  const purchaseInstagram = $('#purchase-instagram')
  const purchaseClose = purchaseModal ? $('.purchase-close', purchaseModal) : null

  const productGrid = $('.product-grid')

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

  const closeAllModals = () => {
    closeModal(imageModal)
    closeModal(sizeGuideModal)
    closeModal(purchaseModal)

    if (imageModalImg) imageModalImg.classList.remove('zoomed')
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllModals()
  })

  function formatPrice(value) {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
    }

    if (typeof value === 'string' && value.trim().length > 0) return value

    return ''
  }

  function renderProducts(products = []) {
    if (!productGrid) return

    productGrid.innerHTML = products.map(p => `
      <article class="product-card" data-category="${p.category}">
        <div class="product-image-wrapper" aria-hidden="true">
          <img src="${p.image}" alt="${p.name}" class="product-image">
        </div>
        <div class="product-info">
          <h3 class="product-name">${p.name}</h3>
          <p class="product-category">${(p.category || '').charAt(0).toUpperCase() + (p.category || '').slice(1)}</p>
          <p class="product-price">${formatPrice(p.price)}</p>
          <a href="#" class="size-guide-link">Guia de Medidas</a>
          <button class="button">Comprar agora</button>
        </div>
      </article>
    `).join('')
  }

  function attachProductDelegation() {
    // Filtragem por categoria (requer que existam .category-card no DOM)
    const categoryCards = $$('.category-card')

    if (categoryCards.length) {
      const clearActive = () => categoryCards.forEach(c => c.classList.remove('active-category'))

      categoryCards.forEach(card => {
        card.addEventListener('click', e => {
          e.preventDefault()

          clearActive()

          card.classList.add('active-category')

          const selected = card.dataset.category
          const allProducts = $$('.product-card')

          allProducts.forEach(p => {
            const cat = p.dataset.category

            p.classList.toggle('hidden', !(selected === 'all' || selected === cat))
          })

          if (navMenu && navMenu.classList.contains('active')) closeMobileMenu()
        })
      })
    }

    if (!productGrid) return

    productGrid.addEventListener('click', e => {
      const productCard = e.target.closest('.product-card')
      const addBtn = e.target.closest('.product-card .button')

      if (addBtn && productCard) {
        e.preventDefault()

        const name = $('.product-name', productCard)?.textContent.trim() || 'produto'
        const price = $('.product-price', productCard)?.textContent.trim() || ''

        if (purchaseProductName) purchaseProductName.textContent = `${name} ${price}`

        const whatsappText = encodeURIComponent(`Olá, gostaria de comprar: ${name} ${price}`)

        if (purchaseWhatsapp) purchaseWhatsapp.href = `https://wa.me/5511910076475?text=${whatsappText}`
        if (purchaseInstagram) purchaseInstagram.href = 'https://www.instagram.com/texshoes_/'

        openModal(purchaseModal)

        return
      }

      const sizeLink = e.target.closest('.size-guide-link')

      if (sizeLink && productCard) {
        e.preventDefault()

        openModal(sizeGuideModal)

        return
      }

      const imgWrap = e.target.closest('.product-image-wrapper')

      if (imgWrap && productCard && imageModal && imageModalImg) {
        const img = $('.product-image', imgWrap)

        if (!img || !img.src) return

        imageModalImg.src = img.src
        imageModalImg.alt = img.alt || ''
        imageModalImg.classList.remove('zoomed')

        openModal(imageModal)

        return
      }
    })
  }

  function setupModalControls() {
    if (imageModal && imageModalImg) {
      if (imageModalClose) imageModalClose.addEventListener('click', () => {
        imageModalImg.classList.remove('zoomed')

        closeModal(imageModal)
      })

      imageModalImg.addEventListener('click', e => {
        e.stopPropagation()

        imageModalImg.classList.toggle('zoomed')
      })

      imageModal.addEventListener('click', e => {
        if (e.target === imageModal) {
          imageModalImg.classList.remove('zoomed')

          closeModal(imageModal)
        }
      })
    }

    if (sizeGuideModal) {
      if (sizeGuideClose) sizeGuideClose.addEventListener('click', () => closeModal(sizeGuideModal))

      sizeGuideModal.addEventListener('click', e => {
        if (e.target === sizeGuideModal) closeModal(sizeGuideModal)
      })
    }

    if (purchaseModal) {
      if (purchaseClose) purchaseClose.addEventListener('click', () => closeModal(purchaseModal))

      purchaseModal.addEventListener('click', e => {
        if (e.target === purchaseModal) closeModal(purchaseModal)
      })
    }
  }

  try {
    const resp = await fetch('src/stock.json')
    const products = await resp.json()

    renderProducts(products)
    attachProductDelegation()
    setupModalControls()

  } catch (err) {
    console.error('Erro carregando produtos:', err)
  }
})
