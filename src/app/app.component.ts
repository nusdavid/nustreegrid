import { Component, OnInit, ViewChild } from '@angular/core';
import { SortService, ResizeService, PageService, EditService, ContextMenuService, TreeGridComponent, ColumnChooserService, FreezeService, Column, InfiniteScrollService } from '@syncfusion/ej2-angular-treegrid';
import {  EditSettingsModel, RowPosition } from '@syncfusion/ej2-treegrid';
import axios from 'axios';
import { DialogComponent, ButtonPropsModel } from '@syncfusion/ej2-angular-popups';
import { FormControl, FormGroup } from '@angular/forms';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [SortService, ResizeService, PageService, EditService, ContextMenuService, ColumnChooserService, FreezeService, InfiniteScrollService]
})
export class AppComponent implements OnInit {
  public data: any;
  public contextMenuItems: object[] = [];
  public editing: EditSettingsModel = {};
  public toolbar: any[] = [];
  public columns: any[] = [];
  public filterSettings: Object = {};
  public sortSettings: Object = {};
  public selectionSettings: Object = {};
  public pageSettings!: Object;
  @ViewChild('treegrid', { static: false })
  public treegrid!: TreeGridComponent;

  @ViewChild('columnDialog')
  public columnDialog!: DialogComponent;
  public hidden: Boolean = false;
  public columnDialogButtons: ButtonPropsModel[] = [{
    click: this.columnDialogBtnClick.bind(this),
    buttonModel: {
      content: 'Submit', isPrimary: true
    }
  }, { click: this.closeColumnDialog.bind(this), buttonModel: { content: 'Close' } }];
  public target: string = '.control-section';
  public columnForm!: FormGroup;
  public selectedEditColumn: any = {};

  public copyingRows: any[] = [];

  public columnDialogHeader: string = ''
  public columnDialogAction: string = ''

  public currentAddingColumnIndex: number = -1
  public currentEditingColumnIndex: number = -1

  public clipboardAction: string = ''
  public deletedIndex: number = -1

  public showTree: boolean = false

  ngOnInit(): void {
    this.contextMenuItems =  [
      { text: 'New', target: '.e-headercontent', id: 'add-column' },
      { text: 'Del Col', target: '.e-headercontent', id: 'delete-column' },
      { text: 'Edit', target: '.e-headercontent', id: 'edit-column' },
      { text: 'Freeze', target: '.e-headercontent', id: 'freeze-column' },
      { text: 'Add Next', target: '.e-content', id: 'add-row' },
      { text: 'Add Child', target: '.e-content', id: 'add-child' },
      { text: 'Copy', target: '.e-content', id: 'copy-rows' },
      { text: 'Cut', target: '.e-content', id: 'cut-rows' },
      { text: 'Paste Next', target: '.e-content', id: 'paste-rows' },
      { text: 'Paste Child', target: '.e-content', id: 'paste-child' },
      { text: 'Del', target: '.e-content', id: 'delete-row' },
    ]
    this.editing = { allowDeleting: true, allowAdding: true, allowEditing: true, mode: 'Dialog' };
    this.toolbar = ['ColumnChooser'];
    this.filterSettings = { type: 'FilterBar', hierarchyMode: 'Parent', mode: 'Immediate' };
    this.sortSettings =  { columns: [{ field: 'taskId', direction: 'Ascending' }]}
    this.selectionSettings = { type: 'Multiple' };
    this.pageSettings= { pageSize: 50 };

    this.getData()

    this.columnForm = new FormGroup({
      headerText: new FormControl(''),
      editType: new FormControl(''),
      defaultValue: new FormControl(''),
      fontColor: new FormControl(''),
      backgroundColor: new FormControl(''),
      textAlign: new FormControl(''),
      textWrap: new FormControl(''),
      fontSize: new FormControl(''),
      minWidth: new FormControl('')
    });
  }

  async getData() {
    const res = await axios.get(`${environment.apiUrl}/api/v1/treegrid`)
    this.columns = res.data.columns;
    this.data = res.data.data;

    this.showTree = true
  }

  async save() {
    const res = await axios.post(
      `${environment.apiUrl}/api/v1/treegrid`,
      {
        data: this.data,
        columns: this.columns
      }
    )

    this.columns = res.data.columns
    this.data = res.data.data
  }

