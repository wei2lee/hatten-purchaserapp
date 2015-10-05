
function fakeNetworkDelay($timeout, f) {
    $timeout(f, Math.random() * 1000); 
}
angular.module('services-api', [])
/* ==========================================================================
   API Service Variables
   ========================================================================== */
.value('apiService', {
    token:{},
    apiBase:'http://103.9.149.59:8034/',
    resourceBase:'http://103.9.149.59:8034/data/HATT/',
    apiUserName:'90731C01@hatt',
    apiUserPassword:'F2568907B18C'
})
/* ==========================================================================
   API Service Base Class
   ========================================================================== */
.factory('apiServiceBase', function($q,$timeout,apiService) {
    function _apiServiceBase(_values) {
        var _this = this;
        this.values = _values;
        this.apiService = apiService;
        this._useCache = false;
    }
    _apiServiceBase.prototype.useCache = function() {
        this._useCache = true;
        return this; 
    }
    _apiServiceBase.prototype.getAll = function() {
        return $q(function(resolve,reject){
            reject(createError('Not implemented')); 
        });
    }
    _apiServiceBase.prototype.getById = function(id) {
        return $q(function(resolve,reject){
            reject(createError('Not implemented')); 
        });
    }
    _apiServiceBase.prototype.processError = function(jqXHR, textStatus, errorThrown) {
        var msg = null;
        if(jqXHR.responseJSON != null) {
            var json = jqXHR.responseJSON;
            if(!msg && json.error) {
                msg = {
                    domain:ErrorDomain.ServerInfracture, 
                    code:json.error, 
                    description:json.error_description || ('error:'+json.error)
                };   
            }
            if(!msg && json.ErrorCode){
                msg = {
                    domain:ErrorDomain.ServerInfracture, 
                    code:json.ErrorCode, 
                    description:json.Message || ('ErrorCode:'+json.ErrorCode)
                };   
            }
            if(!msg && json.Message) {
                msg = {
                    domain:ErrorDomain.ServerInfracture, 
                    code:0, 
                    description:json.Message
                }; 
            }
            if(!msg) {
                msg = {
                    domain:ErrorDomain.ServerInfracture, 
                    code:0, 
                    description:"Unable to interprete server reply"
                }; 
            }
        }else{
            if(!msg && jqXHR.status == 0) {
                msg = {
                    domain:ErrorDomain.ClientHTTP, 
                    code:0, 
                    description:"Unable to connect to server"
                }; 
            }
            if(!msg && errorThrown != null) {
                msg = {
                    domain:ErrorDomain.ClientHTTP, 
                    code:jqXHR.status, 
                    description:errorThrown
                }; 
            }
            console.log(jqXHR);
            if(!msg) {
                msg = {
                    domain:ErrorDomain.ClientHTTP, 
                    code:jqXHR.status, 
                    description:'Unable to interprete server reply ('+jqXHR.status+')'
                }; 
            }
        }
        return msg;
    }
    _apiServiceBase.prototype.processHtml = function(html) {
           
    }

    return _apiServiceBase;
})
.factory('apiServiceBaseWithToken', function($q,$timeout,apiServiceBase,apiToken) {
    function api() {}
    api.prototype = new apiServiceBase();
    api.prototype.withToken = function(createJQXHR) {
        var defer = $q.defer();
        var _self = this;
        if(apiToken.apiService.token.access_token) {
            createJQXHR().done(function(data, textStatus, jqXHR) { 
                console.log('done@' + this.url);
                console.log(data);
                defer.resolve(data);
            }).fail(function(jqXHR, textStatus, errorThrown) {
                if(jqXHR.status==401){
                    console.log('fail@' + this.url);
                    console.log('Re-token');
                    return apiToken.token().then(function(){
                        return createJQXHR().then(function(data, textStatus, jqXHR){
                            console.log('done@' + this.url);
                            console.log(data);
                            defer.resolve(data);
                        });
                    }).catch(function(error) {
                        console.log('fail@' + this.url);
                        console.log(error);
                        defer.reject(error); 
                    });
                }else{
                    console.log('fail@' + this.url);
                    var error = _self.processError(jqXHR, textStatus, errorThrown);
                    console.log(error);
                    defer.reject(error); 
                }
            });
        }else{
            apiToken.token().then(function(){
                return createJQXHR().then(function(data, textStatus, jqXHR){
                    console.log('done@' + this.url);
                    console.log(data);
                    defer.resolve(data);
                });
            }).catch(function(error) {
                console.log('fail@' + this.url);
                console.log(error);
                defer.reject(error); 
            });
        }
        return defer.promise;
    }
    return api;
})

