import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory using ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function updateTauriPubkey() {
  const pubkey = process.env.TAURI_SIGNING_PUBLIC_KEY;
  if (!pubkey) {
    console.error('TAURI_SIGNING_PUBLIC_KEY environment variable is not set');
    process.exit(1);
  }

  // Use path.resolve to get the correct path from the script location
  const tauriConfigPath = path.resolve(__dirname, '..', 'src-tauri', 'tauri.conf.json');

  try {
    // Read and parse the existing config
    const configContent = fs.readFileSync(tauriConfigPath, 'utf8');
    const config = JSON.parse(configContent);

    // Ensure the required structure exists
    if (!config.plugins) {
      config.plugins = {};
    }
    if (!config.plugins.updater) {
      config.plugins.updater = {};
    }

    // Update the pubkey
    config.plugins.updater.pubkey = pubkey;

    // Write back the updated config with proper formatting
    const updatedContent = JSON.stringify(config, null, 2);
    fs.writeFileSync(tauriConfigPath, updatedContent, 'utf8');

    // Display the updated content
    console.log('Updated tauri.conf.json:', updatedContent);

  } catch (error) {
    console.error('Error updating Tauri pubkey:', error);
    process.exit(1);
  }
}

updateTauriPubkey(); 