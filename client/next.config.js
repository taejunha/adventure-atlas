module.exports = {
    webpack: (config) => {
      config.module.rules.push({
        test: /\.html$/,
        loader: 'ignore-loader',
      });
      return config;
    },
  };
  