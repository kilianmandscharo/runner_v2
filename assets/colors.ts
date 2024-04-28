import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../tailwind.config.js";

const fullConfig = resolveConfig(tailwindConfig);
const colors: any = fullConfig.theme?.colors ?? {};

export { colors };
