## Ontology browser

Animated ontology browser wich can be used with almost any ontology API.

### Parameters

#### `api_endpoint`

API endpoint with placeholder (`<>`) for id.
Node information will be fetched by replacing the placeholder with clicked node `id`.

#### `initial_id`

Initial node id to display at load time.

#### `node-id_path`

Path to uniqe id of the node, in API response. Path to nested value can be used. In that case, path parts should be separated by periods (`details.id`)
E.g. if API response is JSON:

```json
{
    "details": {
        "id": "HP:0001168",
        "name": "Short phalanx of finger",
        ...
    },
    ...
}
```

`node-id_path` would be `details.id`.

#### `node-label_path`

Path to label of the node in response JSON. Nested path can be used, similar to `node-id_path`

#### `node-details_path`

Path to node other details object.

#### `node-details_show_keys`

List of data keys in the node details object (defined by `node-details_path`) to display.

#### `node-relations-parents_path` and `node-relations-children_path`

Path to arrays of node children and parents.

#### `node-relations-id_key` and `node-relations-label_key`

Key of id and label of the children / parents nodes inside the children/parents array item. No nested path is supported here.
E.g. in case of this node data:

```json
{
    "details": {
        "id": "HP:0001168",
        "name": "Short phalanx of finger",
        ...
    },
    "relations": {
        "children": [
            {"ontologyId": "HP0000234", "name" : "Some disorder 1"},
            {"ontologyId": "HP0000235", "name" : "Some disorder 2"}
        ],
        "parents": [
            {"ontologyId": "HP0000233", "name" : "Some disorder 4"},
        ]
    }
    ...
}
```

`node-relations-id_key` should be set to `"ontologyId"` and `node-relations-label_key` should be set to `"name"`.
