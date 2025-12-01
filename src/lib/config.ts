import fs from 'fs'
import path from 'path'
import toml from 'toml'

let configCache: any = null;

export const getConfig = (forceReload = false) => {
  if (configCache && !forceReload) {
    return configCache;
  }

  const configPath = path.join(process.cwd(), 'config.toml');
  const fileContents = fs.readFileSync(configPath, 'utf8');
  configCache = toml.parse(fileContents);
  return configCache;
};
