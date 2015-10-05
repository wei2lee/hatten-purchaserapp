var ErrorDomain = {
    ServerInfracture : 'ServerInfracture',
    ServerApplication : 'ServerApplication',
    ClientInfracture : 'ClientInfracture',
    ClientApplication : 'ClientApplication',
    ClientHTTP : 'ClientHTTP'
};

function createError(msg) {
    return {
        domain:ErrorDomain.ClientApplication,
        code:0,
        description:msg
    }
}

function SemanticVersion(str) {
    var splits = str ? str.split(".") : [];
    this.major = splits.length > 0 ? parseInt(splits[0]) : 0;
    this.minor = splits.length > 1 ? parseInt(splits[1]) : 0;
    this.patch = splits.length > 2 ? parseInt(splits[2]) : 0;
    this.toString = function() {
        return this.minor + "." + this.minor + "." + this.patch;   
    }
    this.compare = function(right) {
        var left = this;
        if(left.major == right.major) {
            if(left.minor == right.minor) {
                if(left.patch == right.patch) {
                    return 0;   
                }else{
                    if(left.patch>right.patch) return 1;
                    else return -1;
                }
            }else{
                if(left.minor>right.minor) return 1;
                else return -1;   
            }
            }else{
                if(left.major>right.major) return 1;
                else return -1;   
            }
    }
}