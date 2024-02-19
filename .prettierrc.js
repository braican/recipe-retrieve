import upstatementPrettierConfig from "@upstatement/prettier-config";

export default {
  ...upstatementPrettierConfig,
	"plugins": ["prettier-plugin-svelte"],
	"overrides": [{ "files": "*.svelte", "options": { "parser": "svelte" } }]
};