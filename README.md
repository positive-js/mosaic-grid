### Сборка

cd packages/native-grid/   
npm link

cd ../../packages/mosaic-grid/   
npm link @ptsecurity/native-grid   
npm install

cd ../../   
npm install   
npm run buildCore

### Сборка примера
cd packages/angular-cli-example/   
npm link @ptsecurity/native-grid   
npm link @ptsecurity/mosaic-grid   
npm install

Note: If you get "npm ERR! Maximum call stack size exceeded" try to delete packages/angular-cli-example/package-lock.json and packages/angular-cli-example/node_modules and re-run npm install

### Запуск примера
cd packages/angular-cli-example/   
ng serve

### Как обновить код из исходного репозитория https://github.com/ag-grid/ag-grid
1. Клонируем https://github.com/ag-grid/ag-grid
2. Копируем ag-grid/packages/ag-grid-angular/src/* в mosaic-grid/packages/mosaic-grid/src/
3. Копируем из папки ag-grid/packages/ag-grid-angular/ в mosaic-grid/packages/mosaic-grid/ те файлы, которые уже есть в последней.
   Обращаем внимание на то, что в package.json нужно внести изменения в задачу ngc-main, связанные с заменой модуля gulp-ngc на собственную реализацию.
4. В папке mosaic-grid/packages/mosaic-grid/ заменяем строку ag-grid-community на @ptsecurity/native-grid
5. Аккуратно просматриваем разницу между ag-grid/packages/ag-grid-angular/package.json и mosaic-grid/packages/mosaic-grid/package.json и доносим в последний изменения.
6. Копируем ag-grid/packages/ag-grid-community/src/* в mosaic-grid/packages/native-grid/src/
7. Копируем из папки ag-grid/packages/ag-grid-community/ в mosaic-grid/packages/native-grid/ те файлы, которые уже есть в последней.
8. Аккуратно просматриваем разницу между ag-grid/packages/ag-grid-community/package.json и mosaic-grid/packages/native-grid/package.json и доносим в последний изменения.
9. Проверяем diff
10. Выполняем шаги из раздела "Сборка"
