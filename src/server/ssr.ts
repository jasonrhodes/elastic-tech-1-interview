import express, { Express } from "express";
import fs from "fs";
import path from "path";
import React from "react";
import ReactDOMServer from "react-dom/server";
import App from "../client/app";

export function SSRRoute(app: Express) {
  const manifest = fs.readFileSync(
    path.join(__dirname, "static/manifest.json"),
    "utf-8"
  );
  const assets = JSON.parse(manifest);

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use("/", express.static(path.join(__dirname, "static")));

  app.get("/", (req, res) => {
    const component = ReactDOMServer.renderToString(React.createElement(App));
    res.render("client", { assets, component });
  });
}
