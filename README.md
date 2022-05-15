# mario-party-dice

This is an analysis of which dice blocks are best in Super Mario Party. [Here are the results](https://gregstoll.com/~gregstoll/mariopartydice/) - this repository contains the source files used to do the analysis as well as the source for the linked website.

The initial analysis was done in Excel (see [dice-analysis.xlsx](https://github.com/gregstoll/mario-party-dice/blob/main/dice-analysis.xlsx)). That was easy to iterate on quickly, but once I had results I wanted to write up I used the [plotly](https://plotly.com/javascript/) library for Javascript. I ended up writing Javascript functions to calculate regression lines and such. I also single-sourced all the dice values in the javascript, and added a utility in Javascript to look for tags that look like `<span class="diceBlock diceBlock-Bowser"></span>` and fill in the text with Bowser's dice values.

The HTML and TypeScript are compiled together with webpack.
