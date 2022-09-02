import CopyWebpackPlugin from "copy-webpack-plugin"
import * as path from "path"
import * as webpack from "webpack"

import packageJson = require("../package.json")

const config: webpack.Configuration = {
  entry: ["./src/js/index.tsx"],
  output: {
    publicPath: "/",
    path: path.join(__dirname, "../build"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {from: "src/delete.svg", to: "delete.svg"},
        {from: "src/edit.svg", to: "edit.svg"},
        {from: "src/tick.svg", to: "tick.svg"},
        {from: "src/favicon.ico", to: "favicon.ico"},
      ],
    }),
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(packageJson.version),
    }),
  ],
}

export default config
