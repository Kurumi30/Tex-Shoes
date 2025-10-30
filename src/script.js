document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle')
  const navMenu = document.getElementById('nav-menu')
  const navLinks = document.querySelectorAll('.nav-link')

  const closeMobileMenu = () => {
    navMenu.classList.remove('active')
    menuToggle.classList.remove('fa-times')
    menuToggle.classList.add('fa-bars')
  }

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active')

      if (navMenu.classList.contains('active')) {
        menuToggle.classList.remove('fa-bars')
        menuToggle.classList.add('fa-times')
      } else {
        closeMobileMenu()
      }
    })
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        closeMobileMenu()
      }
    })
  })

  const categoryLinks = document.querySelectorAll('.category-card')
  const productCards = document.querySelectorAll('.product-card')

  categoryLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()

      categoryLinks.forEach((catLink) => {
        catLink.classList.remove('active-category')
      })

      link.classList.add('active-category')

      const selectedCategory = link.getAttribute('data-category')

      productCards.forEach((card) => {
        const productCategory = card.getAttribute('data-category')

        if (selectedCategory === 'all' || selectedCategory === productCategory) {
          card.classList.remove('hidden')
        } else {
          card.classList.add('hidden')
        }
      })
    })
  })

  const modal = document.getElementById('image-modal')
  const modalImage = document.getElementById('modal-image')
  const closeModal = document.querySelector('.modal-close')

  document.querySelectorAll('.product-image-wrapper').forEach(card => {
    card.addEventListener('click', () => {
      const imageSrc = card.querySelector('.product-image').src

      modalImage.src = imageSrc
      modal.classList.add('active')
    })
  })

  const closeImageModal = () => {
    modal.classList.remove('active')
  }

  closeModal.addEventListener('click', closeImageModal)

  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeImageModal()
  })

  const sizeGuideModal = document.getElementById('size-guide-modal')
  const sizeGuideLinks = document.querySelectorAll('.size-guide-link')
  const closeSizeGuideModal = document.querySelector('.size-guide-close')

  sizeGuideLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault()

      sizeGuideModal.classList.add('active')
    })
  })

  const closeTheSizeModal = () => {
    sizeGuideModal.classList.remove('active')
  }

  closeSizeGuideModal.addEventListener('click', closeTheSizeModal)

  sizeGuideModal.addEventListener('click', (event) => {
    if (event.target === sizeGuideModal) {
      closeTheSizeModal()
    }
  })
})
