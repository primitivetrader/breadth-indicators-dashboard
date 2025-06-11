const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8BP6K4fEuxzoCELHufQsn4FRB66NL4R3PhEWTZ-yFdaSHAWtDyYsGPoyC0KGtKqtgyek9RgllGS8g/pub?gid=1548855059&single=true&output=csv";

document.getElementById("daySelector").addEventListener("input", loadCharts);

async function loadCharts() {
  const days = parseInt(document.getElementById("daySelector").value) || 60;
  const response = await fetch(csvUrl);
  const data = await response.text();

  const rows = data.split("\n").slice(1).filter(row => row.trim().length > 0);
  const parsed = rows.map(row => row.split(","));

  const recent = parsed.slice(-days);

  const labels = recent.map(row => row[0]);
  const f10 = recent.map(row => parseFloat(row[5]));
  const g10 = recent.map(row => parseFloat(row[6]));
  const h50 = recent.map(row => parseFloat(row[7]));
  const i50 = recent.map(row => parseFloat(row[8]));
  const j200 = recent.map(row => parseFloat(row[9]));
  const k200 = recent.map(row => parseFloat(row[10]));
  const net20 = recent.map(row => parseFloat(row[2]));
  const net50 = recent.map(row => parseFloat(row[3]));
  const net200 = recent.map(row => parseFloat(row[4]));

  createLineChart("chart10", labels, f10, g10, "10(5)");
  createLineChart("chart50", labels, h50, i50, "50(5)");
  createLineChart("chart200", labels, j200, k200, "200(5)");

  createHistogram("chartNet20", labels, net20, "Net 20 High");
  createHistogram("chartNet50", labels, net50, "Net 50 High");
  createHistogram("chartNet200", labels, net200, "Net 200 High");
}

function createLineChart(canvasId, labels, data1, data2, title) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  if (window[canvasId]) window[canvasId].destroy();
  window[canvasId] = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: `${title} Blue`, data: data1, borderColor: "blue", fill: false },
        { label: `${title} Red`, data: data2, borderColor: "red", fill: false }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: title }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            callback: function (val) {
              return val;
            },
            color: function (context) {
              const val = context.tick.value;
              if (val >= 80) return "darkred";
              if (val <= 20) return "blue";
              if (val === 50) return "black";
              return "gray";
            }
          }
        }
      }
    }
  });
}

function createHistogram(canvasId, labels, data, title) {
  const ctx = document.getElementById(canvasId).getContext("2d");
  if (window[canvasId]) window[canvasId].destroy();
  window[canvasId] = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: title,
          data,
          backgroundColor: "black"
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: { display: true, text: title }
      }
    }
  });
}

loadCharts();
