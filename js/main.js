// كود نظيف وسليم 100%
document.addEventListener('DOMContentLoaded', function() {
    console.log('موقع بيدراكس جاهز!');
    
    // 1. القائمة المتنقلة
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // 2. العداد - طريقة بسيطة ومضمونة
    function startCounters() {
        const counters = document.querySelectorAll('.number[data-count]');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            let current = 0;
            
            // إعادة تعيين العداد
            counter.textContent = '0+';
            
            const interval = setInterval(() => {
                current += 1;
                counter.textContent = current + '+';
                
                if (current >= target) {
                    clearInterval(interval);
                }
            }, 80); // سرعة العد
        });
    }

    // تشغيل العداد بعد ثانية
    setTimeout(startCounters, 1000);

    // 3. زر العودة للأعلى
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'back-to-top';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        width: 40px;
        height: 40px;
        background: #2d5016;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        display: none;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTop);
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    window.addEventListener('scroll', function() {
        backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
});
// دالة العداد المحسنة
function initAllCounters() {
    const allCounters = document.querySelectorAll('.number[data-count]');
    
    allCounters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        
        // إعادة تعيين
        counter.textContent = '0';
        
        const interval = setInterval(() => {
            current += 1;
            counter.textContent = current + (counter.textContent.includes('+') ? '+' : '');
            
            if (current >= target) {
                clearInterval(interval);
            }
        }, 60);
    });
}

// تشغيل العدادات في جميع الصفحات
document.addEventListener('DOMContentLoaded', function() {
    console.log('الصفحة محملة - جاهز للعدادات');
    
    // تشغيل العدادات بعد تحميل الصفحة
    setTimeout(initAllCounters, 1000);
    
    // ... باقي الكود الحالي
});
// وظائف مساعدة
function callUs() {
    window.location.href = 'tel:+966505564578';
}

function whatsappUs() {
    window.open('https://wa.me/966505564578', '_blank');
}