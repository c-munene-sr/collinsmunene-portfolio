/*!
 * Collins Munene Portfolio — Main JS
 */
(function ($) {
  "use strict";

  // ======================== SMOOTH SCROLLING ========================
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
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
        $("html, body").animate(
          { scrollTop: target.offset().top - 72 },
          1000,
          "easeInOutExpo"
        );
        return false;
      }
    }
  });

  // ======================== CLOSE MOBILE MENU ON CLICK ========================
  $(".js-scroll-trigger").click(function () {
    $(".navbar-collapse").removeClass("show");
  });

  // ======================== NAVBAR SHRINK ON SCROLL ========================
  var navbarCollapse = function () {
    if ($("#mainNav").length) {
      if ($(window).scrollTop() > 100) {
        $("#mainNav").addClass("navbar-shrink");
      } else {
        $("#mainNav").removeClass("navbar-shrink");
      }
    }
  };
  navbarCollapse();
  $(window).scroll(navbarCollapse);

  // ======================== MOBILE TOGGLE ========================
  $(".navbar-toggler").click(function () {
    $(".navbar-collapse").toggleClass("show");
  });

  // ======================== ACTIVE NAV HIGHLIGHTING ========================
  $(window).on("scroll", function () {
    var scrollPos = $(window).scrollTop() + 100;
    $(".nav-link.js-scroll-trigger").each(function () {
      var href = $(this).attr("href");
      if (href && href.startsWith("#")) {
        var section = $(href);
        if (section.length) {
          if (
            section.offset().top <= scrollPos &&
            section.offset().top + section.outerHeight() > scrollPos
          ) {
            $(".nav-link").removeClass("active");
            $(this).addClass("active");
          }
        }
      }
    });
  });

  // ======================== SCROLL REVEAL ANIMATIONS ========================
  function revealOnScroll() {
    var reveals = document.querySelectorAll(
      ".service-card, .project-card, .fav-card, .timeline-item, .skill-item"
    );
    var windowHeight = window.innerHeight;
    reveals.forEach(function (el, index) {
      var elementTop = el.getBoundingClientRect().top;
      var revealPoint = 120;
      if (elementTop < windowHeight - revealPoint) {
        // Stagger the animation slightly
        setTimeout(function () {
          el.classList.add("visible");
        }, index * 80);
      }
    });
  }
  window.addEventListener("scroll", revealOnScroll);
  window.addEventListener("load", revealOnScroll);

  // ======================== PARTICLE GRID (HERO BG) ========================
  function createParticleGrid() {
    var container = document.getElementById("particleGrid");
    if (!container) return;

    var canvas = document.createElement("canvas");
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
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

    container.addEventListener("mousemove", function (e) {
      var rect = container.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    container.addEventListener("mouseleave", function () {
      mouse.x = null;
      mouse.y = null;
    });

    var numParticles = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
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

      particles.forEach(function (p) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0, 240, 255, " + p.opacity + ")";
        ctx.fill();
      });

      // Draw connections
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
              "rgba(0, 240, 255, " + (0.06 * (1 - dist / 150)) + ")";
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Mouse interaction
        if (mouse.x !== null) {
          var mdx = particles[i].x - mouse.x;
          var mdy = particles[i].y - mouse.y;
          var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 200) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle =
              "rgba(0, 240, 255, " + (0.15 * (1 - mdist / 200)) + ")";
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }
    animate();
  }

  $(window).on("load", createParticleGrid);

})(jQuery);
