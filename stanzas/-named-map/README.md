# Named map

## Usage
Named map that uses data based on county codes.

## Area settings
One can choose a preset map at the `area` parameter. Currently, only the world map is available but we plan on adding more areas in the future!

## Value settings
1. **ID**

Please provide a dataset with the `id` of each inner area of the area set at the `area` parameter. In the case of the world map, the `id` would be the three-digit ISO 3166-1 numeric country code.
Country codes per country can be found at the following [link](https://en.wikipedia.org/wiki/ISO_3166-1_numeric)

***

2. **Value**
<p>please set the key name needed to retreive the `value` of your data object at the stanza parameter `value-key`.</p>
In the below example the `valuey-key` is `rate`.

```javaScript
[
  {
    //  three-digit ISO 3166-1 numeric country code `528` corresponds to `the Netherlands`
    "id": "528",
    // `value-key` stanza parameter is 'rate'
    "rate": "0.9"
  },
  {
    "id": "8",
    "rate": "0.2"
  }
]
```
