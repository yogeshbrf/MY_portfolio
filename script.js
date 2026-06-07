document.addEventListener("DOMContentLoaded", () => {
    // Page Loader Logic
    const loaderProgress = document.querySelector(".loader-progress");
    const loader = document.getElementById("loader");
    
    // Start body loading state
    document.body.classList.add("loading");
    
    // Simulate progress bar filling up to 85%
    let progress = 0;
    const progressInterval = setInterval(() => {
        if (progress < 85) {
            progress += Math.floor(Math.random() * 8) + 4;
            if (progress > 85) progress = 85;
            if (loaderProgress) loaderProgress.style.width = `${progress}%`;
        }
    }, 60);

    function hideLoader() {
        clearInterval(progressInterval);
        if (loaderProgress) loaderProgress.style.width = "100%";
        
        setTimeout(() => {
            if (loader) loader.classList.add("loaded");
            document.body.classList.remove("loading");
            
            // Initialize scroll animations after loader fades out
            initScrollAnimations();
        }, 300);
    }
    
    // Handle loaded state
    if (document.readyState === "complete") {
        hideLoader();
    } else {
        window.addEventListener("load", hideLoader);
    }

    // Scroll Reveal Animations using IntersectionObserver
    function initScrollAnimations() {
        const revealElements = document.querySelectorAll(".reveal");
        
        const observerOptions = {
            root: null,
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px"
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    el.classList.add("active");
                    observer.unobserve(el);
                    
                    // Cleanup reveal classes after animation completes to restore original hover transitions
                    setTimeout(() => {
                        el.classList.remove("reveal", "active", "delay-100", "delay-200", "delay-300", "delay-400", "delay-500");
                    }, 1500);
                }
            });
        }, observerOptions);
        
        revealElements.forEach(el => observer.observe(el));
    }

    // 1. Navigation Active Highlighting on Scroll
    const sections = document.querySelectorAll("section");
    const navLinks = document.querySelectorAll(".nav-links a");

    function updateActiveNavLink() {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 100; // Offset for header height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        navLinks.forEach(link => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${currentSectionId}`) {
                link.classList.add("active");
            }
        });
    }

    window.addEventListener("scroll", updateActiveNavLink);
    updateActiveNavLink(); // Run once initially



    // 3. Download CV Handler
    const downloadCvBtn = document.getElementById("btn-download-cv");
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener("click", () => {
            // Create a temporary link element
            const link = document.createElement("a");
            link.href = "cv.pdf"; // Looks for cv.pdf in the directory
            link.download = "Yogesh_Resume.pdf";

            // Check if file exists by fetching it
            fetch(link.href, { method: 'HEAD' })
                .then(res => {
                    if (res.ok) {
                        // File exists, trigger download
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    } else {
                        // File does not exist, alert user
                        alert("CV document ('cv.pdf') not found in the project folder.\n\nPlease place your resume PDF file inside the 'RESUME' folder and name it 'cv.pdf' to enable direct downloading!");
                    }
                })
                .catch(() => {
                    alert("CV document ('cv.pdf') not found in the project folder.\n\nPlease place your resume PDF file inside the 'RESUME' folder and name it 'cv.pdf' to enable direct downloading!");
                });
        });
    }
});
