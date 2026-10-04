/**
 * JOBFIT - SCRIPT UTAMA
 * Fitur: Navbar aktif pill, Hamburger menu, Scroll reveal,
 *        Animated progress bar, Kalkulator Kecocokan Skill,
 *        Form Kontak dengan feedback
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ============================================================
       1. ANIMATED NAV PILL (DESKTOP)
       ============================================================ */
    const navbarNav = document.getElementById('navbarNav');
    const navPill   = document.getElementById('navActivePill');
    const navLinks  = document.querySelectorAll('.navbar-nav .nav-link');

    const updateNavPill = (activeTarget) => {
        if (!activeTarget || !navPill || !navbarNav) return;
        const navRect  = navbarNav.getBoundingClientRect();
        const linkRect = activeTarget.getBoundingClientRect();
        navPill.style.transform = `translate3d(${linkRect.left - navRect.left}px, ${linkRect.top - navRect.top}px, 0)`;
        navPill.style.width     = `${linkRect.width}px`;
        navPill.style.height    = `${linkRect.height}px`;
        navPill.style.opacity   = '1';
    };

    const initialActive = document.querySelector('.navbar-nav .nav-link.active') || navLinks[0];
    if (initialActive) {
        setTimeout(() => updateNavPill(initialActive), 80);
        window.addEventListener('resize', () => {
            const active = document.querySelector('.navbar-nav .nav-link.active');
            if (active) updateNavPill(active);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            updateNavPill(link);
        });
    });


    /* ============================================================
       2. HIGHLIGHT NAV LINK SAAT SCROLL (SCROLLSPY MANUAL)
       ============================================================ */
    const sections = document.querySelectorAll('section[id]');

    const onScroll = () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 120) {
                current = sec.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                updateNavPill(link);
            }
        });

        // Update mobile nav links highlight
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.style.color = link.getAttribute('href') === `#${current}`
                ? '#FFFFFF'
                : '';
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });


    /* ============================================================
       3. HAMBURGER MOBILE MENU
       ============================================================ */
    const navToggler  = document.getElementById('navToggler');
    const mobileMenu  = document.getElementById('mobileMenu');

    if (navToggler && mobileMenu) {
        navToggler.addEventListener('click', () => {
            navToggler.classList.toggle('open');
            mobileMenu.classList.toggle('open');
        });

        // Tutup menu saat link diklik
        mobileMenu.querySelectorAll('.mobile-nav-link, .btn').forEach(el => {
            el.addEventListener('click', () => {
                navToggler.classList.remove('open');
                mobileMenu.classList.remove('open');
            });
        });
    }


    /* ============================================================
       4. SCROLL REVEAL ANIMATION
       ============================================================ */
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));


    /* ============================================================
       5. ANIMATED PROGRESS BAR (HERO)
       ============================================================ */
    const bars = document.querySelectorAll('.animated-bar');

    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const targetWidth = bar.getAttribute('data-width') || '87%';
                setTimeout(() => { bar.style.width = targetWidth; }, 300);
                barObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    bars.forEach(bar => barObserver.observe(bar));


    /* ============================================================
       6. KALKULATOR KECOCOKAN SKILL (MODAL)
       ============================================================ */
    const roleSelect       = document.getElementById('modalRoleSelect');
    const skillsContainer  = document.getElementById('modalSkillsList');
    const scoreValue       = document.getElementById('modalScoreValue');
    const statusTitle      = document.getElementById('modalStatusTitle');
    const modalProgressBar = document.getElementById('modalProgressBar');

    const roleData = {
        'business-analyst': {
            title: 'Business Analyst',
            skills: ['SQL', 'Excel', 'Power BI', 'Requirement Gathering', 'Data Modeling'],
            required: ['SQL', 'Excel', 'Power BI', 'Requirement Gathering']
        },
        'frontend-dev': {
            title: 'Frontend Developer',
            skills: ['HTML/CSS', 'JavaScript', 'React.js', 'Tailwind CSS', 'TypeScript'],
            required: ['HTML/CSS', 'JavaScript', 'React.js', 'Tailwind CSS']
        },
        'data-scientist': {
            title: 'Data Scientist',
            skills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Tableau'],
            required: ['Python', 'SQL', 'Machine Learning', 'Pandas']
        },
        'product-manager': {
            title: 'Product Manager',
            skills: ['Roadmapping', 'Agile/Scrum', 'User Research', 'Analytics', 'Wireframing'],
            required: ['Roadmapping', 'Agile/Scrum', 'User Research', 'Analytics']
        }
    };

    const renderSkills = (roleKey) => {
        if (!skillsContainer) return;
        const role = roleData[roleKey];
        skillsContainer.innerHTML = '';

        role.skills.forEach((skill, idx) => {
            const isChecked = idx < 3;
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4';
            col.innerHTML = `
                <div class="form-check p-2 px-3 rounded-3 bg-secondary-card border-glass d-flex align-items-center gap-2">
                    <input class="form-check-input modal-skill-check" type="checkbox" value="${skill}" id="modal_skill_${idx}" ${isChecked ? 'checked' : ''}>
                    <label class="form-check-label text-white small w-100" for="modal_skill_${idx}" style="cursor:pointer">
                        ${skill}
                    </label>
                </div>
            `;
            skillsContainer.appendChild(col);
        });

        document.querySelectorAll('.modal-skill-check').forEach(cb => {
            cb.addEventListener('change', calculateScore);
        });

        calculateScore();
    };

    const calculateScore = () => {
        const currentRoleKey = roleSelect ? roleSelect.value : 'business-analyst';
        const role = roleData[currentRoleKey];
        const checkedSkills = Array.from(document.querySelectorAll('.modal-skill-check:checked')).map(cb => cb.value);

        let matchCount = 0;
        role.required.forEach(req => { if (checkedSkills.includes(req)) matchCount++; });

        let score = Math.round((matchCount / role.required.length) * 100);
        if (checkedSkills.length === role.skills.length) score = 100;
        if (checkedSkills.length === 0) score = 0;

        if (scoreValue) scoreValue.textContent = `${score}%`;
        if (modalProgressBar) modalProgressBar.style.width = `${score}%`;
        if (statusTitle) {
            if (score >= 80)       statusTitle.textContent = 'Tingkat Kecocokan Tinggi 🎉';
            else if (score >= 50)  statusTitle.textContent = 'Kecocokan Skill Sedang';
            else                   statusTitle.textContent = 'Kecocokan Masih Rendah';
        }
    };

    if (roleSelect) {
        roleSelect.addEventListener('change', (e) => renderSkills(e.target.value));
        renderSkills(roleSelect.value);
    }

    // Reset modal progress bar saat dibuka
    const fitModal = document.getElementById('fitCalculatorModal');
    if (fitModal) {
        fitModal.addEventListener('show.bs.modal', () => {
            if (modalProgressBar) modalProgressBar.style.width = '0%';
            setTimeout(calculateScore, 300);
        });
    }


    /* ============================================================
       7. FORM KONTAK
       ============================================================ */
    const contactForm   = document.getElementById('jobfitContactForm');
    const submitBtn     = document.getElementById('submitBtn');
    const submitText    = document.getElementById('submitText');
    const submitSpinner = document.getElementById('submitSpinner');
    const formSuccess   = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Tampilkan loading state
            if (submitBtn)     submitBtn.disabled = true;
            if (submitText)    submitText.textContent = 'Mengirim...';
            if (submitSpinner) submitSpinner.classList.remove('d-none');
            if (formSuccess)   formSuccess.classList.add('d-none');

            // Simulasi pengiriman (2 detik)
            setTimeout(() => {
                if (submitBtn)     submitBtn.disabled = false;
                if (submitText)    submitText.textContent = 'Kirim Pesan';
                if (submitSpinner) submitSpinner.classList.add('d-none');
                if (formSuccess)   formSuccess.classList.remove('d-none');
                contactForm.reset();

                // Sembunyikan notif sukses setelah 5 detik
                setTimeout(() => {
                    if (formSuccess) formSuccess.classList.add('d-none');
                }, 5000);
            }, 2000);
        });
    }

});
