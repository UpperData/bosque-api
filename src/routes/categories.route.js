const express =require ('express');
const router= express.Router();
const category=require('../controllers/categories.ctrl');
const serviceToken = require('../controllers/serviceToken.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.get('/front/categoriES/GET',forceBrute.notBruteSecure,category.getMainCategories); //Get Main Category
router.post('/frONT/CAtegorRIES/CREATE',forceBrute.notBruteSecure,category.addMainCategories); //add Main caterory
router.get('/Front/SubCATEGORY/GET/:mainCategoryId',forceBrute.notBruteSecure,category.getSubCategories);
router.post('/FRont/sUBCAterory/CREATE',forceBrute.notBruteSecure,category.addSubCategories) //Crea subcategoria
router.get('/Front/SubCATEGORYn1/GET/:subCategoryId',forceBrute.notBruteSecure,category.getSubCategoriesN1);
router.get('/fornt/ALLCateories',forceBrute.notBruteSecure,category.getAllCategories)// obtienes arbol de categorias
module.exports=router;