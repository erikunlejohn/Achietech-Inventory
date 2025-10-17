// Sidebar toggle
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const mainContent = document.querySelector('.main-content');

menuBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  mainContent.classList.toggle('sidebar-active');
});

// Fade-in dashboard cards on load
window.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.stat-card');
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add('visible');
    }, index * 150);
  });
});

// Smooth hover animations for stat cards and buttons
document.querySelectorAll('.stat-card, button').forEach((el) => {
  el.addEventListener('mouseenter', () => {
    el.style.transform = 'translateY(-4px)';
    el.style.transition = 'transform 0.2s ease';
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = 'translateY(0)';
  });
});
