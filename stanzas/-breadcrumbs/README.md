# Breadcrumbs

### Showing nodes

In order to visualise the data, Breadcrumbs stanza should receive:

1. data with `data-url` as well as `data-type`.
2. Inital data node id to show.

The data should be hierarchy tree-like data of the format:

```json
[
  {
    "id": 1,
    "value": "some_value",
    "label": "Some label",
    "children": [2, 19, 25, 29, 30],
  },
  {
    "id": 2,
    "value": "some_value",
    "label": "Some another label",
    "children": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    "parent": 1,
  },
  ...
]
```

`id` key in data is mandatory and its values should be uniqe for every node. Numbers as well as strings are accepted.

### Dropdown menu display

In order to display dropdown menu for the nodes on top of other elements, container element of the breadcrumbs stanza should have `overflow: visible !important;` CSS property

### Copying current path

The path to current node can be copied in clipboard by clicking the Copy button. The copied path will be in the format:
`{Node1 label} > {Node2 label} > {Node3 label} > ....`

### Coupling with another stanza

Breadcrumbs should share the same data that have been passed to another stanza.
Than could be done by using

```html
<togostanza--data-source
  url="<url to data>"
  receiver="name_of_first_stanza, name_of_second_stanza"
  target-attribute="data-url"
></togostanza--data-source>
```

To change currently showing hierarchy node, Breadcrumbs stanza need to receive event `selectedDatumChanged` with

```javascript
{
  details:
  {
    id: <id of the node to show>
  }
}
```

as event payload.

Initially showing path could be defined by passing `initial-data-id` parameter, referring to id of the node, path to which should be shown at first loading.

Also, when clicking on the node inside the Breadcrumbs stanza, will dispatch same `selectedDatumChanged` event with payload containing the `id` of clicked node in same manner.
