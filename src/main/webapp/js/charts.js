google.charts.load('current', {packages: ['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart(){
  //to be filled in later
  var travel_data = new google.visualization.DataTable();
  //define columns for the DataTable instance

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

  var chart = new google.visualization.PieChart(document.getElementById('book_chart'));
  chart.draw(travel_data, chart_options);
}
