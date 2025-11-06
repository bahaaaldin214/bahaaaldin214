window.addEventListener('DOMContentLoaded', (event) => {

    // --- Feather Icons ---
    // This is handled by the script tag in the HTML, but if you were
    // to load it dynamically, you'd call feather.replace() here.

    // --- Navbar Scroll Behavior ---
    let lastScrollTop = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight) {
            // Scroll Down
            navbar.style.top = `-${navbar.offsetHeight}px`;
        } else {
            // Scroll Up
            navbar.style.top = '0';
        }
        lastScrollTop = scrollTop <= 0? 0 : scrollTop; // For Mobile or top of page
    });

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuClose = document.getElementById('mobile-menu-close');
    const mobileLinks = document.querySelectorAll('#mobile-menu.mobile-nav-links li a');

        menuToggle?.addEventListener('click', () => {
            mobileMenu.classList.add('is-open');
        });

        menuClose?.addEventListener('click', () => {
            mobileMenu.classList.remove('is-open');
        });

        // Close menu when a link is clicked
        mobileLinks?.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('is-open');
            });
        });
    

    // --- Experience Tabs ---
    const tabList = document.querySelector('.tab-list');
    const tabButtons = tabList? tabList.querySelectorAll('.tab-btn') : [];
    const tabPanels = document.querySelectorAll('.tab-panel');

    if (tabList) {
        tabList.addEventListener('click', (e) => {
            const clickedTab = e.target.closest('button');
            if (!clickedTab) return;

            // Deactivate all
            tabButtons.forEach(button => {
                button.classList.remove('active');
                button.setAttribute('aria-selected', 'false');
            });

            tabPanels.forEach(panel => {
                panel.setAttribute('hidden', true);
            });

            // Activate clicked
            clickedTab.classList.add('active');
            clickedTab.setAttribute('aria-selected', 'true');

            const { id } = clickedTab;
            const targetPanel = document.querySelector(`[aria-labelledby="${id}"]`);
            if (targetPanel) {
                targetPanel.removeAttribute('hidden');
            }
        });
    }

    // --- Scroll Animations (Intersection Observer) ---
    // Using Intersection Observer for better performance than ScrollReveal library
    const sections = document.querySelectorAll('.content-section');
    
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        rootMargin: '0px 0px -100px 0px' // Trigger when 100px from bottom
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

});
