import { loadConfig, loadEnvFile } from './config.js';
import { openDatabase } from './db.js';
import { createApp } from './server.js';

loadEnvFile();
const config = loadConfig();
const db = openDatabase(config.databasePath);
const app = createApp({ db, config });
app.listen(config.port, config.host, () => {
  console.log(`PROJEKT EX intern hört auf http://${config.host}:${config.port}`);
  console.log('Nicht öffentlich. Kein Versand, keine Veröffentlichung.');
});
