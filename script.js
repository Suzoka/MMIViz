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
        const svg = d3.select('svg');
        svg.style('background-color', 'rgba(110, 98, 157, 0.55)');

        svg.selectAll('g')
            .data(gagnants)
            .join('g')
            .attr('id', (dataG, i) => 2015 + i)
            .attr('transform', (dataG, i) => `translate(${(5 + (300 / 9) * i)}, 0), scale(1, -1)`)
                .selectAll('g')
                .data (dataG => dataG)
                .join('g')
                .attr('transform', (dataU, i, dataG) => `translate(${((300/9 - 5)/dataG.length) * i}, 0)`)
                    .append('rect')
                    .attr('width', (dataU, i, dataG) => (300/9 - 5)/dataG.length)
                    .attr('height', dataU => dataU.charts[0]*35)
                    .attr('fill', dataU => dataU.color)

  


    });
});