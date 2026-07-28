document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadExperience();
    loadPublications();
    loadEducation();
    loadSkills();
    loadProjects();
    loadScholar();

    setupScrollSpy();
    setupModalEvents();

    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});

function setupScrollSpy() {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav ul li a');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));
                const activeLink = document.querySelector(`nav ul li a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

function setupModalEvents() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.close-modal');

    closeBtn.onclick = () => closeModal();
    window.onclick = (event) => {
        if (event.target == modal) {
            closeModal();
        }
    }
    // Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// Carousel State
let currentProjectImages = [];
let currentSlideIndex = 0;

function openModal(project) {
    console.log("Opening modal for:", project.title);
    const modal = document.getElementById('project-modal');
    if (!modal) return;

    // Load Images
    if (project.images && project.images.length > 0) {
        currentProjectImages = project.images;
    } else if (project.image) {
        currentProjectImages = [project.image];
    } else {
        currentProjectImages = [`https://placehold.co/600x300/1e293b/475569?text=${encodeURIComponent(project.title)}`];
    }

    currentSlideIndex = 0;
    showSlide(currentSlideIndex);

    document.getElementById('modal-title').textContent = project.title;
    document.getElementById('modal-desc').textContent = project.description;

    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = project.tags.map(t => `<span class="tech-chip">${t}</span>`).join('');

    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.add('visible');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function changeSlide(n) {
    showSlide(currentSlideIndex += n);
}

function currentSlide(n) {
    showSlide(currentSlideIndex = n);
}

function showSlide(n) {
    if (currentProjectImages.length === 0) return;

    if (n >= currentProjectImages.length) { currentSlideIndex = 0; }
    if (n < 0) { currentSlideIndex = currentProjectImages.length - 1; }

    const imgElement = document.getElementById('modal-img');
    imgElement.src = currentProjectImages[currentSlideIndex];

    // Update Dots
    const dotsContainer = document.getElementById('carousel-dots');
    dotsContainer.innerHTML = '';

    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    if (currentProjectImages.length > 1) {
        if (prevBtn) prevBtn.style.display = "block";
        if (nextBtn) nextBtn.style.display = "block";

        currentProjectImages.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = index === currentSlideIndex ? 'dot active-dot' : 'dot';
            dot.onclick = () => currentSlide(index);
            dotsContainer.appendChild(dot);
        });
    } else {
        if (prevBtn) prevBtn.style.display = "none";
        if (nextBtn) nextBtn.style.display = "none";
    }
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('visible');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // match css transition
    document.body.style.overflow = '';
}

function parseDate(dateStr) {
    if (!dateStr || dateStr.toLowerCase() === 'present') return new Date();
    const parts = dateStr.trim().split(' ');
    if (parts.length < 2) return new Date(dateStr);

    const monthNames = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    const monthIndex = monthNames.findIndex(m => parts[0].toLowerCase().startsWith(m));
    const year = parseInt(parts[1]);

    if (monthIndex !== -1 && !isNaN(year)) {
        return new Date(year, monthIndex, 1);
    }
    return new Date(dateStr);
}

function calculateDuration(dateString) {
    try {
        const parts = dateString.split('–').map(s => s.trim());
        if (parts.length !== 2) return '';

        const start = parseDate(parts[0]);
        const end = parseDate(parts[1]);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return '';

        let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        months += 1;
        if (months < 1) months = 0;
        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        let duration = '';
        if (years > 0) duration += `${years} yr${years > 1 ? 's' : ''} `;
        if (remainingMonths > 0) duration += `${remainingMonths} mo${remainingMonths > 1 ? 's' : ''}`;
        return duration.trim();
    } catch (e) {
        console.error("Error calculating duration", e);
        return '';
    }
}

