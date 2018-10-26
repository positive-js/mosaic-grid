import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';

import { GridOptions, ColDef, Events, AgGridEvent, RowEvent, IGetRowsParams, IDatasource } from '@ptsecurity/native-grid';
import { AgGridNg2 } from '@ptsecurity/mosaic-grid';

import { AgGridNavigation, AgGridSaveState } from '../ag-grid-custom.service';
import { AgGridCustomDataService } from '../ag-grid-custom-data.service';

import {debounce, distinctUntilChanged, finalize} from 'rxjs/operators';
import { of, timer } from 'rxjs';
import { debounce as  debounceLodash } from 'lodash';

interface GridDataProvider {
  datasource: IDatasource;
  searchText: string;
}

@Component({
  selector: 'app-custom-grid',
  templateUrl: './custom-grid.component.html'
})
export class CustomGridComponent implements OnInit {
  @ViewChild('agGrid') agGrid: AgGridNg2;
  @ViewChild('log') logElement: ElementRef;

  private logContents = '';

  private writeToLog = debounceLodash(() => {
    this.logElement.nativeElement.value = this.logContents;
    this.logElement.nativeElement.scrollTop = this.logElement.nativeElement.scrollHeight;
  }, 200);

  /*
  Использование в качестве datasource отдельного класса добавляет ряд неудобств.
  1. Как выделить строку после загрузки первой страницы?
  Это удобно делать в логике контроллера, поэтому отдельный datasource вносит сложность.
  2. Как пробросить флаг/промис для mc-loader в шаблон?
  Поэтому, более удобным представляется использование в качестве datasource простого объекта.
  */
  private gridDataProvider: GridDataProvider = {
    datasource: {
      getRows: this.getGridRows.bind(this)
    },
    searchText: ''
  };

  public gridOptions: GridOptions;
  public searchText = new FormControl();

  constructor(private agGridCustomDataService: AgGridCustomDataService) {
    this.gridOptions = {
      columnDefs: this.createColDefs(),
      enableColResize: true,
      enableSorting: true,
      // разрешает точки в field
      suppressFieldDotNotation: true,
      /*
      https://www.ag-grid.com/javascript-grid-keyboard-navigation/#suppress-cell-selection
      suppressCellSelection отключает клавиатурную навигацию
      */
      // suppressCellSelection: true,
      onGridReady: this.onGridReady.bind(this),
      rowSelection: 'multiple',

      rowModelType: 'infinite',
      // нужно выставить флаг, чтобы грид вызывал datasource при изменении сортировки
      enableServerSideSorting: true,
      // неудобно, по сути этим настраивается количество запрашиваемых с сервера данных
      cacheBlockSize: 100,

      /*
      Этот блок переменных нужен для того, чтобы обойти прибитые гвоздями темы.
      Например, в src/ts/gridOptionsWrapper.ts в функции getHeaderHeight для получения высоты заголовка используется
      функция specialForNewMaterial, которая обращается к методам из файла src/ts/environment.ts, в котором дофига хардкода.
      */
      headerHeight: 34,
      rowHeight: 36
    };

    this.initSearch();
  }

  ngOnInit() {
  }

  scrollTo(index) {
    this.gridOptions.api.ensureIndexVisible(index);
    const rowNode = this.gridOptions.api.getDisplayedRowAtIndex(index);
    rowNode.setSelected(true);
  }

  clearSelection() {
    this.gridOptions.api.deselectAll();
  }

  clearLog() {
    this.logContents = '';
    this.writeToLog();
  }

  initSearch() {
    this.searchText.valueChanges
      .pipe(
        debounce((value) => {
          if (value) {
            return timer(400);
          }
          return of(value);
        }),
        distinctUntilChanged()
      )
      .subscribe((searchText) => {
        this.gridDataProvider.searchText = searchText;
        this.gridOptions.api.setDatasource(this.gridDataProvider.datasource);
      });
  }

