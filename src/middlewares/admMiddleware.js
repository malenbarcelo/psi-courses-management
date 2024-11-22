//Route middleware
function companyLoggedMiddleware(req,res,next){
    
    if(!req.session.userLogged || req.session.userLogged.id_companies != 36){
        return res.redirect('/')
    }

    return next()
}
module.exports=companyLoggedMiddleware