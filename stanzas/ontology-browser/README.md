## Ontology browser

Animated ontology browser wich can be used with almost any ontology API.

### Parameters

#### `api-endpoint`

API endpoint with placeholder (`<>`) for id.

#### `initial-id`

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
