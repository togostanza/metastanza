# Barchart

### Legend

With legend on, you can hide/show data lines by clicking the correspondong legend item.

### Params

#### category

X axis will use values stored with this key

#### value

Y axis will use values stored with this key

#### group-by

Inside each `category` divide data by this key's value

#### error-key

Use error data (for error bars) stored in value with this key

#### xlabel-angle

Angle of x labels, in range [-90, +90] degrees

#### ylabel-angle

Angle of y labels, in range [-90, +90] degrees

### Error bars

If `error-key` is empty or undefined, no error bars would be rendered.
If there is `error-bar` specified, error bars will be drawn.
For data points where there is a data in key specified by `error-key`.
If that key is non-existent, or the data stored there cannot be parsed as a float number, no error bar will be drawn for such data point.
