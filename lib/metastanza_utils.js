import * as d3 from 'd3';

export default {

  fetchReq: async function(url, element, post_params) {
    //// url:     API URL
    //// element: target element for loding icon, error message
    //// params:  API parameters for the POST method

    // loading icon img
    if (element){
      if (element.offsetHeight < 30) d3.select(element).transition().duration(100).style("min-height", "30px");
      d3.select(element)
	.append("div").attr("class", "metastanza-loading-icon-div").attr("id", "metastanza-loading-icon-div")
	.style("position", "absolute").style("top", "10px").style("left", Math.floor(element.offsetWidth / 2) - 30 + "px")
        .append("img").attr("class", "metastanza-loading-icon").attr("src", "./assets/loading.gif");
    }
    
    // fetch options
    let options = {
      method: "get",
      headers: {'Accept': 'application/json'}
    }
    if (post_params) { // post
      options = {
	method: "post",
	body: post_params,
	headers: {
	  'Content-Type': 'application/x-www-form-urlencoded',
	  'Accept': 'application/json',
	}
      }
    }
    
    // set timeout of fetch
    let fetchTimeout = function(promise, time) {
      if (!time) time = 600000; // default: 10 min
      return new Promise(function(resolve, reject) {
	setTimeout(function() {
          reject(new Error("API timeout - " + time + " ms"))
	}, time)
	promise.then(resolve, reject)
      })
    };
    
    // fetch request
    try {
      return await fetchTimeout(fetch(url, options)).then(res=>{
	if (res.ok){
	  return res.json().then(json => {
	    d3.select(element).select("#metastanza-loading-icon-div").remove();
	    return json;
	  });
	} else {
	  this.displayApiError(element, res.status + " " + res.statusText);
	}
      })
    } catch (error) {
      this.displayApiError(element, error);
    }
  },

  getJsonFromSparql: async function(url, element, post_params, label_var_name, value_var_name) {
    
    const json = await this.fetchReq(url, element, post_params);
    if(!label_var_name) label_var_name = "label";
    if(!value_var_name) value_var_name = "value";
    
    try {
      if (typeof(json) === "object") {
	return {
	  series: ["value"],
	  data: json.results.bindings.map(row => {
	    return {
	      label: row[label_var_name].value,
	      value: parseFloat(row[value_var_name].value)
	    }
	  })
	}
      }
    } catch (error) {
      this.displayApiError(element, error);
    }     
  },

  getFormatedJson: async function(url, element, post_params) {
    
    const json = await this.fetchReq(url, element, post_params);
    
    try {
      if (typeof(json) === "object") {
	return json;
      }
    } catch (error) {
      this.displayApiError(element, error);
    }     
  },
  
  displayApiError: function(element, error) {
    if (element) d3.select(element).select("#metastanza-loading-icon-div").remove();
    d3.select(element)
      .append("div").attr("class", "metastanza-error-message-div")
      .append("p").attr("class", "metastanza-error-message").html("MetaStanza API error:<br>" + error);
    console.log(error);
  }

};
