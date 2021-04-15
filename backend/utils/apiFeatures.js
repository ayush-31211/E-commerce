class APIFeatures
{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr= queryStr;
    }

    search(){
        const keyword = this.queryStr.keyword?{
            name:{
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }:{}
        this.qurey = this.query.find({...keyword});
        return this;
    }

    filter(){
        const queryStrCopy = {...this.queryStr};

        // Removing Fields from query 
        const removeFields = ['keyword','limit','page'];
        removeFields.forEach(el=>(delete queryStrCopy[el]));
        
        // for Price, Ratings
        let queryStr = JSON.stringify(queryStrCopy);        
        
        //Regex to add '$' before gt|gte|lt|lte
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        queryStr = JSON.parse(queryStr)

        this.query = this.query.find(queryStr);
        return this;

    }

    pagination(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
        
    }
}
module.exports=APIFeatures;