// Navbar Alpine.js Components
function initNavbar() {
  return {
    mobileMenuOpen: false,
    scrollY: 0,

    init() {
      this.setupScrollListener();
      this.setupKeyboardListener();
      this.setupResizeListener();
    },

    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
      this.toggleBodyScroll();
    },

    closeMobileMenu() {
      this.mobileMenuOpen = false;
      this.toggleBodyScroll();
    },

    toggleBodyScroll() {
      if (this.mobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },

    setupScrollListener() {
      window.addEventListener('scroll', () => {
        this.scrollY = window.scrollY;
        this.handleNavbarScroll();
      });
    },

    handleNavbarScroll() {
      const navbar = document.querySelector('.navbar');
      if (this.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
      } else {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
      }
    },

    setupKeyboardListener() {
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    },

    setupResizeListener() {
      window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && this.mobileMenuOpen) {
          this.closeMobileMenu();
        }
      });
    }
  };
}