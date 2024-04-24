const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push("mjs");
defaultConfig.resolver.sourceExts.push("sql");

module.exports = defaultConfig;
