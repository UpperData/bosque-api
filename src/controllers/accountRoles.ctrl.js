const models=require('../db/models/index');

async function getRoleByAccount(req,res){
	const{accountId}=req;
	return await models.accountRole.findAll({ 
		where:{accountId,isActived:true},
		include:[
			{
			model:models.account
			},
			{
			model:models.role
			}
		]
	})
	.then(async function(srResult){		
		return srResult; 		
	}).catch(async function(error){		
		return { data:{"result":false,"message":"Algo salió mal, no se pudo buscar "}};		
	})	
}
async function add(req,res){ // metodo de uso interno
	
	const {accountId,RoleId,statusId}=req;
	const t = await model.sequelize.transaction();
	return await models.accountRoles.create({accountId,RoleId,StatusId:statusId},{transaction:t})
	.then(function(rsResult){
		t.commit()
		return rsResult;
	}).catch(async function (error){
		t.rollback();
		return { data:{"result":false,"message":"Algo salió mal asignando permiso"}};
	})
}
async function addMembership(req,res){ // agregra membresia
	
	const {accountId,roleId,isActived}=req.body;
	
	const t = await models.sequelize.transaction();
	return await models.accountRole.findAndCountAll({
		attributes:['accountId','roleId'],
		where:{accountId,roleId}
	}).then(async function(rsMembership){
		
		if(rsMembership.count>0) {
			//actualiza
			await models.accountRole.update({isActived},{where:{accountId,roleId},transaction:t})
			.then(function(rsResult){
				t.commit()
				if(isActived){
					res.status(200).json({"data":{"result":true,"message":"Membresia asignada"}});   
				}else{
					res.status(200).json({"data":{"result":true,"message":"Membresia revocada"}});   
				}				
			}).catch(async function (error){
				t.rollback();
				res.status(403).json({"data":{"result":false,"message":error.message}}); 
			})
		}else{
			//crea
			await models.accountRole.create({accountId,roleId,isActived},{transaction:t})
			.then(function(rsResult){
				t.commit()
				res.status(200).json({"data":{"result":true,"message":"Membresia asignada","data":rsResult}});   
			}).catch(async function (error){
				t.rollback();	
				res.status(403).json({"data":{"result":false,"message":error.message}}); 
			})
		}
	}).catch(async function (error){
		t.rollback();
		console.log(error);
		res.status(403).json({"data":{"result":false,"message":"Algo salió mal, intente nuevamente"}}); 
	})
	
}
async function getRoleByEmail(req,res){
	const{email}=req.params;
	return await models.account.findOne({
		attributes:[['id','accountId']],
		where:{email}
	})
	.then(async function(rsAccount){
		if(rsAccount){
			await models.accountRole.findAll({ 
				attributes:[['id','membershipId'],'accountId'],
				where:{accountId:rsAccount.dataValues.accountId,isActived:true},
				include:[
					{
						model:models.account,
						attributes:['name']
					},
					{
						model:models.role,
						attributes:[['id','roleId'],'name']
					}
				]
			})
			.then(async function(srResult){	
				rsMembership={"accountId":rsAccount.dataValues.accountId,"membership":srResult}
				//srResult.push({"membershi":rsAccount})	
				res.status(200).json({"data":{"result":true,"message":"resultado de busqueda","data":rsMembership}}); 
			}).catch(async function(error){	
				res.status(403).json({"data":{"result":false,"message":error.message}}); 		
			})
		}else{
			res.status(403).json({"data":{"result":false,"message":"No existe email indicado"}}); 
		}
		
	}).catch(async function(error){	
			
		res.status(403).json({"data":{"result":false,"message":error.message}}); 		
	})	
}
async function getRoleByPhone(req,res){
	const{phone}=req.params;
	return await models.account.findOne({
		attributes:[['id','accountId']],
		where:{phone}
	})
	.then(async function(rsAccount){
		if(rsAccount){
			await models.accountRole.findAll({ 
				attributes:[['id','membershipId'],'accountId'],
				where:{accountId:rsAccount.dataValues.accountId,isActived:true},
				include:[
					{
						model:models.account,
						attributes:['name']
					},
					{
						model:models.role,
						attributes:[['id','roleId'],'name']
					}
				]
			})
			.then(async function(srResult){	
				rsMembership={"accountId":rsAccount.dataValues.accountId,"membership":srResult}
				//srResult.push({"membershi":rsAccount})	
				res.status(200).json({"data":{"result":true,"message":"resultado de busqueda","data":rsMembership}}); 
			}).catch(async function(error){	
				console.log(error)
				res.status(403).json({"data":{"result":false,"message":error.message}}); 		
			})
		}else{
			res.status(403).json({"data":{"result":false,"message":"No existe número de teléfono indicado"}}); 
		}
		
	}).catch(async function(error){		
		console.log(error)
		res.status(403).json({"data":{"result":false,"message":error.message}}); 		
	})	
}

async function getPhoneByGroup(req,res){
	const {group}=req.body
	let rsContacts=[]
	for (let index = 0; index < group.length; index++) {		
		await models.account.findAll({
			attributes:[['id','accountId'],'phone','email','people'],
			include:[
				{
					model:models.accountRole,
					attributes:[['id','accountRoleId'],'roleId'],
					where:{roleId:group[index]}
	
				}
			]
		}).then(async function(rsAccount){			
			rsAccount.forEach(element => {
				rsContacts.push({"accountId":element.accountId,"phone":element.phone,"personName":element.people.document.firstName+" "+element.people.document.lastName,"email":rsAccount.email}) 	
			});				
	
		}).catch(async function(error){		
			console.log(error);					
		})	
	}
	// elimina duplicados
	var datos = rsContacts.filter((data, index, j) => 
		index === j.findIndex((t) => (t.phone === data.phone))
	)
	res.status(200).json({"result":true,"message":"resultado de busqueda","data":datos}); 
}
module.exports={
	getRoleByAccount,
	add,
	addMembership,
	getRoleByEmail,
	getRoleByPhone,
	getPhoneByGroup // todas los telefonos, email y people de un grupo
};
