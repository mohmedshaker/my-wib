// =================================================================================
// التطبيق الرئيسي للموقع
// =================================================================================
const App = {
    // -----------------------------------------------------------------------------
    // الخصائص الرئيسية
    // -----------------------------------------------------------------------------
    lang: 'ar', // اللغة الافتراضية
    translations: {}, // لتخزين نصوص الترجمة
    projects: [], // لتخزين بيانات المشاريع

    // -----------------------------------------------------------------------------
    // دالة التهيئة الرئيسية (Init)
    // -----------------------------------------------------------------------------
    async init() {
        console.log('تطبيق بيدراكس يبدأ العمل...');
        this.detectLanguage(); // تحديد اللغة
        await this.loadTranslations(); // تحميل ملفات الترجمة
        await this.loadProjects(); // تحميل بيانات المشاريع
        this.updateUI(); // تحديث واجهة المستخدم بالنصوص
        this.initEventListeners(); // تهيئة مستمعي الأحداث
        this.initCounters(); // تهيئة عدادات الأرقام
        this.initMobileMenu(); // تهيئة قائمة الموبايل
        this.initBackToTopButton(); // تهيئة زر العودة للأعلى
        this.renderProjectDetails(); // عرض تفاصيل المشروع إذا كانت الصفحة هي صفحة التفاصيل
    },

    // -----------------------------------------------------------------------------
    // الوظائف المتعلقة باللغة والترجمة
    // -----------------------------------------------------------------------------
    detectLanguage() {
        // الأولوية لـ URL param، ثم LocalStorage، ثم اللغة الافتراضية
        const urlParams = new URLSearchParams(window.location.search);
        this.lang = urlParams.get('lang') || localStorage.getItem('lang') || 'ar';
        localStorage.setItem('lang', this.lang); // مزامنة LocalStorage
    },

    async loadTranslations() {
        try {
            // تحديد المسار الصحيح بناءً على مكان الملف الحالي
            const path = window.location.pathname.includes('/pages/') ? '../lang/' : './lang/';
            const response = await fetch(`${path}${this.lang}.json`);
            if (!response.ok) throw new Error('فشل تحميل ملف الترجمة');
            this.translations = await response.json();
        } catch (error) {
            console.error(error);
            // في حالة الفشل، يتم تحميل اللغة العربية كخيار احتياطي
            const path = window.location.pathname.includes('/pages/') ? '../lang/' : './lang/';
            const response = await fetch(`${path}ar.json`);
            this.translations = await response.json();
        }
    },

    updateUI() {
        // تحديث اتجاه الصفحة
        document.documentElement.lang = this.translations.lang_code;
        document.documentElement.dir = this.translations.direction;

        // تحديث جميع العناصر التي تحتوي على `data-translate`
        document.querySelectorAll('[data-translate]').forEach(el => {
            const key = el.getAttribute('data-translate');
            // استخدم reduce للوصول إلى القيمة المتداخلة
            const value = key.split('.').reduce((obj, k) => (obj || {})[k], this.translations);
            if (value) {
                el.textContent = value;
            }
        });
    },

    changeLanguage(newLang) {
        if (this.lang === newLang) return;

        // تحديث الرابط لإضافة بارامتر اللغة
        const url = new URL(window.location);
        url.searchParams.set('lang', newLang);

        // إعادة تحميل الصفحة بالرابط الجديد
        window.location.href = url.toString();
    },

    // -----------------------------------------------------------------------------
    // الوظائف المتعلقة بالمشاريع
    // -----------------------------------------------------------------------------
    async loadProjects() {
        try {
            const path = window.location.pathname.includes('/pages/') ? '../data/' : './data/';
            const response = await fetch(`${path}projects.json`);
            if (!response.ok) throw new Error('فشل تحميل ملف المشاريع');
            this.projects = await response.json();
            this.renderProjects();
        } catch (error) {
            console.error(error);
        }
    },

    renderProjects() {
        const container = document.getElementById('projects-grid');
        if (!container) return; // الخروج إذا لم تكن في صفحة المشاريع

        container.innerHTML = ''; // إفراغ الحاوية
        this.projects.forEach(project => {
            const imagePath = window.location.pathname.includes('/pages/') ? `../${project.image}` : `./${project.image}`;
            const projectCard = `
                <div class="project-card">
                    <div class="project-image">
                        <img src="${imagePath}" alt="${project['title_' + this.lang]}">
                    </div>
                    <div class="project-info">
                        <h3>${project['title_' + this.lang]}</h3>
                        <p>${project['description_' + this.lang].substring(0, 100)}...</p>
                        <div class="project-features">
                            ${project['features_' + this.lang].map(f => `<span class="feature">${f}</span>`).join('')}
                        </div>
                        <div class="project-meta">
                            <span><i class="fas fa-calendar"></i> ${project.year}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${project['location_' + this.lang]}</span>
                        </div>
                         <a href="project-details.html?id=${project.id}" class="btn btn-primary" data-translate="projects_page.details_btn">تفاصيل المشروع</a>
                    </div>
                </div>
            `;
            container.innerHTML += projectCard;
        });
    },

    renderProjectDetails() {
        const container = document.getElementById('project-details-container');
        if (!container) return;

        const urlParams = new URLSearchParams(window.location.search);
        const projectId = parseInt(urlParams.get('id'));
        const project = this.projects.find(p => p.id === projectId);

        if (project) {
             const imagePath = `../${project.image}`;
             container.innerHTML = `
                <h1 class="project-title">${project['title_' + this.lang]}</h1>
                <img src="${imagePath}" alt="${project['title_' + this.lang]}" class="project-main-image">
                <div class="project-content">
                    <p>${project['description_' + this.lang]}</p>
                    <h3>المميزات</h3>
                    <ul>
                        ${project['features_' + this.lang].map(f => `<li>${f}</li>`).join('')}
                    </ul>
                </div>
            `;
        } else {
            container.innerHTML = `<p>المشروع غير موجود أو يجري تحميله...</p>`;
        }
    },

    // -----------------------------------------------------------------------------
    // تهيئة مستمعي الأحداث
    // -----------------------------------------------------------------------------
    initEventListeners() {
        // أزرار تغيير اللغة
        document.getElementById('lang-ar-btn')?.addEventListener('click', () => this.changeLanguage('ar'));
        document.getElementById('lang-en-btn')?.addEventListener('click', () => this.changeLanguage('en'));
    },

    // -----------------------------------------------------------------------------
    // الوظائف المساعدة والتفاعلية
    // -----------------------------------------------------------------------------
    initMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
    },

    initCounters() {
        const counters = document.querySelectorAll('.number[data-count]');
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            if (isNaN(target)) return;
            let current = 0;
            const increment = target / 100;

            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target + (counter.getAttribute('data-count').includes('+') ? '+' : '');
                }
            };
            setTimeout(updateCounter, 1000); // تأخير بسيط لبدء العداد
        });
    },

    initBackToTopButton() {
        const backToTop = document.createElement('button');
        backToTop.innerHTML = '↑';
        backToTop.className = 'back-to-top';
        document.body.appendChild(backToTop);

        backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.style.display = 'block';
            } else {
                backToTop.style.display = 'none';
            }
        });
    }
};

// =================================================================================
// تشغيل التطبيق عند تحميل الصفحة
// =================================================================================
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});