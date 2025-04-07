import FamilyModel from "../FamilyModel.js";
import ProductModel from "../ProductModel.js";
import ProductBasicModel from "../product/ProductBasicModel.js";
import ProductExtraModel from "../product/ProductExtraModel.js";
import CombinedProductModel from "../product/CombinedProductModel.js";


class FamilyTreeDecoder{

    setGroupMap(map){
        this.groupMap = map;
    }

    decodeFamilyTree(familyTreeParam){
        this.familyMap = new Map();
        this.productMap = new Map();
        this.familyTree = [];

        this.fastProducts = [];

        this.combinedWaitlist = [];

        this.extraWaitlist = [];
        this.basicWaitlist = [];
        this.menuWaitlist = [];

        for(let familyParam of familyTreeParam){
           this.addFamily(familyParam);
        }

        for(let basicWait of this.basicWaitlist){
            let product = this.productMap.get(basicWait.productId);
            basicWait.basic.setProduct(product);
        }
        for(let extraWait of this.extraWaitlist){
            let product = this.productMap.get(extraWait.productId);
            extraWait.extra.setProduct(product);
        }
        for(let menuWait of this.menuWaitlist){
            let product = this.productMap.get(menuWait.productId);
            menuWait.menu.addMenuLine(menuWait.group, product);
        }
        return {
            familyMap: this.familyMap,
            productMap: this.productMap,
            familyTree: this.familyTree,
            fastProducts: this.fastProducts
        };
    }

    addFamily(familyParam, superfamily = null){
        let family = new FamilyModel(familyParam);
        if(familyParam.DG){
            let group = this.groupMap.get(familyParam.DG);
            if(group){
                family.defaultGroup = group;
            }
        }
        if(familyParam.Sub){
            for(let subfamilyParam of familyParam.Sub){
                this.addFamily(subfamilyParam, family);
            }
        }
        if(familyParam.Pro){
            for(let productParam of familyParam.Pro){
                this.addProduct(productParam, family);
            }
        }  
        if(superfamily == null){
            this.familyTree.push(family);
        } else{
            superfamily.addSubfamily(family);
        }
        this.familyMap.set(family.id, family);
    }

    addProduct(productParam, family){
        let product = new ProductModel(productParam);
        family.addProduct(product);
        if(productParam.Ba){
            for(let basicParam of productParam.Ba){
                this.addBasic(basicParam, product);
            }
        }
        if(productParam.Ext){
            for(let extraParam of productParam.Ext){
                this.addExtra(extraParam, product);
            }
        }
        if(product.isTapa() || product.isWine()){
            productParam.S = productParam.I;
            let combinedProduct = new CombinedProductModel(productParam, productParam.Desc);
            product.addCombined(combinedProduct);
        } else if(product.isLiquor() && product.prices[0]>0){
            productParam.S = productParam.I;
            let combinedProduct = new CombinedProductModel(productParam, productParam.Desc);
            product.addCombined(combinedProduct);
        }
        if(productParam.Co){
            for(let combinedParam of productParam.Co){
                this.addCombined(combinedParam, product);
            }
        }
        
        if(productParam.Me){
            for(let [key, value] of Object.entries(productParam.Me)){
                for(let productId of value){
                    this.menuWaitlist.push({
                        menu: product,
                        group: key,
                        productId: productId
                    });
                }
            };
        }

        if(productParam.Fa){
            this.addFastProduct(productParam, product);
        }
       
        this.productMap.set(product.id, product);
    }

    addCombined(combinedParam, product){
        let combinedProduct = new CombinedProductModel(combinedParam);
        product.addCombined(combinedProduct);
        this.productMap.set(combinedProduct.id, combinedProduct);
        this.combinedWaitlist.push(combinedProduct);
        if(combinedParam.Ba){
            for(let basicParam of combinedParam.Ba){
                this.addBasic(basicParam, combinedProduct);
            }
        }
        if(combinedParam.Ext){
            for(let extraParam of combinedParam.Ext){
                this.addExtra(extraParam, combinedProduct);
            }
        }
        if(combinedParam.Fa){
            this.addFastProduct(combinedParam, combinedProduct);
        }

    }

    addExtra(extraParam, product){
        let extra = new ProductExtraModel(extraParam);
        this.extraWaitlist.push({
            extra: extra,
            productId: extraParam.Pr
        });
        product.addExtra(extraParam.Pr, extra);
    }

    addBasic(basicParam, product){
        let basic = new ProductBasicModel(basicParam);
        this.basicWaitlist.push({
            basic: basic,
            productId: basicParam.Pr
        });
        product.addBasic(basicParam.Pr, basic);
    }

    addFastProduct(productParam, product){
        this.fastProducts.push(product);
        product.fastLines = [];
        for(let fastLine of productParam.Fa){
            product.fastLines.push({
                placeId: fastLine.P,
                startTime: new Date(fastLine.S),
                endTime: new Date(fastLine.E)
            });
        }
    }   
}

export default FamilyTreeDecoder;