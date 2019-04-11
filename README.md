# Model4G.net

## Introduction
This is the codebase for the interactive web-GIS maps of Kathmandu Metropolitan City Ward 7 used on the [model4g.net](model4g.net) website.

## Live map links
1. Map of projects planned for year B.S. 2071 - 2072
[http://model4g.net/en/projects/71-72](http://model4g.net/en/projects/71-72)
2. Map of schools
[http://model4g.net/ne/data/140](http://model4g.net/ne/data/140)
3. Map of colleges
[http://model4g.net/ne/data/141](http://model4g.net/ne/data/141)
4. Map of hospitals
[http://model4g.net/ne/data/142](http://model4g.net/ne/data/142)
5. Map of points of interest
[http://model4g.net/ne/page/151](http://model4g.net/ne/page/151)

## Server-side Dependencies
- Php
- Web server

## Installation
Clone this repo into the web server path and embed the index.php from the subdirectories for the respective map pages (sub-projects).

## API Endpoints
Configured in the `api` field of `<project>/js/config/config.js` and change them to point to the correct API endpoints.
Example: `/projectsinward/js/config.js`, `/roadreport/js/config.js`

## Code Overview
This app is built using the Cartomancer framework created by GitHub user `jedi-Knight`. It is a jQuery framework for web-GIS maps.
- `data.js`: This is where the data model resides. It Model object acts as an in-memory JSON data store which can be queried using the functions provided in this module. It also provides functions for Ajax queries, which are basically wrappers over standard jQuery Ajax and extend its functionality.
- `cartograph.js`: This module provides functions that create and update the DOM components, including the map, using the given parameters.
- `cartomancer.js`: This is the controller that initializes the model and view, listens for user input, calls functions on `data.js` to query the model and calls functions from `cartograph.js` to update the view. 
In this project separate `cartomancer.js` files are used in each sub-project (GIS map) directory.
Each of the sub-projects also has separate `config.js` files found in their respective `config` subdirectories.
Each project also has separate plugins directories that extend the functionality of the core framework.