.factory('apiEventBase', function($q,$timeout,apiServiceBaseWithToken, apiUser) {
    function api(){}
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.getAll = function() {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + _self.getAllUrl,{
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        }).then(function(data){
            _self.values = _.each(data, function(o) {
                o.RoadShow.StartDate = new Date(o.RoadShow.StartDate);
                o.RoadShow.EndDateTime  = new Date(o.RoadShow.EndDateTime);
            });
            return data;
        });
    }
    api.prototype.getById = function(id) {
        var _self = this;
        if(_self.useCache && _self.values){
            return $q(function(resolve,reject){
                if(typeof id == 'string') id = parseInt(id);
                var found = _.find(_self.values, function(o) {
                    return o.EventId  == id; 
                });
                if(found){
                    found.RoadShow.StartDate = new Date(found.RoadShow.StartDate);
                    found.RoadShow.EndDateTime  = new Date(found.RoadShow.EndDateTime);
                    resolve(found);
                }
                else reject(createError('Not found'));
            });
        }else{
            return this.withToken(function(){
                return $.ajax(_self.apiService.apiBase + 'api/WhatNews/GetWhatNewsById?eventid='+id,{
                    method:'GET',
                    dataType:'json',
                    headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
                }).done(function(data, textStatus, jqXHR) { 
                    return data;
                });
            })
        }
    }
    api.prototype.getRate = function(event,user) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Rate/GetEventRate?iEventId='+event.EventId+'&iCustomerID='+user.CustomerId, {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.rate = function(event,user,star) {
        var _self = this;
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Rate/UpdateEventRate?iEventId='+event.EventId+'&iCustomerID='+user.CustomerId+'&iRateValue='+star+'', {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.getFeedbackForm = function() {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/CustomerEventFeedBackForm/GetFeedBackForm', {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.postFeedbackForm = function(feedbackResult) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/CustomerEventFeedBackForm/UpdateFeedbackForm', {
                method:'POST',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                contentType: "application/json; charset=utf-8",
                data:JSON.stringify(feedbackResult)
            })
        });
    }
    api.prototype.attemp = function(event) {
        var _self = this;
        if(!apiUser.getUser()) {
            return $q(function(resolve, reject) {
                reject(createError("Not login")); 
            });
        }
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Rate/AttendEvent', {
                method:'GET',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                data: {
                    iEventId:event.EventId,
                    iCustomerID:apiUser.getUser().CustomerId
                }
            })
        });
    }
    api.prototype.unAttemp = function(event) {
        var _self = this;
        if(!apiUser.getUser()) {
            return $q(function(resolve, reject) {
                reject(createError("Not login")); 
            });
        }
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Rate/UnAttendEvent', {
                method:'GET',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                data: {
                    iEventId:event.EventId,
                    iCustomerID:apiUser.getUser().CustomerId
                }
            })
        });
    }
    api.prototype.getAttemp = function(event) {
        var _self = this;
        if(!apiUser.getUser()) {
            return $q(function(resolve, reject) {
                reject(createError("Not login")); 
            });
        }
        var user = apiUser.getUser();
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Rate/GetEventRate?iEventId='+event.EventId+'&iCustomerID='+user.CustomerId, {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            });
        });
    }
    return api;
})
/* ==========================================================================
   API Service Start
   ========================================================================== */
