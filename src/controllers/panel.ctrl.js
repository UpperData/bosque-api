const mdll= require('../db/models/index');
async  function getAllPanel(req,res){
    const {RolE} =req.params
	return await mdll.grantRole.findAll({
	attributes: {exclude: ['createdAt','updatedAt']},
	where:{roleId:RolE,isActived:true},
	include: [{
		model:mdll.role,
		attributes: {exclude: ['createdAt','updatedAt']},
		required:true
	},
	{
		model:mdll.permission,
		attributes: {exclude: ['createdAt','updatedAt']},
		where:{isActived:true},
		required:true,
			include:[{
				model:mdll.operation,
				attributes: {exclude: ['createdAt','updatedAt']},
				required:true
			}],
			include:[{
				model:mdll.subModule,
				attributes: {exclude: ['createdAt','updatedAt']},
				order:['sorting'],
				required:true,
				include:[{
					model:mdll.module,
					attributes: {exclude: ['createdAt','updatedAt']},
					order:['sorting'],
					required:true
				}]
			}]
	}]
	})
	.then(async function (rsMenu){			
	// *** OPTIENE TODOS SUBMODULOS SIN DUPLICADOS
		var seenNames = {};
		var rsMenuS = rsMenu.filter(function(currentObject) { 			
		    if (currentObject['permission']['subModule'].id in seenNames) {
		        return false;
		    } else {
		        seenNames[currentObject['permission']['subModule'].id] = true;
		        return true;
		    }
		});			
	// *** OPTIENE TODOS Modulo DE CADA MODULO
		var seenNames = {};
		var rsMenuM = rsMenuS.filter(function(currentObject) {
		    if (currentObject['permission']['subModule']['module'].id in seenNames) {
		        return false;
		    } else {
		        seenNames[currentObject['permission']['subModule']['module'].id] = true;
		        return true;
		    }
		});		
		var rsMenuT=[];
		var sr  = [];
		for (i=0; i<rsMenuM.length; i++) {
			for (j=0; j<rsMenuS.length; j++) {				
				if(rsMenuM[i]['permission']['subModule']['module'].id==rsMenuS[j]['permission']['subModule'].moduleId){	
					let permisions =await mdll.grantRole.findAll({ // busca permisos en el submodulo
						attributes:['id'],
						where:{roleId:RolE,isActived:true},
						include:[{
							model:mdll.permission,
							where:{subModuleId:rsMenuS[j]['permission']['subModule'].id,isActived:true},
							attributes:['id'],
							include:[{
								model:mdll.operation,
								attributes:['id','name']
							}]
						}]
					})	
					//console.log(permisions);
					sr.push({"id":rsMenuS[j]['permission']['subModule'].id,
							"name":rsMenuS[j]['permission']['subModule'].name,
							"desc":rsMenuS[j]['permission']['subModule'].description,
							"route":rsMenuS[j]['permission']['subModule'].route,
							"sort":rsMenuS[j]['permission']['subModule'].sorting,
							"icon":rsMenuS[j]['permission']['subModule'].icon,
							"actions":permisions});                    
				}
				sr.sort(function (a, b) { //Ordena subModulos
					return a.sort - b.sort;
				});
			}
            rsMenuT.push({"module":rsMenuM[i]['permission']['subModule']['module'].name,
							"icon":rsMenuM[i]['permission']['subModule']['module'].icon,
							"sort":rsMenuM[i]['permission']['subModule']['module'].sorting,
                            "sModule":sr})
			sr= [];			
		}
		rsMenuT.sort(function (a, b) { //Ordena Modulos
			return a.sort - b.sort;
		});
		res.json(rsMenuT);		
	}).catch(function (error) {
		console.log(error);
		res.json({data:{"status":false,"message":"Algo salió mal generando menú"}});	
	})
}
module.exports={getAllPanel}