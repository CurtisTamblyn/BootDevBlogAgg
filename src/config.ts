import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl : string;

    currentUserName : string;
};

export function setUser(userName : string) {
    const config = readConfig();
    config.currentUserName = userName;
    writeConfig(config);
}

export function readConfig() : Config {

    try {
        const configPath = getConfigFilePath();
        const configString = fs.readFileSync(configPath, "utf-8");
        const parsedConfig = JSON.parse(configString);
        const config = validateConfig(parsedConfig);
        return config;
    }
    catch(error) {
        const e = error as Error;
        console.log(`Error when retrieving Config: ${e.message}. Returning empty config`);
        return defaultConfig();
    }
}



function getConfigFilePath() : string {
    return path.join(os.homedir(), ".gatorconfig.json");
}

function writeConfig(cfg : Config) {
    const configPath = getConfigFilePath();

    // Convert our config to json keys
    const outputConfig = {
        db_url : cfg.dbUrl,
        current_user_name : cfg.currentUserName,
    };

    fs.writeFileSync(configPath, JSON.stringify(outputConfig), { encoding:"utf-8"});
}



function validateConfig(rawConfig: any) : Config {

    if (!rawConfig.db_url || typeof rawConfig.db_url !== "string") {
        throw new Error("db_url is required in config file");
    }
    if (!rawConfig.current_user_name || typeof rawConfig.current_user_name !== "string") {
        throw new Error("current_user_name is required in config file");
    }

    const config = {
        dbUrl : rawConfig.db_url,
        currentUserName : rawConfig.current_user_name,
    };

    return config;
}

function defaultConfig() : Config {
    return {
        dbUrl: "postgres://example",
        currentUserName: "",
    };
}