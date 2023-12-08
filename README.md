<div align = center>
<img src="https://raw.githubusercontent.com/angus6b23/hk-transport/master/assets/logo.svg" width="800" height="300" alt="hk-transport-logo">
</div>

# HK transport 香港交通
<div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; margin-left: -0.5rem">
<img alt="GitHub License" src="https://img.shields.io/github/license/angus6b23/hk-transport">
<img alt="GitHub release (with filter)" src="https://img.shields.io/github/v/release/angus6b23/hk-transport">
<img alt="F-Droid (including pre-releases)" src="https://img.shields.io/f-droid/v/app.hkTransport">
<img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fhk-transport.12a.app">
<img alt="Website" src="https://img.shields.io/website?url=https%3A%2F%2Fapi.12a.app%2Fhk-transport&label=backend">
<img alt="Liberapay receiving" src="https://img.shields.io/liberapay/receives/12a.app">
</div>

An app viewing all major modes of transport in Hong Kong.

提供香港各種交通到站時間、路線資訊等

HK Transport makes use of data from HK gov
In the app, you can find data of
香港交通利用香港政府數據並作出整合
應用中可檢視路線包括

-   Bus 巴士
-   MTR 地鐵
-   Minibus 專線小巴
-   Tram（Estimated time of arrival not available）
    電車（未提供到站時間）
-   Light Rail 輕鐵
-   Ferry（Estimated time of arrival not available）
    渡輪（未提供到站時間）

## Screenshots
<div style="display: flex; flex-wrap: wrap; gap: 1rem">
<img src="https://raw.githubusercontent.com/angus6b23/hk-transport/master/metadata/en-US/images/phoneScreenshots/en-1.png" width="300" alt="en-search-screenshot">
<img src="https://raw.githubusercontent.com/angus6b23/hk-transport/master/metadata/zh-TW/images/phoneScreenshots/zh-1.png" width="300" alt="zh-search-screenshot">
<img src="https://raw.githubusercontent.com/angus6b23/hk-transport/master/metadata/en-US/images/phoneScreenshots/en-3.png" width="300" alt="eta-screenshot">
<img src="https://raw.githubusercontent.com/angus6b23/hk-transport/master/metadata/zh-TW/images/phoneScreenshots/zh-4.png" width="300" alt="list-screenshot">
</div>



## Features 

-   [Live site 線上版](https://hk-transport.12a.app)
-   [Google Play Store](https://play.google.com/store/apps/details?id=app.hkTransport)
-   [Fdroid](https://f-droid.org/zh_Hant/packages/app.hkTransport/)
-   Transport modes include bus, mtr, minibus, tram, light rail, ferry
    可檢視路線包括巴士，地鐵，專線小巴，電車，輕鐵，渡輪
-   No annoying ads
    無任何廣告
-   Modern interface
    現代介面
-   Integrated map for viewing route
    可使用地圖檢視路線
-   Estimated time for arrival for bus, mtr, light rail and minibus 檢視巴士、專線小巴、地鐵和輕鐵的到站時間
-   Can be used without install
    可直擁於瀏覽器中使用
-   Install option includes PWA, F-droid, Play store
    可安裝版本包括Web app， F-Droid 和 Play store

## Installing

1.  Clone the git repository

    `git clone https://github.com/angus6b23/hk-transport`

2.  Run yarn / npm

    Using yarn

    `yarn && yarn run build`

    Using npm

    `npm install && npm run build`

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

## License

![img](https://www.gnu.org/graphics/gplv3-or-later.svg)

This app is provided under GPL v3.0 or later. For details, please see https://www.gnu.org/licenses/gpl-3.0.en.html
