const errorMiddleware = async (err, req, res, next) => {
  try{
    res.status(err.statusCode || err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error"
    })
  }
  catch(error){
    next(error)
  }
}

export default errorMiddleware