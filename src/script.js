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
  const PAGE_SIZE = 8

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

  function renderProductCards(items = []) {
    return items.map(p => `
      <article class="product-card" data-category="${p.category}">
        <div class="product-image-wrapper" aria-hidden="true">
          <img src="${p.image}" loading="lazy" alt="${p.name}" class="product-image">
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

  let currentPage = 1
  let allProducts = []
  let selectedCategory = 'all'
  let currentFiltered = []

  function renderProductsPage(page = 1, append = false) {
    if (!productGrid) return

    if (!allProducts.length) {
      productGrid.innerHTML = '<p class="no-products" style="text-align:center;">Nenhum produto disponível.</p>'
      currentFiltered = []
      updateLoadMoreButton()
      return
    }

    // filtra conforme categoria selecionada
    currentFiltered = selectedCategory === 'all'
      ? allProducts
      : allProducts.filter(p => p.category === selectedCategory)

    const start = (page - 1) * PAGE_SIZE
    const slice = currentFiltered.slice(start, start + PAGE_SIZE)

    if (!slice.length && page === 1) {
      productGrid.innerHTML = '<p class="no-products" style="text-align:center;">Nenhum produto encontrado nessa categoria.</p>'
    } else if (append) {
      productGrid.insertAdjacentHTML('beforeend', renderProductCards(slice))
    } else {
      productGrid.innerHTML = renderProductCards(slice)
    }

    updateLoadMoreButton()
  }

  function updateLoadMoreButton() {
    if (!productGrid) return

    const existingBtn = document.getElementById('load-more-btn')
    const total = Array.isArray(currentFiltered) ? currentFiltered.length : (allProducts.length || 0)
    const loaded = currentPage * PAGE_SIZE
    const hasMore = loaded < total

    if (hasMore) {
      if (!existingBtn) {
        const btn = document.createElement('button')

        btn.id = 'load-more-btn'
        btn.className = 'button'
        btn.textContent = 'Ver mais'
        btn.style.display = 'block'
        btn.style.margin = '30px auto 0'
        btn.addEventListener('click', () => {
          currentPage++
          renderProductsPage(currentPage, true)
        })
        productGrid.parentNode.appendChild(btn)
      }
    } else {
      if (existingBtn) existingBtn.remove()
    }
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

          selectedCategory = card.dataset.category || 'all'
          currentPage = 1
          renderProductsPage(currentPage, false)

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

    if (!resp.ok) console.error('Verifique se o arquivo stock.json existe e está preenchido corretamente.')

    const products = await resp.json()

    if (!products.length) throw new Error('Nenhum produto encontrado no estoque.')

    allProducts = products
    currentPage = 1
    selectedCategory = 'all'

    renderProductsPage(currentPage)
    attachProductDelegation()
    setupModalControls()
  } catch (err) {
    console.error('Erro carregando produtos:', err)
  }
})