async function loadProfile() {
    try {
        const response = await fetch('data/profile.json?v=' + new Date().getTime());
        const data = await response.json();
        console.log("Profile Data Loaded:", data);

        document.getElementById('name').textContent = data.name;
        document.getElementById('role').textContent = data.role;
        document.getElementById('summary').textContent = data.summary;

        if (data.image) {
            document.getElementById('profile-img').src = data.image;
        }

        const socialContainer = document.getElementById('social-links');
        const contactContainer = document.getElementById('contact-info');
        const emailBtn = document.getElementById('email-btn');

        socialContainer.innerHTML = '';
        if (data.social.linkedin) socialContainer.innerHTML += `<a href="${data.social.linkedin}" target="_blank" rel="noopener noreferrer" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
        if (data.social.github) socialContainer.innerHTML += `<a href="${data.social.github}" target="_blank" rel="noopener noreferrer" title="GitHub"><i class="fab fa-github"></i></a>`;
        if (data.social.scholar) socialContainer.innerHTML += `<a href="${data.social.scholar}" target="_blank" rel="noopener noreferrer" title="Google Scholar"><i class="fas fa-graduation-cap"></i></a>`;

        if (data.contact.email_link) {
            emailBtn.href = data.contact.email_link;
        }
        contactContainer.innerHTML = `<span><i class="fas fa-map-pin"></i> ${data.contact.location}</span>`;

    } catch (e) {
        console.error("Error loading profile:", e);
    }
}

async function loadExperience() {
    try {
        const response = await fetch('data/experience.json?v=' + new Date().getTime());
        const data = await response.json();
        const container = document.getElementById('experience-list');

        container.classList.add('cards-container', 'single-col');

        // Calculate total experience duration across visible roles
        let totalMonths = 0;

        data.forEach(job => {
            if (!job.visible) return;

            // Calculate months for total counter
            try {
                const parts = job.date.split('–').map(s => s.trim());
                if (parts.length === 2) {
                    const start = parseDate(parts[0]);
                    const end = parseDate(parts[1]);
                    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                        let m = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
                        if (m > 0) totalMonths += m;
                    }
                }
            } catch (e) {}

            const card = document.createElement('div');
            card.className = 'card';

            const logoSrc = job.logo ? job.logo : 'https://placehold.co/48x48/f3f4f6/9ca3af?text=Logo';
            const duration = calculateDuration(job.date);
            const durationHTML = duration ? `<span class="duration-text">• ${duration}</span>` : '';

            let logoHTML = `<img src="${logoSrc}" alt="${job.company} Logo" class="company-logo" onerror="this.src='https://placehold.co/48x48/f3f4f6/9ca3af?text=Logo'">`;
            if (job.url) {
                logoHTML = `<a href="${job.url}" target="_blank" class="logo-link" title="Visit ${job.company}">${logoHTML}</a>`;
            }

            let contentHTML = '';
            if (job.keywords && Array.isArray(job.keywords)) {
                const tags = job.keywords.map(k => `<span class="exp-keyword">${k}</span>`).join('');
                contentHTML = `<div class="keyword-container">${tags}</div>`;
            } else if (job.description) {
                const listItems = job.description.map(item => `<li>${item}</li>`).join('');
                contentHTML = `<ul>${listItems}</ul>`;
            }

            card.innerHTML = `
                <div class="exp-card-header">
                    ${logoHTML}
                    <div class="exp-details">
                        <div class="role-title">
                            <span>${job.role}</span>
                        </div>
                        <div class="company-name">${job.company} | ${job.location}</div>
                        <div class="date-row">
                            <span class="date-badge">${job.date}</span>
                            ${durationHTML}
                        </div>
                    </div>
                </div>
                <div class="exp-body">
                    ${contentHTML}
                </div>
            `;
            container.appendChild(card);
        });

        // Update Section Title with Total Experience in brackets
        if (totalMonths > 0) {
            const years = (totalMonths / 12).toFixed(1).replace('.0', '');
            const titleEl = document.querySelector('#experience .section-title');
            if (titleEl) {
                titleEl.innerHTML = `<i class="fas fa-briefcase"></i> Experience <span style="font-size: 0.85em; font-weight: 500; opacity: 0.8;">(${years}+ yrs)</span>`;
            }
        }
    } catch (e) {
        console.error("Error loading experience:", e);
    }
}

async function loadSkills() {
    try {
        const response = await fetch('data/skills.json?v=' + new Date().getTime());
        const data = await response.json();
        const container = document.getElementById('skills-list');

        data.categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'card';

            const chips = cat.skills.map(skill => `<span class="tech-chip">${skill}</span>`).join('');

            card.innerHTML = `
                <div class="role-title" style="margin-bottom:0.5rem; font-size:1rem">${cat.name}</div>
                <div class="tech-stack">
                    ${chips}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error("Error loading skills:", e);
    }
}

