
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError={
    statusCode:err.statusCode|| StatusCodes.INTERNAL_SERVER_ERROR,
    msg:err.message||'Something went wrong....try again later'
  }
  

  if(err.code && err.code === 11000){
    customError.msg=`the email ${req.body.email} is already exist, please provide a different email`
    customError.statusCode=400
  
  }

  if(err.name && err.name ==='ValidatorError'){
   customError.msg=Object.values(err.errors).map((item)=>item.message).join('')
  customError.statusCode=400
  
  }

  if(err.name === 'CastError'){
    customError.msg=`No item found with id: ${Object.values(err.value)}`,
    customError.statusCode=404
  }
 //return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg:customError.msg })

}

module.exports = errorHandlerMiddleware
