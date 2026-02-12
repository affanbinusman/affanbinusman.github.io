document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    loadExperience();
    loadPublications();
    loadEducation();
    loadSkills();
    loadProjects();
    loadScholar();

    setupScrollSpy();

    // Smooth scrolling for nav links
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
                // Remove active from all
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active to current
                const activeLink = document.querySelector(`nav ul li a[href="#${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, {
        rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

function calculateDuration(dateString) {
    try {
        const parts = dateString.split('–').map(s => s.trim());
        if (parts.length !== 2) return '';

        const start = new Date(parts[0]);
        const end = parts[1].toLowerCase() === 'present' ? new Date() : new Date(parts[1]);

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
        const response = await fetch('data/profile.json');
        const data = await response.json();

        document.getElementById('name').textContent = data.name;
        document.getElementById('role').textContent = data.role;
        document.getElementById('summary').textContent = data.summary;

        const socialContainer = document.getElementById('social-links');
        const contactContainer = document.getElementById('contact-info');
        const emailBtn = document.getElementById('email-btn');

        socialContainer.innerHTML = '';
        if (data.social.linkedin) socialContainer.innerHTML += `<a href="${data.social.linkedin}" target="_blank" title="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
        if (data.social.github) socialContainer.innerHTML += `<a href="${data.social.github}" target="_blank" title="GitHub"><i class="fab fa-github"></i></a>`;
        if (data.social.scholar) socialContainer.innerHTML += `<a href="${data.social.scholar}" target="_blank" title="Google Scholar"><i class="fas fa-graduation-cap"></i></a>`;

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
        const response = await fetch('data/experience.json');
        const data = await response.json();
        const container = document.getElementById('experience-list');

        // Reset container classes for standard layout
        container.classList.add('cards-container', 'single-col');

        data.forEach(job => {
            if (!job.visible) return;

            const card = document.createElement('div');
            card.className = 'card';

            const logoSrc = job.logo ? job.logo : 'https://placehold.co/48x48/f3f4f6/9ca3af?text=Logo';
            const duration = calculateDuration(job.date);
            const durationHTML = duration ? `<span class="duration-text">• ${duration}</span>` : '';

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
                    <img src="${logoSrc}" alt="${job.company} Logo" class="company-logo" onerror="this.src='https://placehold.co/48x48/f3f4f6/9ca3af?text=Logo'">
                    <div class="exp-details">
                        <div class="role-title">${job.role}</div>
                        <div class="company-name">${job.company} | ${job.location}</div>
                        <div style="margin-top:2px">
                            <span class="date-badge">${job.date}</span>
                            ${durationHTML}
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    ${contentHTML}
                </div>
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error("Error loading experience:", e);
    }
}

async function loadSkills() {
    try {
        const response = await fetch('data/skills.json');
        const data = await response.json();
        const container = document.getElementById('skills-list');

        data.categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'card';

            const chips = cat.skills.map(skill => `<span class="tech-chip">${skill}</span>`).join('');

            card.innerHTML = `
                <div class="role-title" style="margin-bottom:0.75rem; font-size:1rem">${cat.name}</div>
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
        const response = await fetch('data/projects.json');
        const data = await response.json();
        const container = document.getElementById('projects-list');

        data.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'card';

            const imgUrl = `https://placehold.co/600x300/1e293b/475569?text=${encodeURIComponent(proj.title)}`;
            const tags = proj.tags.map(t => `<span class="tech-chip">${t}</span>`).join('');

            card.innerHTML = `
                <div class="project-img-placeholder" style="background-image: url('${imgUrl}');"></div>
                <div class="role-title" style="font-size:1rem">${proj.title}</div>
                <div class="card-body">
                    <p style="font-size: 0.9rem; margin-bottom: 0.5rem">${proj.description}</p>
                </div>
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
                gpaHTML = `<div style="font-size:0.85rem; margin-top:0.5rem; color:var(--text-secondary)">GPA: ${edu.gpa}</div>`;
            }

            card.innerHTML = `
                <div class="exp-card-header">
                     <div class="exp-details">
                        <div class="role-title">${edu.school}</div>
                        <div class="company-name">${edu.degree}</div>
                        <span class="date-badge">${edu.date}</span>
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
                <div class="pub-title">${pub.title}</div>
                <div class="pub-venue">${pub.venue}, ${pub.year}</div>
                ${assocHTML}
                ${pub.link ? `<a href="${pub.link}" target="_blank" class="pub-link">View <i class="fas fa-arrow-right"></i></a>` : ''}
            `;
            container.appendChild(card);
        });
    } catch (e) {
        console.error("Error loading publications:", e);
    }
}

async function loadScholar() {
    try {
        const response = await fetch('data/scholar.json');
        const data = await response.json();
        if (data.citations > 0) {
            document.getElementById('scholar-count').textContent = `Total Citations: ${data.citations}`;
        }
    } catch (e) {
        console.error("Scholar data not found:", e);
    }
}
