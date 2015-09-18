
function fakeNetworkDelay($timeout, f) {
    $timeout(f, Math.random() * 1000); 
}
angular.module('services-api', [])
//API Service Start
.value('apiService', {
    token:{},
    apiBase:'http://103.9.149.59:8034/',
    resourceBase:'http://103.9.149.59:8034/data/HATT/',
    apiUserName:'90731C01@hatt',
    apiUserPassword:'F2568907B18C'
})
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

    return _apiServiceBase;
})
.factory('apiServiceBaseWithToken', function($q,$timeout,apiServiceBase,apiToken) {
    function api() {}
    api.prototype = new apiServiceBase();
    api.prototype.withToken = function(createJQXHR) {
        var defer = $q.defer();
        var _self = this;
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
        return defer.promise;
    }
    return api;
})
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
                reject('Username and password must not be empty'); 
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
    api.prototype.logout = function() {
        this.user = undefined;
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
    return new api();
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

.service('apiEvent', function($q,apiServiceBaseWithToken) {
    function api(){}
    api.prototype = new apiServiceBaseWithToken();
    ret = new api();
    var index = 0;
    var values = []; ret.values = values;
    var value = {};
    value.id = index++;
    value.thumb = 'img/images_dummy_only/Hatten_homepage1.png';
    value.description = faker.lorem.paragraphs();
    value.period = '12-14 JUNE, 11pm-5pm';
    value.displayName = 'The New Pulse of Melaka';
    value.expireDate = faker.date.future();
    value.expireRemain = '';
    value.area = faker.address.state();
    value.address = faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.state() + ', ' + faker.address.country();
    value.location = {
        latitude:faker.address.latitude(),
        longitude:faker.address.longitude()
    };
    value.distance = sprintf("%.1f ", Math.random() * 100) + 'KM';
    value.type = 0;
    values.push(value);
    
    value = {};
    value.id = index++;
    value.thumb = 'img/images_dummy_only/Hatten_birthday.png';
    value.description = faker.lorem.paragraphs();
    value.period = '12-14 JUNE, 11pm-5pm';
    value.displayName = 'Happy Birthday';
    value.expireDate = faker.date.future();
    value.expireRemain = '';
    value.area = faker.address.state();
    value.address = faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.state() + ', ' + faker.address.country();
    value.location = {
        latitude:faker.address.latitude(),
        longitude:faker.address.longitude()
    };
    value.distance = sprintf("%.1f ", Math.random() * 100) + 'KM';
    value.type = 0;
    values.push(value);
    
    
    api.prototype.getAll = function() {
        return $q(function(resolve,reject){
            resolve(values); 
        });
    }
    api.prototype.getById = function(id) {
        if(typeof id == 'string') id = parseInt(id);
        return $q(function(resolve,reject){
            var found = _.find(values, function(o){
                return o.id == id; 
            });
            if(found) resolve(found); 
            else reject(createError('Not found'));
        });
    }
    return ret;
})

.service('apiTicket', function($q,$timeout,apiServiceBaseWithToken,apiEvent) {
    function api(){}
    api.prototype = new apiServiceBaseWithToken();
    var values = []; api.values = values;
    var index = 0;
    value = {};
    value.id = index++;
    value.qrcode = faker.image.qrcode();
    value.event = apiEvent.values[0];
    values.push(value);
    api.prototype.addByEvent = function(event) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0){
                var value = {};
                value.id = index++;
                value.qrcode = faker.image.qrcode();
                value.event = event;
                values.push(value);
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

.service('apiWhatsNewItem', function($q,$timeout,apiServiceBase, apiEvent){
    return apiEvent;
})

.service('apiProperty', function(apiProject) {
    return apiProject;
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

.service('apiDefectItemAreaLocation', function() {
    var values = [];
    this.values = values;
    
    values = [
{displayName:'Living and Dining Room', id:1},
{displayName:'Kitchen', id:2},
{displayName:'Master Bedroom', id:3},
{displayName:'Bedroom 2', id:4},
{displayName:'Bedroom 3', id:5},
{displayName:'Bedroom 4', id:6},
{displayName:'Ceiling', id:7},
{displayName:'Location(Migration)', id:8},
{displayName:'Master Bed', id:9},
{displayName:' Car Park - Ceiling', id:10},
{displayName:'Kitchen - Ceiling', id:11},
{displayName:'Car Porch', id:12},
{displayName:'Living Room', id:13},
{displayName:'Dining Room', id:14},
{displayName:'Master Bedroom', id:15},
{displayName:'Bedroom 1', id:16},
{displayName:'Bedroom 2', id:17},
{displayName:'Bedroom 3', id:18},
{displayName:'Family Room', id:19},
{displayName:'Utility Room', id:20},
{displayName:'Store Room', id:21},
{displayName:'Staircase', id:22},
{displayName:'Dry Kitchen', id:23},
{displayName:'Wet Kitchen', id:24},
{displayName:'Yard', id:25},
{displayName:'Master Bath', id:26},
{displayName:'Bathroom 2', id:27},
{displayName:'Bathroom 3', id:28},
{displayName:'Bed Room 4', id:29},
{displayName:'Standard/Common', id:30},
{displayName:'Retail / Office', id:31},
{displayName:'Retail Front ', id:32},
{displayName:'Retail Back ', id:33},
{displayName:'Office Front', id:34},
{displayName:'Office Back', id:35},
{displayName:'Toilet', id:36},
{displayName:'A/C Ledge (Front)', id:37},
{displayName:'A/C Ledge (Back)', id:38},
{displayName:'Retail', id:39},
{displayName:'Office', id:40},
{displayName:'A/C Ledge', id:41},
{displayName:'Foyer', id:42},
{displayName:'Patio', id:43},
{displayName:'Store 1', id:44},
{displayName:'Store 2', id:45},
{displayName:'Bedroom 4', id:46},
{displayName:'Terrace', id:47},
{displayName:'Bathroom 4', id:48},
{displayName:'Balcony', id:49},
{displayName:'Bedroom 5', id:50},
{displayName:'Bathroom 5', id:51},
{displayName:'Family Hall ', id:52},
{displayName:'Tandas', id:53},
{displayName:'Shower Area', id:54},
{displayName:'testing', id:55},
{displayName:'Compartment', id:56},
{displayName:'Roof', id:57},
{displayName:'Others', id:58},
{displayName:'Fencing', id:59},
{displayName:'garden', id:60},
{displayName:'Driveway', id:61},
{displayName:'Guest Room', id:62},
{displayName:'Bathroom 6', id:63},
{displayName:'External Back Wall (Ground Floor)', id:64},
{displayName:'External Back Wall (First Floor)', id:65},
{displayName:'Study Area', id:66},
{displayName:'Bedroom 1', id:67},
{displayName:'Wash', id:68},
{displayName:'Store 3', id:69},
{displayName:'Bathroom 1', id:70},
{displayName:'Linen', id:71},
{displayName:'turfing', id:72},
{displayName:'Open Terrace', id:73},
{displayName:'Kitchen', id:74},
{displayName:'Balcony 1', id:75},
{displayName:'Balcony 2', id:76},
{displayName:'Master Bedroom 2', id:77},
{displayName:'Terrace 1', id:78},
{displayName:'Terrace 2', id:79},
{displayName:'Laundry', id:80},
{displayName:'Planter', id:81},
{displayName:'Planter', id:82},
{displayName:'Maid\'s Room', id:83},
{displayName:'Letter Box', id:84},
{displayName:'Void Area', id:85},
{displayName:'Utility 2', id:86},
{displayName:'Paved Area', id:87},
{displayName:'Powder Room', id:88},
{displayName:'Drying Yard', id:89},
{displayName:'Refuse Chamber', id:90},
{displayName:'Courtyard', id:91},
{displayName:'Production Area', id:92},
{displayName:'Reception Lobby', id:93},
{displayName:'General Office', id:94},
{displayName:'Executive Office', id:95},
{displayName:'Pump Room', id:96},
{displayName:'Porch', id:97},
{displayName:'Roof Terrace', id:98},
{displayName:'Guard House', id:99},
{displayName:'Bedroom 6', id:100},
{displayName:'Bedroom 7', id:101},
{displayName:'Bathroom 7', id:102},
{displayName:'Corridor', id:103},
{displayName:'Walk-In Closet', id:104},
{displayName:'Shop', id:105},
{displayName:'General office 1', id:106},
{displayName:'General office 2', id:107},
{displayName:'Office 2', id:108}
    
    ];
    return new apiBaseService(values,$q,$timeout);
})

.service('apiDefectItemReason', function($q,$timeout) {
    var values = [];
    this.values = values;
    
    values = [
        {id:0, displayName:'Not Applicable'},
        {id:1, displayName:'Work Of Nature'}
    ];
    return new apiBaseService(values,$q,$timeout);
})


.service('apiDefectItemStatus', function($q,$timeout) {
    var values = [];
    this.values = values;
    
    values = [
        {id:1, displayName:'In Progress'},
        {id:2, displayName:'Not Started'},
        {id:3, displayName:'Completed'}
    ];
    return new apiBaseService(values,$q,$timeout);
})
         
.service('apiDefectItemSeverity', function($q,$timeout) {
    var values = [];
    this.values = values;
    
    values = [
        {id:1, displayName:'Low'},
        {id:2, displayName:'Medium'},
        {id:3, displayName:'High'}
    ];
    return new apiBaseService(values,$q,$timeout);
})

.service('apiDefectType', function($q,$timeout) {
    var values = [];
    this.values = values;
    
    values = [
    {id:0,displayName:'Ceiling - C1  Rough surface / chipped / cracked / damaged / broken',},
    {id:1,displayName:'Ceiling - C4  Others',},
    {id:2,displayName:'Door (include door panel, frame, glazing, architrave, heelstone, roller shutter, etc) - D1  Rough surface / poor joint / chipped / cracked / damaged / dented / sagged / warped / scratched',},
    {id:3,displayName:'Door (include door panel, frame, glazing, architrave, heelstone, roller shutter, etc) - D2  Misaligned / unlevel',},
    {id:4,displayName:'Door (include door panel, frame, glazing, architrave, heelstone, roller shutter, etc) - D3  Visible gap / inconsistent gap / poor pointing',},
    {id:5,displayName:'Floor (include screeding, tiles, parquet, timber strips, etc) - F2  Rough surface / patchy / scratched',},
    {id:6,displayName:'Plaster Wall / Paintwork - PW2  Rough surface / bulging / hollowness / chipped / pin hole',},
    {id:7,displayName:'Sanitary wares & fittings / Plumbing - S1  Leaking (e.g. pipe, slab, water tank, etc.',},
    {id:8,displayName:'Wall Tiles - T1  Broken / chipped / cracked / hollowness',},
    {id:9,displayName:'Electrical - 13amp Power Point c/w Cover',},
    {id:10,displayName:'Electrical - Air Conditioner Point c/w Switch',},
    {id:11,displayName:'Electrical - Car Porch Light Point',},
    {id:12,displayName:'Electrical - DB Boxes & Cover',},
    {id:13,displayName:'Cleaning Services',},
    {id:14,displayName:'Cleaning Common Area',},
    {id:15,displayName:'Cleaning Staircase',},
    {id:16,displayName:'Cleaning Staircase',},
    {id:17,displayName:'Normal Cleaning',}         
    ];
    return new apiBaseService(values,$q,$timeout);
})

.service('apiUnit', function($q,$timeout,apiProject, apiUser) {
    var values = [];
    
    for(i = 0 ; i < 200 ; i++) {
        var value = {};
        value.id = i;
        value.unitNo = faker.id.unitNo();
        value.type = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1'][_.random(6)];
        value.view = ['East','West','South', 'South'][_.random(3)];
        value.size = 2000;
        value.floorplans = [{
            thumb:null,
            areas:[{
                displayName:'',
                coords:''
            }]
        }];
        value.owner = _.sample(apiUser.values);
        value.project = _.sample(apiProject.values);
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})

.service('apiDefectItem', function($q,$timeout) {
    var values = [];
    return new apiBaseService(values,$q,$timeout);
})



//API Service End