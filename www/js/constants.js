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