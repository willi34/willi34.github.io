// CTF Page Specific JavaScript - Fixed Filter Bug

document.addEventListener('DOMContentLoaded', function() {
    initializeCTFPage();
});

function initializeCTFPage() {
    // Wait for components to load
    setTimeout(() => {
        setupFilterFunctionality();
        setupCTFCardInteractions();
        setupImageErrorHandling();
        setupAccessibilityFeatures();
    }, 200);
}

function setupFilterFunctionality() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const ctfCards = document.querySelectorAll('.ctf-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter cards with animation
            filterCTFCards(ctfCards, filter);
        });
    });
}

// Filter function extracting the category from the cards
function filterCTFCards(cards, filter) {
    cards.forEach((card, index) => {
        // Get the category string and check if it includes the filter
        const categories = card.getAttribute('data-category') || '';
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        // Add filtering class for smooth transitions
        card.classList.add('filtering');
        
        setTimeout(() => {
            if (shouldShow) {
                card.classList.remove('hidden');
                card.style.animationDelay = `${index * 0.1}s`;
            } else {
                card.classList.add('hidden');
            }
            
            // Remove filtering class after animation
            setTimeout(() => {
                card.classList.remove('filtering');
            }, 500);
        }, 50);
    });
    
    // Update results counter
    updateResultsCounter(cards, filter);
}

// May be used later for a results functionnal counter
function updateResultsCounter(cards, filter) {
    const visibleCards = Array.from(cards).filter(card => {
        const categories = card.getAttribute('data-category') || '';
        return filter === 'all' || categories.includes(filter);
    });
    // Update counter element if it exists
    const counterElement = document.querySelector('#results-counter');
    if (counterElement) {
        counterElement.textContent = `Showing ${visibleCards.length} CTF(s)`;
    }
    
    // Console log for debugging
    console.log(`Filter: ${filter}, Showing ${visibleCards.length} CTF(s)`);
    
    // Also announce to screen readers if function exists
    if (window.announceFilterChange) {
        window.announceFilterChange(filter, visibleCards.length);
    }
}

// CTF Card Interactions and link routing
function setupCTFCardInteractions() {
    const ctfCards = document.querySelectorAll('.ctf-card');
    
    ctfCards.forEach(card => {
        // Click handler for navigation
        card.addEventListener('click', function() {
            const ctfName = this.querySelector('h3').textContent;
            const url = `/general-ctfs/${ctfName.toLowerCase().replace(/\s+/g, '-')}`;
            try {
                window.location.href = url;
            } catch (error) {
                console.error(`Navigation to ${url} failed:`, error);
                // Fallback: show coming soon page
                // window.location.href = "/coming-soon.html"

            }
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Animate logo/emoji
            const logo = this.querySelector('.ctf-logo, .ctf-emoji');
            if (logo) {
                if (logo.classList.contains('ctf-logo')) {
                    logo.style.transform = 'scale(1.1) rotate(5deg)';
                } else {
                    logo.style.transform = 'scale(1.1) rotate(-5deg)';
                }
            }
            
            // Animate tags
            const tags = this.querySelectorAll('.tag');
            tags.forEach((tag, index) => {
                setTimeout(() => {
                    tag.style.transform = 'scale(1.05)';
                }, index * 50);
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            
            // Reset logo/emoji
            const logo = this.querySelector('.ctf-logo, .ctf-emoji');
            if (logo) {
                logo.style.transform = '';
            }
            
            // Reset tags
            const tags = this.querySelectorAll('.tag');
            tags.forEach(tag => {
                tag.style.transform = '';
            });
        });
        
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Handle image loading errors
function setupImageErrorHandling() {
    const images = document.querySelectorAll('.ctf-logo');
    images.forEach(img => {
        img.addEventListener('error', function() {
            const parent = this.parentElement;
            const ctfName = parent.parentElement.querySelector('h3').textContent;
            parent.innerHTML = `<div class="ctf-emoji">🚩</div>`;
        });
        
        // Add loading state
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
}

// Accessibility enhancements
function setupAccessibilityFeatures() {
    const ctfCards = document.querySelectorAll('.ctf-card');
    ctfCards.forEach(card => {
        // Add ARIA labels
        const ctfName = card.querySelector('h3').textContent;
        card.setAttribute('aria-label', `Navigate to ${ctfName} writeup`);
        card.setAttribute('role', 'button');
        
        // Add focus styles
        card.addEventListener('focus', function() {
            this.style.outline = '2px solid #ff6b1a';
            this.style.outlineOffset = '2px';
        });
        card.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Add ARIA labels to filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        const filter = button.getAttribute('data-filter');
        button.setAttribute('aria-label', `Filter CTFs by ${filter === 'all' ? 'all categories' : filter + ' category'}`);
        button.setAttribute('role', 'tab');
    });
}

// Additional debugging function
function debugFilterSystem() {
    console.log('=== CTF Filter Debug Info ===');
    
    const cards = document.querySelectorAll('.ctf-card');
    cards.forEach((card, index) => {
        const title = card.querySelector('h3').textContent;
        const categories = card.getAttribute('data-category');
        console.log(`Card ${index + 1}: "${title}" - Categories: "${categories}"`);
    });
    
    const buttons = document.querySelectorAll('.filter-btn');
    console.log('Available filters:');
    buttons.forEach(btn => {
        const filter = btn.getAttribute('data-filter');
        console.log(`- ${filter}`);
    });
}

// Call debug function on page load (remove in production)
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(debugFilterSystem, 500);
});