// Data for the chart
const data = {
  labels: Array.from({ length: 121 }, (_, i) => i), // Days from 0 to 120
  datasets: [
    {
      label: "Fingerprint",
      data: Array.from({ length: 121 }, (_, i) => {
        return -0.1 - (i - 32) * 0.012 + (Math.random() - 0.5) * 8;
      }),
      borderColor: "#184755",
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    },
    {
      label: "Competitors",
      data: Array.from({ length: 121 }, (_, i) => {
        return -1.3 - (i - 32) * 0.7 + (Math.random() - 0.5) * 8;
      }),
      borderColor: "#fdc3c3",
      borderWidth: 2,
      fill: false,
      pointRadius: 0,
    },
  ],
};

// Custom plugin to draw vertical line
const verticalLinePlugin = {
  id: "verticalLine",
  afterDraw: (chart) => {
    const ctx = chart.ctx;
    const tooltip = chart.tooltip;
    if (tooltip._active && tooltip._active.length) {
      const activePoint = tooltip._active[0];
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, bottomY);
      ctx.lineTo(x, topY);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#c1c1be";
      ctx.stroke();
      ctx.restore();
    }
  },
};

// Chart configuration
const config = {
  type: "line",
  data: data,
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
        suggestedMin: -60,
        suggestedMax: 60,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
  },
  plugins: [verticalLinePlugin],
};

// Initialize the chart
const ctx = document.getElementById("dynamicChart").getContext("2d");
const myChart = new Chart(ctx, config);

// Tooltip functionality
const tooltipElement = document.getElementById("tooltip");

function showTooltip(event) {
  const canvasPosition = myChart.canvas.getBoundingClientRect();
  const x = event.clientX - canvasPosition.left;
  const y = event.clientY - canvasPosition.top;

  // Get the index of the nearest data point
  const points = myChart.getElementsAtEventForMode(
    event,
    "nearest",
    { intersect: false },
    false
  );

  if (points.length > 0) {
    const dataIndex = points[0].index;

    const day = data.labels[dataIndex];
    const fingerprintValue = data.datasets[0].data[dataIndex];
    const competitorsValue = data.datasets[1].data[dataIndex];
    // Format the tooltip content
    const tooltipContent = `
      <div style="font-weight: bold;">${day} Days</div>
      <hr style="margin: 4px 0; color:black;">
      <div>Fingerprint: ${fingerprintValue.toFixed(1)}%</div>
      <div>Competitors: ${competitorsValue.toFixed(1)}%</div>
    `;

    tooltipElement.innerHTML = tooltipContent;
    tooltipElement.classList.remove("hidden");

    tooltipElement.style.left = `${x + 10}px`;
    tooltipElement.style.top = `${y + 10}px`;
  } else {
    tooltipElement.classList.add("hidden");
  }
}

// Event listeners for tooltip
myChart.canvas.addEventListener("mousemove", showTooltip);
myChart.canvas.addEventListener("mouseout", () =>
  tooltipElement.classList.add("hidden")
);

// Creating the squares in the anonymous section
const squaresContainer = document.querySelector(".squares");
const numberOfSquares = 308;

// Create squares using map and append them in one go
const squares = Array.from({ length: numberOfSquares }, (_, i) => {
  const square = document.createElement("div");
  square.classList.add("square", "hover-square");
  return square;
});

// Append all squares to the container
squaresContainer.append(...squares);
