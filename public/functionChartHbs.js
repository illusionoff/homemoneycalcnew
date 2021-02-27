// eslint-disable-next-line no-unused-vars
function ChartHbs(strArrColor, strArrName, strArrCosts) {
  // создаем маccив строк из входной строки
  const arrColor = strArrColor.split(",");
  const arrName = strArrName.split(",");
  const arrCosts = strArrCosts.split(",");
  const ctx = document.getElementById("myChart").getContext("2d");
  /* global Chart */
  Chart.defaults.global.legend.display = false; // eslint-disable-next-line no-unused-vars
  const chart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: arrName,
      datasets: [
        {
          backgroundColor: arrColor,
          data: arrCosts,
        },
      ],
    },
    options: {
      responsive: false,
    },
  });
  const buttonsTablePie = document.getElementsByName("buttonVisible");
  const tableVisible = document.getElementById("table");
  const myChart = document.getElementById("myChart");
  buttonsTablePie.forEach((button, index) => {
    button.onclick = () => {
      button.style.backgroundColor = "#26a69a";
      if (index === 0) {
        tableVisible.style.display = "block";
        myChart.style.display = "inline";
        buttonsTablePie[1].style.backgroundColor = "transparent";
        buttonsTablePie[2].style.backgroundColor = "transparent";
      } else if (index === 1) {
        tableVisible.style.display = "none";
        myChart.style.display = "inline";
        buttonsTablePie[0].style.backgroundColor = "transparent";
        buttonsTablePie[2].style.backgroundColor = "transparent";
      } else {
        myChart.style.display = "none";
        tableVisible.style.display = "block";
        buttonsTablePie[0].style.backgroundColor = "transparent";
        buttonsTablePie[1].style.backgroundColor = "transparent";
      }
    };
  });
}
