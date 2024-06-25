// 에러처리 미들웨어

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message,
    data: err.data,
  });
};
