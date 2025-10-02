// Hero Section Scroll Animations
document.addEventListener('DOMContentLoaded', function() {
    // Enable smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Get elements
    const nameTitle = document.querySelector('.name-title');
    const mainTitle = document.querySelector('.main-title');
    const seoText = document.querySelector('.seo-text');
    const awardImage = document.querySelector('.award-image');
    
    // Create fixed logo container
    const logoContainer = document.createElement('div');
    logoContainer.className = 'fixed-logo';
    logoContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        opacity: 0;
        transform: translateY(-50px);
        transition: all 0.6s ease-out;
        pointer-events: none;
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
        padding: 2.6rem 0 5.2rem 0;
    `;
    document.body.appendChild(logoContainer);
    
    // Clone name title for logo
    const logoTitle = nameTitle.cloneNode(true);
    logoTitle.style.cssText = `
        font-size: 24pt;
        font-weight: 200;
        color: white;
        opacity: 0.3;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
        margin: 0;
        padding: 0;
        white-space: nowrap;
        line-height: 1;
    `;
    logoContainer.appendChild(logoTitle);
    
    // Create bottom container for H1
    const bottomContainer = document.createElement('div');
    bottomContainer.className = 'fixed-bottom-text';
    bottomContainer.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 1000;
        opacity: 0;
        transform: translateY(50px);
        transition: all 0.6s ease-out;
        pointer-events: none;
        background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
        padding: 5.2rem 0 2.6rem 0;
    `;
    document.body.appendChild(bottomContainer);
    
    // Clone main title for bottom
    const bottomTitle = mainTitle.cloneNode(true);
    bottomTitle.style.cssText = `
        font-size: 12px;
        font-weight: 400;
        color: white;
        opacity: 0.5;
        text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
        margin: 0;
        padding: 0;
        text-align: left;
        max-width: 50%;
        line-height: 1.4;
    `;
    bottomContainer.appendChild(bottomTitle);
    
    function updateScrollAnimations() {
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        const scrollProgress = Math.min(scrollTop / windowHeight, 1);
        
        // 1. Farid Sayar - fly up to top and stick as logo
        if (scrollProgress > 0.1) {
            logoContainer.style.opacity = '1';
            logoContainer.style.transform = 'translateY(0)';
            nameTitle.style.opacity = '0';
            nameTitle.style.transform = 'translateY(-100px)';
        } else {
            logoContainer.style.opacity = '0';
            logoContainer.style.transform = 'translateY(-50px)';
            nameTitle.style.opacity = '0.3';
            nameTitle.style.transform = 'translateY(0)';
        }
        
        // 2. H1 text - move down with normal speed, stick at bottom
        const h1MoveDistance = scrollProgress * 200;
        if (scrollProgress > 0.3) {
            bottomContainer.style.opacity = '1';
            bottomContainer.style.transform = 'translateY(0)';
            mainTitle.style.opacity = '0';
            mainTitle.style.transform = 'translateY(100px)';
        } else {
            bottomContainer.style.opacity = '0';
            bottomContainer.style.transform = 'translateY(50px)';
            mainTitle.style.opacity = '0.5';
            mainTitle.style.transform = `translateY(${h1MoveDistance}px)`;
        }
        
        // 3. SEO text - fast scroll down and disappear
        const seoMoveDistance = scrollProgress * 400;
        const seoOpacity = Math.max(0, 1 - scrollProgress * 2);
        seoText.style.opacity = seoOpacity;
        seoText.style.transform = `translateY(${seoMoveDistance}px)`;
        
        // 4. Award image - slowly move down and disappear
        const awardMoveDistance = scrollProgress * 300;
        const awardOpacity = Math.max(0, 1 - scrollProgress * 1.5);
        awardImage.style.opacity = awardOpacity;
        awardImage.style.transform = `translateY(${awardMoveDistance}px)`;
    }
    
    // Throttled scroll event listener
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollAnimations);
            ticking = true;
        }
    }
    
    function handleScroll() {
        requestTick();
        ticking = false;
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Add mobile-specific styling
    function updateMobileStyles() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Mobile logo styling
            logoTitle.style.cssText = `
                font-size: 24pt;
                font-weight: 200;
                color: white;
                opacity: 0.3;
                text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
                margin: 0;
                padding: 0;
                white-space: nowrap;
                line-height: 1;
                max-width: 75%;
            `;
            
            // Mobile H1 styling
            bottomTitle.style.cssText = `
                font-size: 12px;
                font-weight: 400;
                color: white;
                opacity: 0.5;
                text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
                margin: 0;
                padding: 0;
                text-align: left;
                max-width: 75%;
                line-height: 1.4;
            `;
        } else {
            // Desktop styling (original)
            logoTitle.style.cssText = `
                font-size: 24pt;
                font-weight: 200;
                color: white;
                opacity: 0.3;
                text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
                margin: 0;
                padding: 0;
                white-space: nowrap;
                line-height: 1;
            `;
            
            bottomTitle.style.cssText = `
                font-size: 12px;
                font-weight: 400;
                color: white;
                opacity: 0.5;
                text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
                margin: 0;
                padding: 0;
                text-align: left;
                max-width: 50%;
                line-height: 1.4;
            `;
        }
    }
    
    // Update mobile styles on load and resize
    updateMobileStyles();
    window.addEventListener('resize', updateMobileStyles);
    
    // Initial call
    updateScrollAnimations();
});
