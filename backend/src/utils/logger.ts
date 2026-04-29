/**
 * Structured logger for production backend.
 */
export const logRequest = (req: any, res: any, next: any) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logEntry = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      userAgent: req.get('user-agent')
    };
    
    console.log(JSON.stringify(logEntry));
  });

  next();
};

export const logError = (error: any, context: string) => {
  const errorLog = {
    level: 'error',
    context,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString()
  };
  console.error(JSON.stringify(errorLog));
};
