const fs = require('fs');

// Lire le fichier index.html
fs.readFile('index.html', 'utf8', (err, data) => {
    if (err) {
        console.error('Erreur lors de la lecture du fichier:', err);
        return;
    }

    // Calculer la date d'hier
    const hier = new Date();
    hier.setDate(hier.getDate() - 1);
    const dateHier = hier.toISOString().split('T')[0];

    // Trouver le tableau des dates de lancement
    const regex = /const datesLancements = \[([\s\S]*?)\];/;
    const match = data.match(regex);

    if (match) {
        // Extraire les dates existantes
        const datesExistantes = match[1].split(',').map(date => date.trim());
        
        // Ajouter la nouvelle date
        datesExistantes.push(`'${dateHier}'`);
        
        // Créer le nouveau tableau
        const nouveauTableau = `const datesLancements = [\n    ${datesExistantes.join(',\n    ')}\n];`;
        
        // Remplacer l'ancien tableau par le nouveau
        const nouveauContenu = data.replace(regex, nouveauTableau);
        
        // Écrire le fichier modifié
        fs.writeFile('index.html', nouveauContenu, 'utf8', (err) => {
            if (err) {
                console.error('Erreur lors de l\'écriture du fichier:', err);
                return;
            }
            console.log('Date ajoutée avec succès:', dateHier);
        });
    } else {
        console.error('Impossible de trouver le tableau des dates de lancement');
    }
}); 