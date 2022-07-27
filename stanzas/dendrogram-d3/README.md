## Data format

Use following data format to vizualize the graph in this stanza:

```json
[

  {
    "id": 1,
    "name": "A",
    "size": 100
  }
  {
    "id": 2,
    "name": "B",
    "parent": 1,
    "size": 10,
    "group":"a"
  },
  ...
]
```

`id` is the unique identifier of the node. Required. Name "id" should be used
`parent` is the id of the parent node. Optional. Name "parent" should be used
Others fields are optional.
