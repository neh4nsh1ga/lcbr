document.addEventListener('DOMContentLoaded', function () {
  const sliders = document.querySelectorAll('.slider');

  sliders.forEach(function (slider) {
    const track = slider.querySelector('.slider-track');
    const slides = track ? track.querySelectorAll('.slide') : [];
    const prevBtn = slider.querySelector('.slider-btn-prev');
    const nextBtn = slider.querySelector('.slider-btn-next');
    const dotsContainer = slider.querySelector('.slider-dots');

    if (!track || slides.length === 0) return;

    let current = 0;
    const total = slides.length;

    // Create dots
    for (let i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.classList.add('slider-dot');
      dot.setAttribute('aria-label', '슬라이드 ' + (i + 1));
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', function () {
        goTo(i);
      });
      if (dotsContainer) dotsContainer.appendChild(dot);
    }

    var dots = dotsContainer ? dotsContainer.querySelectorAll('.slider-dot') : [];

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      current = index;
      track.style.transform = 'translateX(-' + (current * 100) + '%)';
      dots.forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        goTo(current - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        goTo(current + 1);
      });
    }

    // Touch/swipe support
    var startX = 0;
    var isDragging = false;

    track.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    track.addEventListener('touchend', function (e) {
      if (!isDragging) return;
      isDragging = false;
      var diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          goTo(current + 1);
        } else {
          goTo(current - 1);
        }
      }
    }, { passive: true });

    // Auto-play (every 6 seconds)
    var autoPlay = setInterval(function () {
      goTo(current + 1);
    }, 60000);

    // Pause on hover
    slider.addEventListener('mouseenter', function () {
      clearInterval(autoPlay);
    });
    slider.addEventListener('mouseleave', function () {
      autoPlay = setInterval(function () {
        goTo(current + 1);
      }, 60000);
    });
  });
});
