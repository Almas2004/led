const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const revealItems = document.querySelectorAll('.reveal');
const faqItems = document.querySelectorAll('.faq-item');
const counters = document.querySelectorAll('[data-counter]');
const parallaxTarget = document.querySelector('[data-parallax]');
const parallaxLayers = document.querySelectorAll('[data-parallax-layer]');
const heroSection = document.querySelector('.hero');
const form = document.getElementById('whatsapp-form');

const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=77769879977&text&type=phone_number&app_absent=0';
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 12);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

if (menuToggle && mobileMenu) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    mobileMenu.classList.toggle('is-open', !expanded);
  });

  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menuToggle.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('is-open');
    });
  });
}

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const animateCounter = (element) => {
  const target = Number(element.dataset.counter || 0);
  const duration = 1400;
  const start = performance.now();

  const frame = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = new Intl.NumberFormat('ru-RU').format(Math.floor(target * eased));

    if (progress < 1) {
      requestAnimationFrame(frame);
    } else {
      element.textContent = new Intl.NumberFormat('ru-RU').format(target);
    }
  };

  requestAnimationFrame(frame);
};

if ('IntersectionObserver' in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.38 }
  );

  counters.forEach((counter) => counterObserver.observe(counter));
} else {
  counters.forEach((counter) => animateCounter(counter));
}

faqItems.forEach((item) => {
  const trigger = item.querySelector('.faq-trigger');
  const panel = item.querySelector('.faq-panel');

  if (!trigger || !panel) return;

  trigger.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open');

    faqItems.forEach((otherItem) => {
      otherItem.classList.remove('is-open');
      const otherTrigger = otherItem.querySelector('.faq-trigger');
      const otherPanel = otherItem.querySelector('.faq-panel');
      if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      if (otherPanel) otherPanel.style.maxHeight = '0px';
    });

    if (!isOpen) {
      item.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      panel.style.maxHeight = `${panel.scrollHeight}px`;
    }
  });
});

if (!prefersReducedMotion && heroSection && (parallaxTarget || parallaxLayers.length)) {
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let rafPending = false;

  const renderParallax = () => {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    if (parallaxTarget) {
      parallaxTarget.style.transform = `translate3d(${currentX * 20}px, ${currentY * 20}px, 0)`;
    }

    parallaxLayers.forEach((layer) => {
      const depth = Number(layer.dataset.depth || 8);
      const moveX = currentX * depth;
      const moveY = currentY * depth;

      if (layer.classList.contains('hero-media')) {
        const scrollOffset = Math.min(window.scrollY * 0.12, 56);
        layer.style.transform = `translate3d(${moveX * 0.2}px, ${moveY * 0.2 + scrollOffset}px, 0) scale(1.06)`;
      } else {
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      }
    });

    if (Math.abs(mouseX - currentX) > 0.001 || Math.abs(mouseY - currentY) > 0.001) {
      requestAnimationFrame(renderParallax);
    } else {
      rafPending = false;
    }
  };

  const requestParallax = () => {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(renderParallax);
  };

  heroSection.addEventListener('mousemove', (event) => {
    const rect = heroSection.getBoundingClientRect();
    mouseX = Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width - 0.5));
    mouseY = Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height - 0.5));
    requestParallax();
  });

  heroSection.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
    requestParallax();
  });

  window.addEventListener(
    'scroll',
    () => {
      requestParallax();
    },
    { passive: true }
  );
}

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      city: String(formData.get('city') || '').trim(),
      screen: String(formData.get('screen') || '').trim(),
      format: String(formData.get('format') || '').trim(),
      comment: String(formData.get('comment') || '').trim(),
    };

    const message = [
      'Здравствуйте! Хочу получить расчет по LED-экрану.',
      '',
      `Имя: ${payload.name || '—'}`,
      `Телефон: ${payload.phone || '—'}`,
      `Город: ${payload.city || '—'}`,
      `Тип экрана: ${payload.screen || '—'}`,
      `Покупка или аренда: ${payload.format || '—'}`,
      `Комментарий: ${payload.comment || '—'}`,
    ].join('\n');

    window.open(`${WHATSAPP_URL}&text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
}
