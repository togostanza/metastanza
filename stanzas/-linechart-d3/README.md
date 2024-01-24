# D3 Linechart

### Legend

With legend on, you can hide/show data lines by clicking the correspondong legend item.

### Data type

Data specified by `y-axis-key` should be numbers or string numerical values (`"123.456"`). All other data will be converted to numbers, and any non-numerical values will be ignored.

#### x-axis-data-type

Type of data for x axis.

If `x-axis-data-type` is set to `number`, Linechart Stanza will ignore all non-numeric values, and show only those, which could be represented as a numbers. (Even is numbers is in string format (`"123.456"`))

#### xlabel-angle

Angle of x labels, in range [-90, +90] degrees

#### ylabel-angle

Angle of y labels, in range [-90, +90] degrees

### Error bars

If `error-key` is empty or undefined, no error bars would be rendered.
If there is `error-bar` specified, error bars will be drawn.
For data points where there is a data in key specified by `error-key`.
If that key is non-existent, or the data stored there cannot be parsed as a float number, no error bar will be drawn for such data point.
