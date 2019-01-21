# Mosaic Grid

cd packages/native-grid/
npm link

cd ../mosaic-grid/
npm link @ptsecurity/native-grid
npm install

cd ../angular-cli-example/
npm link @ptsecurity/native-grid
npm link @ptsecurity/mosaic-grid
npm install

### Build

cd ../
npm run buildCore

### Run example

cd angular-cli-example/
ng serve
