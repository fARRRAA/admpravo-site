let currentSlide = 1;
const totalSlides = 15;

// Initialize presentation
document.addEventListener('DOMContentLoaded', function() {
    updateSlideIndicator();
    updateProgress();
    updateNavButtons();
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
            e.preventDefault();
            changeSlide(1);
        } else if (e.key === 'Home') {
            goToSlide(1);
        } else if (e.key === 'End') {
            goToSlide(totalSlides);
        }
    });
    
    // Add touch/swipe support
    let startX = null;
    let startY = null;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) {
            return;
        }
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Determine if it's a horizontal swipe (more horizontal than vertical)
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    // Swipe left - next slide
                    changeSlide(1);
                } else {
                    // Swipe right - previous slide
                    changeSlide(-1);
                }
            }
        }
        
        startX = null;
        startY = null;
    });
});

function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    
    if (newSlide >= 1 && newSlide <= totalSlides) {
        goToSlide(newSlide);
    }
}

function goToSlide(slideNumber) {
    if (slideNumber < 1 || slideNumber > totalSlides) {
        return;
    }
    
    // Hide current slide
    const currentSlideElement = document.getElementById(`slide-${currentSlide}`);
    if (currentSlideElement) {
        currentSlideElement.classList.remove('active');
    }
    
    // Show new slide
    currentSlide = slideNumber;
    const newSlideElement = document.getElementById(`slide-${currentSlide}`);
    if (newSlideElement) {
        newSlideElement.classList.add('active');
    }
    
    updateSlideIndicator();
    updateProgress();
    updateNavButtons();
    
    // Trigger animations for the new slide
    triggerSlideAnimations();
}

function updateSlideIndicator() {
    const slideNumberElement = document.getElementById('slideNumber');
    const totalSlidesElement = document.getElementById('totalSlides');
    
    if (slideNumberElement) {
        slideNumberElement.textContent = currentSlide;
    }
    if (totalSlidesElement) {
        totalSlidesElement.textContent = totalSlides;
    }
}

function updateProgress() {
    const progress = document.getElementById('progress');
    if (progress) {
        const percentage = (currentSlide / totalSlides) * 100;
        progress.style.width = percentage + '%';
    }
}

function updateNavButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 1;
    }
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides;
    }
}

function triggerSlideAnimations() {
    const currentSlideElement = document.getElementById(`slide-${currentSlide}`);
    if (!currentSlideElement) return;
    
    // Reset animations by removing and re-adding animation classes
    const animatedElements = currentSlideElement.querySelectorAll('[class*="animation"], [style*="animation"]');
    
    animatedElements.forEach(element => {
        const clone = element.cloneNode(true);
        element.parentNode.replaceChild(clone, element);
    });
}

// Add smooth scrolling for any internal links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }
});

// Add auto-play functionality (optional)
let autoPlay = false;
let autoPlayInterval;

function toggleAutoPlay() {
    autoPlay = !autoPlay;
    
    if (autoPlay) {
        autoPlayInterval = setInterval(() => {
            if (currentSlide < totalSlides) {
                changeSlide(1);
            } else {
                autoPlay = false;
                clearInterval(autoPlayInterval);
            }
        }, 5000); // Change slide every 5 seconds
    } else {
        clearInterval(autoPlayInterval);
    }
}

// Add fullscreen functionality
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Add print functionality
function printPresentation() {
    // Show all slides for printing
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.position = 'relative';
        slide.style.opacity = '1';
        slide.style.transform = 'none';
        slide.style.pageBreakAfter = 'always';
    });
    
    window.print();
    
    // Restore slide visibility after printing
    setTimeout(() => {
        slides.forEach((slide, index) => {
            slide.style.position = 'absolute';
            if (index + 1 !== currentSlide) {
                slide.style.opacity = '0';
            }
            slide.style.pageBreakAfter = 'auto';
        });
    }, 1000);
}

// Add presentation controls
function addPresentationControls() {
    const controls = document.createElement('div');
    controls.className = 'presentation-controls';
    controls.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        gap: 10px;
        z-index: 1002;
    `;
    
    const fullscreenBtn = document.createElement('button');
    fullscreenBtn.innerHTML = '⛶';
    fullscreenBtn.title = 'Toggle Fullscreen';
    fullscreenBtn.onclick = toggleFullscreen;
    fullscreenBtn.style.cssText = `
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.9);
        cursor: pointer;
        font-size: 16px;
    `;
    
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '🖨';
    printBtn.title = 'Print Presentation';
    printBtn.onclick = printPresentation;
    printBtn.style.cssText = fullscreenBtn.style.cssText;
    
    controls.appendChild(fullscreenBtn);
    controls.appendChild(printBtn);
    
    document.body.appendChild(controls);
}

// Initialize additional controls
// addPresentationControls();

// Prevent context menu on presentation slides
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.slide')) {
        e.preventDefault();
    }
});

// Add performance optimization for animations
function optimizeAnimations() {
    // Use requestAnimationFrame for smooth animations
    let ticking = false;
    
    function updateAnimations() {
        // Animation updates here
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }
    
    // Use this for any continuous animations
    // requestTick();
}

// Initialize optimization
optimizeAnimations();