const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ8BP6K4fEuxzoCELHufQsn4FRB66NL4R3PhEWTZ-yFdaSHAWtDyYsGPoyC0KGtKqtgyek9RgllGS8g/pub?gid=1548855059&single=true&output=csv";

let chart10, chart50, chart200;

function createChart(ctx, label, labels, blueData, redData) {
  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: label + ' Blue',
          data: blueData,
          borderColor: 'blue',
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        },
        {
          label: label + ' Red',
          data: redData,
          borderColor: 'red',
          borderWidth: 2,
          fill: false,
          pointRadius: 0
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: label
        },
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            color: 'black'
          },
          grid: {
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: 'black',
            maxTicksLimit: 10
          }
        }
      },
      elements: {
        line: {
          tension: 0.3
        }
      }
    },
    plugins: [{
      id: 'customZones',
      beforeDraw: (chart) => {
        const ctx = chart.ctx;
        const yScale = chart.scales.y;
        const area = chart.chartArea;

        // Overbought (80–90) – dark red
        ctx.fillStyle = '#8B0000';
        ctx.fillRect(area.left, yScale.getPixelForValue(90), area.right - area.left, yScale.getPixelForValue(80) - yScale.getPixelForValue(90));

        // Neutral (50) – black line
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(area.left, yScale.getPixelForValue(50));
        ctx.lineTo(area.right, yScale.getPixelForValue(50));
        ctx.stroke();

        // Oversold (10–20) – blue
        ctx.fillStyle = '#0000CD';
        ctx.fillRect(area.left, yScale.getPixelForValue(20), area.right - area.left, yScale.getPixelForValue(10) - yScale.getPixelForValue(20));
      }
    }]
  });
}

function loadCharts() {
  const daysToShow = parseInt(document.getElementById("daysInput").value) || 60;

  Papa.parse(csvUrl, {
    download: true,
    header: true,
    complete: function(results) {
      const data = results.data.slice(-daysToShow);

      const labels = data.map(row => row["Date"]);
      const colF = data.map(row => parseFloat(row["10sma"]) || 0);
      const colG = data.map(row => parseFloat(row["sma5(10)"]) || 0);
      const colH = data.map(row => parseFloat(row["50sma"]) || 0);
      const colI = data.map(row => parseFloat(row["sma5(50)"]) || 0);
      const colJ = data.map(row => parseFloat(row["200ema"]) || 0);
      const colK = data.map(row => parseFloat(row["sma5(200)"]) || 0);

      if (chart10) chart10.destroy();
      if (chart50) chart50.destroy();
      if (chart200) chart200.destroy();

      chart10 = createChart(document.getElementById('chart10'), "10(5)", labels, colF, colG);
      chart50 = createChart(document.getElementById('chart50'), "50(5)", labels, colH, colI);
      chart200 = createChart(document.getElementById('chart200'), "200(5)", labels, colJ, colK);
    }
  });
}

loadCharts();
