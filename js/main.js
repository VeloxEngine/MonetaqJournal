/**
 * Minimalist Blog Core Logic
 * Handles reading progress, code snippet copy, search & category filtering, and mobile menu
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Reading Progress Indicator
  const progressBar = document.getElementById('reading-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        progressBar.style.width = `${progress}%`;
      }
    }, { passive: true });
  }

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      mobileToggle.innerHTML = isOpen ? '&#10005;' : '&#9776;';
    });
  }

  // 3. Code Block Copy Functionality
  const copyButtons = document.querySelectorAll('.copy-btn');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const codeWrapper = btn.closest('.code-block-wrapper');
      const codeEl = codeWrapper ? codeWrapper.querySelector('code') : null;
      if (!codeEl) return;

      const codeText = codeEl.innerText;
      try {
        await navigator.clipboard.writeText(codeText);
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.color = '#34d399';
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.color = '';
        }, 2000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
    });
  });

  // 4. Client-side Search and Tag Filtering (for index page)
  const searchInput = document.getElementById('search-input');
  const pillButtons = document.querySelectorAll('.pill-btn');
  const postCards = document.querySelectorAll('.post-card');

  let activeTag = 'all';
  let searchQuery = '';

  function filterPosts() {
    postCards.forEach((card) => {
      const cardTag = (card.getAttribute('data-tag') || '').toLowerCase();
      const cardTitle = (card.querySelector('.post-title')?.innerText || '').toLowerCase();
      const cardExcerpt = (card.querySelector('.post-excerpt')?.innerText || '').toLowerCase();

      const matchesTag = activeTag === 'all' || cardTag === activeTag;
      const matchesSearch = !searchQuery || cardTitle.includes(searchQuery) || cardExcerpt.includes(searchQuery);

      if (matchesTag && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  if (pillButtons.length > 0) {
    pillButtons.forEach((pill) => {
      pill.addEventListener('click', () => {
        pillButtons.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        activeTag = pill.getAttribute('data-filter') || 'all';
        filterPosts();
      });
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      filterPosts();
    });
  }
});
