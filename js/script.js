// Load header and footer
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        if (response.ok) {
            const content = await response.text();
            document.getElementById(elementId).innerHTML = content;
        } else {
            console.error(`Failed to load ${filePath}`);
        }
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
        // Fallback for environments where fetch might not work with local files
        loadComponentFallback(elementId, filePath);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer
    loadComponent('header-placeholder', '/header.html');
    loadComponent('footer-placeholder', '/footer.html');
    
    // Wait a bit for components to load, then initialize event listeners
    setTimeout(initializeEventListeners, 100);
});

// Initialize all event listeners
function initializeEventListeners() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add click handlers to category cards, grabs the H3 header as category name for dynamic routing
    //For the category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.querySelector('h3').textContent;
            window.location.href = `/${category.toLowerCase().replace(' ', '-')}`;
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            } else {
                navbar.style.background = 'rgba(20, 20, 20, 0.95)';
            }
        }
    });

    // Add hover effects to social links
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // Add typing effect to hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        }
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
}


// Function to toggle mobile menu (for future mobile menu implementation)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    
    navLinks.classList.toggle('mobile-active');
    navbar.classList.toggle('mobile-menu-open');
}

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close any open modals or menus
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('.nav-links.mobile-active');
        if (mobileMenu) {
            toggleMobileMenu();
        }
    }
    
    // Arrow key navigation for category cards
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const cards = document.querySelectorAll('.category-card');
        const focusedCard = document.activeElement;
        const currentIndex = Array.from(cards).indexOf(focusedCard);
        
        if (currentIndex !== -1) {
            let nextIndex;
            if (e.key === 'ArrowLeft') {
                nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
            } else {
                nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
            }
            cards[nextIndex].focus();
            e.preventDefault();
        }
    }
});

// Performance optimization: Lazy loading for images (if you add images later)
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}