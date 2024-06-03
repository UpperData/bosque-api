const res = require('express/lib/response');
var jwt=require('jwt-simple');
var moment=require('moment');
const model=require('../db/models/index');
require('dotenv').config();

 async function newToken(account,roles,type,dateTime,people,shop){ //Genera un token con una estructura especifica -->newToken(account,roles,type,dateTime,people)
	
	var exp;
	 if(type=="passwordReset"){
		exp=moment().add(2,"hours").unix();
	}else if(type=="forgot"){
		exp=moment().add(1,"days").unix();
	}else if(type=="newAccount"){
		exp=moment().add(3,"days").unix();
	}else if(type=="login"){
		exp=moment().add(6,"hours").unix();
	}else if(type=="updateEmail"){
		exp=moment().add(1,"days").unix();
	}else if(type=="test"){
		exp=moment().add(1,"days").unix();
	}else if(type=="restoreSecret"){
		exp=moment().add(2,"hours").unix();
	}else	{
		exp=moment().add(1,"days").unix()
	}
	 
    var payload={
	type,
	account:{"id":account.id,"email":account.email,"name":account.name},	
	role:roles,	
	people:people,
	dateTimeLogin:dateTime,	
	rem:"lo-veremos-cara-a-cara",
	iat:moment().unix(),
	exp,
	shop:shop
    };
	//console.log(payload)
    var token= await jwt.encode(payload,process.env.JWT_SECRET);     
    return token;
}
async function dataTokenGet(token){ // obtiene informacion del token con la estructura --> newToken(account,roles,type,dateTime,people,shop)
	try{
		var  payload= await jwt.decode(token,process.env.JWT_SECRET);
		//console.log(payload);		
		if (Date.now() >= payload.exp * 1000) {
			return false;
		}else{
			const dataToken={"account":payload.account,"role":payload.role, "people":payload.people,"dateStart":payload.dateTimeLogin,"type":payload.type,"shop":payload.shop}
			return dataToken;  
		}
	}catch(erro){
		return false;
	}
}
async function genRestoreSecret(rsAccount){ //genera toke sin estructura especifica
	try{
		var exp=moment().add(2,"hours").unix();
		var payload={	
		account:{"id":rsAccount.id,"email":rsAccount.email,"name":rsAccount.name},			
		rem:"lo-veremos-cara-a-cara",
		iat:moment().unix(),
		exp
		};
		var token= await jwt.encode(payload,process.env.JWT_SECRET);      
		return token
	}catch(error){
		return false;
	}
}
async function getTokenAll(token){ // obtiene token sin estructura especifica --> payload
	try{
		var  payload= await jwt.decode(token,process.env.JWT_SECRET);		
		if (Date.now() >= payload.exp * 1000) {
			return false;
		}else{			
			return payload;  
		}
	}catch(error){
		return false;
	}
}
module.exports={newToken,dataTokenGet,genRestoreSecret,getTokenAll}
