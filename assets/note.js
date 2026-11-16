/* 論文筆記站 — 筆記頁側邊抽屜選單
   自動從頁面中的六段標題產生「本篇目錄」，並讀取 ../data/notes.json 產生「其他筆記」清單。
   新增筆記時不需要修改本檔。 */
(function () {
  var sections = document.querySelectorAll(".note-section");
  if (!sections.length) return;

  var currentSlug = (location.pathname.split("/").pop() || "").replace(/\.html$/, "");

  // 1. 幫每一段加上 id，讓目錄可以跳轉
  sections.forEach(function (section, i) {
    if (!section.id) section.id = "section-" + (i + 1);
  });

  // 2. 開啟按鈕
  var toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "drawer-toggle";
  toggle.setAttribute("aria-controls", "note-drawer");
  toggle.setAttribute("aria-expanded", "false");
  toggle.innerHTML = '<span class="drawer-toggle-icon" aria-hidden="true"></span>選單';

  // 3. 遮罩與抽屜
  var overlay = document.createElement("div");
  overlay.className = "drawer-overlay";
  overlay.hidden = true;

  var drawer = document.createElement("nav");
  drawer.className = "drawer";
  drawer.id = "note-drawer";
  drawer.setAttribute("aria-label", "筆記選單");
  // 不用 hidden（display: none 會讓滑入效果失效），改用 .is-open 控制顯示

  var tocItems = Array.prototype.map.call(sections, function (section) {
    var heading = section.querySelector("h2");
    var text = heading ? heading.textContent : section.id;
    return '<li><a href="#' + section.id + '">' + escapeHtml(text) + "</a></li>";
  }).join("");

  drawer.innerHTML =
    '<div class="drawer-header">' +
      '<span class="drawer-title">論文筆記站</span>' +
      '<button type="button" class="drawer-close" aria-label="關閉選單">關閉</button>' +
    "</div>" +
    '<a class="drawer-home" href="../index.html">← 回首頁</a>' +
    '<h2 class="drawer-heading">本篇目錄</h2>' +
    '<ol class="drawer-list">' + tocItems + "</ol>" +
    '<h2 class="drawer-heading">所有筆記</h2>' +
    '<ul class="drawer-list drawer-notes"><li class="drawer-muted">載入中……</li></ul>';

  document.body.appendChild(toggle);
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);

  var closeBtn = drawer.querySelector(".drawer-close");

  var isOpen = false;

  function openDrawer(moveFocus) {
    isOpen = true;
    drawer.classList.add("is-open");
    overlay.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("drawer-open");
    if (moveFocus) closeBtn.focus();
  }

  function closeDrawer(returnFocus) {
    clearHoverTimer();
    openedByHover = false;
    // 手動關閉時滑鼠若還在右側區域，要先離開該區域才會再次自動開啟
    if (pointerInZone) hoverArmed = false;
    isOpen = false;
    drawer.classList.remove("is-open");
    overlay.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("drawer-open");
    if (returnFocus) toggle.focus();
  }

  // 滑鼠在畫面右側「抽屜所在的區域」停留 0.15 秒就自動開啟；離開抽屜後自動關閉。
  // 只在有滑鼠的裝置啟用（手機仍用點擊）。用點擊開啟時不會自動關閉。
  var canHover = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var openedByHover = false;
  var hoverTimer = null;
  var pointerInZone = false;
  var hoverArmed = true;
  var HOVER_OPEN_DELAY = 150;  // 在右側區域停留多久才打開
  var HOVER_CLOSE_DELAY = 300; // 讓滑鼠稍微滑出邊界時不會馬上關掉

  function clearHoverTimer() {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  }

  if (canHover) {
    document.addEventListener("mousemove", function (e) {
      var zoneLeft = window.innerWidth - drawer.offsetWidth;
      var inZone = e.clientX >= zoneLeft;
      if (!inZone) {
        pointerInZone = false;
        hoverArmed = true;
        if (!isOpen) {
          clearHoverTimer();
        } else if (openedByHover && !hoverTimer) {
          // 由滑鼠開啟的抽屜：滑鼠離開抽屜區域後自動關閉
          hoverTimer = setTimeout(function () { closeDrawer(false); }, HOVER_CLOSE_DELAY);
        }
        return;
      }
      pointerInZone = true;
      if (isOpen) {
        clearHoverTimer(); // 滑回抽屜就取消自動關閉
        return;
      }
      if (!hoverArmed || hoverTimer) return;
      hoverTimer = setTimeout(function () {
        hoverTimer = null;
        if (!pointerInZone || isOpen) return;
        openedByHover = true;
        openDrawer(false);
      }, HOVER_OPEN_DELAY);
    });
    document.documentElement.addEventListener("mouseleave", function () {
      pointerInZone = false;
      if (!isOpen) clearHoverTimer();
    });
  }

  toggle.addEventListener("click", function () {
    clearHoverTimer();
    openedByHover = false;
    openDrawer(true);
  });
  closeBtn.addEventListener("click", function () { closeDrawer(true); });
  overlay.addEventListener("click", function () { closeDrawer(true); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) closeDrawer(true);
  });
  drawer.addEventListener("click", function (e) {
    var link = e.target.closest("a");
    if (link && link.getAttribute("href").charAt(0) === "#") closeDrawer(false);
  });

  // 4. 其他筆記清單
  var notesList = drawer.querySelector(".drawer-notes");
  fetch("../data/notes.json")
    .then(function (res) {
      if (!res.ok) throw new Error(res.status);
      return res.json();
    })
    .then(function (notes) {
      notes.sort(function (a, b) { return String(b.added).localeCompare(String(a.added)); });
      notesList.innerHTML = notes.map(function (note) {
        var year = note.year == null ? "待補" : note.year;
        var label = escapeHtml(note.title) + '<span class="drawer-note-meta">' +
          escapeHtml(firstAuthor(note.authors)) + "（" + escapeHtml(year) + "）</span>";
        if (note.slug === currentSlug) {
          return '<li><span class="drawer-current" aria-current="page">' + label + "</span></li>";
        }
        return '<li><a href="' + encodeURIComponent(note.slug) + '.html">' + label + "</a></li>";
      }).join("");
    })
    .catch(function () {
      notesList.innerHTML = '<li class="drawer-muted">無法讀取筆記清單。</li>';
    });

  function firstAuthor(authors) {
    var parts = String(authors || "待補").split(",");
    var name = parts[0].trim();
    return parts.length > 2 ? name + " 等" : name;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }
})();
