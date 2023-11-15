let fn = null;
let podiumFlag = false;

fetch('data.json').then(function (response) {
    response.json().then(function (data) {
        let gagnants = getGagnants(data, document.querySelector('select[name="trophy"]').value);
        graphique(gagnants);
        legende(data);

        document.querySelector('select[name="trophy"]').addEventListener('change', function (event) {
            gagnants = getGagnants(data, event.target.value);
            d3.select('g.graph').selectAll('g').selectAll('circle').remove()
            d3.select('g.graph').selectAll('g').selectAll("rect").transition().duration(300).attr('height', 0).remove();
            setTimeout(function () {
                d3.select('g.graph').selectAll('g').remove();
                d3.select('g.valeurs').selectAll('g').remove();
                graphique(gagnants);
            }, 300);
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
        .attr('height', (dataU, i, dataG) => (300 / 9 - 5) / dataG.length / 2)
        .attr('fill', dataU => dataU.color)

    barre.append('circle')
        .attr('cx', (dataU, i, dataG) => (300 / 9 - 5) / dataG.length / 2)
        .attr('cy', (dataU, i, dataG) => (300 / 9 - 5) / dataG.length / 2)
        .attr('r', (dataU, i, dataG) => (300 / 9 - 5) / dataG.length / 2)
        .attr('fill', 'white')

    setTimeout(function () {
        barre.select('rect').transition().duration(600).attr('height', dataU => dataU.charts[4] * (160 / echelle.valeurs[cas].length))
        barre.select("circle").transition().duration(600).attr('cy', dataU => dataU.charts[4] * (160 / echelle.valeurs[cas].length))
        setTimeout(function () {podiumFlag = false;},600)
    }, 10);

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
        .attr('x', -13)
        .style('text-anchor', 'middle')
}

function legende(data) {
    data[0].result.forEach((univ) => {
        document.querySelector('section.universite').innerHTML += `<p class="${univ.university.replaceAll(' ', '').toLowerCase()}" style="  --color: ${univ.color};">${univ.university}</p>`;
    });
    eventLegende(data);
}

function eventLegende(donnees) {
    document.querySelectorAll('section.universite p').forEach((univ) => {

        univ.addEventListener('mouseenter', function (event) {
            if (!podiumFlag) {
                d3.selectAll('g.graph g').selectAll('g').transition().duration(500).style('opacity', 0.2);
                d3.selectAll("g." + event.target.className).transition().duration(300).style('opacity', 1);
            }
        });

        univ.addEventListener('mouseleave', function (event) {
            if (!podiumFlag) {
                d3.select('g.graph').selectAll('*').transition().duration(500).style('opacity', 1);
            }
        });

        univ.addEventListener('click', function (event) {
            d3.select('g.graph').selectAll('g').selectAll('circle').remove()
            d3.select('g.graph').selectAll('g').selectAll("rect").transition().duration(300).attr('height', 0).remove();
            setTimeout(function () {
                d3.select('g.graph').selectAll('g').remove();
                d3.select('g.valeurs').selectAll('g').remove();
                tracePodium(event.target.className, JSON.parse(JSON.stringify(donnees)));
            }, 300);
        });
    });
}

function tracePodium(univ, data) {
    podiumFlag = true;
    let podium = [];
    const copydata = JSON.parse(JSON.stringify(data));
    data.forEach(function (anneeData) {
        anneeData.result.forEach(function (resultat) {
            if (resultat.university.replaceAll(' ', '').toLowerCase() == univ) {
                podium.push(resultat);
            }
        });
    })
    const annee = d3.select('g.graph').selectAll('g')
        .data(podium)
        .join('g')
        .attr('id', (dataA, i) => 2015 + i)
        .attr('transform', (dataA, i) => `translate(${(5 + (300 / 9) * i)}, 0), scale(1, -1)`)
        .attr('class', (dataU) => dataU.university.replaceAll(' ', '').toLowerCase());

    annee.append('line')
        .attr('x1', -2.5)
        .attr('x2', -2.5)
        .attr('y1', 0)
        .attr('y2', 160)
        .attr('stroke', 'white')
        .attr('stroke-width', 1.5)

    const barrePodium = annee.selectAll('g')
        .data(dataA => dataA.charts.splice(0, 3))
        .join('g')
        .attr('transform', (dataU, i) => `translate(${((300 / 9 - 5) / 3) * i}, 0)`);

    barrePodium.append('rect')
        .attr('width', (300 / 9 - 5) / 3)
        .attr('height', 2)
        .attr('fill', (data, i) => {
            switch (i) {
                case 0:
                    return 'gold';
                case 1:
                    return 'silver';
                case 2:
                    return 'coral';
            }
        });

    barrePodium.append('circle')
        .attr('cx', (dataU, i, dataG) => (300 / 9 - 5) / 6)
        .attr('cy', (dataU, i, dataG) => (300 / 9 - 5) / 6)
        .attr('r', (dataU, i, dataG) => (300 / 9 - 5) / 6)
        .attr('fill', (data, i) => {
            if (data == 0) {
                return 'none';
            }
            switch (i) {
                case 0:
                    return 'gold';
                case 1:
                    return 'silver';
                case 2:
                    return 'coral';
            }
        })

    setTimeout(function () {
        barrePodium.select('rect').transition().duration(600).attr('height', dataU => dataU * (160 / 4) + 2);
        barrePodium.select("circle").transition().duration(600).attr('cy', dataU => dataU * (160 / 4));
    }, 10)

    d3.select('svg')
        .selectAll('g.graph>g')
        .append('text')
        .text((dataG, i) => 2015 + i)
        .attr('transform', 'scale(0.8, -0.8)')
        .attr('y', 12.5)
        .attr('x', 2.25)

    const valeur = d3.select('g.valeurs')
        .selectAll('g')
        .data([1, 2, 3, 4])
        .join('g')

    valeur.append('line')
        .attr('x1', -5)
        .attr('x2', 300)
        .attr('y1', data => data * (160 / 4))
        .attr('y2', data => data * (160 / 4))
        .attr('stroke', 'white')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '5 5')
        .attr('transform', 'scale(1, -1)')

    valeur.append('text')
        .text(data => data)
        .attr('y', data => (data * (160 / 4) - 5) * -1)
        .attr('x', -13)
        .style('text-anchor', 'middle');

    setTimeout(function () {
        fn = () => resetGraph(copydata, event);
        document.querySelector('body').addEventListener('click', fn);
    }, 300);
}

function resetGraph(copydata, e) {
    if (e.target.tagName != "P") {
        d3.select('g.graph').selectAll('g').selectAll('circle').remove()
        d3.select('g.graph').selectAll('g').selectAll("rect").transition().duration(300).attr('height', 0).remove();
        setTimeout(function () {
            d3.select('g.graph').selectAll('g').remove();
            d3.select('g.valeurs').selectAll('g').remove();
            graphique(getGagnants(copydata, document.querySelector('select[name="trophy"]').value));
            document.querySelector('body').removeEventListener('click', fn);
            setTimeout(function () {
                fn = null;
            }, 50);
        }, 300);
    }
    else {
        document.querySelector('body').removeEventListener('click', fn);
        setTimeout(function () {
            fn = null;
        }, 50);
    }
}