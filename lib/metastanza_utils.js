import * as d3 from 'd3';

export default {
  
  fetchReq: async function(url, params, method, targetElement){
    const el = d3.select(targetElement);
    
    if(targetElement){
      el.append("img").attr("id", "icon").attr("width", "50px").attr("href", "http://togostanza.org/img/logotype.svg");
    }
    
    let options = {method: method};
    if(method == "get" && params[0]){
      url += "?" + params.join("&");
    }else if(method == "post"){
      if(params[0]) options.body = params("&");
      options.headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'};
      options.mode = 'cors';
    }
    
    // set timeout of fetch
    let fetch_timeout = function(ms, promise) {
      return new Promise(function(resolve, reject) {
	setTimeout(function() {
          reject(new Error("timeout"))
	}, ms)
	promise.then(resolve, reject)
      })
    };
    
    try{
      let res = await fetch_timeout(600000, fetch(url, options)).then(res=>{
	el.select("#icon").remove();
	if(res.ok) return res.json();
	else return false;
      });
      return res;
    }catch(error){
      console.log(error);
    }
  },

  getJsonFromSparql: async function(url, params, method, targetElement, label_var_name, value_var_name){
    const json = await this.fetchReq(url, params, method, targetElement);
  
    return json.results.bindings.map((row) => {
      return {
	label: row[label_var_name].value,
	value: parseFloat(row[value_var_name].value)
      };
    });
  }

};
