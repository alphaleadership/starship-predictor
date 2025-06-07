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

// Fonction pour obtenir la date d'aujourd'hui au format YYYY-MM-DD
function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Fonction pour ajouter la date d'aujourd'hui
function addTodayDate() {
    const htmlContent = readHtmlFile();
    const today = getTodayDate();
    
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
    if (existingDates.includes(today)) {
        console.log('La date d\'aujourd\'hui existe déjà dans la liste');
        return;
    }

    // Vérifier que la date est plus récente que la dernière
    const lastDate = new Date(existingDates[existingDates.length - 1]);
    const todayDate = new Date(today);
    if (todayDate <= lastDate) {
        console.log('La date d\'aujourd\'hui n\'est pas plus récente que la dernière date enregistrée');
        return;
    }

    // Construire le nouveau tableau de dates
    const newDatesArray = `const datesLancements = [\n    ${existingDates.map(d => `'${d}'`).join(',\n    ')},\n    '${today}'  \n];`;

    // Remplacer l'ancien tableau par le nouveau
    const newContent = htmlContent.replace(datesArrayRegex, newDatesArray);

    // Écrire les modifications
    writeHtmlFile(newContent);
}

// Exécuter le programme
addTodayDate(); 