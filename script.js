function toggleMenu() {
  const dropdown = document.getElementById("dropdownMenu");
  if (!dropdown) return;
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
}
document.addEventListener("click", function (e) {
  const dropdown = document.getElementById("dropdownMenu");
  const btn = document.querySelector(".menu-btn");
  if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
    dropdown.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabPanes = document.querySelectorAll(".tab-pane");
  const rowsPerPage = 5;
  let currentPage = 1;

  // Show page for a given table
  function showPage(table, page) {
    if (!table) return;
    const allRows = Array.from(table.querySelectorAll("tbody tr"));
    // Only paginate main rows (query-row or first-level rows)
    const mainRows = allRows.filter(
      (r) =>
        r.classList.contains("query-row") ||
        !r.classList.contains("query-details")
    );

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    mainRows.forEach((row, index) => {
      row.style.display = index >= start && index < end ? "table-row" : "none";
      // Hide details row if exists
      if (
        row.nextElementSibling &&
        row.nextElementSibling.classList.contains("query-details")
      ) {
        row.nextElementSibling.style.display = "none";
      }
    });
    // Enable/disable buttons
    const nav = table.parentElement.querySelector(".pagination-nav");
    if (nav) {
      nav
        .querySelector("#prevPage")
        .parentElement.classList.toggle("disabled", page === 1);
      nav
        .querySelector("#nextPage")
        .parentElement.classList.toggle("disabled", end >= mainRows.length);
    }
  }

  // Get active table in visible tab
  function getActiveTable() {
    const activePane = document.querySelector(
      ".tab-pane[style*='display: block']"
    );
    if (!activePane) return null;
    return activePane.querySelector(".query-table");
  }

  // Tab click event
  tabButtons.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      currentPage = 1;

      // Hide all panes
      tabPanes.forEach((pane) => (pane.style.display = "none"));

      // Show selected pane
      const targetPane = document.getElementById(tabBtn.dataset.tab);
      if (targetPane) targetPane.style.display = "block";

      // Update active tab
      tabButtons.forEach((b) => b.classList.remove("active"));
      tabBtn.classList.add("active");

      // Show first page for the table in this tab
      const table = getActiveTable();
      if (table) showPage(table, currentPage);
    });
  });

  // Initialize first tab
  const firstTab = document.querySelector(".tab-btn.active") || tabButtons[0];
  if (firstTab) firstTab.click();
});

// Toggle query details
function toggleDetails(row) {
  const nextRow = row.nextElementSibling;
  if (nextRow && nextRow.classList.contains("query-details")) {
    nextRow.style.display =
      nextRow.style.display === "table-row" ? "none" : "table-row";
  }
}

// Search queries in active tab
function searchQueries() {
  const input = document.getElementById("querySearchInput").value.toLowerCase();
  const table = document.querySelector(
    ".tab-pane[style*='display: block'] .query-table"
  );
  if (!table) return;

  const rows = table.querySelectorAll("tbody tr");
  rows.forEach((row) => {
    const text = row.innerText.toLowerCase();
    if (text.includes(input) || row.classList.contains("no-data-row")) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const rowsPerPage = 5;
  let currentPage = 1;

  const table = document.querySelector(".query-table"); // active table
  const prevBtn = document.getElementById("prevPage");
  const nextBtn = document.getElementById("nextPage");

  function showPage(page) {
    const rows = Array.from(table.querySelectorAll("tbody tr.query-row"));
    const totalPages = Math.ceil(rows.length / rowsPerPage);

    // hide all rows
    rows.forEach(r => r.style.display = "none");

    // show current page rows
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    rows.slice(start, end).forEach(r => r.style.display = "table-row");

    // enable/disable buttons
    prevBtn.parentElement.classList.toggle("disabled", page === 1);
    nextBtn.parentElement.classList.toggle("disabled", page === totalPages);
  }

  prevBtn.addEventListener("click", e => {
    e.preventDefault();
    if (currentPage > 1) currentPage--;
    showPage(currentPage);
  });

  nextBtn.addEventListener("click", e => {
    e.preventDefault();
    const rows = Array.from(table.querySelectorAll("tbody tr.query-row"));
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    if (currentPage < totalPages) currentPage++;
    showPage(currentPage);
  });

  // initial load
  showPage(currentPage);
});