  async addRow(rowInfo: any) {
    this.treegrid.editSettings.newRowPosition = 'Below'
    const value = { taskId: Math.floor(Math.random() * (10000000 - 1 + 1) + 1)}
    this.treegrid.addRecord(value, rowInfo.rowIndex, 'Below')

    await this.sleep(500)
    await this.save()
  }

  async addChild(rowInfo: any) {
    this.treegrid.editSettings.newRowPosition = 'Child'
    const value = { taskId:  Math.floor(Math.random() * (10000000 - 1 + 1) + 1) }
    this.treegrid.addRecord(value, rowInfo.rowIndex, 'Child')

    await this.sleep(500)
    await this.save()
  }

  async deleteRow(index: number) {
    this.data.splice(index, 1)
    this.treegrid.refresh()

    await this.sleep(500)
    await this.save()
  }

  actionComplete(args: any) {
    if (args.requestType == "save") {
      const index = args.index;
      this.treegrid.selectRow(index);
    }
  }

  addColumn(index: number) {
    this.currentAddingColumnIndex = index
    this.columnDialogHeader = 'Add Column'
    this.columnDialogAction = 'add'
    this.columnForm.reset()
    this.columnDialog.show()
  }

  editColumn(index: number) {
    this.currentEditingColumnIndex = index
    this.columnDialogHeader = 'Edit Column'
    this.columnDialogAction = 'edit'
    this.columnForm.reset()
    this.columnDialog.show()
    this.selectedEditColumn = this.columns[index]

    this.columnForm.setValue({
      headerText: this.selectedEditColumn.headerText || '',
      editType: this.selectedEditColumn.editType || '',
      defaultValue: this.selectedEditColumn.defaultValue || '',
      fontColor: this.selectedEditColumn.fontColor || '',
      backgroundColor: this.selectedEditColumn.backgroundColor || '',
      textAlign: this.selectedEditColumn.textAlign || 'left',
      textWrap: this.selectedEditColumn.textWrap || '',
      fontSize: this.selectedEditColumn.fontSize || '',
      minWidth: this.selectedEditColumn.minWidth || 50,
    })
  }

  closeColumnDialog() {
    this.columnDialog.hide()
  }

  async columnDialogBtnClick() {
    if (this.columnDialogAction === 'add') {
      await this.handleAddColumn()
    } else {
      await this.handleEditColumn()
    }
    this.columnDialog.hide();
  }

  async handleAddColumn() {
    const column = this.handleFormatColumn()
    this.treegrid.columns.splice(this.currentAddingColumnIndex + 1, 0, new Column(column))
    this.treegrid.refreshColumns()
    this.updateData(this.data, column.field, column.defaultValue, column.editType)
    this.treegrid.refresh();

    await this.sleep(500)
    await this.save()
  }

  async handleEditColumn() {
    const column = this.handleFormatColumn()
    this.treegrid.columns.splice(this.currentEditingColumnIndex, 1, new Column(column))
    this.treegrid.refreshColumns()

    await this.sleep(500)
    await this.save()
  }

  handleFormatColumn() {
    const column = this.columnForm.value
    column.field = this.camelize(column.headerText)
    column.width = 120

    if (column.fontColor || column.fontSize || column.backgroundColor || column.textWrap) {
      const style: any = {}
      if (column.fontSize) {
        style['fontSize'] = column.fontSize
        delete column.fontSize
      }
      if (column.fontColor) {
        style['color'] = column.fontColor
        delete column.fontColor
      }
      if (column.backgroundColor) {
        style['backgroundColor'] = column.backgroundColor
        delete column.backgroundColor
      }
      if (column.textWrap) {
        style['wordBreak'] = column.textWrap
        delete column.wordWrap
      }

      column.customAttributes = { style }
    }

    return column
  }

  updateData(data: any, field: string, defaultValue: string, dataType: string) {
    data.forEach((a: any) => {
      a[field] = dataType.includes('numericedit') ? parseFloat(defaultValue) : defaultValue;
      if (a.hasOwnProperty('subtasks')) {
        this.updateData(a['subtasks'], field, defaultValue, dataType);
      }
    });
  }

  deleteColumn(index: number) {
    this.columns.splice(index, 1);
  }

