/* =========================================================
   鲸柜柜家居 · 交互
   无依赖。所有模块都做了空值保护，404 / 隐私页也能复用。
   ========================================================= */

(() => {
  const doc = document;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = doc.body;

  /* ---------------------------------------------------------
     Header / 移动端菜单
     --------------------------------------------------------- */

  const header = doc.querySelector(".site-header");
  const menuToggle = doc.querySelector(".menu-toggle");
  const mobileMenu = doc.getElementById("mobile-menu");
  const isSolidHeader = header?.dataset.solid === "true";

  const syncBodyLock = () => {
    const menuOpen = mobileMenu?.classList.contains("is-open");
    const materialOpen = doc.getElementById("material-modal")?.classList.contains("is-open");
    body.classList.toggle("is-locked", Boolean(menuOpen || materialOpen));
  };

  const setHeaderState = () => {
    if (!header || isSolidHeader || header.classList.contains("is-menu-open")) return;
    header.classList.toggle("is-scrolled", window.scrollY > 36);
  };

  setHeaderState();
  window.addEventListener("scroll", setHeaderState, { passive: true });

  const closeMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove("is-open");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "打开菜单");
    header?.classList.remove("is-menu-open");
    syncBodyLock();
  };

  const openMenu = () => {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.add("is-open");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuToggle.classList.add("is-active");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "关闭菜单");
    header?.classList.add("is-menu-open");
    syncBodyLock();
  };

  menuToggle?.addEventListener("click", () => {
    if (mobileMenu?.classList.contains("is-open")) closeMenu();
    else openMenu();
  });

  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 1100) closeMenu();
  });

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */

  const revealItems = [...doc.querySelectorAll(".reveal")];

  if (revealItems.length) {
    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -6% 0px" }
      );
      revealItems.forEach((item) => revealObserver.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }

  /* ---------------------------------------------------------
     案例筛选
     --------------------------------------------------------- */

  const projectsGrid = doc.getElementById("projects-grid");
  const projectCards = projectsGrid ? [...projectsGrid.querySelectorAll(".project-card")] : [];
  const projectFilters = [...doc.querySelectorAll(".project-filter")];
  const projectsEmpty = doc.querySelector(".projects-empty");

  const layoutProjects = (visibleCards) => {
    const count = visibleCards.length;

    visibleCards.forEach((card, index) => {
      let wide = false;

      if (count === 1) {
        wide = true;
      } else if (count >= 3) {
        const isLastAlone = index === count - 1 && index % 2 === 1;
        wide = index === 0 || isLastAlone;
      }

      card.classList.toggle("is-wide", wide);
    });
  };

  const applyFilter = (filter, shouldScroll = false) => {
    if (!projectCards.length) return;

    const knownFilters = projectFilters.map((button) => button.dataset.filter);
    const nextFilter = knownFilters.includes(filter) ? filter : "全部";

    projectFilters.forEach((button) => {
      const isActive = button.dataset.filter === nextFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    const visibleCards = [];

    projectCards.forEach((card) => {
      const show = nextFilter === "全部" || card.dataset.category === nextFilter;
      card.classList.toggle("is-hidden", !show);
      if (show) visibleCards.push(card);
    });

    layoutProjects(visibleCards);
    projectsEmpty?.classList.toggle("is-visible", visibleCards.length === 0);

    if (shouldScroll) {
      doc.getElementById("projects")?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  projectFilters.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter || "全部"));
  });

  applyFilter("全部");

  /* ---------------------------------------------------------
     板材弹层（桌面端；手机端直接进入板材详情页）
     --------------------------------------------------------- */

  const materialModal = doc.getElementById("material-modal");
  const materialCards = [...doc.querySelectorAll("[data-material-index]")];
  const materialDataNode = doc.getElementById("materials-data");
  const desktopMaterials = window.matchMedia("(min-width: 901px)");
  const materialClose = materialModal?.querySelector(".material-modal__close");
  let materialsData = [];
  let lastFocusedElement = null;

  if (materialDataNode) {
    try {
      materialsData = JSON.parse(materialDataNode.textContent || "[]");
    } catch (error) {
      materialsData = [];
    }
  }

  const fillList = (node, values) => {
    if (!node) return;
    node.replaceChildren();
    (values || []).forEach((value) => {
      const item = doc.createElement("li");
      item.textContent = value;
      node.appendChild(item);
    });
  };

  const closeMaterial = () => {
    if (!materialModal || !materialModal.classList.contains("is-open")) return;

    materialModal.classList.remove("is-open");
    materialModal.setAttribute("aria-hidden", "true");
    syncBodyLock();

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus({ preventScroll: true });
    }
  };

  const openMaterial = (index) => {
    const material = materialsData[index];
    if (!material || !materialModal) return;

    lastFocusedElement = doc.activeElement;

    const swatch = doc.getElementById("material-modal-swatch");
    if (swatch) {
      swatch.className = `material-modal__swatch material-swatch--${material.swatch || "particle"}`;
    }

    const image = doc.getElementById("material-modal-image");
    if (image) {
      image.src = material.image || "";
      image.alt = material.imageAlt || material.name || "";
    }

    const setText = (id, value) => {
      const node = doc.getElementById(id);
      if (node) node.textContent = value || "";
    };

    setText("material-modal-num", material.number);
    setText("material-modal-en", material.english);
    setText("material-modal-price", material.priceLevel);
    setText("material-modal-title", material.name);
    setText("material-modal-summary", material.summary);
    setText("material-modal-core", material.core);
    setText("material-modal-spaces", (material.spaces || []).join(" / "));
    setText("material-modal-finish", material.finish);
    fillList(doc.getElementById("material-modal-advantages"), material.advantages);
    fillList(doc.getElementById("material-modal-cautions"), material.cautions);

    const brands = doc.getElementById("material-modal-brands");
    if (brands) {
      brands.replaceChildren();
      (material.brands || []).forEach((brand) => {
        const tag = doc.createElement("span");
        tag.textContent = brand;
        brands.appendChild(tag);
      });
    }

    const link = doc.getElementById("material-modal-link");
    if (link) link.href = `/#contact`;

    materialModal.classList.add("is-open");
    materialModal.setAttribute("aria-hidden", "false");
    syncBodyLock();
    materialClose?.focus({ preventScroll: true });
  };

  materialCards.forEach((card) => {
    card.addEventListener("click", (event) => {
      if (!desktopMaterials.matches) return;
      event.preventDefault();
      openMaterial(Number(card.dataset.materialIndex));
    });
  });

  materialClose?.addEventListener("click", closeMaterial);

  materialModal?.addEventListener("click", (event) => {
    if (event.target === materialModal) closeMaterial();
  });

  materialModal?.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeMaterial();
      return;
    }

    if (event.key !== "Tab") return;

    const focusable = [...materialModal.querySelectorAll("a[href], button:not([disabled])")];
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  desktopMaterials.addEventListener("change", () => {
    if (!desktopMaterials.matches) closeMaterial();
  });

  /* ---------------------------------------------------------
     工艺手风琴
     --------------------------------------------------------- */

  const craftItems = [...doc.querySelectorAll(".craft-item")];

  craftItems.forEach((item) => {
    const trigger = item.querySelector(".craft-item__trigger");
    const panel = item.querySelector(".craft-item__panel");

    trigger?.addEventListener("click", () => {
      const willOpen = !item.classList.contains("is-open");

      craftItems.forEach((other) => {
        other.classList.remove("is-open");
        const otherTrigger = other.querySelector(".craft-item__trigger");
        const otherPanel = other.querySelector(".craft-item__panel");
        otherTrigger?.setAttribute("aria-expanded", "false");
        otherPanel?.setAttribute("aria-hidden", "true");
      });

      if (willOpen) {
        item.classList.add("is-open");
        trigger.setAttribute("aria-expanded", "true");
        panel?.setAttribute("aria-hidden", "false");
      }
    });
  });

  /* ---------------------------------------------------------
     预约表单
     --------------------------------------------------------- */

  const bookingForm = doc.getElementById("booking-form");
  const formStatus = doc.getElementById("form-status");
  const formSuccess = doc.getElementById("form-success");
  const submitButton = bookingForm?.querySelector(".booking-submit");
  const formEmail = (bookingForm?.dataset.formEmail || "").trim();

  const showFormStatus = (message, isError = false) => {
    if (!formStatus) return;
    formStatus.textContent = message;
    formStatus.classList.add("is-visible");
    formStatus.classList.toggle("is-error", isError);
  };

  const clearFormStatus = () => {
    if (!formStatus) return;
    formStatus.textContent = "";
    formStatus.classList.remove("is-visible", "is-error");
  };

  const showFormSuccess = () => {
    if (!bookingForm) return;
    bookingForm.style.display = "none";
    formSuccess?.classList.add("is-visible");
    formSuccess?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "center",
    });
  };

  bookingForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearFormStatus();

    const name = bookingForm.elements.name?.value.trim() || "";
    const phoneRaw = bookingForm.elements.phone?.value.trim() || "";
    const phone = phoneRaw.replace(/[\s-]/g, "");
    const email = bookingForm.elements.email?.value.trim() || "";
    const consent = bookingForm.elements.consent?.checked;
    const honey = bookingForm.elements._honey?.value || "";

    if (honey) {
      showFormSuccess();
      return;
    }

    if (!name) {
      showFormStatus("请先填写称呼。", true);
      bookingForm.elements.name?.focus();
      return;
    }

    const isMobile = /^1[3-9]\d{9}$/.test(phone);
    const isLandline = /^0\d{2,3}\d{7,8}$/.test(phone);

    if (!isMobile && !isLandline) {
      showFormStatus("请填写有效的手机号码或座机号码。", true);
      bookingForm.elements.phone?.focus();
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormStatus("邮箱格式看起来不太对，可以检查一下，或留空。", true);
      bookingForm.elements.email?.focus();
      return;
    }

    if (!consent) {
      showFormStatus("请先阅读并勾选隐私说明。", true);
      bookingForm.elements.consent?.focus();
      return;
    }

    if (!formEmail) {
      showFormStatus("预约表单尚未接通接收邮箱，暂时无法提交。请联系网站管理员完成配置。", true);
      return;
    }

    const payload = {
      name,
      phone,
      email,
      category: bookingForm.elements.category?.value || "",
      budget: bookingForm.elements.budget?.value || "",
      city: bookingForm.elements.city?.value.trim() || "",
      message: bookingForm.elements.message?.value.trim() || "",
      consent: "已同意隐私说明",
      _subject: "官网预约咨询 · 鲸柜柜",
      _template: "table",
      _captcha: "false",
      _honey: "",
      page: window.location.href,
    };

    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "正在提交…";
    }

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(formEmail)}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const raw = await response.text();
      let data = {};

      try {
        data = JSON.parse(raw);
      } catch (error) {
        data = {};
      }

      const success = data.success === true || data.success === "true";
      const message = String(data.message || "");

      if (!response.ok || !success) {
        throw new Error(message || "提交失败");
      }

      if (/activation|activate|激活/i.test(message)) {
        showFormStatus(
          "预约信息已发送，但接收邮箱还没有完成 FormSubmit 激活。请检查邮箱中的激活邮件；完成激活后，再提交一次即可正常收到。",
          true
        );
        return;
      }

      showFormSuccess();
    } catch (error) {
      showFormStatus(
        "提交没有成功，请检查网络后重试。如果仍然不行，请稍后再试，或通过页面上的联系方式与我们联系。",
        true
      );
    } finally {
      if (submitButton && bookingForm.style.display !== "none") {
        submitButton.disabled = false;
        submitButton.textContent = "提交预约";
      }
    }
  });

  /* ---------------------------------------------------------
     全局键盘
     --------------------------------------------------------- */

  doc.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    closeMenu();
    closeMaterial();
  });
})();
