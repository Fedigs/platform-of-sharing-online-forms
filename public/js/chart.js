function newChart(nom, id, tab, ctx) {
  ctx = document.getElementById(id).getContext("2d");
  nom = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: tab.label,
      datasets: [
        {
          label: "Réponses",
          data: tab.data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
      responsive: true,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: tab.contenu
      }
    }
  });
}
function exist(x, tab) {
  var val = false;
  for (let i = 0; i < tab.length; i++) {
    if (x == tab[i]) {
      console.log(true);
      return true;
    }
  }
  return val;
}
function graphe(tab) {
  var tab = JSON.parse(JSON.stringify(tab));
  //console.log(tab);
  //type:bar,pie,doughnut
  var DéjàAffiché = [];
  for (let i = 0; i < tab.length; i++) {
    var chartDiv = document.getElementById("chartDiv");
    chartDiv.insertAdjacentHTML(
      "beforeend",
      "<div  class='chart-container' style='position: relative; height:70vh; width:60vw'><canvas id='myChart" +
        i +
        "'></canvas></div><br>"
    );

    var id = "myChart" + i;
    var nom = "chart" + i;
    var ctx = "ctx" + i;

    //console.log(DéjàAffiché);
    if (!exist(tab[i].contenu, DéjàAffiché)) {
      newChart(nom, id, tab[i], ctx);
    }
    DéjàAffiché.push(tab[i].contenu);
  }
}
