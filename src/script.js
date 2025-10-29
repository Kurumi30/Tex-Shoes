document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle')
  const navMenu = document.getElementById('nav-menu')

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active')

      if (menuToggle.classList.contains('fa-bars')) {
        menuToggle.classList.remove('fa-bars')
        menuToggle.classList.add('fa-times')
      } else {
        menuToggle.classList.remove('fa-times')
        menuToggle.classList.add('fa-bars')
      }
    })
  }

  const categoryLinks = document.querySelectorAll('.category-card')
  const productCards = document.querySelectorAll('.product-card')

  categoryLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault()

      // Remove a classe ativa de todas as categorias
      categoryLinks.forEach((catLink) => {
        catLink.classList.remove('active-category')
      })
      // Adiciona a classe ativa à categoria clicada
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

  const modal = document.getElementById('image-modal');
  const modalImage = document.getElementById('modal-image');
  const closeModal = document.querySelector('.modal-close');

  document.querySelectorAll('.product-image-wrapper').forEach(card => {
    card.addEventListener('click', () => {
      const imageSrc = card.querySelector('.product-image').src;
      modalImage.src = imageSrc;
      modal.classList.add('active');
    });
  });

  // Função para fechar o modal
  const closeImageModal = () => {
    modal.classList.remove('active');
  };

  // Fechar ao clicar no 'X'
  closeModal.addEventListener('click', closeImageModal);

  // Fechar ao clicar fora da imagem (no fundo do modal)
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeImageModal();
    }
  })
})
