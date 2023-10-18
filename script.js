fetch('data.json').then(function (response) {
    response.json().then(function (data) {
        data.forEach((element, iAnnee)=> {
            let gagnants=[];
            element.result.forEach((univ) => {
                if (univ.charts[0] == element.winner[0]){
                    gagnants.push(univ);
                }
            })
            console.log(gagnants);
            
        });
    });
});