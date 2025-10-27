// Fetch and render leadership data dynamically
async function renderLeadership() {
  const response = await fetch('./leadership.json');
  const data = await response.json();

  // ===== Hero Image =====
  const heroSection = document.querySelector('.council-hero .hero-figure');
  if (heroSection) {
    heroSection.innerHTML = `
      <img src="${data.hero.image}" alt="${data.hero.alt}" />
      <figcaption>${data.hero.figcaption}</figcaption>
    `;
  }

  // ===== Members Grid =====
  const membersGrid = document.querySelector('.members-grid');
  if (membersGrid) {
    membersGrid.innerHTML = ''; // clear existing items

    data.members.forEach(member => {
      const li = document.createElement('li');
      li.classList.add('member');
      if (member.solo) li.classList.add('member--solo');

      li.innerHTML = `
        <figure>
          <img class="avatar" src="${member.image}" alt="${member.alt}" />
          <figcaption>
            <strong>${member.name}</strong>
            <span>${member.role}</span>
          </figcaption>
        </figure>
      `;
      membersGrid.appendChild(li);
    });
  }
}

// Call the function
renderLeadership();
