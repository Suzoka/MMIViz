fetch('data.json').then(function (response) {
    response.json().then(function (data) {
        let gagnants = getGagnants(data, document.querySelector('select[name="trophy"]').value);
        graphique(gagnants);

        document.querySelector('select[name="trophy"]').addEventListener('change', function (event) {
            console.log(data);
            gagnants = getGagnants(data, event.target.value);
            d3.select('g.graph').selectAll('*').remove();
            d3.select('g.valeurs').selectAll('*').remove();
            graphique(gagnants);
        });
    });
});


function getGagnants(data, cas) {
    let gagnants = [];
    let valeur;
    data.forEach(element => {
        let gagnant = [];
        element.result.forEach((univ) => {
            valeur = 0;
            if (cas == 1) {
                    valeur = univ.charts[0] + univ.charts[1] + univ.charts[2];
            }
            else {
                valeur = univ.charts[0];
            }
            if (valeur == element.winner[cas]) {
                univ.charts[4] = valeur;
                gagnant.push(univ);
            }
        })
        gagnants.push(gagnant);
    });
    return gagnants;
}

function graphique(gagnants) {
    const cas = document.querySelector('select[name="trophy"]').value;
    const echelle = { valeurs: [[1, 2, 3], [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]] };
    // let hauteur = 0;
    // console.log(gagnants);
    // if (cas == 1) {
    //     gagnants.forEach(gagnant => {
    //         gagnant[0].charts.forEach(chart => {
    //             hauteur += chart;
    //         })
    //     });
    // }
    // else {
    //     hauteur = univ.charts[0];
    // }

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
        .attr('height', dataU => dataU.charts[4] * (160 / echelle.valeurs[cas].length))
        .attr('fill', dataU => dataU.color);

    barre.append('circle')
        .attr('cx', (dataU, i, dataG) => (300 / 9 - 5) / dataG.length / 2)
        .attr('cy', dataU => dataU.charts[4] * (160 / echelle.valeurs[cas].length))
        .attr('r', (dataU, i, dataG) => (300 / 9 - 5) / dataG.length / 2)
        .attr('fill', 'white');

    barre.on('mouseenter', function (event, dataU) {
        barre.transition().duration(500).style('opacity', 0.2);
        d3.selectAll("g." + dataU.university.replaceAll(' ', '').toLowerCase()).transition().duration(300).style('opacity', 1);
    });

    barre.on('mouseleave', function (event, dataU) {
        barre.transition().duration(500).style('opacity', 1);
    });

    d3.select('svg')
        .selectAll('g.graph>g')
        .append('text')
        .text((dataG, i) => 2015 + i)
        .attr('transform', 'scale(0.8, -0.8)')
        .attr('y', 12.5)
        .attr('x', 2.25)

    const valeur = d3.select('g.valeurs')
        .selectAll('g')
        .data(echelle.valeurs[cas])
        .join('g')

    valeur.append('line')
        .attr('x1', -5)
        .attr('x2', 300)
        .attr('y1', data => data * (160 / echelle.valeurs[cas].length))
        .attr('y2', data => data * (160 / echelle.valeurs[cas].length))
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5 5')
        .attr('transform', 'scale(1, -1)')

    valeur.append('text')
        .text(data => data)
        .attr('y', data => (data * (160 / echelle.valeurs[cas].length) - 5) * -1)
        .attr('x', -15)
}