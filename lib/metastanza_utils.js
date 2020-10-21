import * as d3 from 'd3';

export default {

  // fetch
  //// url: API URL
  //// element: target element for loding icon
  //// params: API parameters for POST method (stringified key-value json)
  fetchReq: async function(url, element, post_params) {

    // loading icon img
    if (element) d3.select(element).append("img")
      .attr("id", "icon").attr("src", "http://togostanza.org/img/loading.gif");

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
	  'Accept': 'application/json'
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
	if (element) d3.select(element).select("#icon").remove();
	if (res.ok) return res.json();
	else this.showApiError(element, res.status + " " + res.statusText);
      })
    } catch (error) {
      this.showApiError(element, error);
    }
  },

  getJsonFromSparql: async function(url, element, post_params, label_var_name, value_var_name) {
    const json = await this.fetchReq(url, element, post_params);

    try {
      if (typeof(json) === "object") {
	return json.results.bindings.map(row => {
	  return {
	    label: row[label_var_name].value,
	    value: parseFloat(row[value_var_name].value)
	  }
	})
      }
    } catch (error) {
      this.showApiError(element, error);
    }
      
  },

  showApiError: function(element, error) {
    if (element) d3.select(element).select("#icon").remove();
    d3.select(element).append("p").attr("class", "error_message").html("MetaStanza API error:<br>" + error);
    console.log(error);
  }

};
