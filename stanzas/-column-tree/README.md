# Column tree

## Search settings

One can search for a node via the below 2 methods:

1. **keyword search**
    </br>
    To search by keyword, please set the data property used for searching at the `search-key` parameter.

2. **path search**
    </br>
    To search by path, please use the `id` of the path followed by a `/`. (see example below)
    <br/>
    This explanation on how to search by path is shown to the user by default next to the search box, but can be turned off by setting the `show-path-explanation` parameter to `false`.
    Furthermore, with the `show-path` parameter set to `true`, the path for each search hit will be shown in the suggestion box like the following: **<ruby>label<rp>(</rp><rt>id</rt><rp>)</rp></ruby>/<ruby>label<rp>(</rp><rt>id</rt><rp>)</rp></ruby>/**

<details>
<summary>example path search</summary>
<p>

To get the node from below example data with `3` as an `id`, one can search by `1/2/3`. In this case the path will be shown like the following if the `show-path` parameter is set to `true` and the `label-key` is set to `label`:
**<ruby>Transcript variant<rp>(</rp><rt>1</rt><rp>)</rp></ruby>/<ruby>Coding variant<rp>(</rp><rt>2</rt><rp>)</rp></ruby>/<ruby>Coding sequence variant<rp>(</rp><rt>3</rt><rp>)</rp></ruby>/**

```
  {
    "id": 1,
    "value": "transcript_variant",
    "label": "Transcript variant",
    "children": [2, 19, 25, 29, 30]
  },
  {
    "id": 2,
    "value": "coding_variant",
    "label": "Coding variant",
    "children": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18],
    "parent": 1
  },
  {
    "id": 3,
    "value": "coding_sequence_variant",
    "label": "Coding sequence variant",
    "n": 18057,
    "description": "A sequence variant that changes the coding sequence",
    "parent": 2
  }
```

</p>
</details>
<br/>

## Value settings

With the `show-value` parameter set to `true`, one can show a value next to or under the label. (depending on the content alignment of the stanza set at the parameter `node-content-alignment`)
<br/>
Please set the data property for the value at the `value-key` parameter.
If there is no data found for the value, the message set at `value-fallback` will be shown.
