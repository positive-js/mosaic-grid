### Build core

cd packages/native-grid/
npm link

cd packages/mosaic-grid/
npm link @ptsecurity/native-grid
npm install

cd ../../
npm install
npm run buildCore

### Build exmaple
cd packages/angular-cli-example/
npm link @ptsecurity/native-grid
npm link @ptsecurity/mosaic-grid
npm install

Note: If you get "npm ERR! Maximum call stack size exceeded" try to delete packages/angular-cli-example/package-lock.json and packages/angular-cli-example/node_modules and re-run npm install

### Run example
ng serve
