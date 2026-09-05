document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       SCROLL REVEAL
       ===================================================== */

    const sections = document.querySelectorAll("section");

    sections.forEach(section => {

        Array.from(section.children).forEach((element, index) => {

            element.classList.add("reveal");

            // Petit décalage entre les éléments
            element.style.transitionDelay = `${index * 60}ms`;

        });

    });


    const revealObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    revealObserver.unobserve(entry.target);
                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -50px 0px"
        }
    );


    document.querySelectorAll(".reveal").forEach(element => {
        revealObserver.observe(element);
    });



    /* =====================================================
       ACTIVE NAVIGATION
       ===================================================== */

    const navLinks = document.querySelectorAll(
        'nav a[href^="#"]'
    );

    const pageSections = document.querySelectorAll(
        "section[id]"
    );


    const navigationObserver = new IntersectionObserver(
        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const currentId = entry.target.id;

                    navLinks.forEach(link => {

                        link.classList.remove("active");

                        if (
                            link.getAttribute("href") ===
                            `#${currentId}`
                        ) {
                            link.classList.add("active");
                        }

                    });

                }

            });

        },
        {
            rootMargin: "-35% 0px -55% 0px"
        }
    );


    pageSections.forEach(section => {
        navigationObserver.observe(section);
    });



    /* =====================================================
       NAVBAR CLICK
       ===================================================== */

    navLinks.forEach(link => {

        link.addEventListener("click", event => {

            const targetId =
                link.getAttribute("href");

            const target =
                document.querySelector(targetId);

            if (!target) return;

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        });

    });



    /* =====================================================
       NAVBAR SHADOW ON SCROLL
       ===================================================== */

    const navbar =
        document.querySelector("nav");

    window.addEventListener("scroll", () => {

        if (!navbar) return;

        if (window.scrollY > 30) {

            navbar.style.boxShadow =
                "0 4px 20px rgba(20, 33, 61, 0.06)";

        } else {

            navbar.style.boxShadow = "none";

        }

    });

});
