const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8BP6K4fEuxzoCELHufQsn4FRB66NL4R3PhEWTZ-yFdaSHAWtDyYsGPoyC0KGtKqtgyek9RgllGS8g/pub?gid=1548855059&single=true&output=csv";

document.getElementById("days").addEventListener("change", loadCharts);

async function loadCharts() {
  const days = parseInt(document.getElementById("days").value);
  const response = await fetch(csvUrl);
  const data = await response.text();
  const rows = data.split("\n").slice(1).reverse().slice(0, days).reverse(); // latest N days
  const labels = [], f=[], g=[], h=[], i=[], j=[], k=[], c=[], d=[], e=[];

  rows.forEach(row => {
    const cols = row.split(",");
    labels.push(cols[0]);
    f.push(parseFloat(cols[5]));
    g.push(parseFloat(cols[6]));
    h.push(parseFloat(cols[7]));
    i.push(parseFloat(cols[8]));
    j.push(parseFloat(cols[9]));
    k.push(parseFloat(cols[10]));
    c.push(parseFloat(cols[2]));
    d.push(parseFloat(cols[3]));
    e.push(parseFloat(cols[4]));
  });

  const chartConfigs = [
    {
      id: 'chart1',
      title: '10(5)',
      datasets: [
        { label: '10 SMA %', data: f, borderColor: 'blue', fill: false },
        { label: 'SMA5(10)', data: g, borderColor: 'red', fill: false }
      ]
    },
    {
      id: 'chart2',
      title: '50(5)',
      datasets: [
        { label: '50 SMA %', data: h, borderColor: 'blue', fill: false },
        { label: 'SMA5(50)', data: i, borderColor: 'red', fill: false }
      ]
    },
    {
      id: 'chart3',
      title: '200(5)',
      datasets: [
        { label: '200 SMA %', data: j, borderColor: 'blue', fill: false },
        { label: 'SMA5(200)', data: k, borderColor: 'red', fill: false }
      ]
    },
    {
      id: 'chart4',
      title: 'Net 20 Day High',
      datasets: [
        { label: 'Net 20 High', data: c, backgroundColor: 'black', type: 'bar' }
      ]
    },
    {
      id: 'chart5',
      title: 'Net 50 Day High',
      datasets: [
        { label: 'Net 50 High', data: d, backgroundColor: 'black', type: 'bar' }
      ]
    },
    {
      id: 'chart6',
      title: 'Net 200 Day High',
      datasets: [
        { label: 'Net 200 High', data: e, backgroundColor: 'black', type: 'bar' }
      ]
    }
  ];

  chartConfigs.forEach((cfg, index) => {
    const ctx = document.getElementById(cfg.id).getContext('2d');
    if (window[cfg.id]) window[cfg.id].destroy();
    window[cfg.id] = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: cfg.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 1.6,
        plugins: {
          title: {
            display: true,
            text: cfg.title,
            font: { size: 16 }
          }
        },
        scales: {
          y: {
            grid: {
              color: ctx => {
                if (ctx.tick.value >= 80) return 'darkred';
                if (ctx.tick.value <= 20) return 'blue';
                if (ctx.tick.value === 50) return 'black';
                return '#ccc';
              }
            }
          }
        }
      }
    });
  });
}

// Initial load
loadCharts();
