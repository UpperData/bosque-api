const express =require ('express');
const router= express.Router();
const publishing=require('../controllers/publishing.ctrl');
const auth=require('../controllers/middleware/auth.ctrl');
const forceBrute=require('../controllers/middleware/noBrute.ctrl');

router.put('/invetory/publishING/set',forceBrute.notBruteSecure,auth.autorizedRole([5]), publishing.setPublishing); // sube o da de baja a una publicación
router.get('/invetory/puBLIshING/gET/:articleId',forceBrute.notBruteSecure,publishing.getPublishing); // obtiene una publicación x Id
router.get('/invetory/puBLIshING/cat/GET/:categoryId',forceBrute.notBruteSecure,publishing.getPublishingCategory); // obtiene una publicación x Categoria
router.get('/invetory/pubLIshING/CLAss/GET/:autoTypeId',forceBrute.notBruteSecure,publishing.getPublishingClass); // obtiene una publicación x clase de auto
router.get('/invetory/pubLIshING/SUBcat/GET/:subCategoryId',forceBrute.notBruteSecure,publishing.getPublishingSubCategory); // obtiene una publicación x clase de auto
router.get('/invetory/pubLIshING/FULL/GET/:limit/:page',forceBrute.notBruteSecure,publishing.getPublishingFull); // Todas la publicaiones por pagians
router.get('/invetory/puBLIshING/CategORY/CustoM/:subCategoryId/:textValue/:limit/:page',forceBrute.notBruteSecure,publishing.getPublishingSubCategoryAndText); // producto por categoris 
router.get('/invetory/puBLIshING/seven/:shop',forceBrute.notBruteSecure,publishing.getPublishingByShopSeven); // últimas 7 publicaciones de una tienda  
router.get('/invetory/puBLIshiNG/cateory/:category/:limit/:page',forceBrute.notBruteSecure,publishing.getPublishingCategoryName); // productos por categoria por nombre


module.exports=router;