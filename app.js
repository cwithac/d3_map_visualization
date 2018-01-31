//Gather Data
d3.queue()
  .defer(d3.json, '//unpkg.com/world-atlas@1.1.4/world/50m.json')
  .defer(d3.csv, './country_data.csv', function(row) {
    return {
      country: row.country,
      countryCode: row.countryCode,
      population: +row.population,
      medianAge: +row.medianAge,
      fertilityRate: +row.fertilityRate,
      populationDensity: +row.population / +row.landArea
    }
  })
  .await(function(error, mapData, populationData) {
    if (error) throw error;

    const geoData = topojson.feature(mapData, mapData.objects.countries).features;

    populationData.forEach(row => {
      const countries = geoData.filter(d => d.id === row.countryCode);
      countries.forEach(country => country.properties = row);
    });

//Generate Map
    const width = 960;
    const height = 600;

    const projection = d3.geoMercator();

    const path = d3.geoPath()
                    .projection(projection);

    d3.select('svg')
        .attr('width', width)
        .attr('height', height)
      .selectAll('.country')
      .data(geoData)
      .enter()
        .append('path')
        .classed('country', true)
        .attr('d', path);

  });
