import * as Vega from 'vega';
import * as VegaLite from 'vega-lite';
import { Handler as VegaTooltipHandler } from 'vega-tooltip';

export default async function barchart(stanza, params) {
  const dataset = await fetch(params['src-url']).then(res => res.json());

  const values = dataset.data.flatMap((item) => {
    return dataset.series.map((itemLabel) => {
      return {
        value: item[itemLabel],
        barLabel: item.label,
        itemLabel,
      };
    });
  });

  const {spec} = VegaLite.compile({
    data: {
      values
    },
    title: params['chart-title'],
    mark: 'bar',
    width: {
      step: 64
    },
    encoding: {
      x: {
        field: 'barLabel',
        title: null
      },
      y: {
        aggregate: 'sum',
        field: 'value',
        title: null
      },
      color: {
        field:  'itemLabel',
        title:  null,
        legend: params['show-legend'] === 'show-legend' ? {} : null
      },
      tooltip: {
        field: 'itemLabel'
      }
    }
  });

  const view = new Vega.View(Vega.parse(spec), {
    renderer: 'svg',
    container: stanza.root.querySelector('main')
  });

  view.tooltip(new VegaTooltipHandler().call);

  await view.runAsync();
}
