import Plotly from 'plotly.js-basic-dist-min';

function setupNoCoinsChart() {
    let scatterData = {
        x: [21, 21, 21, 20, 20, 19, 20, 20, 20, 21, 20],
        y: [1.7078, 1.6073, 2.5658, 1.8856, 0.4714, 2.3392, 1.4907, 3.0912, 2.8674, 2.5, 2.357],
        mode: "markers",
        text: ["(no character)<br>Dice: 1,2,3,4,5,6", "Mario:<br>Dice: 1,3,3,3,5,6", "Luigi", "Peach", "Daisy", "Yoshi", "Shy Guy", "Koopa Troopa", "Bowser Jr", "Dry Bones", "Pom Pom"],
    };
    let layout = {
        xaxis: {
            title: "Total of numbers on dice block",
        },
        yaxis: {
            title: "Standard deviation of dice block values",
        }
    }
    Plotly.newPlot('noCoinsChart', [scatterData], layout, {responsive: true});
}

        /*Plotly.newPlot( chartSection.children.item(index), plot_datas,
         {
            title: {
                text: raw_data.metadata[divisionId]['name'],
                font: {
                    color: textColor
                }
            },
            legend: {
                font: {
                    color: textColor
                }
            },
            xaxis: {
                color: textColor
            },
            yaxis: {
                color: textColor
            },
            hovermode: "x",
            paper_bgcolor: isDark ? "#262626" : "#e6e6e6",
            plot_bgcolor: isDark ? "#262626" : "#e6e6e6"
         },
         {responsive: true});
        index++;
    }*/

(function() {
    setupNoCoinsChart();
})();

