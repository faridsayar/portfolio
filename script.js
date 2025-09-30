/**
 * Single Page Portfolio JavaScript
 * Minimal functionality for AK47-F showcase page
 */

class SinglePagePortfolio {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothTransitions();
        this.setupAccessibility();
        this.setupResponsiveHandling();
    }

    // Smooth transitions for interactive elements
    setupSmoothTransitions() {
        // Add smooth hover effects to all interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .bg-white\\/10');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-2px)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
    }

    // Accessibility enhancements
    setupAccessibility() {
        // Add keyboard navigation support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Ensure focus is visible
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Remove keyboard navigation class on mouse use
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });

        // Add focus indicators for better accessibility
        const focusableElements = document.querySelectorAll('a, button');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid #00D4FF';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });
    }

    // Responsive handling
    setupResponsiveHandling() {
        // Handle window resize
        window.addEventListener('resize', this.debounce(() => {
            this.adjustLayoutForScreenSize();
        }, 250));

        // Initial layout adjustment
        this.adjustLayoutForScreenSize();
    }

    adjustLayoutForScreenSize() {
        const isMobile = window.innerWidth < 768;
        const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
        
        // Adjust font sizes for different screen sizes
        const title = document.querySelector('h1');
        if (title) {
            if (isMobile) {
                title.style.fontSize = '2.5rem';
            } else if (isTablet) {
                title.style.fontSize = '4rem';
            } else {
                title.style.fontSize = '5rem';
            }
        }

        // Adjust grid layout for mobile
        const projectDetails = document.querySelector('.grid-cols-1');
        if (projectDetails && isMobile) {
            projectDetails.classList.add('space-y-4');
        }
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Handle external link clicks
    handleExternalLink(url) {
        // Add loading state
        const button = event.target.closest('a');
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Opening...';
            button.style.opacity = '0.7';
            
            // Reset after a short delay
            setTimeout(() => {
                button.textContent = originalText;
                button.style.opacity = '1';
            }, 1000);
        }
        
        // Open link
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

// Initialize the single page portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.singlePagePortfolio = new SinglePagePortfolio();
    
    // Add click handlers for external links
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.singlePagePortfolio.handleExternalLink(link.href);
        });
    });
});

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
    .keyboard-navigation *:focus {
        outline: 2px solid #00D4FF !important;
        outline-offset: 2px !important;
    }
    
    /* Smooth transitions for all elements */
    * {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Ensure no scrolling */
    body, html {
        overflow: hidden !important;
        height: 100vh !important;
        width: 100vw !important;
    }
`;
document.head.appendChild(style);