  freezeColumn(field: string) {
    this.treegrid.getColumnByField(field).freeze = 'Left'
    this.treegrid.refreshColumns()
  }

  copyRows() {
    this.clipboardAction = 'copy'
    this.copyingRows = this.treegrid.getSelectedRecords()
    this.copyingRows = this.copyingRows.reverse()
    this.highlightSelectedRows(this.treegrid.getSelectedRowIndexes());
    this.treegrid.copy();
  }

  cutRows() {
    this.clipboardAction = 'cut'
    this.copyingRows = this.treegrid.getSelectedRecords()
    this.copyingRows = this.copyingRows.reverse()
    this.highlightSelectedRows(this.treegrid.getSelectedRowIndexes());
    this.treegrid.copy();
  }

  async pasteRows(rowIndex: number, position: RowPosition) {
    if (this.clipboardAction == 'copy') {
      this.treegrid.editSettings.newRowPosition = position
      const data: any[] = []

      this.copyingRows.forEach(async (element: object) => {
        const newData = JSON.parse(JSON.stringify(element))
        const obj = { ...newData['taskData'] };
        await this.sleep(100);

        this.treegrid.addRecord(obj, rowIndex, position)
      });

      this.treegrid.refresh();
    } else if (this.clipboardAction == 'cut') {
      this.treegrid.editSettings.newRowPosition = position
      this.deletedIndex = rowIndex;

      const objArray: object[] = [];
      Promise.all(this.copyingRows.map(async (element: object): Promise<void> => {
        const newData = JSON.parse(JSON.stringify(element))
        objArray.push(newData.taskData);
        await this.deleteObjectRecord(element)
      })).then(async () => {
        await this.sleep(100);
        objArray.forEach(async (obj1: object) => {
          let data = JSON.parse(JSON.stringify(obj1))
          await this.sleep(1)
          const ind = position === 'Below' ? rowIndex - this.copyingRows.length : rowIndex - this.copyingRows.length

          this.treegrid.addRecord(data, ind, position)
        });
      });

      this.sleep(500).then(() => {
        this.treegrid.refresh();
      });
    }

    await this.sleep(500)
    await this.save()
  }

  public deleteObjectRecord(element: any, deleteRow: boolean = true) {
    return new Promise<void>(async (resolve, reject) => {
      if (element.hasOwnProperty('subtasks')) {
        element.subtasks.forEach(async (element1: any) => {
          if (element1.hasOwnProperty('subtasks')) {
            await this.deleteObjectRecord(element1, false);
          }
          if (element['index'] < this.deletedIndex) {
            this.deletedIndex--;
          }
        });
      }

      if (deleteRow == true) {
        if (element['index'] < this.deletedIndex) {
          // console.log("main");
          this.deletedIndex--;
          // console.log(this.deletedIndex);
        }
        await this.sleep(1);

        this.treegrid.deleteRecord('taskId', element);
      }
      resolve();
    });
  }

  contextMenuClick(args: any): void {
    switch(args.item.id) {
      case 'add-column':
        this.addColumn(args.column.index)
        break
      case 'edit-column':
        this.editColumn(args.column.index)
        break
      case 'delete-column':
        this.deleteColumn(args.column.index)
        break
      case 'freeze-column':
        this.freezeColumn(args.column.field)
        break
      case 'add-row':
        this.addRow(args.rowInfo)
        break
      case 'delete-row':
        this.deleteRow(args.rowInfo.rowIndex)
        break
      case 'add-child':
        this.addChild(args.rowInfo)
        break
      case 'copy-rows':
        this.copyRows()
        break
      case 'cut-rows':
        this.cutRows()
        break
      case 'paste-rows':
        this.pasteRows(args.rowInfo.rowIndex, 'Below')
        break
      case 'paste-child':
        this.pasteRows(args.rowInfo.rowIndex, 'Child')
        break
      default:
        console.log('Invalid Item Id:', args.item.id)
    }
  }

  camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  highlightSelectedRows(selectedItems: any) {
    for (let i in selectedItems) {
      this.treegrid.getRowByIndex(selectedItems[i]).querySelectorAll('td').forEach((element) => {
        element.style.background = 'pink';
      });
    }
  }

  sleep(num: number) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, num);
    });
  }
}
