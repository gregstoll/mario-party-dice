import Plotly from 'plotly.js-basic-dist-min';

interface CharacterDiceData {
    coins: number[];
    moves: number[];
}
const DICE_DATA = new Map<string, CharacterDiceData>([
    ["(no character)", {coins: [], moves: [1,2,3,4,5,6]}],
    ["Mario", {coins: [], moves: [1,3,3,3,5,6]}],
    ["Luigi", {coins: [], moves: [1,1,1,5,6,7]}],
    ["Peach", {coins: [], moves: [0,2,4,4,4,6]}],
    ["Daisy", {coins: [], moves: [3,3,3,3,4,4]}],
    ["Yoshi", {coins: [], moves: [0,1,3,3,5,7]}],
    ["Shy Guy", {coins: [], moves: [0,4,4,4,4,4]}],
    ["Koopa Troopa", {coins: [], moves: [1,1,2,3,3,10]}],
    ["Bowser Jr.", {coins: [], moves: [1,1,1,4,4,9]}],
    ["Dry Bones", {coins: [], moves: [1,1,1,6,6,6]}],
    ["Pom Pom", {coins: [], moves: [0,3,3,3,3,8]}],
    ["Wario", {coins: [-2,-2], moves: [6,6,6,6]}],
    ["Waluigi", {coins: [-3], moves: [1,3,5,5,7]}],
    ["Rosalina", {coins: [2,2], moves: [2,3,4,8]}],
    ["Donkey Kong", {coins: [5], moves: [0,0,0,10,10]}],
    ["Diddy Kong", {coins: [2], moves: [0,0,7,7,7]}],
    ["Goomba", {coins: [2,2], moves: [3,4,5,6]}],
    ["Monty Mole", {coins: [1], moves: [2,3,4,5,6]}],
    ["Bowser", {coins: [-3,-3], moves: [1,8,9,10]}],
    ["Hammer Bro", {coins: [3], moves: [1,1,5,5,5]}],
]);

function validateData() {
    for (const [character, data] of Array.from(DICE_DATA.entries())) {
        // TODO - assert data looks valid
    }
}

function standardDeviation(values: number[]): number {
    const avg = values.reduce((a, b) => a + b) / values.length;
    const squareDiffs = values.map(value => (value - avg) ** 2);
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / values.length;
    return Math.sqrt(avgSquareDiff);
}

function setupNoCoinsChart() {
    let xs: number[] = [];
    let ys: number[] = [];
    let texts: string[] = [];
    for (const [character, data] of Array.from(DICE_DATA.entries())) {
        if (data.coins.length === 0) {
            xs.push(data.moves.reduce((a, b) => a + b));
            ys.push(standardDeviation(data.moves));
            texts.push(character + "<br>Dice: " + data.moves.join(","));
        }
    }
    let scatterData = {
        //x: [21, 21, 21, 20, 20, 19, 20, 20, 20, 21, 20],
        x: xs,
        //y: [1.7078, 1.6073, 2.5658, 1.8856, 0.4714, 2.3392, 1.4907, 3.0912, 2.8674, 2.5, 2.357],
        y: ys,
        mode: "markers",
        //text: ["(no character)<br>Dice: 1,2,3,4,5,6", "Mario:<br>Dice: 1,3,3,3,5,6", "Luigi", "Peach", "Daisy", "Yoshi", "Shy Guy", "Koopa Troopa", "Bowser Jr", "Dry Bones", "Pom Pom"],
        text: texts
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
    validateData();
    setupNoCoinsChart();
})();

