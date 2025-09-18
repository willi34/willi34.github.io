// CTF Page Specific JavaScript

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

// Filter functionality
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

function filterCTFCards(cards, filter) {
    cards.forEach((card, index) => {
        const categories = card.getAttribute('data-category');
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

function updateResultsCounter(cards, filter) {
    const visibleCards = Array.from(cards).filter(card => {
        const categories = card.getAttribute('data-category');
        return filter === 'all' || categories.includes(filter);
    });
    
    // You can add a results counter element if desired
    console.log(`Showing ${visibleCards.length} CTF(s) for filter: ${filter}`);
}

// CTF Card Interactions
function setupCTFCardInteractions() {
    const ctfCards = document.querySelectorAll('.ctf-card');
    
    ctfCards.forEach(card => {
        // Click handler for navigation
        card.addEventListener('click', function() {
            const ctfName = this.querySelector('h3').textContent;
            handleCTFNavigation(ctfName);
        });
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Animate logo/emoji
            const logo = this.querySelector('.ctf-logo, .ctf-emoji');
            if (logo) {
                logo.style.transform = 'scale(1.1) rotate(5deg)';
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

function handleCTFNavigation(ctfName) {
    // In a real application, you would navigate to the specific CTF page
    console.log(`Navigating to CTF: ${ctfName}`);
    
    // Example implementations:
    // window.location.href = `/ctf/${ctfName.toLowerCase().replace(/\s+/g, '-')}`;
    // or show a modal with CTF details
    // or load content dynamically
    
    // For demo purposes, show an alert
    showCTFModal(ctfName);
}

function showCTFModal(ctfName) {
    // Create a simple modal (you could enhance this)
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
            padding: 2rem;
            border-radius: 15px;
            border: 2px solid #ff6b1a;
            text-align: center;
            max-width: 400px;
            animation: slideIn 0.3s ease;
        ">
            <h2 style="color: #ff6b1a; margin-bottom: 1rem;">Opening ${ctfName}</h2>
            <p style="color: #ff8c42; margin-bottom: 2rem;">This would navigate to the CTF writeups page...</p>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #ff6b1a;
                color: #000;
                border: none;
                padding: 0.8rem 2rem;
                border-radius: 25px;
                cursor: pointer;
                font-weight: bold;
            ">Close</button>
        </div>
    `;
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideIn {
            from { transform: scale(0.8) translateY(-20px); opacity: 0; }
            to { transform: scale(1) translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
    
    // Close on outside click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e