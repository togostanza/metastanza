import * as d3 from 'd3';

export default {
  
  fetchReq: async function (url, targetElement, params, method){ // targetElement: element for loding icon, params: key-value json, method: get(default), post

    // loading icon img
    if(targetElement) d3.select(targetElement).append("img").attr("id", "icon").attr("width", "50px").attr("src", "http://togostanza.org/img/logotype.svg");

    // fetch options
    if(!method) method == "get";
    let options = {method: method};
    if(params){
      if(method.toLowerCase() == "post"){ // post
	options.body = JSON.stringify(params);
	options.headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'};
	options.mode = 'cors';
      }else{ // get
	url += "?" + Object.keys(params).map(key => key + "=" + params[key]).join("&");
      }
    }
    
    // set timeout of fetch
    let fetchTimeout = function(ms, promise) {
      return new Promise(function(resolve, reject) {
	setTimeout(function() {
          reject(new Error("timeout"))
	}, ms)
	promise.then(resolve, reject)
      })
    };

    // fetch request
    try{
      let res = await fetchTimeout(600000, fetch(url, options)).then(res=>{
	d3.select(targetElement).select("#icon").remove();
	if(res.ok) return res.json();
	else return false;
      });
      return res;
    }catch(error){
      console.log(error);
    }
  },

  getJsonFromSparql: async function(url, targetElement, params, method, label_var_name, value_var_name){
    const json = await this.fetchReq(url, targetElement, params, method);

    if(json){
      return json.results.bindings.map((row) => {
	return {
	  label: row[label_var_name].value,
	  value: parseFloat(row[value_var_name].value)
	};
      });
    }else{
      this.showApiError(targetElement);
    }
  },

  showApiError: function(targetElement){
    const removeApiError = function(){ d3.select(targetElement).remove(); }
    d3.select(targetElement).append("p").text("API error");
    setTimeout(removeApiError, 3000);
  }

};
