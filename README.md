<div align = center>
<img src="https://raw.githubusercontent.com/angus6b23/hk-transport/master/assets/logo.svg" width="800" height="300" alt="hk-transport-logo">
</div>

# HK transport

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

An app viewing all major modes of transport in Hong Kong.

提供香港各種交通到站時間、路線資訊等

The app makes use of api provided by HK government to provide estimated time of arrival, station locations etc.

## Features

-   [Live site](https://hk-transport.12a.app)
-   Transport modes include bus, mtr, minibus, tram, light rail, ferry
-   No annoying ads
-   Modern interface
-   Integrated map for viewing route
-   Estimated time for arrival for bus, mtr and minibus
-   Can be used without install
-   Install option includes PWA, F-droid(Will be added)

## Installing

1.  Clone the git repository

    `git clone https://github.com/angus6b23/hk-transport`

2.  Run yarn / npm

    Using yarn

    `yarn && yarn run build`

    Using npm

    `npm && npm run build`

3.  Serve the files in /dist folder

## Building Android image

1. Install capacitor and ionic cli

    For capacitor, please see https://capacitorjs.com/

    For ionic cli, please see https://ionicframework.com/docs/cli

2. Clone the git repository

    `git clone https://github.com/angus6b23/hk-transport`

3. Build the image using ionic/cli

    `ionic capacitor build android`

4. Continue with android studio
