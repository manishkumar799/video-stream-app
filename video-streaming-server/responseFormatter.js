const zlib = require('zlib');

function responseFormatter(req, res, next) {
  // Response formatter for success responses
  res.sendResponse = (data, message = 'Success', statusCode = 200) => {
    const jsonResponse = JSON.stringify({
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
    });

    const acceptEncoding = req.headers['accept-encoding'] || '';

    if (acceptEncoding.includes('gzip')) {
      // Compress the response using gzip
      zlib.gzip(jsonResponse, (err, compressedData) => {
        if (err) {
          console.error('Compression error:', err);
          res.status(500).send('Internal Server Error');
          return;
        }
        res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Type', 'application/json');
        res.status(statusCode).send(compressedData);
      });
    } else {
      // Send uncompressed response if gzip is not supported
      res.setHeader('Content-Type', 'application/json');
      res.status(statusCode).send(jsonResponse);
    }
  };

  // Response formatter for error responses
  res.sendError = (error, statusCode = 500) => {
    res.status(statusCode).json({
      status: 'error',
      message: error.message,
      error: {
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        data: error.data,
      },
      timestamp: new Date().toISOString(),
    });
  };

  next();
}

module.exports = responseFormatter;
