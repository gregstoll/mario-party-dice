import Plotly from 'plotly.js-basic-dist-min';

interface CharacterDiceData {
    coins: number[];
    moves: number[];
}
interface RegressionInfo {
    slope: number;
    intercept: number;
}
const DICE_DATA : [string, CharacterDiceData][] = [
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
    ["Boo", {coins: [-2,-2], moves: [5,5,7,7]}],
    ["Hammer Bro", {coins: [3], moves: [1,1,5,5,5]}],
];
const DICE_DATA_MAP : Map<string, CharacterDiceData> = new Map(DICE_DATA);

function validateData() {
    for (const [character, data] of DICE_DATA) {
        if (character.length == 0) {
            console.error("Character name is empty");
        }
        if (data.coins.length + data.moves.length !== 6) {
            console.error("Invalid number of dice for character ", character);
        }
        if (data.moves.length < 4) {
            console.error("Not enough moves for character ", character);
        }
        for (const coin of data.coins) {
            if (coin < -5 || coin > 5) {
                console.error(`Coin value ${coin} out of range for character `, character);
            }
        }
        for (const move of data.moves) {
            if (move < 0 || move > 10) {
                console.error(`Move value ${move} out of range for character `, character);
            }
        }
    }
}

function standard_deviation(values: number[]): number {
    const avg = values.reduce((a, b) => a + b) / values.length;
    const squareDiffs = values.map(value => (value - avg) ** 2);
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b) / values.length;
    return Math.sqrt(avgSquareDiff);
}

function calculate_regression_line(xs: number[], ys: number[]) : RegressionInfo {
    const xAvg = xs.reduce((a, b) => a + b) / xs.length;
    const yAvg = ys.reduce((a, b) => a + b) / ys.length;
    const xyAvg = xs.map((x, i) => x * ys[i]).reduce((a, b) => a + b) / xs.length;
    const x2Avg = xs.map(x => x ** 2).reduce((a, b) => a + b) / xs.length;
    const slope = (xyAvg - xAvg * yAvg) / (x2Avg - xAvg ** 2);
    const intercept = yAvg - slope * xAvg;
    return {slope: slope, intercept: intercept};
}

function make_plotly_regression_line(xs: number[], ys: number[]) : object {
    const line_info = calculate_regression_line(xs, ys);
    const x_min = Math.min(...xs);
    const x_max = Math.max(...xs);
    return {
        x: [x_min, x_max],
        y: [line_info.slope * x_min + line_info.intercept, line_info.slope * x_max + line_info.intercept],
        mode: "lines",
        line: {
            dash: 'dot',
            width: 2
        },
        hovertemplate: "<extra></extra>" // the "<extra></extra>" at the end suppresses
                                         // the plot name, which is meaningless for us
    }
}

function get_moves_and_coin_string(data: CharacterDiceData, extra_space?: boolean) : string {
    const joiner_string = extra_space ? ", " : ",";
    const coin_string = data.coins.map(coin => `${coin > 0 ? "+" : ""}${coin} coin${coin !== 1 ? "s" : ""}`).join(joiner_string);
    const move_string = data.moves.map(move => `${move}`).join(joiner_string);
    if (coin_string.length > 0) {
        return coin_string + joiner_string + move_string;
    }
    return move_string;
}

function calculate_regression_line_correlation(xs: number[], ys: number[], info: RegressionInfo) : number {
    let regressionSquaredError = 0
    let totalSquaredError = 0
    
    function yPrediction(x : number) {
        return info.slope * x + info.intercept;
    }
    
    const yMean = ys.reduce((a, b) => a + b) / ys.length
    
    for (let i = 0; i < xs.length; i++) {
        regressionSquaredError += Math.pow(ys[i] - yPrediction(xs[i]), 2)
        totalSquaredError += Math.pow(ys[i] - yMean, 2)
    }
    
    return 1 - (regressionSquaredError / totalSquaredError);
}

function get_regression_line_string(info: RegressionInfo, correlation: number) : string {
    return `y = ${info.slope.toFixed(3)}x + ${info.intercept.toFixed(3)}<br>R?? = ${correlation.toFixed(3)}`;
}

function distance_from_regression_line(line_info: RegressionInfo, x: number, y: number) : number {
    return (-1*line_info.slope*x + y - line_info.intercept)/Math.sqrt(1+Math.pow(line_info.slope, 2));
}

function setupDiceTable() {
    const table = document.getElementById("diceTable") as HTMLTableElement;
    let headerTr = document.createElement("tr");
    headerTr.innerHTML = "<th>Character</th><th>Dice</th>";
    table.appendChild(headerTr);
    for (const [character, data] of DICE_DATA) {
        let tr = document.createElement("tr");
        tr.innerHTML = `<td>${character}</td><td>${get_moves_and_coin_string(data, true)}</td>`;
        table.appendChild(tr);
    }
}

