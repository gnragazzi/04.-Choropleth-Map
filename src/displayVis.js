import fetchData from './fetchData.js'
import { getAxes, getXScale, getYScale } from './scales.js'
const container = document.querySelector('.vis-container')
const educationDataURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const countyDataURL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

const displayVis = async () => {
  const educationData = await fetchData(educationDataURL)
  const countyData = await fetchData(countyDataURL)
  const h = container.getBoundingClientRect().height
  const w = container.getBoundingClientRect().width
  const padding = 70
  // TOOLTIP
  const tooltip = d3
    .select('body')
    .append('div')
    .attr('class', 'tooltip')
    .attr('id', 'tooltip')
    .text('this is a tooltip')

  const svg = d3
    .select(container)
    .append('svg')
    .attr('height', h)
    .attr('width', w)
    .style('border', '0.3rem solid var(--myPrim)')
    .style('border-radius', '0.3rem')

  const eduMin = d3.min(educationData, ({ bachelorsOrHigher }) => {
    return bachelorsOrHigher
  })

  const eduMax = d3.max(educationData, ({ bachelorsOrHigher }) => {
    return bachelorsOrHigher
  })

  const path = d3.geoPath()
  const colorScale = d3
    .scaleLinear()
    .domain([eduMin, eduMax])
    .range(['#E2F3E8', '#245634'])
  svg
    .selectAll('path')
    .data(topojson.feature(countyData, countyData.objects.counties).features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('class', 'county')
    .attr('data-fips', ({ id }) => {
      return id
    })
    .attr('data-education', ({ id }) => {
      return educationData.find((item) => item.fips === id)['bachelorsOrHigher']
    })
    .attr('data-location', ({ id }) => {
      const { area_name, state } = educationData.find(
        (item) => item.fips === id
      )
      return `${area_name}, ${state}`
    })
    .on('mouseover', (e) => {
      e.target.style.stroke = '#7389ae'
      const element = e.target.getBoundingClientRect()
      const tooltip = document.getElementById('tooltip')
      tooltip.style.left = `${element.right + 5}px`
      tooltip.style.top = `${element.bottom}px`
      tooltip.classList.add('active')
      tooltip.dataset.education = e.target.dataset.education
      const location = e.target.dataset.location

      tooltip.innerHTML = `<p>${location}:  ${e.target.dataset.education}%</p>`
    })
    .on('mouseout', (e) => {
      e.target.style.stroke = ''
      const tooltip = document.getElementById('tooltip')
      tooltip.classList.remove('active')
    })
    .attr('fill', ({ id }) => {
      const degree = educationData.find((item) => item.fips === id)[
        'bachelorsOrHigher'
      ]
      return colorScale(degree)
    })

  const legendDomain = [0, 10, 20, 30, 40, 50, 60, 70, 80]
  const legend = d3
    .select(container)
    .append('svg')
    .attr('id', 'legend')
    .attr('height', 30)
    .attr('width', 250)
  console.log(eduMin, eduMax)
  const legendScale = d3.scaleBand().domain(legendDomain).range([0, 250])
  const legendAxis = d3.axisBottom(legendScale).tickFormat((d) => `${d}%`)
  legend.append('g').attr('transform', `translate(0, 10)`).call(legendAxis)

  legend
    .selectAll('rect')
    .data(legendDomain)
    .enter()
    .append('rect')
    .attr('height', 10)
    .attr('width', 250 / legendDomain.length)
    .attr('x', (d) => legendScale(d))
    .attr('fill', (d) => {
      return colorScale(d)
    })
}
export default displayVis
