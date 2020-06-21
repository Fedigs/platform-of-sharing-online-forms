class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1A)Filtering
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach(el => delete queryObj[el]);
    //1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log(this.queryString, queryObj);
    console.log(JSON.parse(queryStr));

    this.query = this.query.find(JSON.parse(queryStr));

    //let query = Tour.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    //2) Sorting
    //exemple 127.0.0.1:3000/api/v1/tours?sort=duration,price => trier par duration et puis par prix

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    //3)Field limitting
    //exemple bech naffichi kan nom,duration,price => 127.0.0.1:3000/api/v1/tours?fields=name,duration,price
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      // bech na7i attribut kima __v mta3 mongo nzidha un - twali => -__v
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    //4)pagination
    //page=2&limit=10 => 1-10 page1 , 11-20 page2 , 21-30 page3
    //skip(10) na7i 10 résultat 9bel manabda ne7seb page loula feha 10 na7i el 10 adhoukem bech nit7asel 3la page2
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
