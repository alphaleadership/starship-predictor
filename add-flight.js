    const fs = require('fs');
const path = require('path');

// Fonction pour lire le fichier HTML
function readHtmlFile() {
    try {
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        return htmlContent;
    } catch (error) {
        console.error('Erreur lors de la lecture du fichier:', error);
        process.exit(1);
    }
}

// Fonction pour écrire dans le fichier HTML
function writeHtmlFile(content) {
    try {
        fs.writeFileSync('index.html', content, 'utf8');
        console.log('Fichier mis à jour avec succès!');
    } catch (error) {
        console.error('Erreur lors de l\'écriture du fichier:', error);
        process.exit(1);
    }
}

// Fonction pour ajouter une nouvelle date
function addNewDate(date) {
    const htmlContent = readHtmlFile();
    
    // Vérifier le format de la date
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
        console.error('Format de date invalide. Utilisez le format YYYY-MM-DD');
        process.exit(1);
    }

    // Vérifier que la date est valide
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
        console.error('Date invalide');
        process.exit(1);
    }

    // Trouver le tableau des dates
    const datesArrayRegex = /const datesLancements = \[([\s\S]*?)\];/;
    const match = htmlContent.match(datesArrayRegex);
    
    if (!match) {
        console.error('Impossible de trouver le tableau des dates dans le fichier');
        process.exit(1);
    }

    // Extraire les dates existantes
    const existingDates = match[1]
        .split(',')
        .map(d => d.trim())
        .filter(d => d)
        .map(d => d.replace(/'/g, ''));

    // Vérifier si la date existe déjà
    if (existingDates.includes(date)) {
        console.error('Cette date existe déjà dans la liste');
        process.exit(1);
    }

    // Vérifier que la nouvelle date est plus récente que la dernière
    const lastDate = new Date(existingDates[existingDates.length - 1]);
    if (dateObj <= lastDate) {
        console.error('La nouvelle date doit être plus récente que la dernière date enregistrée');
        process.exit(1);
    }

    // Construire le nouveau tableau de dates
    const newDatesArray = `const datesLancements = [\n    ${existingDates.map(d => `'${d}'`).join(',\n    ')},\n    '${date}'  \n];`;

    // Remplacer l'ancien tableau par le nouveau
    const newContent = htmlContent.replace(datesArrayRegex, newDatesArray);

    // Écrire les modifications
    writeHtmlFile(newContent);
}

// Vérifier les arguments
if (process.argv.length !== 3) {
    console.log('Usage: node add-flight.js YYYY-MM-DD');
    process.exit(1);
}

// Ajouter la nouvelle date
addNewDate(process.argv[2]); 