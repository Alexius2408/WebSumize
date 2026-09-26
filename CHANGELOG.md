# Changelog

## [0.0.44](https://github.com/Alexius2408/WebSumize/compare/v0.0.43...v0.0.44) (2026-09-26)

### Bug Fixes

* small login and window fixes ([d9f9497](https://github.com/Alexius2408/WebSumize/commit/d9f9497335ec4a0c95eddbfac4ff826383392e26))

### Improvements

* read app version from package.json ([02a4471](https://github.com/Alexius2408/WebSumize/commit/02a447179d463e7cd68187f6ae727f7b1ecab6e0))

### CI

* set up automatic versions, changelog and commit message checks (semantic-release, commitlint, husky) ([803e819](https://github.com/Alexius2408/WebSumize/commit/803e819468b6dcf2b0f92eed062abba8e36c999b))
* release new versions on fix, perf, style and feat ([dd49164](https://github.com/Alexius2408/WebSumize/commit/dd4916442dbcade2a031ea6957785261acab9aab))

## [0.0.43](https://github.com/Alexius2408/WebSumize/compare/b2187bf7367ffd48956a9f9644d3bc29ec9a6153...v0.0.43) (2026-08-10)

### Bug Fixes

* **login:** don't crash when there is no saved login ([0a9c7c9](https://github.com/Alexius2408/WebSumize/commit/0a9c7c91251e780a37d4f7ce60139b4440932339))

### Styling

* **main window:** move the dropdown menu to the right ([0a9c7c9](https://github.com/Alexius2408/WebSumize/commit/0a9c7c91251e780a37d4f7ce60139b4440932339))

### Documentation

* **license:** fix a typo in the copyright name ([de8224a](https://github.com/Alexius2408/WebSumize/commit/de8224a167ff421c8631775ddc288d3c775a085a))

### Chores

* add a description, keywords, license info and a `dev` script to package.json ([de8224a](https://github.com/Alexius2408/WebSumize/commit/de8224a167ff421c8631775ddc288d3c775a085a))
* set the version to 0.0.43 ([0a9c7c9](https://github.com/Alexius2408/WebSumize/commit/0a9c7c91251e780a37d4f7ce60139b4440932339))

## [0.0.42](https://github.com/Alexius2408/WebSumize/commits/b2187bf7367ffd48956a9f9644d3bc29ec9a6153) (2026-08-10)

The first version number. It covers everything from the first upload on 2026-03-12 until 2026-08-10, before new versions and this changelog were created automatically.

### New Features

* first version of the app: an Electron window with a login page, a main page and a connection to WebUntis ([d53c804](https://github.com/Alexius2408/WebSumize/commit/d53c8047238ecdecb08ad889e274e60cd25fcdf0))
* **login:** log in with username, password, school name and school URL ([ce4c548](https://github.com/Alexius2408/WebSumize/commit/ce4c5483168d3a1a37f316a4724a276e4adc49e2))
* **main window:** add a logout button ([920a712](https://github.com/Alexius2408/WebSumize/commit/920a712992432b355a648b4d22bfff299530ccf0))
* **login:** new login screen with a typing text animation that runs endlessly ([1d225f0](https://github.com/Alexius2408/WebSumize/commit/1d225f05c2ab82a34ad39fa0e5c386f1b8be83c7), [55135f5](https://github.com/Alexius2408/WebSumize/commit/55135f5578d7c48d9a7fee247fcd4cd73014c3d6))
* **login:** links on the login page open in the browser ([ea0cef1](https://github.com/Alexius2408/WebSumize/commit/ea0cef117b7b46a9ac288fc6aeec0f99dc75485e))
* **logs:** save errors to a daily log file (removed again later) ([2209e9c](https://github.com/Alexius2408/WebSumize/commit/2209e9c812819ed3b47fdfaebdb522c26c578448))
* add a temporary app logo ([34658af](https://github.com/Alexius2408/WebSumize/commit/34658afdb5e144d4eb09340a0189b2101780a493))
* **login:** show an error message when the login fails ([7d01c74](https://github.com/Alexius2408/WebSumize/commit/7d01c7424c144dbde09315e4ed71494a050646ae), [633da2e](https://github.com/Alexius2408/WebSumize/commit/633da2e8af6cd39030ec55155c8358565d1bb653))
* **login:** loading animation on the login button ([633da2e](https://github.com/Alexius2408/WebSumize/commit/633da2e8af6cd39030ec55155c8358565d1bb653))
* **main window:** add a dropdown menu with Settings, Export Data, Import Data and Logout ([d348e14](https://github.com/Alexius2408/WebSumize/commit/d348e140d1a434958e78a7b3ab932d23a6147cd2))
* **tray:** add a tray icon: double-click opens the main window, click opens the mini window, right-click opens a menu ([b4e7144](https://github.com/Alexius2408/WebSumize/commit/b4e7144c0b57804ad675719be0202f52ee45898b))
* add app icons for Windows, macOS and Linux ([b4e7144](https://github.com/Alexius2408/WebSumize/commit/b4e7144c0b57804ad675719be0202f52ee45898b))
* show the app icon in the taskbar ([dcfefe0](https://github.com/Alexius2408/WebSumize/commit/dcfefe048887a9388156ade0a5890ce9eb5af4cd))
* **timetable:** first version of the timetable display ([0b42d0c](https://github.com/Alexius2408/WebSumize/commit/0b42d0c243f429d9016cd3b0aa5a81cc4a48ed97))
* **login:** detect when you are offline, show a message and disable the inputs ([0b42d0c](https://github.com/Alexius2408/WebSumize/commit/0b42d0c243f429d9016cd3b0aa5a81cc4a48ed97))

### Bug Fixes

* **login:** fix several login bugs ([55135f5](https://github.com/Alexius2408/WebSumize/commit/55135f5578d7c48d9a7fee247fcd4cd73014c3d6))
* **tray:** "Open Main Window" and "Open Mini Window" show the window that is already open instead of opening a second one ([dcfefe0](https://github.com/Alexius2408/WebSumize/commit/dcfefe048887a9388156ade0a5890ce9eb5af4cd))
* **logs:** replace all line breaks in log messages, not only the first one ([49b563b](https://github.com/Alexius2408/WebSumize/commit/49b563bb11738ff773f99aba0c2d471cb1991881))
* **windows:** keep track of open windows correctly between the tray and the rest of the app ([ee42460](https://github.com/Alexius2408/WebSumize/commit/ee42460a2fdb608006b587711dfef6e880fd3875))
* **logout:** also delete the saved timetable when logging out ([ee42460](https://github.com/Alexius2408/WebSumize/commit/ee42460a2fdb608006b587711dfef6e880fd3875))
* **timetable:** sort lessons by start time, from the first lesson to the last ([a2b39e2](https://github.com/Alexius2408/WebSumize/commit/a2b39e2bd8f7ae9368ea7fb8e63e75fc66dc3c02))
* **tray:** the mini window can only be opened after logging in ([d9ca74f](https://github.com/Alexius2408/WebSumize/commit/d9ca74f209588d2acb0f90c7ce73ebc0cf1a1879))
* **login:** treat saved login data with empty fields as logged out ([fe7a3ca](https://github.com/Alexius2408/WebSumize/commit/fe7a3ca7c66725c76ef27cf2f24218c3ffcf552f))

### Performance

* **timetable:** save today's timetable and only load it from WebUntis again after 30 minutes, when the app needs it, to send fewer requests ([6bf669e](https://github.com/Alexius2408/WebSumize/commit/6bf669e76c8e254a76692c9dc799315086d66611))

### Styling

* **login:** hide the typing text on small screens so it doesn't overlap ([ea0cef1](https://github.com/Alexius2408/WebSumize/commit/ea0cef117b7b46a9ac288fc6aeec0f99dc75485e))
* **login:** change a typing sentence to "Made with love by Alexius!" ([6e61025](https://github.com/Alexius2408/WebSumize/commit/6e6102512d7a17a6c037942f2c9189ad051b56d3))
* use only a dark design instead of following the system's light or dark mode, because keeping both was too complicated ([0b42d0c](https://github.com/Alexius2408/WebSumize/commit/0b42d0c243f429d9016cd3b0aa5a81cc4a48ed97))
* remove the menu bar at the top of the app ([e329116](https://github.com/Alexius2408/WebSumize/commit/e32911677664d4b71245626fd5de8487a775f7f4))
* **login:** better layout on smaller screens ([e329116](https://github.com/Alexius2408/WebSumize/commit/e32911677664d4b71245626fd5de8487a775f7f4), [d30e6d3](https://github.com/Alexius2408/WebSumize/commit/d30e6d32533e8a13089e0d39a0f25415d95c95d6))
* **login:** bigger heading and wider input fields ([6fe4000](https://github.com/Alexius2408/WebSumize/commit/6fe4000321f9e45b4981cf5fc89119fb7283edb2))
* **login:** rework the password visibility icons ([fe7a3ca](https://github.com/Alexius2408/WebSumize/commit/fe7a3ca7c66725c76ef27cf2f24218c3ffcf552f))
* only hide the menu bar outside of development mode ([fe7a3ca](https://github.com/Alexius2408/WebSumize/commit/fe7a3ca7c66725c76ef27cf2f24218c3ffcf552f))

### Improvements

* rename files: webUnitsClient.js to webUnitsAPI.js, windwos.js to windows.js ([571f334](https://github.com/Alexius2408/WebSumize/commit/571f3343449d7c48528a172a87fac9b9a31444e5))
* rename the source folder from scr to src ([025465f](https://github.com/Alexius2408/WebSumize/commit/025465f2ea77177ed488d802ec216ecc497d246d))
* **constants:** add the USERROOT and LOG_DIR_PATH constants ([6e61025](https://github.com/Alexius2408/WebSumize/commit/6e6102512d7a17a6c037942f2c9189ad051b56d3), [7d01c74](https://github.com/Alexius2408/WebSumize/commit/7d01c7424c144dbde09315e4ed71494a050646ae))
* **logs:** save log files as .log instead of .txt ([16362ac](https://github.com/Alexius2408/WebSumize/commit/16362ac9b366f6d5dc1e8be609775de073c711a2))
* **main window:** show the timetable data in its own area instead of at the end of the page ([16362ac](https://github.com/Alexius2408/WebSumize/commit/16362ac9b366f6d5dc1e8be609775de073c711a2))
* **constants:** move file paths into a separate PATHS group ([6bf669e](https://github.com/Alexius2408/WebSumize/commit/6bf669e76c8e254a76692c9dc799315086d66611))
* move the tray and window code out of main.js into their own files ([4721f59](https://github.com/Alexius2408/WebSumize/commit/4721f590b547fc99fc163e338120572a50d67f1d))
* move the IPC handlers into their own files ([a2b39e2](https://github.com/Alexius2408/WebSumize/commit/a2b39e2bd8f7ae9368ea7fb8e63e75fc66dc3c02))
* remove the unused update.js ([ee42460](https://github.com/Alexius2408/WebSumize/commit/ee42460a2fdb608006b587711dfef6e880fd3875))
* **logs:** remove the error log system again and print errors to the console with `console.error()` instead, because the log files were too complicated ([d9ca74f](https://github.com/Alexius2408/WebSumize/commit/d9ca74f209588d2acb0f90c7ce73ebc0cf1a1879))

### Documentation

* add the README ([d53c804](https://github.com/Alexius2408/WebSumize/commit/d53c8047238ecdecb08ad889e274e60cd25fcdf0))
* update and format the README ([7482223](https://github.com/Alexius2408/WebSumize/commit/74822239fcf6dd8471a2f81b437fe5eeb2971e49), [3871f2b](https://github.com/Alexius2408/WebSumize/commit/3871f2bca484c820761892cb945433bb1f0de83e), [6a57f16](https://github.com/Alexius2408/WebSumize/commit/6a57f160f3aa67f28ebb52c6e3562cf6207c2437), [e951dfc](https://github.com/Alexius2408/WebSumize/commit/e951dfcad5cb1225ae601b4c1130c1dd31315609))
* add the license and rename the help website folder to WebsiteForHelp ([4c70039](https://github.com/Alexius2408/WebSumize/commit/4c7003994354917a25c6b25a3a3a61fed6873c22))
* add a license header and a description to every file ([571f334](https://github.com/Alexius2408/WebSumize/commit/571f3343449d7c48528a172a87fac9b9a31444e5))
* add the MIT license of the WebUntis library ([ec2f6ef](https://github.com/Alexius2408/WebSumize/commit/ec2f6efce406dea4052ac06cf17561f0a0bf6954)) and a link to its repository ([7151c2e](https://github.com/Alexius2408/WebSumize/commit/7151c2ed45958fd6c9be2f88d778459a0ada3fb4))
* add a security policy ([314b13b](https://github.com/Alexius2408/WebSumize/commit/314b13bb5363ee3323e1a0eb07d5939bf41986b4), [51b76b9](https://github.com/Alexius2408/WebSumize/commit/51b76b97130319ce6f47e7310ce419a1b05882f8), [d9ca74f](https://github.com/Alexius2408/WebSumize/commit/d9ca74f209588d2acb0f90c7ce73ebc0cf1a1879))
* **logs:** explain the log system in logs_explanation.md, removed again together with the log system ([51b76b9](https://github.com/Alexius2408/WebSumize/commit/51b76b97130319ce6f47e7310ce419a1b05882f8), [d9ca74f](https://github.com/Alexius2408/WebSumize/commit/d9ca74f209588d2acb0f90c7ce73ebc0cf1a1879))

### Chores

* remove node_modules from the repository and add a .gitignore ([6dbe353](https://github.com/Alexius2408/WebSumize/commit/6dbe353954c41aa5051de9610651482d528640a2))
* rename the package from webunits_information to websumize ([7d01c74](https://github.com/Alexius2408/WebSumize/commit/7d01c7424c144dbde09315e4ed71494a050646ae))
* remove a log file that was uploaded by accident ([51b76b9](https://github.com/Alexius2408/WebSumize/commit/51b76b97130319ce6f47e7310ce419a1b05882f8))
* set the author in package.json ([e951dfc](https://github.com/Alexius2408/WebSumize/commit/e951dfcad5cb1225ae601b4c1130c1dd31315609))
* ignore personal notes (TODO.md, IdeasForSettings.md) ([16362ac](https://github.com/Alexius2408/WebSumize/commit/16362ac9b366f6d5dc1e8be609775de073c711a2), [6bf669e](https://github.com/Alexius2408/WebSumize/commit/6bf669e76c8e254a76692c9dc799315086d66611))
* ignore build output and system files ([80759b1](https://github.com/Alexius2408/WebSumize/commit/80759b14858b00c19503d7641bf1de70ab68b26c))
* set the version to 0.0.42 by hand, with the plan to raise the last number after every commit (42 commits so far) ([b2187bf](https://github.com/Alexius2408/WebSumize/commit/b2187bf7367ffd48956a9f9644d3bc29ec9a6153))

### Build

* add an npm start script and Electron as a dev dependency ([dcfefe0](https://github.com/Alexius2408/WebSumize/commit/dcfefe048887a9388156ade0a5890ce9eb5af4cd))
* update dependencies ([80759b1](https://github.com/Alexius2408/WebSumize/commit/80759b14858b00c19503d7641bf1de70ab68b26c))
* clean up the dependency list and add is-online ([0b42d0c](https://github.com/Alexius2408/WebSumize/commit/0b42d0c243f429d9016cd3b0aa5a81cc4a48ed97))
* update dependencies to fix security issues (is-online 12, got 15, undici 8) ([7c4b481](https://github.com/Alexius2408/WebSumize/commit/7c4b4812271a2015506961572c4433478ce3652c))