async function loadProjects() {
    try {
        const response = await fetch('data/projects.json?v=' + new Date().getTime());
        const data = await response.json();
        const container = document.getElementById('projects-list');

        data.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'card project-card'; // Added class

            // Use the first image from the array if available, otherwise fallback to 'image' or placeholder
            let imgUrl = proj.image;
            if (proj.images && proj.images.length > 0) {
                imgUrl = proj.images[0];
            }
            if (!imgUrl) {
                imgUrl = `https://placehold.co/600x300/1e293b/475569?text=${encodeURIComponent(proj.title)}`;
            }

            const tags = proj.tags.map(t => `<span class="tech-chip">${t}</span>`).join('');

            // Click event for Modal
            card.onclick = () => openModal(proj);

            card.innerHTML = `
                <div class="project-img-placeholder" style="background-image: url('${imgUrl}');"></div>
                <div class="role-title" style="font-size:1rem">${proj.title}</div>
                <div style="font-size: 0.85rem; margin-top: 0.25rem">${proj.description}</div>
                <div class="tech-stack">${tags}</div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error("Error loading projects:", e);
    }
}

async function loadEducation() {
    try {
        const response = await fetch('data/education_pubs.json');
        const data = await response.json();
        const container = document.getElementById('education-list');

        data.education.forEach(edu => {
            const card = document.createElement('div');
            card.className = 'card';

            let gpaHTML = '';
            if (edu.gpa) {
                gpaHTML = `<div style="font-size:0.8rem; margin-top:0.25rem; color:var(--text-secondary)">GPA: ${edu.gpa}</div>`;
            }

            card.innerHTML = `
                <div class="exp-card-header">
                     <div class="exp-details">
                        <div class="role-title">
                            ${edu.school}
                            ${edu.url ? `<a href="${edu.url}" target="_blank" class="pub-link-icon" title="Visit School"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        </div>
                        <div class="company-name" style="margin-top:0.25rem">${edu.degree}</div>
                        <div class="date-row" style="margin-top:0.25rem">
                            <span class="date-badge">${edu.date}</span>
                        </div>
                        ${gpaHTML}
                     </div>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error("Error loading education:", e);
    }
}

async function loadPublications() {
    try {
        const response = await fetch('data/education_pubs.json');
        const data = await response.json();
        const container = document.getElementById('publications-list');

        data.publications.forEach(pub => {
            const card = document.createElement('div');
            card.className = 'card pub-card';

            let assocHTML = '';
            if (pub.associated_with) {
                assocHTML = `<div class="pub-association"><i class="fas fa-building"></i> Associated with ${pub.associated_with}</div>`;
            }

            card.innerHTML = `
                <div class="pub-title">
                    ${pub.title}
                    ${pub.link ? `<a href="${pub.link}" target="_blank" class="pub-link-icon" title="View Publication"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
                <div class="pub-venue">${pub.venue}, ${pub.year}</div>
                ${assocHTML}
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error("Error loading publications:", e);
    }
}

async function loadScholar() {
    try {
        const response = await fetch('data/scholar.json?v=' + new Date().getTime());
        const data = await response.json();
        if (data.citations > 0) {
            document.getElementById('scholar-count').textContent = `Total Citations: ${data.citations}`;
        }
    } catch (e) {
        console.error("Scholar data not found:", e);
    }
}