.factory('apiToken', function($q,apiServiceBase) {
    function api() {}
    api.prototype = new apiServiceBase();
    api.prototype.token = function(){
        var _self = this;
        return $q(function(resolve,reject) {
            $.ajax(_self.apiService.apiBase + 'Token',{
                method:'POST',
                dataType:'json',
                data:{
                    username:_self.apiService.apiUserName,
                    password:_self.apiService.apiUserPassword,
                    grant_type:'password'
                }
            }).done(function(data, textStatus, jqXHR) { 
                console.log('done@' + this.url);
                console.log(data);
                _self.apiService.token = data;
                resolve(data);
            }).fail (function(jqXHR, textStatus, errorThrown) {
                console.log('fail@' + this.url);
                var error = _self.processError(jqXHR, textStatus, errorThrown);
                console.log(error);
                reject(error);
            });
        })
    }
    return new api();
})
.factory('apiUser', function($q,apiServiceBaseWithToken) {
    function api() {}
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.login = function(username, password) {
        var _self = this;
        if(!username || !password){
            return $q(function(resolve,reject) {
                reject(createError('Username and password must not be empty')); 
            });
        }
        return _self.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/AppCustomer/GetByEmailAndPass',{
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                data:{
                    email:username,
                    pass:password
                }
            })
        }).then(function(data){
            _self.user = data;
            return data;
        }).catch(function(error){
            if(error.domain == ErrorDomain.ServerInfracture && error.code == 1){
                throw {
                    domain:ErrorDomain.ClientApplication, 
                    code:0, 
                    description:"User doesn\'t match with any password"
                };
            }else{
                throw error;   
            }
        });
    }
    
    api.prototype.signUp = function(signUpData) {
        var _self = this;
        if(!signUpData.EmailAddress ||
           !signUpData.Password ||
           !signUpData.Title || 
           !signUpData.FullName ||
           !signUpData.IC ||
           !signUpData.CallingCode || 
           !signUpData.ContactNumber){
            return $q(function(resolve,reject) {
                reject(createError('All fields are compulsury')); 
            });
        }
        return _self.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/AppCustomer/Add2',{
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                data:{
                    ic:signUpData.IC,
                    title:signUpData.Title,
                    emailladdress:signUpData.EmailAddress,
                    callingcode:signUpData.CallingCode,
                    contctnumber:signUpData.ContactNumber,
                    loginprovider:"4545499996",
                    ProviderKey:"5ssss1454",
                    fullname:signUpData.FullName,
                    spass:signUpData.Password
                }
            })
        }).then(function(data){
            return _self.withToken(function(){
                return $.ajax(_self.apiService.apiBase + 'api/AppCustomer/GetByEmailAndPass',{
                    method:'GET',
                    dataType:'json',
                    headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                    data:{
                        email:signUpData.EmailAddress,
                        pass:signUpData.Password
                    }
                })
            });
        }).then(function(data){
            _self.user = data;
            return data;
        }).catch(function(error){
            if(error.domain == ErrorDomain.ServerInfracture && error.code == 1){
                throw {
                    domain:ErrorDomain.ClientApplication, 
                    code:0, 
                    description:"User doesn\'t match with any password"
                };
            }else{
                throw error;   
            }
        });
    }
    
    api.prototype.edit = function(user) {
        var _self = this;
        return _self.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/AppCustomer/'+user.IC+'/Edit2',{
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                data:{
                    Title:user.Title,
                    CallingCode:user.CallingCode,
                    ContactNumber:user.ContactNumber,
                    FullName:user.FullName,
                    sPass:user.sPass
                }
            })
        }).then(function(data){
            return _self.withToken(function(){
                return $.ajax(_self.apiService.apiBase + 'api/AppCustomer/GetByEmailAndPass',{
                    method:'GET',
                    dataType:'json',
                    headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                    data:{
                        email:_self.getUser().Email,
                        pass:user.sPass
                    }
                }).then(function(data){
                    _self.user = data;
                    return data;
                });
            });
        })
    }
    
    api.prototype.logout = function() {
        this.user = undefined;
    }
    
    api.prototype.changePassword = function(user) {
        var _self = this;
        if(!_self.getUser()) {
            return $q(function(resolve, reject) {
                reject(createError("Not logon")); 
            });
        }
        return _self.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/AppCustomer/UpdateEmail?iCustomerId='+user.iCustomerId+'&email='+user.email+'&pass='+user.pass,{
                method:'POST',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                data:{
                    Ic:_self.getUser().IC
                }
            });
        }).then(function(data){
            return _self.withToken(function(){
                return $.ajax(_self.apiService.apiBase + 'api/AppCustomer/GetByEmailAndPass',{
                    method:'GET',
                    dataType:'json',
                    headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                    data:{
                        email:user.email,
                        pass:user.pass
                    }
                }).then(function(data){
                    _self.user = data;
                    return data;
                });
            });
        })
    }
    
    api.prototype.forgetPassword = function() {
        var _self = this;
        if(!_self.getUser()) {
            return $q(function(resolve, reject) {
                reject(createError("Not logon")); 
            });
        }
        return _self.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/AppEmail/ForgetPassWord',{
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                data:{
                    Ic:_self.getUser().IC
                }
            });
        });
    }
    
    api.prototype.getUser = function() {
        return this.user;
    }
    return new api();
})


