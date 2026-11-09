import { loadConfig, loadEnvFile } from './config.js';
import { openDatabase } from './db.js';
import { seedExample } from './fixtures.js';

loadEnvFile();
const config = loadConfig();
const db = openDatabase(config.databasePath);
seedExample(db);
db.close();
console.log('Beispieldatensatz geladen. Die Ansicht steht auf Beispiel. Der Echtbetrieb bleibt getrennt und leer, bis eigene Daten entstehen.');
