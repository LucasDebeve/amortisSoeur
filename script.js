function annuitee(capital, taux, duree) {
    return capital * taux / (1 - (1 + taux) ** (-duree))
}

function uniquementEtetes(periode = "Année") {
    const empruntTable = document.getElementById("emprunt");
    empruntTable.innerHTML = `
<tr>
    <th>${periode}</th>
    <th>Capital restant dû en début de période</th>
    <th>Intérêts de la période</th>
    <th>
        Amortissement du capital
    </th>
    <th>
        Annuité d'emprunt </br>
        (Vous paieriez cette somme chaque ${periode})
    </th>
    <th>Capital restant dû en fin de période</th>
</tr>`;

}

function toggleForm() {
    console.log("toggleForm");
    const form = document.getElementById("form");
    form.classList.toggle("hidden");
}

function ajouterLigneAmmortissementConstant(capital, taux, duree, n, amortissement, liste) {
    const table = document.getElementById("emprunt");
    const ligne = table.insertRow(-1);
    
    const celluleDuree = ligne.insertCell(0);
    celluleDuree.innerHTML = n;

    const celluleCapital = ligne.insertCell(1);
    celluleCapital.innerHTML = (Math.round(capital*100)/100).toLocaleString("fr-FR") + " €";
    
    const celluleInteret = ligne.insertCell(2);
    const interet = capital * taux;
    celluleInteret.innerHTML = (Math.round(interet*100)/100).toLocaleString("fr-FR") + " €";

    const celluleAmortissement = ligne.insertCell(3);
    celluleAmortissement.innerHTML = (Math.round(amortissement*100)/100).toLocaleString("fr-FR") + " €";

    const celluleAnnuite = ligne.insertCell(4);
    const annuite = amortissement + interet;
    celluleAnnuite.innerHTML = (Math.round(annuite*100)/100).toLocaleString("fr-FR") + " €";


    const celluleCapitalRestant = ligne.insertCell(5);
    const capitalRestant = capital - amortissement;
    celluleCapitalRestant.innerHTML = (Math.round(capitalRestant*100)/100).toLocaleString("fr-FR") + " €";

    liste.push([capital, interet, amortissement, annuite, capitalRestant]);

    return capitalRestant;
}

function ajouterTotal(liste) {
    const amortissementTotal = liste.reduce((acc, ligne) => acc + ligne[2], 0);
    const interetTotal = liste.reduce((acc, ligne) => acc + ligne[1], 0);
    const annuiteTotal = liste.reduce((acc, ligne) => acc + ligne[3], 0);
    const footerInt = document.getElementById("int");
    footerInt.innerHTML = (Math.round(interetTotal*100)/100).toLocaleString("fr-FR") + " €";
    const footerAmo = document.getElementById("amo");
    footerAmo.innerHTML = (Math.round(amortissementTotal*100)/100).toLocaleString("fr-FR") + " €";
    const footerAn = document.getElementById("ann");
    footerAn.innerHTML = (Math.round(annuiteTotal*100)/100).toLocaleString("fr-FR") + " €";

}

function ajouterLigneAnnuite(capital, taux, duree, annuite, n, liste) {
    const table = document.getElementById("emprunt");
    const ligne = table.insertRow(-1);
    
    const celluleDuree = ligne.insertCell(0);
    celluleDuree.innerHTML = n;

    const celluleCapital = ligne.insertCell(1);
    celluleCapital.innerHTML = (Math.round(capital*100)/100).toLocaleString("fr-FR") + " €";

    const celluleInteret = ligne.insertCell(2);
    const interet = capital * taux;
    celluleInteret.innerHTML = (Math.round(interet*100)/100).toLocaleString("fr-FR") + " €";

    const celluleAmortissement = ligne.insertCell(3);
    const amortissement = annuite - interet;
    celluleAmortissement.innerHTML = (Math.round(amortissement*100)/100).toLocaleString("fr-FR") + " €";

    const celluleAnnuite = ligne.insertCell(4);
    celluleAnnuite.innerHTML = (Math.round(annuite*100)/100).toLocaleString("fr-FR") + " €";

    const celluleCapitalRestant = ligne.insertCell(5);
    const capitalRestant = capital - amortissement;
    celluleCapitalRestant.innerHTML = (Math.round(capitalRestant*100)/100).toLocaleString("fr-FR") + " €";

    liste.push([capital, interet, amortissement, annuite, capitalRestant]);

    return capitalRestant;
}

// Events
document.querySelectorAll("input, select").forEach(input => {
    input.addEventListener("change", () => {
        let capital = parseFloat(document.getElementById("montant").value);
        let taux = parseFloat(document.getElementById("taux").value / 100);
        let duree = parseInt(document.getElementById("duree").value);
        if (isNaN(capital) || isNaN(taux) || isNaN(duree) || (duree < 0) || (taux < 0) || (taux > 100) || (capital < 0)){
            return;
        }
        // Verifie la période selectionné (mensuel, trimestriel, semestriel, annuel) : radio button période
        let periode = document.querySelector("select[name='période']").value;
        if (periode == "mensuel") {
            taux = (1+taux)**(1/12) - 1;
            duree = duree * 12;
            uniquementEtetes("Mois");
        } else if (periode == "trimestriel") {
            taux = (1+taux)**(1/4) - 1;
            duree = duree * 4;
            uniquementEtetes("Trismestre");
        } else if (periode == "semestriel") {
            taux = (1+taux)**(1/2) - 1;
            duree = duree * 2;
            uniquementEtetes("Semestre");
        } else {
            uniquementEtetes("Année");
        }

        let type = document.querySelector("input[name='type']:checked").value;
        
        let capitalRestant = capital;
        let liste = [];
        if (type == "capital") {
            const amortissement = capital / duree;
            for(let i = 0; i < duree; i++) {
                capitalRestant = ajouterLigneAmmortissementConstant(capitalRestant, taux, duree, i+1, amortissement, liste);
            }
        } else {
            let annuite = annuitee(capital, taux, duree);
            for(let i = 0; i < duree; i++) {
                capitalRestant = ajouterLigneAnnuite(capitalRestant, taux, duree, annuite, i+1, liste);
            }
        } 
        ajouterTotal(liste);
    });
});

document.getElementById("showForm").addEventListener("click", toggleForm);