.factory('apiProject', function($q,apiServiceBaseWithToken) {
    function api() {}
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.getAll = function() {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Project/GetAllProjects',{
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        }).then(function(data){
            data = _.each(data, function(o) {
                $pts = $(o.ProjectTemplate);
                $pt = $("<div/>");
                $pt.append($pts);
                $a = $pt.find('a');
                $a.each(function() {
                    var href = $(this).attr("href");
                    var ngclick = "u.navigateToStateWithIntent('app.web', {title:'"+o.Name+"', url:'"+href+"'})";
                    $(this).attr("ng-click", ngclick);
                });
                var x = $pt.get(0).outerHTML;
                o.ProjectTemplate = x;
            });
            _self.values = data;
            return data;
        });
    }
    api.prototype.getById = function(id) {
        var _self = this;
        if(_self.useCache && _self.values){
            return $q(function(resolve,reject){
                if(typeof id == 'string') id = parseInt(id);
                var found = _.find(_self.values, function(o) {
                    return o.ProjectId == id; 
                });
                if(found) resolve(found);
                else reject(createError('Not found'));
            });
        }else{
            return this.withToken(function(){
                return $.ajax(_self.apiService.apiBase + 'api/AppProject/'+id,{
                    method:'GET',
                    dataType:'json',
                    headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
                }).done(function(data, textStatus, jqXHR) { 
                    data.ProjectId = data.Id;
                    data.Id = undefined;
                    return data;
                });
            })
        }
    }
    api.prototype.getRate = function(project,user) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Rate/GetProject?iProjectID='+project.ProjectId+'&iCustomerID='+user.CustomerId, {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.rate = function(project,user,star) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Rate/UpdateProjectRate?iProjectId='+project.ProjectId+'&iCustomerID='+user.CustomerId+'&iRateValue='+star+'', {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.getFeedbackForm = function() {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/CustomerProjectFeedBackForm/GetFeedBackForm', {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.postFeedbackForm = function(feedbackResult) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/CustomerProjectFeedBackForm/UpdateFeedbackForm', {
                method:'POST',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                contentType: "application/json; charset=utf-8",
                data:JSON.stringify(feedbackResult)
            })
        });
    }
    return new api();
})

.service('apiProperty', function(apiProject) {
    return apiProject;
})