function setupNoCoinsChart() {
    let xs: number[] = [];
    let ys: number[] = [];
    let texts: string[] = [];
    for (const [character, data] of DICE_DATA) {
        if (data.coins.length === 0) {
            xs.push(data.moves.reduce((a, b) => a + b));
            ys.push(standard_deviation(data.moves));
            texts.push(character + "<br>Dice: " + get_moves_and_coin_string(data));
        }
    }
    const scatterData = {
        x: xs,
        y: ys,
        mode: "markers",
        text: texts,
        hovertemplate: "(%{x}, %{y:.2f})<br>%{text}<extra></extra>" // the "<extra></extra>" at the end suppresses
                                                                    // the plot name, which is meaningless for us
    };
    const regression_line_info = calculate_regression_line(xs, ys);
    const regression_line = make_plotly_regression_line(xs, ys);
    const correlation = calculate_regression_line_correlation(xs, ys, regression_line_info);
    const layout = {
        title: "Dice with no coins",
        xaxis: {
            title: "Total of numbers on dice block",
        },
        yaxis: {
            title: "Standard deviation of dice block values",
        },
        annotations: [
            {
                xref: "x",
                x: 19.5,
                y: 1.75,
                text: get_regression_line_string(regression_line_info, correlation),
                font: {
                    family: 'Arial',
                    size: 14,
                    color: "#222222"
                },
                showarrow: false
            }
        ],
        showlegend: false
    }
    Plotly.newPlot('noCoinsChart', [scatterData, regression_line], layout, {responsive: true});
}

function setupCoinsChart() {
    let xs: number[] = [];
    let ys: number[] = [];
    let sizes: number[] = [];
    let texts: string[] = [];
    for (const [character, data] of DICE_DATA) {
        if (data.coins.length > 0) {
            xs.push(data.moves.reduce((a, b) => a + b));
            ys.push(data.coins.reduce((a, b) => a + b));
            // Use the square root so the area of the circle is proportional to the standard deviation
            sizes.push(Math.sqrt(standard_deviation(data.moves)));
            texts.push(character + "<br>Dice: " + get_moves_and_coin_string(data));
        }
    }
    let scatterData = {
        x: xs,
        y: ys,
        mode: "markers",
        text: texts,
        hovertemplate: "(%{x}, %{y})<br>%{text}<extra></extra>", // the "<extra></extra>" at the end suppresses
                                                                 // the plot name, which is meaningless for us
        marker: {
            size: sizes.map(size => size * 7)
        }
    };
    const regression_line_info = calculate_regression_line(xs, ys);
    const regression_line = make_plotly_regression_line(xs, ys);
    const correlation = calculate_regression_line_correlation(xs, ys, regression_line_info);
    const layout = {
        title: "Dice with coins",
        xaxis: {
            title: "Total of numbers on dice block",
        },
        yaxis: {
            title: "Total of coins on dice block",
        },
        annotations: [
            {
                xref: "x",
                x: 26,
                y: -2,
                text: get_regression_line_string(regression_line_info, correlation),
                font: {
                    family: 'Arial',
                    size: 14,
                    color: "#222222"
                },
                showarrow: false
            }
        ],
        showlegend: false
    }
    Plotly.newPlot('coinsChart', [scatterData, regression_line], layout, {responsive: true});
}

function setupCoinsByStandardDeviationChart() {
    let standard_deviations = new Map<string, number>();
    let original_xs: number[] = [];
    let original_ys: number[] = [];
    for (const [character, data] of DICE_DATA) {
        if (data.coins.length > 0) {
            original_xs.push(data.moves.reduce((a, b) => a + b));
            original_ys.push(data.coins.reduce((a, b) => a + b));
            standard_deviations.set(character, standard_deviation(data.moves));
        }
    }
    const original_regression_line_info = calculate_regression_line(original_xs, original_ys);
    let xs: number[] = [];
    let ys: number[] = [];
    let texts: string[] = [];
    for (const [character, data] of DICE_DATA) {
        if (data.coins.length > 0) {
            xs.push(standard_deviation(data.moves));
            let x = data.moves.reduce((a, b) => a + b);
            let y = data.coins.reduce((a, b) => a + b);
            ys.push(distance_from_regression_line(original_regression_line_info, x, y));
            texts.push(character + "<br>Dice: " + get_moves_and_coin_string(data));
        }
    }
    let scatterData = {
        x: xs,
        y: ys,
        mode: "markers",
        text: texts,
        hovertemplate: "(%{x:.2f}, %{y:.2f})<br>%{text}<extra></extra>", // the "<extra></extra>" at the end suppresses
                                                                         // the plot name, which is meaningless for us
    };
    const regression_line_info = calculate_regression_line(xs, ys);
    const regression_line = make_plotly_regression_line(xs, ys);
    const correlation = calculate_regression_line_correlation(xs, ys, regression_line_info);
    const layout = {
        title: "Dice with coins by standard deviation",
        xaxis: {
            title: "Standard deviation of numbers on dice block",
        },
        yaxis: {
            title: "\"goodness\" (distance from point to line)",
        },
        annotations: [
            {
                xref: "x",
                x: 4,
                y: 2,
                text: get_regression_line_string(regression_line_info, correlation),
                font: {
                    family: 'Arial',
                    size: 14,
                    color: "#222222"
                },
                showarrow: false
            }
        ],
        showlegend: false
    }
    Plotly.newPlot('coinsByStandardDeviationChart', [scatterData, regression_line], layout, {responsive: true});
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

function substituteMovesAndCoinsStringSpans() {
    let spans = document.getElementsByClassName("diceBlock");
    for (let span of Array.from(spans)) {
        const name = Array.from(span.classList).filter(className => className.startsWith("diceBlock-"))[0].substring("diceBlock-".length).replace("_", " ");
        const use_parens = !span.classList.contains("diceBlock-noparen");
        if (!DICE_DATA_MAP.has(name)) {
            console.error("No dice block data for " + name);
        }
        span.innerHTML = `${use_parens ? '(' : ''}${get_moves_and_coin_string(DICE_DATA_MAP.get(name), true)}${use_parens ? ')' : ''}`;
    }
}

(function() {
    validateData();
    setupDiceTable();
    setupNoCoinsChart();
    setupCoinsChart();
    setupCoinsByStandardDeviationChart();
    substituteMovesAndCoinsStringSpans();
})();

