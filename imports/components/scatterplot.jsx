import ReactFauxDOM from "react-faux-dom";
import { Component } from "react";
import { DateTime } from "luxon";
import { range } from "lodash";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { axisBottom, axisLeft } from "d3-axis";
import { transition } from "d3-transition"; // eslint-disable-line

import { DATETIME_FORMAT } from "../utils/constants";

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

const tickHoursFull = range(0, 24);
const tickHoursMobile = range(0, 24, 2);

class Scatterplot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenWidth: document.documentElement.clientWidth
    };
    this.onResize = () =>
      this.setState({ screenWidth: document.documentElement.clientWidth });
    window.addEventListener("resize", this.onResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize);
  }

  render() {
    const { notes, oldest, newest } = this.props;
    if (!notes.length) return null;

    let { screenWidth } = this.state;
    screenWidth = screenWidth > 1200 ? screenWidth * 0.6 : screenWidth * 0.95;
    const tickHours = screenWidth > 675 ? tickHoursFull : tickHoursMobile;
    const dotRadius = screenWidth > 675 ? 8 : 4;
    const tickMargin =
      screenWidth > 600 ? screenWidth * 0.04 : screenWidth * 0.08;

    const div = ReactFauxDOM.createElement("div");
    div.setAttribute("id", "chart");

    const margin = {
      top: screenWidth * 0.02,
      right: screenWidth * 0.02,
      bottom: tickMargin,
      left: tickMargin
    };
    const width = screenWidth - margin.left - margin.right;
    const height = Math.floor(screenWidth / 2) - margin.top - margin.bottom;

    const colorScale = scaleLinear()
      .domain([oldest, newest])
      .range([0, 50]);

    const x = scaleLinear()
      .domain([0, 1439]) // minutes of the day
      .range([0, width]);

    const xAxis = scaleLinear()
      .domain([0, 24]) // hours of the day
      .range([0, width]);

    const y = scaleLinear()
      .domain([1, 7]) // days of the week
      .range([height, 0]);

    const chart = select(div)
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "chart");

    const main = chart
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("width", width)
      .attr("height", height)
      .attr("class", "main");

    const tip = select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    main
      .append("g")
      .attr("transform", `translate(0,${height})`)
      .attr("class", "main axis date")
      .call(
        axisBottom(xAxis)
          .ticks(tickHours.length)
          .tickValues(tickHours)
      );

    main
      .append("g")
      .attr("transform", "translate(0,0)")
      .attr("class", "main axis date")
      .call(
        axisLeft(y)
          .ticks(7)
          .tickFormat(d => days[d])
      );

    main
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${height})`)
      .call(
        axisBottom(xAxis)
          .ticks(tickHoursFull.length)
          .tickSize(-height)
          .tickFormat("")
      );

    main
      .append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0,0)")
      .call(
        axisLeft(y)
          .ticks(7)
          .tickSize(-width)
          .tickFormat("")
      );

    const g = main.append("g");

    g.selectAll("scatter-dots")
      .data(notes)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.time))
      .attr("cy", d => y(d.weekday))
      .attr("r", dotRadius)
      .attr("fill", d => `hsl(356, 100%, ${colorScale(d.dateTime)}%)`)
      .on("mouseover", function(d) {
        const dateTimeReadable = DateTime.fromJSDate(d.dateTime).toFormat(
          DATETIME_FORMAT
        );
        const e = () => require("d3-selection").event; // eslint-disable-line
        tip
          .transition()
          .duration(200)
          .style("opacity", 0.9);
        tip
          .html(dateTimeReadable)
          .style("left", `${e().pageX}px`)
          .style("top", `${e().pageY - 32}px`);
      })
      .on("mouseout", function() {
        tip
          .transition()
          .duration(300)
          .style("opacity", 0);
      });

    return div.toReact();
  }
}

export default Scatterplot;