.service('apiPurchasedProperty', function($q, apiProperty, apiUser,apiServiceBaseWithToken) {
    function api(){}
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.getUnitsByUser = function(user) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/AppCustomer/'+user.IC+'/Units', {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.getAll = function() {
        var _self = this;
        return $q.all([_self.getUnitsByUser(apiUser.getUser()), apiProperty.getAll()]).then(function(results){
            var customerProjects = results[0];
            var projects = results[1];
            var units = [];
            _.each(customerProjects, function(customerProject) {
                var customerUnits = [];
                var found = _.find(projects, function(project){
                    return customerProject.ProjectId == project.ProjectId;
                });
                customerUnits = _.each(customerProject.Units, function(unit) {
                    unit.project = found;
                });
                units = units.concat(customerUnits); 
            });
            _self.values = units;
            console.log(units);
            return units;
        })
    }
    api.prototype.getById = function(id) {
        var _self = this; 
        var promise = $q(function(resolve,reject) { resolve(); });
        var p = (_self.useCache && _self.values) ? promise : this.getAll();
        return p.then(function(){ 
            return $q(function(resolve,reject){
                if(typeof id == 'string') id = parseInt(id);
                var found = _.find(_self.values, function(o) {
                    return o.UnitId == id; 
                });
                if(found) resolve(found);
                else reject(createError('Not found'));
            });
        });
    }
    return new api();
})

.service('apiTicket', function($q,$timeout,apiServiceBaseWithToken,apiEvent) {
    function api(){}
    var index = 0;
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.addByEvent = function(event) {
        var _self = this;
        return $q(function(resolve, reject) {
            if(Math.random() >= 0){
                var value = {};
                value.id = index++;
                value.qrcode = 'http://www.campusbookstore.com/MobileBuyBack/QR-AppStore.png';
                value.event = event;
                if(_self.values === undefined) _self.values = [];
                _self.values.push(value);
                    resolve(null); 
            }else{
                reject(createError('Not found'));
            }
        });
    }
    api.prototype.getAll = function() {
        return $q(function(resolve,reject){
            resolve(values); 
        });
    }
    api.prototype.getById = function(id) {
        if(typeof id == 'string') id = parseInt(id);
        return $q(function(resolve,reject){
            var found = _.find(values, function(o){ o.id == id; });
            if(found) resolve(found); 
            else reject(createError('Not found'));
        });
    }
    return new api();
})

.service('apiWhatsNews', function($q,$timeout,apiEventBase){
    function api(){}
    api.prototype = new apiEventBase();
    var ret = new api();
    ret.getAllUrl = 'api/WhatNews/GetAllWhatNews';
    return ret;
})

.service('apiVoucher', function($q,$timeout,apiEventBase){
    function api(){}
    api.prototype = new apiEventBase();
    var ret = new api();
    ret.getAllUrl = 'api/WhatNews/GetAllVoucher';
    return ret;
})

.service('apiEvent', function($q,$timeout,apiEventBase){
    function api(){}
    api.prototype = new apiEventBase();
    var ret = new api();
    ret.getAllUrl = 'api/WhatNews/GetAllEvent';
    return ret;
})

.service('apiConsultant', function($q,$timeout,apiServiceBaseWithToken) {
    function api(){}
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.getByProjectId = function(id) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/AppUser/GetByProjectId?iProjectID='+id, {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.getByUnitId = function(id) {
        var _self = this; 
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/AppUser/GetByUnitId?iUnitID='+id, {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.getById = function(id) {
        var _self = this; 
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/AppUser/'+id, {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.getRate = function(consultant,user) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Rate/GetSysUser?iSysUserID='+consultant.UserId+'&iCustomerID='+user.CustomerId, {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.rate = function(consultant,user,star) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Rate/UpdateSysUser?iSysUserID='+consultant.UserId+'&iCustomerID='+user.CustomerId+'&iRateValue='+star+'', {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.getFeedbackForm = function() {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/CustomerSysUserFeedBackForm/GetFeedBackForm', {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.postFeedbackForm = function(feedbackResult) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/CustomerSysUserFeedBackForm/UpdateFeedbackForm', {
                method:'POST',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token},
                contentType: "application/json; charset=utf-8",
                data:JSON.stringify(feedbackResult)
            })
        });
    }
    return new api();
})

.service('apiProjectUnitType', function($q,$timeout,apiServiceBaseWithToken) {
    function api(){}
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.getByUnitId = function(id) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/ProjectUnitTypes/GetByUnitId?unitid='+id, {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    return new api();
})

