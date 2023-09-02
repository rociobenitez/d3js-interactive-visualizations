/*

En este caso hay que combinar 2 gráficas: Representar la edad de Leonardo
Di Caprio en una gráfica de línea en una y la edad de sus ex en una gráfica de
barras, usando la misma escala, para poder comparar ambos valores

*/

// Constants
const width = 800
const height = 500
const margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40
}

const graphWidth = width - margin.left - margin.right
const graphHeight = height - margin.top - margin.bottom

const diCaprioBirthYear = 1974;
const age = function(year) { return year - diCaprioBirthYear}
const today = new Date().getFullYear()
const ageToday = age(today)

// Create the tooltip container
const tooltip = d3.select('#tooltip');

// Create an array of objects that represent DiCaprio's age in each year from his birth year to the current year.
const dataDiCaprio = [];
for (let year = diCaprioBirthYear; year <= today; year++) {
  dataDiCaprio.push({ year: year, age: age(year) });
}

// Define the svg
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
    .attr('transform', `translate(${margin.left}, ${height - margin.bottom})`)

const yAxisGroup = axisGroup.append("g")
    .attr("id", "yAxisGroup")
    .attr('transform', `translate(${margin.left}, ${margin.top})`)

// Define the scale
let x = d3.scaleBand()
    .range([0, graphWidth])
    .paddingInner(0.2)

let y = d3.scaleLinear()
    .range([graphHeight, 0])

let originalData;

// Data call
d3.csv("data.csv").then(data => {

    originalData = data;

    data.map(d => {
        d.year = +d.year
        d.age = +d.age
    })

    const maxYear = d3.max(data.map(d => d.year))
    const minYear = d3.min(data.map(d => d.year))

    // Scale domain
    x.domain(data.map(d => d.year))
    y.domain([0, ageToday])

    // Create axes
    const xAxis = d3.axisBottom().scale(x)
    const yAxis = d3.axisLeft().scale(y)
        .ticks(10)
        .tickSizeInner(-width)
        .tickSizeOuter(0) 
        .tickPadding(10)

    // Add axes to the chart - call axes
    xAxisGroup.call(xAxis)
    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')  // Rotate labels -40 degrees
        .style('text-anchor', 'end')       // Aligns the text to the end of the label
        .style('font-size', '11px')
        .style('font-family', 'poppins, sans-serif')
        .style('color', '#808b96')
    xAxisGroup.selectAll('line')
        .style('stroke', '#808b96')
    xAxisGroup.select('.domain').remove()

    yAxisGroup.call(yAxis)
    yAxisGroup.selectAll('text')
        .style('font-size', '11px')
        .style('font-family', 'poppins, sans-serif')
        .style('color', '#808b96')
    yAxisGroup.selectAll('line')
        .style('stroke', '#808b96')
    yAxisGroup.select('.domain')
        .style('stroke', '#808b96')
    yAxisGroup.selectAll('.tick line')  // Set the color of the reference lines
        .style('stroke', '#d5d8dc') 
        .style('stroke-width', 0.5) 
    
    // d3-scale-chromatic   https://github.com/d3/d3-scale-chromatic
    const colorScale = d3.scaleOrdinal()
        .domain(data.map(d => d.name)) // Set the domain as the names of people
        .range(d3.schemeTableau10); // default palette

    // Join the data to bars - create bars
    const bars = elementGroup.selectAll('.bar')
        .data(data)

    // Append the enter selection to the DOM
    bars.enter()
        .append('rect')
        .attr('class', d => `${d.name} bar`)
        .attr('width', x.bandwidth())
        .attr('height', d => graphHeight - y(d.age))
        .attr('fill', '#A9CCE3')
        .attr('x', d => x(d.year))
        .attr('y', d => y(d.age))
        .attr('fill', d => colorScale(d.name));

    // Creates an array of years from the first recorded year to the current year
    const years = Array.from({ length: today - minYear + 1 }, (_, i) => minYear + i);

    const line = d3.line()
        .x(d => x(d))
        .y(d => y(age(d)))
        .defined(d => d >= minYear && d <= maxYear)

    // Line path element
    const path = elementGroup.append('path').datum(years)
    
    path.attr('class', 'line')
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', '#2c3e50')
        .attr('stroke-width', 1)

    // Create legend
    const legendGroup = elementGroup.append('g')
        .attr('transform', `translate(${graphWidth / 5}, ${graphHeight / 4})`); 
    legendGroup.append('text')
        .attr('x', 30) 
        .attr('y', 10) 
        .text('Edad de Leonardo Di Caprio') 
        .attr('fill', '#808b96') 
        .style('font-size', '10px'); 

    // Add events
    elementGroup.selectAll('rect')
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut)
})

// Event handlers
const handleMouseOver = (d, i, n) => {
    d3.select(n[i])
        .transition().duration(200)
        .attr('fill-opacity', 0.5)

    // Get the data you want to display in the tooltip
    const diferenceYear = age(d.year) - d.age
    const dataToShow = `${d.name}, ${d.age} años. <br> ${diferenceYear} años de diferencia`; 
    
    // Show the tooltip in the desired position
    tooltip
        .style('display', 'block')
        .style('left', d3.event.pageX + 'px')
        .style('top', d3.event.pageY + 'px')
        .html(`${dataToShow}`);
}

const handleMouseOut = (d, i, n) => {
    d3.select(n[i])
        .transition().duration(200)
        .attr('fill-opacity', 1)
        
    tooltip.style('display', 'none')
}