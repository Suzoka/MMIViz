fetch('data.json').then(function (response) {
    response.json().then(function (data) {
        let gagnants = [];
        data.forEach((element, iAnnee) => {
            let gagnant = [];
            element.result.forEach((univ) => {
                if (univ.charts[0] == element.winner[0]) {
                    gagnant.push(univ);
                }
            })
            gagnants.push(gagnant);
        });
        console.log(gagnants);
        d3.select('svg').style('background-color', 'rgba(110, 98, 157, 0.55)');

        const barre = d3.select('g.graph').selectAll('g')
            .data(gagnants)
            .join('g')
            .attr('id', (dataG, i) => 2015 + i)
            .attr('transform', (dataG, i) => `translate(${(5 + (300 / 9) * i)}, 0), scale(1, -1)`)
            .selectAll('g')
            .data(dataG => dataG)
            .join('g')
            .attr('class', dataU => dataU.university.replaceAll(' ', '').toLowerCase())
            .attr('transform', (dataU, i, dataG) => `translate(${((300 / 9 - 5) / dataG.length) * i}, 0)`);


        barre.append('rect')
            .attr('width', (dataU, i, dataG) => (300 / 9 - 5) / dataG.length)
            .attr('height', dataU => dataU.charts[0] * (160 / 3))
            .attr('fill', dataU => dataU.color);

        barre.append('circle')
            .attr('cx', (dataU, i, dataG) => (300 / 9 - 5) / dataG.length / 2)
            .attr('cy', dataU => dataU.charts[0] * (160 / 3))
            .attr('r', (dataU, i, dataG) => (300 / 9 - 5) / dataG.length / 2)
            .attr('fill', 'white');

        barre.on('mouseenter', function (event, dataU) {
            barre.style('opacity', 0.2);
            d3.selectAll("g." + dataU.university.replaceAll(' ', '').toLowerCase()).style('opacity', 1);
        });

        barre.on('mouseleave', function (event, dataU) {
            barre.style('opacity', 1);
        });

    });
});