async function loadLeadership() {
  try {
    // Fetch leadership.json from the root /data folder
    const res = await fetch('/data/leadership.json');
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();

    // Update hero section
    const heroImg = document.querySelector('.hero-figure img');
    const heroCaption = document.querySelector('.hero-figure figcaption');
    heroImg.src = data.hero.image;
    heroImg.alt = data.hero.alt;
    heroCaption.textContent = data.hero.figcaption;

    // Populate members grid
    const membersGrid = document.getElementById('membersGrid');
    membersGrid.innerHTML = '';

    data.members.forEach(member => {
      const li = document.createElement('li');
      li.className = 'member';
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

    console.log('✅ Leadership data loaded successfully!');
  } catch (err) {
    console.error('❌ Error loading leadership.json:', err);
    alert('Failed to load leadership data. Check console for details.');
  }
}

document.addEventListener('DOMContentLoaded', loadLeadership);
