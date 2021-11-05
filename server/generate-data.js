const faker = require('faker');
const fs = require('fs');
const path = require('path');

const columns = [
  {
    "disableHtmlEncode": true,
    "allowSorting": true,
    "allowResizing": true,
    "allowFiltering": true,
    "allowGrouping": true,
    "allowReordering": true,
    "showColumnMenu": true,
    "enableGroupByFormat": false,
    "allowEditing": true,
    "showInColumnChooser": true,
    "allowSearching": true,
    "autoFit": false,
    "sortDirection": "Descending",
    "field": "taskId",
    "isPrimaryKey": true,
    "freeze": "Left",
    "uid": "grid-column7",
    "foreignKeyField": "taskId",
    "width": 200,
    "visible": true,
    "freezeTable": "frozen-left",
    "index": 0,
    "type": "number",
    "headerText": "ID"
  },
  {
    "disableHtmlEncode": true,
    "allowSorting": true,
    "allowResizing": true,
    "allowFiltering": true,
    "allowGrouping": true,
    "allowReordering": true,
    "showColumnMenu": true,
    "enableGroupByFormat": false,
    "allowEditing": true,
    "showInColumnChooser": true,
    "allowSearching": true,
    "autoFit": false,
    "sortDirection": "Descending",
    "editType": "stringedit",
    "defaultValue": 'Hello',
    "fontColor": "",
    "backgroundColor": "",
    "textAlign": "Center",
    "textWrap": "",
    "fontSize": "",
    "field": "name",
    "uid": "grid-column8",
    "foreignKeyField": "name",
    "width": 200,
    "visible": true,
    "freezeTable": "movable",
    "index": 1,
    "type": "string",
    "headerText": "Name",
    "customAttributes": {style: {color: "#000000", backgroundColor: '#e7ffb0'}}
  },
  {
    "disableHtmlEncode": true,
    "allowSorting": true,
    "allowResizing": true,
    "allowFiltering": true,
    "allowGrouping": true,
    "allowReordering": true,
    "showColumnMenu": true,
    "enableGroupByFormat": false,
    "allowEditing": true,
    "showInColumnChooser": true,
    "allowSearching": true,
    "autoFit": false,
    "sortDirection": "Descending",
    "editType": "stringedit",
    "defaultValue": "helloworld@yopmail.com",
    "fontColor": "",
    "backgroundColor": "",
    "textAlign": "",
    "textWrap": "",
    "fontSize": "",
    "field": "email",
    "uid": "grid-column9",
    "foreignKeyField": "email",
    "width": 200,
    "visible": true,
    "freezeTable": "movable",
    "index": 2,
    "type": "string",
    "headerText": "Email"
  },
  {
    "disableHtmlEncode": true,
    "allowSorting": true,
    "allowResizing": true,
    "allowFiltering": true,
    "allowGrouping": true,
    "allowReordering": true,
    "showColumnMenu": true,
    "enableGroupByFormat": false,
    "allowEditing": true,
    "showInColumnChooser": true,
    "allowSearching": true,
    "autoFit": false,
    "sortDirection": "Descending",
    "editType": "numericedit",
    "defaultValue": 18,
    "fontColor": "",
    "backgroundColor": "",
    "textAlign": "Right",
    "textWrap": "",
    "fontSize": "",
    "field": "age",
    "uid": "grid-column10",
    "foreignKeyField": "age",
    "width": 200,
    "visible": true,
    "freezeTable": "movable",
    "index": 3,
    "type": "number",
    "headerText": "Age"
  },
  {
    "disableHtmlEncode": true,
    "allowSorting": true,
    "allowResizing": true,
    "allowFiltering": false,
    "allowGrouping": true,
    "allowReordering": true,
    "showColumnMenu": true,
    "enableGroupByFormat": false,
    "allowEditing": true,
    "showInColumnChooser": true,
    "allowSearching": true,
    "autoFit": false,
    "sortDirection": "Descending",
    "editType": "datetimepickeredit",
    "defaultValue": '11/4/2021',
    "fontColor": "",
    "backgroundColor": "",
    "textAlign": "",
    "textWrap": "",
    "fontSize": "",
    "field": "birthDay",
    "uid": "grid-column11",
    "foreignKeyField": "birthDay",
    "width": 200,
    "visible": true,
    "freezeTable": "movable",
    "index": 4,
    "type": "string",
    "headerText": "BirthDay"
  },
  {
    "disableHtmlEncode": true,
    "allowSorting": true,
    "allowResizing": true,
    "allowFiltering": false,
    "allowGrouping": true,
    "allowReordering": true,
    "showColumnMenu": true,
    "enableGroupByFormat": false,
    "allowEditing": true,
    "showInColumnChooser": true,
    "allowSearching": true,
    "autoFit": false,
    "sortDirection": "Descending",
    "editType": "booleanedit",
    "defaultValue": true,
    "fontColor": "",
    "backgroundColor": "",
    "textAlign": "",
    "textWrap": "",
    "fontSize": "",
    "field": "male",
    "uid": "grid-column12",
    "foreignKeyField": "male",
    "width": 200,
    "visible": true,
    "freezeTable": "movable",
    "index": 5,
    "type": "string",
    "headerText": "Male?"
  },
  {
    "disableHtmlEncode": true,
    "allowSorting": true,
    "allowResizing": true,
    "allowFiltering": false,
    "allowGrouping": true,
    "allowReordering": true,
    "showColumnMenu": true,
    "enableGroupByFormat": false,
    "allowEditing": true,
    "showInColumnChooser": true,
    "allowSearching": true,
    "autoFit": false,
    "sortDirection": "Descending",
    "editType": "dropdownedit",
    "defaultValue": true,
    "fontColor": "",
    "backgroundColor": "",
    "textAlign": "",
    "textWrap": "",
    "fontSize": "",
    "field": "car",
    "uid": "grid-column13",
    "foreignKeyField": "car",
    "width": 200,
    "visible": true,
    "freezeTable": "movable",
    "index": 6,
    "type": "string",
    "headerText": "Car"
  }
]

const generate = () => {
  const times = 300;
  const data = [];

  for(var i = 0; i < times; i++){
    data.push({
      taskId: i,
      name: faker.name.findName(),
      email: faker.internet.email(),
      age: Math.floor(Math.random() * (80 - 1 + 1) + 1),
      birthDay: new Date(),
      male: [true, false][Math.floor(Math.random()*2)],
      car: ['Suzuki', 'Toyota', 'Honda'][Math.floor(Math.random()*3)]
    })
  }

  const json = JSON.stringify({
    columns,
    data
  })
  const jsonPath = path.join(__dirname, 'data.json')

  fs.writeFile(jsonPath, json, 'utf8', () => {
    console.log('DONE');
  });
}

generate()