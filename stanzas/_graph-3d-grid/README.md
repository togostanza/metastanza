## Data format

Use following data format to vizualize the graph in this stanza:

```json
{
  "nodes": [
    {"id": "Myriel", "group": 1, "key1": "value1", ...},
    {"id": "Napoleon", "group": 1,"key1": "value1", ...},
    {"id": "Mlle.Baptistine", "group": 1,"key1": "value1", ...},
    ...
    ],
    "links": [
        {"source": "Napoleon", "target": "Myriel", "key2": ...},
        {"source": "Mlle.Baptistine", "target": "Myriel", "key2": ...},
        ...
    ]
}
```

| Key     | Value          | Type  | Description   |
| ------- | -------------- | ----- | ------------- |
| `nodes` | Array of nodes | Array | List of nodes |
| `links` | Array of links | Array | List of links |

### Nodes data format

| Key     | Value          | Type                 | Description                                  |
| ------- | -------------- | -------------------- | -------------------------------------------- |
| `id`    | Node id        | `String` or `Number` | Unique node id                               |
| `group` | Node group     | `String` or `Number` | Node group to separate nodes to group planes |
| `key1`  | Node attribute | `String` or `Number` | Arbitrary node attribute                     |
| ...     | Node attribute | `String` or `Number` | Arbitrary node attribute                     |

### Links (edges) data format

| Key      | Value               | Type                 | Description              |
| -------- | ------------------- | -------------------- | ------------------------ |
| `source` | `id` of source node | `String` or `Number` | Unique node id           |
| `target` | `id` of target node | `String` or `Number` | Unique node id           |
| `key2`   | Node attribute      | `String` or `Number` | Arbitrary edge attribute |
| ...      | Node attribute      | `String` or `Number` | Arbitrary edge attribute |

### 3D

3d visualization is made possible by `d3-3d` plugin (https://github.com/Niekes/d3-3d)
