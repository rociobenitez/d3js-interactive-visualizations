/*

Represent the bar graph (vertical or horizontal) and
connect them to the slider so that each year represents the distribution of
world championships for each team. The data must be processed.

*/

// Constants - chart dimensions and margins
const width = 700
const height = 400
const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 80
}

const graphWidth = width - margin.left - margin.right
const graphHeight = height - margin.top - margin.bottom

let years;
let winners;
let originalData;
let maxRepeats;

// Define the svg - Create the svg canvas
const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)

// Define the graph
const elementGroup = svg.append("g")
    .attr("id", "elementGroup")
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Define axes
const axisGroup = svg.append("g")
    .attr("id", "axisGroup")

const xAxisGroup = axisGroup.append("g")
    .attr("id", "xAxisGroup")
    .attr('transform', `translate(${margin.left}, ${graphHeight + margin.top})`)

const yAxisGroup = axisGroup.append("g")
    .attr("id", "yAxisGroup")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Define scales
const x = d3.scaleLinear()  // horizontal position
    .range([0, graphWidth])
    
const y = d3.scaleBand()  // vertical position
    .range([0, graphHeight])
    .paddingInner(0.2)

// Create axes
const xAxis = d3.axisBottom().scale(x)
    .ticks(maxRepeats)
    .tickSizeInner(-width)
    .tickSizeOuter(0) 
    .tickPadding(10)
const yAxis = d3.axisLeft().scale(y)

// Data call
d3.csv('WorldCup.csv').then(data => {
    
    // Convert values. Get the years and unique winners
    let grouped = d3.group(data, d => d.Winner)
    let nested = Array.from(grouped, ([key, values]) => ({key, values}))

    originalData = data;
    nestedData = nested;

    years = data.map(d => d.Year);
    winners = data.map(d => d.Winner);

    // Calculate the maximum value of the x-axis
    maxRepeats = d3.rollups(
        winners,
        v => v.length,
        d => d
    )
    .reduce((max, [, value]) => Math.max(max, value), 0);

    // Scales (domains) - constants
    x.domain([0, maxRepeats])
    y.domain(calculate_winners(winners))
    xAxis.ticks(maxRepeats)

    // Update(data)
    update(winners) 
    slider()  
})

function calculate_winners(data) {
    return [...new Set(data)]
}

// Update - function that updates the graph
function update(data) {    

    // Add axes to the chart
    xAxisGroup.call(xAxis)
    xAxisGroup.select('.domain')
        .style('stroke', '#808b96')
    xAxisGroup.selectAll('text')
        .style('font-size', '11px')
        .style('font-family', 'Space Mono, monospace')
        .style('color', '#5d6d7e')
    xAxisGroup.selectAll('line')
        .style('stroke', '#2471a3')
    xAxisGroup.selectAll('.tick line')  // Set the color of the reference lines
        .style('stroke', '#d5d8dc') 
        .style('stroke-width', 0.25) 

    yAxisGroup.call(yAxis)
    yAxisGroup.select('.domain').remove()
    yAxisGroup.selectAll('text')
        .style('font-size', '11px')
        .style('font-family', 'Space Mono, monospace')
        .style('color', '#5d6d7e')
    xAxisGroup.selectAll('.tick line')  // Set the color of the reference lines
        .style('stroke', '#d5d8dc') 
    
    // Join updated data to elements
    const bars = elementGroup.selectAll('rect')
        .data(data)

    // Update current shapes in the dom
    bars.attr('class', d => `${d} bar` )
        .attr('x', 0)
        .attr('y', d => y(d))
        .attr('height', y.bandwidth() ) 
        .attr('width', d => x(data.filter(item => item === d).length))
        .attr('fill', '#a9cce3')

    // Append the enter selection to the dom
    bars.enter()
        .append('rect')
        .attr('class', d => `${d} bar` )
        .attr('x', 0)
        .attr('y', d => y(d))
        .attr('height', y.bandwidth() ) 
        .attr('width', d => x(data.filter(item => item === d).length))
        .attr('fill', '#a9cce3')

    // Remove unwanted shapes using the exit selection
    bars.exit().remove()

}

// Treat data:
function filterDataByYear(year) { 
    filteredData = originalData.filter(d => +d.Year <= year);
    update(filteredData.map(d => d.Winner))
}

// CHART END

// Slider:
function slider() {    
    // This function generates a slider:
    var sliderTime = d3
        .sliderBottom()
        .min(d3.min(years))  // range years
        .max(d3.max(years))
        .step(4)  // how often the slider increases (4 years)
        .width(620)  // slider width in px
        .ticks(years.length)  
        .default(years[years.length -1])  // marker start point
        .on('onchange', val => {
            // filter the data according to the value of the slider and then update the graph with update
            filterDataByYear(val)
        });

        // slider container
        var gTime = d3 
            .select('div#slider-time') 
            .append('svg')
            .attr('width', width * 0.8)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');

        gTime.call(sliderTime);  // invoke the slider on the container

        d3.select('p#value-time').text(sliderTime.value());  // update the year that is represented
}