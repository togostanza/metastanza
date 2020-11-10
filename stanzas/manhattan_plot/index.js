import * as d3 from 'd3';
import metastanza from '@/lib/metastanza_utils.js';

export default async function manhattanPlot(stanza, params) {
  stanza.render({
    template: 'stanza.html.hbs',
    parameters: {
      title: params.title
    }
  });

  console.log(params.api);
  let dataset = await metastanza.getFormatedJson(params.api, stanza.root.querySelector('#chart'));
  if (typeof dataset == "object") draw(dataset, stanza.root.querySelector('#chart'), parseFloat(params.p_thresh));
 
}

async function draw(dataset, element, p_thresh) {
  
  const width = 800;
  const height = 400;
  
  const chromosomes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20","21", "22", "X", "Y"];
  const chromosomeNtLength = {
    hg38: {
      1: 248956422,
      2: 242193529,
      3: 198295559,
      4: 190214555,
      5: 181538259,
      6: 170805979,
      7: 159345973,
      8: 145138636,
      9: 138394717,
      10: 133797422,
      11: 135086622,
      12: 133275309,
      13: 114364328,
      14: 107043718,
      15: 101991189,
      16: 90338345,
      17: 83257441,
      18: 80373285,
      19: 58617616,
      20: 64444167,
      21: 46709983,
      22: 50818468,
      X: 156040895,
      Y: 57227415
    }
  }

  const thresh =  Math.log10(p_thresh) * (-1);

  const max = Object.values(chromosomeNtLength.hg38).reduce((sum, value) => sum +value);
  
  let svg = d3.select(element).append("svg").attr("width", width).attr("height", height);

  let max_log_p = 0;
  
  svg.selectAll(".plot")
    .data(dataset)
    .enter()
    .filter(function(d){ return Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1) > 0.5 } )
    .append("circle")
    .attr("class", function(d){ return "plot ch_" + d.Chromosome })
    .attr("cx", function(d){
      let start = 0;
      for(let ch of chromosomes){
	if( ch == d.Chromosome) break;
	start += chromosomeNtLength.hg38[ch];
      }
      return (parseInt(d.Physical_position) + start) / max * width })
    .attr("cy",function(d){
      //set max
      if (max_log_p < Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1)) max_log_p = Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1);
      return height;
    })
    .attr("r", 2)
    .filter(function(d){return Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1) > thresh })
    .classed("over-thresh-plot", true)
    .on("mouseover", function(e, d){
      svg.append("text").text(d.dbSNP_RS_ID + ", " + d.Symbol)
	.attr("x", d3.pointer(e)[0] + 10).attr("y", d3.pointer(e)[1]).attr("id", "popup_text");
    })
    .on("mouseout", function(e, d){
      svg.select("#popup_text").remove();
    });

  let max_log_p_int = Math.floor(max_log_p) + 1;
  console.log(max_log_p);
  
  svg.selectAll(".plot")
    .attr("cy", function(d){ return height - Math.log10(parseFloat(d.CLR_C_BMI_pv)) * (-1) * height  / max_log_p_int});

}
