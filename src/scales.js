const getXScale = (dataset, w, padding) => {
  const xScale = d3
    .scaleTime()
    .domain([
      new Date(
        d3.min(dataset, ({ year }) => {
          return `${year}-01-01`
        })
      ),
      new Date(
        d3.max(dataset, ({ year }) => {
          return `${year}-1-02`
        })
      ),
    ])
    .range([padding, w - padding])
  return xScale
}
const getYScale = (h, padding) => {
  const yScale = d3
    .scaleBand()
    .domain([11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
    .range([h - padding, padding])
  return yScale
}

const getAxes = (yScale, padding, xScale, h, svg, months) => {
  // X AXIS

  const xAxis = d3.axisBottom(xScale)
  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis)

  // Y AXIS
  // const timeFormat = d3.timeFormat('%B')

  const yAxis = d3.axisLeft(yScale).tickFormat((d) => {
    return months[d]
  })
  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis)

  // .ticks(12)
}

export { getAxes, getXScale, getYScale }
