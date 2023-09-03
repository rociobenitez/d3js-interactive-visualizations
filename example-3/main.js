// Constants
const width = 800
const height = 400
const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 70
}

const width_chart2 = width
const height_chart2 = 250
const margin_chart2 = {
    top: 10,
    right: margin.right,
    bottom: 30,
    left: margin.left
}

const graphWidth = width - margin.left - margin.right
const graphHeight = height - margin.top - margin.bottom

const graphWidth2 = width_chart2 - margin_chart2.left - margin_chart2.right
const graphHeight2 = height_chart2 - margin_chart2.top - margin_chart2.bottom

// Create the tooltip container
const tooltip = d3.select('#tooltip');

// Define the svg 1
const svg = d3.select("#chart")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width)
    .attr("height", height)

// Define the svg 2
const svg2 = d3.select("#chart-2")
    .append("svg")
    .attr("id", "svg")
    .attr("width", width_chart2)
    .attr("height", height_chart2)

// Define the graph 1
const elementGroup = svg.append("g")
    .attr("id", "elementGroup")
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr("transform", `translate(${margin.left}, ${margin.top})`)

// Define the graph 2
const elementGroup2 = svg2.append("g")
    .attr("id", "elementGroup2")
    .attr('width', graphWidth2)
    .attr('height', graphHeight2)
    .attr("transform", `translate(${margin_chart2.left}, ${margin_chart2.top})`)

// Define axes
const axisGroup = svg.append("g")
    .attr("id", "axisGroup")

const xAxisGroup = axisGroup.append("g")
    .attr("id", "xAxisGroup")
    .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)

const yAxisGroup = axisGroup.append("g")
    .attr("id", "yAxisGroup")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

const axisGroup2 = svg2.append("g")
    .attr("id", "axisGroup2")

const xAxisGroup2 = axisGroup2.append("g")
    .attr("id", "xAxisGroup2")
    .attr('transform', `translate(${margin_chart2.left}, ${height_chart2 - margin_chart2.bottom})`)

const yAxisGroup2 = axisGroup2.append("g")
    .attr("id", "yAxisGroup2")
    .attr('transform', `translate(${margin_chart2.left}, ${margin_chart2.top})`)

// Define the scale
let x = d3.scaleTime()
    .range([0, graphWidth])

let y = d3.scaleLinear()
    .range([graphHeight, 0])

let y2 = d3.scaleLinear()
    .range([graphHeight2, 0])

// Declaration of a variable to store the original data
let originalData;

// Function to parse dates in the "day/month/year" format
let parseDate = d3.timeParse("%d/%m/%Y");

d3.csv("ibex.csv").then(data => {

    originalData = data

    data.map( d => {
        d.close = +d.close
        d.volume = +d.volume
        d.date = parseDate(d.date)
    })

    // Scales domain
    x.domain(d3.extent(data, d => d.date))
    y.domain(d3.extent(data, d => d.close))
    y2.domain(d3.extent(data, d => d.volume))

    // Create axes
    const xAxis = d3.axisBottom().scale(x)
    const yAxis = d3.axisLeft().scale(y)
        .tickSizeInner(-width)

    const xAxis2 = d3.axisBottom().scale(x)
    const yAxis2 = d3.axisLeft().scale(y2)
        .tickFormat(d3.formatPrefix(".0", 1e6))
        .tickSizeInner(-width)

    // Add axes to the chart - call axes
    xAxisGroup.call(xAxis)
    xAxisGroup.selectAll('text')
        .style('font-size', '11px')
        .style('font-family', "'Red Hat Mono', monospace")
        .style('color', '#546e7a')
    xAxisGroup.selectAll('line')
        .style('stroke', '#37474f')
    xAxisGroup.select('.domain')
        .style('stroke', '#37474f')

    yAxisGroup.call(yAxis)
    yAxisGroup.select('.domain').remove()
    yAxisGroup.selectAll('text')
        .style('font-size', '11px')
        .style('font-family', "'Red Hat Mono', monospace")
        .style('color', '#546e7a')
    yAxisGroup.selectAll('line')
        .style('stroke', '#455a64')
        .style('stroke-width', 0.2)
        
    xAxisGroup2.call(xAxis2)
    xAxisGroup2.selectAll('text')
        .style('font-size', '11px')
        .style('font-family', "'Red Hat Mono', monospace")
        .style('color', '#546e7a')
    xAxisGroup2.selectAll('line')
        .style('stroke', '#37474f')
    xAxisGroup2.select('.domain')
        .style('stroke', '#37474f')

    yAxisGroup2.call(yAxis2)
    yAxisGroup2.select('.domain').remove()
    yAxisGroup2.selectAll('text')
        .style('font-size', '11px')
        .style('font-family', "'Red Hat Mono', monospace")
        .style('color', '#546e7a')
    yAxisGroup2.selectAll('line')
        .style('stroke', '#455a64')
        .style('stroke-width', 0.2)

    // Create a line generator with x and y coordinates defined
    var line = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.close))

    // Append a path element to the elementGroup, binding data, and setting attributes for the line
    elementGroup.append("path")
        .data([data])
        .attr("class", "line")
        .attr("d", line)

    // Line styles
    elementGroup.selectAll(".line")
        .style("fill", "none")
        .style("stroke", "#b0bec5")
        .style("stroke-width", "2px");

    // Etiquetas de los ejes
    elementGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('fill', '#78909c')
        .style('font-family', "'Red Hat Mono', monospace")
        .text("Valor de Cierre")

    elementGroup2.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height_chart2 / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style('fill', '#78909c')
        .style('font-family', "'Red Hat Mono', monospace")
        .text("Volumen")

    // Join the data to bars - create bars
    const bars = elementGroup2.selectAll('.bar')
        .data(data)

    // Append the enter selection to the DOM
    bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d => x(d.date))
        .attr('y', d => y2(d.volume))
        .attr('width', 2)
        .attr('height', d => graphHeight2 - y2(d.volume))
        .attr('fill', '#b0bec5')  
    
    // Add events
    elementGroup.selectAll('path')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
})


// Event handlers
const handleMouseOver = (d, i, n) => {
    d = originalData
    d3.select(n[i])
        .transition().duration(200)
        .attr('stroke-opacity', 0.7)

    // Show the tooltip in the desired position
    tooltip
        .style('display', 'block')
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY + 'px')
        .html(`
            <b>Open:</b> ${d[i].open}<br>
            <b>Close:</b> ${d[i].close}<br>
            <b>High:</b> ${d[i].high}<br>
            <b>Low:</b> ${d[i].low}<br>
        `);
}

const handleMouseOut = (d, i, n) => {
    const line = d3.select(n[i])
        .transition().duration(200)
        .attr('stroke-opacity', 1)
        
    tooltip.style('display', 'none')
    // Oculta los marcadores
    markerGroup.style('display', 'none');
}
