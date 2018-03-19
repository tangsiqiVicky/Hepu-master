import {
  baseUrl
} from './env'

export default async(url = '', data = {}, type = 'GET', sub ,method = 'fetch') => {
  type = type.toUpperCase();

   if(!sub) {
     url = baseUrl + url;
   }

  if (type == 'GET') {
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }

  // if (window.fetch && method == 'fetch') {
  // 	let requestConfig = {
  // 		credentials: 'include',
  // 		method: type,
  // 		headers: {
  // 			'Accept': 'application/json',
  // 			'Content-Type': 'application/json'
  // 		},
  // 		mode: "no-cors",
  // 		cache: "force-cache"
  // 	}
  //
  // 	if (type == 'POST') {
  // 		Object.defineProperty(requestConfig, 'body', {
  // 			value: JSON.stringify(data)
  // 		})
  // 	}
  //
  // 	try {
  // 		const response = await fetch(url, requestConfig);
  // 		const responseJson = await response.json();
  // 		return responseJson
  // 	} catch (error) {
  // 		throw new Error(error)
  // 	}
  // }
  // else {
  return new Promise((resolve, reject) => {
    let requestObj;
    if (window.XMLHttpRequest) {
      requestObj = new XMLHttpRequest();
    } else {
      requestObj = new ActiveXObject;
    }

    let sendData = '';
    // if (type == 'POST') {
    //   sendData = postDataFormat(data);
    //   console.log(sendData)
    // }
    requestObj.open(type, url, true);
    requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // requestObj.setRequestHeader("Content-type", "application/json;charset='utf-8'");
    if (type == 'POST') {
      requestObj.send(postDataFormat(data));
    }else{
      requestObj.send(sendData);
    }
    requestObj.onreadystatechange = () => {
      // console.log(requestObj)
      if (requestObj.readyState == 4) {
        if (requestObj.status == 200) {
          let obj = requestObj.response
          if (typeof obj !== 'object') {
            obj = JSON.parse(obj);
          }
          resolve(obj)
        } else {
          reject(requestObj)
        }
      }
    }
  });
  function postDataFormat(obj){
    console.info(obj)
    if(typeof obj != "object" ) {
      alert("输入的参数必须是对象");
      return;
    }
    var arr = new Array();
    var i = 0;
    for(var attr in obj) {
      // arr[i] = encodeURIComponent(attr) + '=' + encodeURIComponent(JSON.stringify(obj[attr]));
      arr[i] = encodeURIComponent(attr) + '=' + encodeURIComponent( typeof(obj[attr]) == "object"? JSON.stringify(obj[attr]): obj[attr] );
      // arr[i] = encodeURIComponent(attr) + '=' + encodeURIComponent( typeof(obj[attr]) == "string"? obj[attr] : JSON.stringify(obj[attr]));
      i++;
    }
    return arr.join('&');
  }
}
