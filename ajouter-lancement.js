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
        const datesExistantes = match[1].split(',').map(date => date.trim()).filter(date => date);
        
        // Vérifier si la date existe déjà
        if (datesExistantes.includes(`'${dateHier}'`)) {
            console.log('Cette date existe déjà dans la liste');
            return;
        }
        
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
            
            // Recharger la page
            console.log('Rechargement de la page...');
            // Note: Le rechargement de la page doit être géré côté client
            // car Node.js ne peut pas recharger une page web directement
        });
    } else {
        console.error('Impossible de trouver le tableau des dates de lancement');
    }
}); 