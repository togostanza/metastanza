# D3 Linechart

### Data format

If `data-type` is set to `json` or `sparql-results-json`, the data format is expected to be `"Long"`, i.e. an array of JSON objects:

```json
[
    {
    "Date": "2016-01-01",
    "count": 1,
    "group": "A"
    },
    {
    "Date": "2016-01-01",
    "count": 3,
    "group": "B"
    },
    {
    "Date": "2016-01-02",
    "count": 2,
    "group": "A"
    },
    {
    "Date": "2016-01-02",
    "count": 12,
    "group": "B"
    },
    ...
]
```

If `data-type` is set to `csv` or `tsv`, the data format can be set either to `"Long"` or `"Wide"`.

`"Long"` data format (in case of `csv`):

```csv
Date,count,group
2016-01-01,1,A
2016-01-01,3,B
2016-01-02,2,A
2016-01-02,12,B
...
```

`"Wide"` data format:

```csv
Date,A,B
2016-01-01,1,5
2016-01-01,3,0
2016-01-02,0,2
2016-01-02,4,12
...
```

In case of `"Wide"` format, the first column will be used as the x-axis and the remaining columns as the y-axes. Every column after the first one will be plotted as a separate line.
In that case parameters `axis-x-data_key`, `axis-y-data_key`, `data_grouping-group_by_data_key`, `data_grouping-color-data_key` and `error_bars-data_key` will be ignored.

### Legend

With legend on, you can hide/show data lines by clicking the correspondong legend item.

### Preview axes

`axis-x-preview` and `axis-y-preview` can be used to show preview axes. Preview axes can be used to zoom in on the data.

### Error bars

If `error_bars-data_key` is empty, undefined or not present in the data, as well as if the data is in `"Wide"` format, no error bars would be rendered.
The error bars will be rendered only for those data point where `error_bars-data_key` is present
