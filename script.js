document.addEventListener("DOMContentLoaded", () => {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll('a[href^="#"]');
  const backToTop = document.getElementById("backToTop");
  const bookingForm = document.getElementById("bookingForm");
  const formMessage = document.getElementById("formMessage");
  const preferredDate = document.getElementById("preferredDate");

  const closeMenu = () => {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove("is-active");
    navMenu.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-open");
  };

  // Mobile menu toggle.
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.classList.toggle("is-active", isOpen);
      navToggle.setAttribute("aria-expanded", String(isOpen));
      document.body.classList.toggle("nav-open", isOpen);
    });
  }

  // Smooth scroll for internal section links.
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      const target = targetId ? document.querySelector(targetId) : null;

      if (!target) return;

      event.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  // Floating back-to-top button.
  const toggleBackToTop = () => {
    if (!backToTop) return;
    backToTop.classList.toggle("is-visible", window.scrollY > 520);
  };

  window.addEventListener("scroll", toggleBackToTop, { passive: true });
  toggleBackToTop();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (preferredDate) {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    preferredDate.min = new Date(today - timezoneOffset).toISOString().split("T")[0];
  }

  const setError = (field, message) => {
    const error = bookingForm.querySelector(`[data-error-for="${field.id}"]`);
    field.classList.add("is-invalid");
    field.setAttribute("aria-invalid", "true");

    if (error) {
      error.textContent = message;
    }
  };

  const clearError = (field) => {
    const error = bookingForm.querySelector(`[data-error-for="${field.id}"]`);
    field.classList.remove("is-invalid");
    field.removeAttribute("aria-invalid");

    if (error) {
      error.textContent = "";
    }
  };

  // Frontend-only booking validation and success feedback.
  if (bookingForm) {
    const fields = Array.from(bookingForm.querySelectorAll("input, select, textarea"));

    fields.forEach((field) => {
      field.addEventListener("input", () => clearError(field));
      field.addEventListener("change", () => clearError(field));
    });

    bookingForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const name = document.getElementById("customerName");
      const phone = document.getElementById("customerPhone");
      const service = document.getElementById("preferredService");
      const date = document.getElementById("preferredDate");
      const message = document.getElementById("message");
      const phonePattern = /^[0-9+\-\s]{8,15}$/;
      let firstInvalid = null;

      fields.forEach(clearError);

      const markInvalid = (field, text) => {
        setError(field, text);
        if (!firstInvalid) firstInvalid = field;
      };

      if (!name.value.trim() || name.value.trim().length < 2) {
        markInvalid(name, "กรุณากรอกชื่ออย่างน้อย 2 ตัวอักษร");
      }

      if (!phone.value.trim() || !phonePattern.test(phone.value.trim())) {
        markInvalid(phone, "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง");
      }

      if (!service.value) {
        markInvalid(service, "กรุณาเลือกบริการที่ต้องการ");
      }

      if (!date.value) {
        markInvalid(date, "กรุณาเลือกวันที่ต้องการจอง");
      } else if (preferredDate.min && date.value < preferredDate.min) {
        markInvalid(date, "กรุณาเลือกวันที่ตั้งแต่วันนี้เป็นต้นไป");
      }

      if (message.value.trim().length > 500) {
        markInvalid(message, "กรุณาใส่ข้อความไม่เกิน 500 ตัวอักษร");
      }

      if (firstInvalid) {
        formMessage.classList.remove("is-visible");
        formMessage.textContent = "";
        firstInvalid.focus();
        return;
      }

      bookingForm.reset();
      formMessage.textContent = "ขอบคุณค่ะ ทีมงาน Koji Massage ได้รับข้อมูลตัวอย่างแล้ว กรุณาติดต่อ LINE หรือโทรเพื่อยืนยันคิวจริง";
      formMessage.classList.add("is-visible");
    });
  }
});
