document.addEventListener('DOMContentLoaded', () => {
    const App = {
        lang: 'ar',
        translations: {},
        projects: [],

        async init() {
            this.detectLanguage();
            await this.loadAssets();
            this.updateUI();
            this.attachEventListeners();
            this.initAnimations();
        },

        detectLanguage() {
            const urlParams = new URLSearchParams(window.location.search);
            this.lang = urlParams.get('lang') || localStorage.getItem('lang') || 'ar';
            localStorage.setItem('lang', this.lang);
        },

        async loadAssets() {
            const base = window.location.pathname.includes('/pages/') ? '..' : '.';
            try {
                const [translationsRes, projectsRes] = await Promise.all([
                    fetch(`${base}/lang/${this.lang}.json`),
                    fetch(`${base}/data/projects.json`)
                ]);
                this.translations = await translationsRes.json();
                this.projects = await projectsRes.json();
            } catch (error) {
                console.error("Failed to load initial assets:", error);
            }
        },

        updateUI() {
            document.documentElement.lang = this.lang;
            document.documentElement.dir = this.lang === 'ar' ? 'rtl' : 'ltr';

            this.updateTextContent();
            this.updateButtons();
            this.renderProjects();
            this.renderProjectDetails();
        },

        updateTextContent() {
            document.querySelectorAll('[data-translate]').forEach(el => {
                const key = el.getAttribute('data-translate');
                const value = key.split('.').reduce((obj, k) => obj?.[k], this.translations);
                if (value) el.innerHTML = value;
            });
        },

        updateButtons() {
            const langButtons = document.querySelectorAll('.lang-btn');
            langButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.id === `lang-${this.lang}-btn`) {
                    btn.classList.add('active');
                }
            });
        },

        renderProjects() {
            const container = document.querySelector('#projects-grid');
            if (!container) return;
            container.innerHTML = '';
            this.projects.forEach(p => {
                const projectCard = `
                    <a href="project-details-${p.id}.html" class="project-card-link" style="text-decoration: none; color: inherit;">
                        <div class="project-card" style="background: var(--white); border-radius: 10px; box-shadow: var(--shadow); overflow: hidden; transition: transform 0.3s;">
                            <img src="../${p.image}" alt="${p[`title_${this.lang}`]}" style="width: 100%; height: 200px; object-fit: cover;">
                            <div class="project-info" style="padding: 1.5rem;">
                                <h3 style="color: var(--primary); margin-bottom: 0.5rem;">${p[`title_${this.lang}`]}</h3>
                                <p>${p[`description_${this.lang}`]}</p>
                            </div>
                        </div>
                    </a>
                `;
                container.innerHTML += projectCard;
            });
        },

        renderProjectDetails() {
            const container = document.querySelector('#project-details-container');
            if (!container) return;
            const projectId = parseInt(container.getAttribute('data-project-id'));
            const project = this.projects.find(p => p.id === projectId);
            if (!project) return;

            const detailsHTML = `
                <h2 style="color: var(--primary); margin-bottom: 1.5rem;">${this.translations.project_details?.description_title || 'وصف المشروع'}</h2>
                <p style="line-height: 1.8; margin-bottom: 2rem;">${project[`full_description_${this.lang}`]}</p>
                <h3 style="color: var(--primary); margin-bottom: 1.5rem;">${this.translations.project_details?.gallery_title || 'معرض الصور'}</h3>
                <div class="project-gallery" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                    ${project.gallery.map(img => `<img src="../${img}" alt="${project[`title_${this.lang}`]}" style="width: 100%; border-radius: 5px;">`).join('')}
                </div>
            `;
            container.innerHTML = detailsHTML;

            const hero = document.querySelector('.page-hero');
            const title = hero.querySelector('h1');
            hero.style.backgroundImage = `linear-gradient(rgba(4, 28, 67, 0.8), rgba(4, 28, 67, 0.8)), url('../${project.image}')`;
            title.textContent = project[`title_${this.lang}`];
        },

        attachEventListeners() {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const newLang = e.target.id.split('-')[1];
                    if (this.lang === newLang) return;
                    const url = new URL(window.location);
                    url.searchParams.set('lang', newLang);
                    window.location.href = url.toString();
                });
            });

            const navToggle = document.querySelector('.nav-toggle');
            const navLinks = document.querySelector('.nav-links');
            if (navToggle && navLinks) {
                navToggle.addEventListener('click', () => {
                    navLinks.classList.toggle('active');
                });
            }
        },

        initAnimations() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });

            document.querySelectorAll('.service-card, .value-card, .project-card, .management-card').forEach(el => {
                el.style.opacity = 0;
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                observer.observe(el);
            });
        }
    };

    App.init();
});