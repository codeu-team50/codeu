
function loadCharts(){
  google.charts.load('current', {packages: ['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  google.charts.setOnLoadCallback(drawHobbiesChart);
}

function drawChart(){
  var travel_data = new google.visualization.DataTable();
  
  travel_data.addColumn('string', 'Country');
  travel_data.addColumn('number', 'Votes');

    //add data to travel_data
  travel_data.addRows([
      ["Sri Lanka", 6],
      ["Maldives", 10],
      ["France", 7],
      ["Singapore", 4],
      ["Australia", 8]
  ]);

  var chart_options = {
                    width: 800,
                    height: 400
  };

  var barChart = new google.visualization.BarChart(document.getElementById('travel_barchart'));
  barChart.draw(travel_data, chart_options);

  var pieChart = new google.visualization.PieChart(document.getElementById('travel_piechart'));
  pieChart.draw(travel_data, chart_options);
}

function drawHobbiesChart(){
  fetch("/hobbieschart")
    .then((response) => {
        return response.json();
      })
    .then((bookJson) => {
        var bookData = new google.visualization.DataTable();
              //define columns for the DataTable instance
        bookData.addColumn('string', 'Book Title');
        bookData.addColumn('number', 'Rating');

        for (i = 0; i < bookJson.length; i++) {
          bookRow = [];
          var title = bookJson[i].title;
          var ratings = bookJson[i].rating;
          bookRow.push(title, ratings);

          bookData.addRow(bookRow);
        }
        var chartOptions = {
                        width: 800,
                        height: 400,
                        pieHole: 0.4
        };
        var hobbiesChart = new google.visualization.PieChart(document.getElementById('hobbies_chart'));
        hobbiesChart.draw(bookData, chartOptions);
        })
}

  

function buildUI() { 
  loadNavigation();
  loadCharts();
  }
