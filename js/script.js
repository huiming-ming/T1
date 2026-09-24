const headerHtml = `
  <a class="logo-container" href="index.html" data-page="home" title="Return to Home" aria-label="Return to Home">
    <img src="images/PowerIcon.png" alt="Power logo" id="logo">
  </a>
  <nav aria-label="Main">
    <ul>
      <li><a href="index.html" data-page="home">Home</a></li>
      <li><a href="televisions.html" data-page="televisions">Televisions</a></li>
      <li><a href="about.html" data-page="about">About Us</a></li>
    </ul>
  </nav>
`;

const footerHtml = `
  <p>&copy; ${new Date().getFullYear()} Hui Ming TANG | JavaScript and parts of the design were done with the help of GenAI (Gemini and Claude AI) </p>
`;

const sampleTvs = [
  { model: "Sample TV A", size: 32, stars: 5.5, watts: 45 },
  { model: "Sample TV B", size: 43, stars: 5, watts: 62 },
  { model: "Sample TV C", size: 50, stars: 4.5, watts: 78 },
  { model: "Sample TV D", size: 55, stars: 4, watts: 95 },
  { model: "Sample TV E", size: 65, stars: 3.5, watts: 130 },
  { model: "Sample TV F", size: 75, stars: 3, watts: 180 }
];

const sampleHoursPerDay = 5;

function showHeaderAndFooter() {
  document.getElementById("site-header").innerHTML = headerHtml;
  document.getElementById("site-footer").innerHTML = footerHtml;
}

function currentPage() {
  const file = window.location.pathname.split("/").pop();
  const name = file.replace(".html", "") || "index";
  return name === "index" ? "home" : name;
}

function markCurrentPage() {
  const current = currentPage();
  document.querySelectorAll("nav a").forEach(function (link) {
    if (link.dataset.page === current) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

document.addEventListener("click", function (event) {
  const link = event.target.closest("a[data-page]");
  if (!link) {
    return;
  }
  if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey) {
    return;
  }
  event.preventDefault();
  window.location.href = link.href;
});

function annualKwh(watts, hoursPerDay) {
  return (watts * hoursPerDay * 365) / 1000;
}

function updateEstimate() {
  const watts = Number(document.getElementById("watts").value) || 0;
  const hours = Number(document.getElementById("hours").value) || 0;
  const tariff = Number(document.getElementById("tariff").value) || 0;

  const kwh = annualKwh(watts, hours);
  const cost = (kwh * tariff) / 100;

  document.getElementById("annual-kwh").textContent = Math.round(kwh);
  document.getElementById("annual-cost").textContent = "$" + cost.toFixed(2);
}

function renderChart() {
  const list = document.getElementById("tv-chart");
  const values = sampleTvs.map(function (tv) {
    return annualKwh(tv.watts, sampleHoursPerDay);
  });
  const largest = Math.max.apply(null, values);

  sampleTvs.forEach(function (tv, index) {
    const item = document.createElement("li");

    const label = document.createElement("span");
    label.textContent = tv.size + " inch";

    const track = document.createElement("span");
    track.className = "bar-track";
    const bar = document.createElement("span");
    bar.className = "bar";
    bar.style.width = (values[index] / largest) * 100 + "%";
    track.appendChild(bar);

    const value = document.createElement("span");
    value.className = "bar-value";
    value.textContent = Math.round(values[index]) + " kWh";

    item.appendChild(label);
    item.appendChild(track);
    item.appendChild(value);
    list.appendChild(item);
  });
}

function renderTvTable() {
  const body = document.getElementById("tv-rows");
  sampleTvs.forEach(function (tv) {
    const row = document.createElement("tr");
    const cells = [
      tv.model,
      tv.size + " inch",
      tv.stars + " stars",
      tv.watts,
      Math.round(annualKwh(tv.watts, sampleHoursPerDay))
    ];
    cells.forEach(function (value) {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    body.appendChild(row);
  });
}

function setUpTelevisionsPage() {
  document.querySelectorAll(".estimator input").forEach(function (input) {
    input.addEventListener("input", updateEstimate);
  });
  renderChart();
  renderTvTable();
  updateEstimate();
}

showHeaderAndFooter();
markCurrentPage();

if (document.getElementById("tv-chart")) {
  setUpTelevisionsPage();
}
