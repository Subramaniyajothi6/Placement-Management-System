

const logger =(req, res, next)=> {

    console.log(`Request Method: ${req.method}`);
    console.log(`Request URL:${req.url}`);
    console.log(`Request Body:${JSON.stringify(req.body)}`);
    console.log('==============================================');
    next();
}

module.exports = logger