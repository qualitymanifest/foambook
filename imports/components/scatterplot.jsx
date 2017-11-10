import React, { Component } from "react";
import ReactFauxDOM from "react-faux-dom";
import * as d3 from "d3";

// https://mikewilliamson.wordpress.com/2016/06/03/d3-and-react-3-ways/

const days = {
	1: "Mo",
	2: "Tu",
	3: "We",
	4: "Th",
	5: "Fr",
	6: "Sa",
	7: "Su"
};

const tickHours = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];


class Scatterplot extends Component {

	render() {
		if (!this.props.notes.length) return null;
		
		let screenWidth = this.props.uiState.screenWidth;
		screenWidth = screenWidth > 1200 ? screenWidth * 0.6 : screenWidth * 0.95;
		const dotRadius = screenWidth > 675 ? 8 : 3;
		const tickMargin = screenWidth > 600 ? screenWidth * 0.04 : screenWidth * 0.08;
		const data = this.props.notes;

		const div = ReactFauxDOM.createElement("div");
		div.setAttribute("id", "chart");
/* ---------------------------------------------------- */
/* ---------------------------------------------------- */

		const margin = {
			top: screenWidth * 0.02,
			right: screenWidth * 0.02,
			bottom: tickMargin,
			left: tickMargin };
		const width = screenWidth - margin.left - margin.right;
		const height = (Math.floor(screenWidth / 2)) - margin.top - margin.bottom;

		const x = d3.scaleLinear()
			.domain([0, 1439])
			.range([0, width]);

		const xAxis = d3.scaleLinear()
			.domain([0, 24])
			.range([0, width]);

		const y = d3.scaleLinear()
			.domain([1, 7])
			.range([height, 0]);

		const chart = d3.select(div)
			.append("svg")
			.attr("width", width + margin.right + margin.left)
			.attr("height", height + margin.top + margin.bottom)
			.attr("class", "chart");

		const main = chart.append("g")
			.attr("transform", `translate(${margin.left},${margin.top})`)
			.attr("width", width)
			.attr("height", height)
			.attr("class", "main");

		main.append("g")
			.attr("transform", `translate(0,${height})`)
			.attr("class", "main axis date")
			.call(d3.axisBottom(xAxis).ticks(11).tickValues(tickHours));

		main.append("g")
			.attr("transform", "translate(0,0)")
			.attr("class", "main axis date")
			.call(d3.axisLeft(y).ticks(7).tickFormat(d => days[d]));

		const g = main.append("g");

		g.selectAll("scatter-dots")
			.data(data)
			.enter().append("circle")
				.attr("cx", d => x(d.time))
				.attr("cy", d => y(d.weekday))
				.attr("r", dotRadius)
				.append("title")
					.text(d => d.dateTimeReadable);

/* ---------------------------------------------------- */
/* ---------------------------------------------------- */

		return div.toReact();
	}
}

export default Scatterplot;