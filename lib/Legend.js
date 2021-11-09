import {LitElement, html} from 'lit-element';

export default class Legend extends LitElement {

  constructor() {
    super();
  }

  render() {
    return html`
    <style>
      .legend {
        padding: 3px 9px;
        position: absolute;
        font-size: 10px;
        line-height: 1.5;
        max-height: 100%;
        overflow-y: auto;
        color: var(--togostanza-label-font-color);
        background-color: rgba(255, 255, 255, .8);
        box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
      }
      .legend > table > tbody > tr > td > .marker {
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 100%;
        vertical-align: middle;
        margin-right: .3em;
      }
      .legend > table > tbody > tr > td .number {
        text-align: right;
      }
      
      
      .leader {
        position: absolute;
        border-left: dotted 1px black;
        z-index: 10000;
        opacity: 0;
        pointer-events: none;
        transition: all .2s;
      }
      .leader[data-direction="top"] {
        border-top: dotted 1px black;
      }
      .leader[data-direction="bottom"] {
        border-bottom: dotted 1px black;
      }
      .leader.-show {
        opacity: .5;
      }
    </style>
    <div class="legend"></div>
    <div class="leader"></div>
    `;
  }

  /**
   *
   * @param {*} data
   * @param {Node} container
   * @param {Object} opt
   *  - direction 'vertical' or 'horizontal'
   *  - position
   *  - fadeoutNodes
   */
  setup(data, container, opt) {
    console.log(data, container, opt)
    const positions = opt.position || ['top', 'right'];

    // make legend
    console.log( this.shadowRoot )
    const legend = this.shadowRoot.querySelector('.legend');
    legend.id = 'MetaStanzaLegend';
    legend.innerHTML = `
    <table>
      <tbody>
      ${data.map(datum => {
        return `
        <tr data-id="${datum.id}">
          <td><span class="marker" style="background-color: ${datum.color}"></span>${datum.label}</td>
          ${datum.value ? `<td class="${(typeof datum.value).toLowerCase()}">${datum.value}</td>` : ''}
        </tr>`;
      }).join('')}
      </tbody>
    <table>`;
    positions.forEach(position => legend.style[position] = 0);
    container.append(legend);

    if (!opt.fadeoutNodes) {return;};
    // make leader
    const leader = this.shadowRoot.querySelector('.leader');

    // event
    container.querySelectorAll(':scope > div > table > tbody > tr').forEach(tr => {
      tr.addEventListener('mouseover', () => {
        const datum = data.find(datum => datum.id === tr.dataset.id);
        if (datum) {
          opt.fadeoutNodes.forEach(node => node.style.opacity = .2);
          datum.node.style.opacity = "";
          leader.classList.add('-show');
          const legendRect = tr.getBoundingClientRect();
          const targetRect = datum.node.getBoundingClientRect();
          leader.style.left = (targetRect.left + targetRect.width * .5) + 'px';
          leader.style.width = (legendRect.left - targetRect.right + targetRect.width * .5) + 'px';
          const legendMiddle = legendRect.top + legendRect.height * .5;
          const targetMiddle = targetRect.top + targetRect.height * .5;
          if (legendMiddle < targetMiddle) {
            leader.dataset.direction = 'top';
            leader.style.top = legendMiddle + 'px';
            leader.style.height = (targetMiddle - legendMiddle) + 'px';

          } else {
            leader.dataset.direction = 'bottom';
            leader.style.top = targetMiddle + 'px';
            leader.style.height = (legendMiddle - targetMiddle) + 'px';
          }
        };
      });
      tr.addEventListener('mouseleave', () => {
        opt.fadeoutNodes.forEach(node => node.style.opacity = "");
        leader.classList.remove('-show');
      });
    });
  }

}

customElements.define('togostanza--legend', Legend);
