document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('tagSearch');
    const diffButtons = document.querySelectorAll('.diff-btn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const pageIndicator = document.getElementById('pageIndicator');
    const allPosts = Array.from(document.querySelectorAll('.post-card'));
    
    let currentPage = 1;
    const itemsPerPage = 10;
    let activeDifficulties = ['Easy', 'Medium', 'Hard', 'Insane'];

    function updateCounts() {
        diffButtons.forEach(btn => {
            const diff = btn.getAttribute('data-difficulty');
            const count = allPosts.filter(post => 
                post.querySelector('.post-difficulty').textContent.trim() === diff
            ).length;
            btn.textContent = `${diff} (${count})`;
        });
    }

    function updateDisplay() {
        const query = searchInput.value.toLowerCase().trim();
        
        // 1. Filter the list first
        const filtered = allPosts.filter(post => {
            const tags = Array.from(post.querySelectorAll('.tag'))
                              .map(t => t.textContent.toLowerCase());
            const diff = post.querySelector('.post-difficulty').textContent.trim();
            
            const matchesSearch = query === "" || tags.some(tag => tag.includes(query));
            const matchesDiff = activeDifficulties.includes(diff);
            
            return matchesSearch && matchesDiff;
        });

        // 2. Calculate pagination bounds
        const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        // 3. Hide all, then show only the slice for the current page
        allPosts.forEach(post => post.classList.add('hidden'));
        
        const toShow = filtered.slice(startIndex, endIndex);
        toShow.forEach(post => post.classList.remove('hidden'));

        // 4. Update UI Elements
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;
        
        // Optional: Scroll to top of list when changing page
        if (toShow.length > 0) {
            document.querySelector('.posts-section').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Event Listeners
    searchInput.addEventListener('input', () => {
        currentPage = 1; // Reset to page 1 on search
        updateDisplay();
    });

    diffButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const difficulty = btn.getAttribute('data-difficulty');
            if (activeDifficulties.includes(difficulty)) {
                activeDifficulties = activeDifficulties.filter(d => d !== difficulty);
                btn.classList.remove('active');
            } else {
                activeDifficulties.push(difficulty);
                btn.classList.add('active');
            }
            currentPage = 1; // Reset to page 1 on filter change
            updateDisplay();
        });
    });

    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updateDisplay();
        }
    });

    nextBtn.addEventListener('click', () => {
        currentPage++;
        updateDisplay();
    });

    // Initialize
    updateCounts();
    updateDisplay();
});