.service('apiProjectUnitFloor', function($q,$timeout,apiServiceBaseWithToken) {
    function api(){}
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.getByUnitId = function(id) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/ProjectUnitFloors/GetListByUnitId?unitid='+id, {
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            })
        });
    }
    api.prototype.getByProjectId = function(id) {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/ProjectUnitFloors/GetListByProjectId?projectid='+id,{
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            });
        })
    }
    return new api();
})

.service('apiTitle', function($q,$timeout,apiServiceBaseWithToken) {
    function api(){}
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.getAll = function() {
        var values = [
            "Mr.", "Ms.", "Madam", "Dato", "Datin", "Datuk", "Tan Sri", "Puan Sri", "Dato' Sri", "Datuk Seri"
        ];
        return $q(function(resolve, reject) {
            resolve(values); 
        });
    }
    return new api();
})

.service('apiCountry', function($q,$timeout,apiServiceBaseWithToken) {
    function api(){}
    api.prototype = new apiServiceBaseWithToken();
    api.prototype.getAll = function() {
        var _self = this;
        return this.withToken(function(){
            return $.ajax(_self.apiService.apiBase + 'api/Country',{
                method:'GET',
                dataType:'json',
                headers:{Authorization:'Bearer '+_self.apiService.token.access_token}
            });
        })
    }
    return new api();
})
/* ==========================================================================
   API Service End
   ========================================================================== */
.factory('apiServiceBase2', function($q) {
    function _apiServiceBase() {
        var _this = this;
        this._useCache = false;
    }
    _apiServiceBase.prototype.useCache = function() {
        this._useCache = true;
        return this; 
    }
    _apiServiceBase.prototype.processError = function(jqXHR, textStatus, errorThrown) {
        var msg = null;
        if(jqXHR.responseJSON != null) {
            var json = jqXHR.responseJSON;
            if(json.error_exist) {
                if(!msg && json.error_message) {
                    msg = {
                        domain:ErrorDomain.ServerInfracture, 
                        code:0, 
                        description:json.error_message
                    }; 
                }
                if(!msg) {
                    msg = {
                        domain:ErrorDomain.ServerInfracture, 
                        code:0, 
                        description:"Unable to interprete server reply"
                    }; 
                }
            }else{
                msg = {
                    domain:ErrorDomain.ServerInfracture, 
                    code:0, 
                    description:"Unable to interprete server reply"
                }; 
            }
        }else{
            if(!msg && jqXHR.status == 0) {
                msg = {
                    domain:ErrorDomain.ClientHTTP, 
                    code:0, 
                    description:"Unable to connect to server"
                }; 
            }
            if(!msg && errorThrown != null) {
                msg = {
                    domain:ErrorDomain.ClientHTTP, 
                    code:jqXHR.status, 
                    description:errorThrown
                }; 
            }
            console.log(jqXHR);
            if(!msg) {
                msg = {
                    domain:ErrorDomain.ClientHTTP, 
                    code:jqXHR.status, 
                    description:'Unable to interprete server reply ('+jqXHR.status+')'
                }; 
            }
        }
        return msg;
    }
    _apiServiceBase.prototype.callApi = function(ajax) {
        var _self = this;
        var defer = $q.defer();
        ajax.then(function(data, textStatus, jqXHR) {
            if(data) {
                if(!data.error_exist) {
                    console.log('done@' + this.url);
                    console.log(data.result);
                    defer.resolve(data.result);   
                    return;
                }
            }
            console.log('done(with error)@' + this.url);
            var error = _self.createError(jqXHR, textStatus, null)
            console.log(error);
            defer.reject(error);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.log('fail@' + this.url);
            var error = _self.createError(jqXHR, textStatus, errorThrown)
            console.log(error);
            defer.reject(error);
        });
        return defer.promise;
    }

    return _apiServiceBase;
})
.service('apiApp', function($q, apiServiceBase2) {
    function api(){}
    api.prototype = new apiServiceBase2();
    api.prototype.get = function() {
        return this.callApi($.ajax('http://infradigital.com.my/appstore/cms/resources/app.php?appid=com.infradesign.prosync&platform=ios',{
            method:'GET',
            dataType:'json'
        }));
    }
    return new api();
});

