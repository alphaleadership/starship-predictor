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

// Fonction pour extraire les dates
function extractDates(htmlContent) {
    // Trouver le tableau des dates
    const datesArrayRegex = /const datesLancements = \[([\s\S]*?)\];/;
    const match = htmlContent.match(datesArrayRegex);
    
    if (!match) {
        console.error('Impossible de trouver le tableau des dates dans le fichier');
        process.exit(1);
    }

    // Extraire les dates existantes
    const dates = match[1]
        .split(',')
        .map(d => d.trim())
        .filter(d => d)
        .map(d => d.replace(/'/g, ''));

    // Créer un tableau d'objets avec les dates et les numéros de vol
    const flights = dates.map((date, index) => ({
        numero: index + 1,
        date: date,
        dateObj: new Date(date)
    }));

    return flights;
}

// Fonction pour sauvegarder en JSON
function saveToJson(flights) {
    const jsonContent = {
        lastUpdate: new Date().toISOString(),
        totalFlights: flights.length,
        flights: flights
    };

    try {
        fs.writeFileSync('flights.json', JSON.stringify(jsonContent, null, 2), 'utf8');
        console.log('Dates exportées avec succès dans flights.json!');
    } catch (error) {
        console.error('Erreur lors de l\'écriture du fichier JSON:', error);
        process.exit(1);
    }
}

// Fonction principale
function exportDates() {
    const htmlContent = readHtmlFile();
    const flights = extractDates(htmlContent);
    saveToJson(flights);
}

// Exécuter le programme
exportDates(); 