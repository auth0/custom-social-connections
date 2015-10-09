var Connection = function () {
    this.apiBaseUrl = AUTH_CONNECTION_API;
    this.authHeader = 'Bearer ' + AUTH_TOKEN;
};

Connection.prototype._request = function(method, url, data, onComplete, onError){
    var self = this,
        ajaxOptions = {
            url: url,
            type: method,
            contentType: 'application/json',
            beforeSend : function(xhr) {
                xhr.setRequestHeader("Authorization", self.authHeader);
            }
        };
    
    if (data) {
        ajaxOptions['data'] = JSON.stringify(data); 
    }
    
	$.ajax(ajaxOptions)
        .done(onComplete)
        .fail(onError);
}

Connection.prototype.getAll = function (callback, errorCallback) {
    this._request("GET", this.apiBaseUrl + "?strategy=oauth2", null, callback, errorCallback);
};

Connection.prototype.get = function(name, callback, errorCallback){
    this._request("GET", this.apiBaseUrl + "/" + name, null, callback, errorCallback);
}

Connection.prototype.create = function (data, callback, errorCallback) {
    this._request("POST", this.apiBaseUrl, data, callback, errorCallback);
};

Connection.prototype.update = function (id, data, callback, errorCallback) {
    this._request("PATCH", this.apiBaseUrl + "/" + id, data, callback, errorCallback);        
};

Connection.prototype.delete = function (name, callback, errorCallback) {
    this._request("DELETE", this.apiBaseUrl + "/" + name, null, callback, errorCallback);    
};

Connection.prototype.getTokenInfo = function (token, callback, errorCallback) {
     var ajaxOptions = {
            url: AUTH_BASE_URL + "userinfo",
            type: "GET",
            beforeSend : function(xhr) {
                xhr.setRequestHeader("Authorization", "Bearer " + token);
            }
        };
       
	$.ajax(ajaxOptions)
        .done(callback)
        .fail(errorCallback);
};