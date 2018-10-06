import { AgGridEvent, Events, GridOptions, Constants, NavigateToNextCellParams, RowNode } from '@ptsecurity/native-grid';
import { AnimationQueueEmptyEvent } from '@ptsecurity/native-grid/src/events';
import { AgGridNg2 } from 'ag-grid-angular';

interface GridState {
  sortModel: any;
  columnState: any;
}

class AgGridNavigation {

  constructor(
    private gridOptions: GridOptions,
    private agGridElementRef: AgGridNg2
  ) {
    this.gridOptions.navigateToNextCell = (params) => this.navigateToNextCell(params);

    this.setupKeyboardHandler();
  }

  /*
  Реализуем выделение строк с клавиатуры с зажатой клавишей Shift.
  Взято отсюда https://www.ag-grid.com/javascript-grid-selection/#selection-with-keyboard-arrow-keys
  */
  private navigateToNextCell(params: NavigateToNextCellParams) {
    const suggestedNextCell = params.nextCellDef;

    const rowModel = this.gridOptions.api.getModel();
    const prevRow = params.previousCellDef ? rowModel.getRow(params.previousCellDef.rowIndex) : undefined;
    const nextRow = params.nextCellDef ? rowModel.getRow(params.nextCellDef.rowIndex) : undefined;

    switch (params.key) {
      case Constants.KEY_DOWN:
        if (params.event.shiftKey) {
          if (nextRow && prevRow) {
            if (nextRow.isSelected() && prevRow.isSelected()) {
              prevRow.setSelected(false, false);
            }
            if (!nextRow.isSelected() && !prevRow.isSelected()) {
              prevRow.setSelected(true, false);
            }
          }
          if (nextRow) {
            nextRow.setSelected(true, false);
          }
        }
        return suggestedNextCell;
      case Constants.KEY_UP:
        if (params.event.shiftKey) {
          if (nextRow && prevRow) {
            if (nextRow.isSelected() && prevRow.isSelected()) {
              prevRow.setSelected(false, false);
            }
            if (!nextRow.isSelected() && !prevRow.isSelected()) {
              prevRow.setSelected(true, false);
            }
          }
          if (nextRow) {
            nextRow.setSelected(true, false);
          }
        }
        return suggestedNextCell;
      case Constants.KEY_LEFT:
      case Constants.KEY_RIGHT:
        return suggestedNextCell;
      default:
        throw new Error('this will never happen, navigation is always on of the 4 keys above');
    }
  }

  private setupKeyboardHandler() {
    /*
    Переопределяем обработку нажатия клавиш.
    Решение найдено тут https://github.com/ag-grid/ag-grid/issues/1288#issuecomment-290532033
    */
    document.documentElement.addEventListener('keydown', (e: KeyboardEvent) => {
      const key = e.which || e.keyCode;
      // TODO: как получить ссылку на DOM-элемент грида?
      // this runs on the document element, so check that we're in the grid
      if (document.querySelector('ag-grid-angular').contains(<Node>e.target)) {
        if (key === Constants.KEY_TAB || key === Constants.KEY_PAGE_HOME || key === Constants.KEY_PAGE_END) {
          e.stopImmediatePropagation();
          e.stopPropagation();
        }
        if (key === Constants.KEY_PAGE_HOME || key === Constants.KEY_PAGE_END) {
          // we don't want to prevent the default tab behaviour
          e.preventDefault();
        }

        /*
        Целевое поведение: клавиши Home/End и PageUp/PageDown не должны менять выделенную строку.
        */
        if (key === Constants.KEY_PAGE_HOME) {
          this.scrollToRow(0);
        } else if (key === Constants.KEY_PAGE_END) {
          this.scrollToRow(this.gridOptions.api.getModel().getPageLastRow() - 1);
        } else if (e.ctrlKey && key === Constants.KEY_A) {
          /*
          Метод gridOptions.api.selectAll не работает с моделями строк, отличными от clientSide.
          Поэтому, делаем то же самое, но без проверок.
          */
          this.gridOptions.api.forEachNode((rowNode: RowNode) => rowNode.selectThisNode(true));
        }
      }
    }, true);
  }

  private scrollToRow(rowIndex) {
    const focusedCell = this.gridOptions.api.getFocusedCell();

    this.gridOptions.api.ensureIndexVisible(rowIndex);

    // TODO: можно ли вернуть фокус в грид проще?
    const animationQueueEmptyHandler = (event: AnimationQueueEmptyEvent) => {
      this.gridOptions.api.removeEventListener(Events.EVENT_ANIMATION_QUEUE_EMPTY, animationQueueEmptyHandler);

      // возвращаем фокус в грид
      this.gridOptions.api.setFocusedCell(rowIndex, focusedCell.column.getColId());
    };

    /*
    Если очередь пуста, то обработчик не вызывается, поэтому вызываем вручную.
    Например это случай, когда строка уже находится в области видимости.
    Вопреки названию, метод isAnimationFrameQueueEmpty возвращает истину, когда очередь НЕ пуста. Об этом же написано и в документации
    https://www.ag-grid.com/javascript-grid-api/: Returns true if the grid has animation frames to execute.
    */
    if (this.gridOptions.api.isAnimationFrameQueueEmpty() === false) {
      animationQueueEmptyHandler(<AnimationQueueEmptyEvent>undefined);
    } else {
      this.gridOptions.api.addEventListener(Events.EVENT_ANIMATION_QUEUE_EMPTY, animationQueueEmptyHandler);
    }
  }
}

class AgGridSaveState {
  private state: GridState;

  constructor(
    private gridOptions: GridOptions,
    private identityKey: string
  ) {
    this.init();
  }

  private init() {
    this.restoreGridState();

    this.gridOptions.api.addGlobalListener((type: string, event: AgGridEvent) => {
      switch (event.type) {
        case Events.EVENT_SORT_CHANGED:
          this.state.sortModel = this.gridOptions.api.getSortModel();
          this.saveGridState();
          break;
        case Events.EVENT_COLUMN_RESIZED:
        case Events.EVENT_DISPLAYED_COLUMNS_CHANGED:
        case Events.EVENT_COLUMN_MOVED:
        case Events.EVENT_COLUMN_PINNED:
          this.state.columnState = this.gridOptions.columnApi.getColumnState();
          this.saveGridState();
          break;
        default:
          break;
      }
    });
  }

  private restoreGridState() {
    this.state = JSON.parse(localStorage.getItem(this.identityKey)) || {};

    if (this.state.sortModel) {
      this.gridOptions.api.setSortModel(this.state.sortModel);
    }

    if (this.state.columnState) {
      this.gridOptions.columnApi.setColumnState(this.state.columnState);
    }
  }

  private saveGridState() {
    localStorage.setItem(this.identityKey, JSON.stringify(this.state));
  }
}

export { AgGridNavigation, AgGridSaveState };
