const withPlugins = require("next-compose-plugins");
const { i18n } = require("./i18n");

module.exports = withPlugins([], {
    i18n,
    experimental: {
        esmExternals: false,
    },
});
