const formatPackage = require("format-package");

module.exports = {
  order: formatPackage.defaults.order,
  formatter: formatPackage.defaults.formatter,
  transformations: {
    ...require("format-package").defaults.transformations,
    "*": (key, value) => {
      if (typeof value !== "object" || Array.isArray(value)) {
        return [key, value];
      }

      const sorted = Object.fromEntries(
        Object.entries(value).sort(([a], [b]) => a.localeCompare(b)),
      );

      return [key, sorted];
    },
  },
};