  private createColDefs() {
    return AgGridCustomDataService.DATA_ITEM_FIELDS.map((fieldName) => {
      const colDef: ColDef = {
        headerName: fieldName,
        field: fieldName
      };
      // простейший кастомный шаблон ячейки
      if (fieldName === 'agent_id') {
        colDef.cellRenderer = (params) => params.value ? `<b>${params.value}</b>` : '';
      }
      // кастомный шаблон ячейки со ссылкой
      if (fieldName === 'input_id') {
        colDef.cellRenderer = (params) => params.value ?
          `<a href="" class="mc-link"><span class="mc-link__text">${params.value}</span></a>` :
          '';
      }
      return colDef;
    });
  }

  private onGridReady() {
    this.log('Grid ready');
    /*
    Несмотря на то, что в документации сказано, что событие gridReady предназначено в том числе для изменения размеров столбцов,
    заметно дергание столбцов в момент между инициализацией грида и восстановлением его состояния.
    */
    const agGridSaveState = new AgGridSaveState(this.gridOptions, 'myCustomGrid');

    const agGridNavigation = new AgGridNavigation(this.gridOptions, this.agGrid);

    this.gridOptions.api.setDatasource(this.gridDataProvider.datasource);

    this.setupSelectionChangeHandler();
    this.setupRowDoubleClickHandler();
  }

  private getGridRows(params: IGetRowsParams): void {
    this.gridOptions.api.showLoadingOverlay();

    this.agGridCustomDataService.getData(params.startRow, params.endRow, params.sortModel, this.gridDataProvider.searchText)
      .pipe(
        finalize(() => this.gridOptions.api.hideOverlay())
      )
      .subscribe(
        (response) => {
          /*
          В случае безусловной передачи второго параметра lastRow поведение грида отличается от мозаичного:
          1. Длина полосы прокрутки эмулирует весь объем данных.
          2. Нажатие End перебрасывает к реальному концу данных, и при последующей прокрутке вверх
          будут дозагружаться пропущенные интервалы данных.

          В случае, если не передаем второй параметр lastRow, получаем поведение как в мозаичном гриде:
          1. Длина полосы прокрутки отображает только загруженные данные.
          2. Нажатие End перебрасывает к концу загруженных данных.
          3. Чтобы сказать гриду, что пришла последняя порция данных, нужно передать в колбэк вторым параметром lastRow.
          */
          params.successCallback(response.data, params.endRow < response.totalCount ? undefined : response.totalCount);

          if (params.startRow === 0) {
            const rowNode = this.gridOptions.api.getDisplayedRowAtIndex(0);
            rowNode.setSelected(true);
            this.gridOptions.api.setFocusedCell(0, this.gridOptions.columnApi.getAllColumns()[0].getColId());
          }
        },
        (error) => {
          params.failCallback();
        }
      );
  }

  private log(str: String) {
    this.logContents += str + '\n';
    this.writeToLog();
  }

  /*********** пример обработки выделения строк *************/
  private setupSelectionChangeHandler() {
    this.gridOptions.api.addEventListener(Events.EVENT_ROW_SELECTED, (event: RowEvent) => {
      const action = event.node.isSelected() ? 'Selected' : 'Deselected';
      this.log(`${action} row: ${event.rowIndex}`);
    });
    this.gridOptions.api.addEventListener(Events.EVENT_SELECTION_CHANGED, (event: AgGridEvent) => {
      /*
      TODO: Здесь никак нельзя получить lastSelectedNode.
      В коде node_modules/ag-grid-community/src/ts/entities/rowNode.ts в функции doRowRangeSelection они получают lastSelectedNode,
      но почему-то не добавляют его в событие EVENT_SELECTION_CHANGED. WTF???
      А в событии EVENT_SELECTION_CHANGED строки всегда приходят в том порядке, как они идут в гриде.
      Т.е. если кликнуть 10-ую строку и потом 1-ую, то здесь в selected получаем строки с 1-ой по 10-ую.
      И никак не можем узнать, что последней кликнутой строкой была 1-ая.
      */
      const selected = this.gridOptions.api.getSelectedNodes();
      this.log(`Selected rows count: ${selected.length}`);
    });
  }

  /*********** пример обработки двойного клика по строке *************/
  private setupRowDoubleClickHandler() {
    this.gridOptions.api.addEventListener(Events.EVENT_ROW_DOUBLE_CLICKED, (event: RowEvent) => {
      this.log(`Double click row: ${event.rowIndex}`);
    });
  }
}
