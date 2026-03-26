/*!
 * Collins Munene Portfolio
 
 */
(function ($) {
  "use strict";

  // ======================== CONFIG ========================
  var NAV_OFFSET = 80; //

  $(document).on("click", 'a.js-scroll-trigger[href*="#"]:not([href="#"])', function (e) {
    if (
      location.pathname.replace(/^\//, "") ===
        this.pathname.replace(/^\//, "") &&
      location.hostname === this.hostname
    ) {
      var target = $(this.hash);
      target = target.length
        ? target
        : $("[name=" + this.hash.slice(1) + "]");
      if (target.length) {
        e.preventDefault();
        $("html, body").animate(
          { scrollTop: target.offset().top - NAV_OFFSET },
          800,
          "easeInOutExpo"
        );
      }
    }
  });

  // ======================== MOBILE MENU TOGGLE ========================
  $(document).on("click", ".navbar-toggler", function () {
    var $collapse = $(".navbar-collapse");
    if ($collapse.hasClass("show")) {
      $collapse.removeClass("show");
    } else {
      $collapse.addClass("show");
    }
  });

  // Close mobile menu when a nav link is clicked
  $(document).on("click", ".navbar-collapse .nav-link", function () {
    $(".navbar-collapse").removeClass("show");
  });

  // Close mobile menu when clicking outside
  $(document).on("click", function (e) {
    var $nav = $("#mainNav");
    if (
      $(".navbar-collapse").hasClass("show") &&
      !$(e.target).closest("#mainNav").length
    ) {
      $(".navbar-collapse").removeClass("show");
    }
  });

  // ======================== NAVBAR SHRINK ON SCROLL ========================
  function handleNavbarShrink() {
    var $nav = $("#mainNav");
    if (!$nav.length) return;

    if ($(window).scrollTop() > 80) {
      $nav.addClass("navbar-shrink");
    } else {
      $nav.removeClass("navbar-shrink");
    }
  }

  // Run on load and scroll
  handleNavbarShrink();
  $(window).on("scroll", handleNavbarShrink);

  // ======================== ACTIVE NAV LINK HIGHLIGHTING ========================
  // Tracks which section is in view and highlights the corresponding nav link
  function updateActiveNav() {
    var scrollPos = $(window).scrollTop() + NAV_OFFSET + 50;
    var windowHeight = $(window).height();
    var docHeight = $(document).height();

    // If near bottom of page, activate last nav link
    if (scrollPos + windowHeight >= docHeight - 50) {
      $(".nav-link.js-scroll-trigger").removeClass("active");
      $(".nav-link.js-scroll-trigger").last().addClass("active");
      return;
    }

    $(".nav-link.js-scroll-trigger").each(function () {
      var href = $(this).attr("href");
      if (!href || !href.startsWith("#")) return;

      var $section = $(href);
      if (!$section.length) return;

      var sectionTop = $section.offset().top - NAV_OFFSET - 50;
      var sectionBottom = sectionTop + $section.outerHeight();

      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        $(".nav-link.js-scroll-trigger").removeClass("active");
        $(this).addClass("active");
      }
    });
  }

  $(window).on("scroll", updateActiveNav);
  $(window).on("load", updateActiveNav);

  // ======================== SCROLL REVEAL ANIMATIONS ========================
  function revealOnScroll() {
    var reveals = document.querySelectorAll(
      ".service-card, .project-card, .fav-card, .timeline-item, .skill-item"
    );
    var windowHeight = window.innerHeight;
    var revealIndex = 0;

    reveals.forEach(function (el) {
      if (el.classList.contains("visible")) return;

      var elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) {
        var delay = revealIndex * 80;
        revealIndex++;
        setTimeout(function () {
          el.classList.add("visible");
        }, delay);
      }
    });
  }

  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", function () {
    // Small delay to ensure layout is settled
    setTimeout(revealOnScroll, 100);
  });

  // ======================== PARTICLE GRID (HERO BACKGROUND) ========================
  function createParticleGrid() {
    var container = document.getElementById("particleGrid");
    if (!container) return;

    var canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    container.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    var particles = [];
    var mouse = { x: null, y: null };

    function resize() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    container.parentElement.addEventListener("mousemove", function (e) {
      var rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    container.parentElement.addEventListener("mouseleave", function () {
      mouse.x = null;
      mouse.y = null;
    });

    var numParticles = Math.min(
      80,
      Math.floor((canvas.width * canvas.height) / 15000)
    );
    for (var i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.4 + 0.1,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 240, 255, " + p.opacity + ")";
        ctx.fill();
      }

      // Draw connections between nearby particles
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = particles[i].x - particles[j].x;
          var dy = particles[i].y - particles[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle =
              "rgba(0, 240, 255, " + 0.06 * (1 - dist / 150) + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction lines
        if (mouse.x !== null) {
          var mdx = particles[i].x - mouse.x;
          var mdy = particles[i].y - mouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 200) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle =
              "rgba(0, 240, 255, " + 0.15 * (1 - mdist / 200) + ")";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  // Initialize particles after page load
  $(window).on("load", createParticleGrid);

})(jQuery);