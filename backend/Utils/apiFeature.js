class ApiFeatures {
  constructor(query, queryString) {
    this.query = query; // The Mongoose query object
    this.queryString = queryString; // The query parameters from the request
  }

  search() {
    const keyword = this.queryString.keyword
      ? {
          name: {
            $regex: this.queryString.keyword,
            $options: 'i', // Case-insensitive search
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    return this;
  }


  filter() {
    const queryCopy = { ...this.queryString }; // Create a copy of the query parameters

    // Remove fields that are not needed for filtering
    const removeFields = ['keyword', 'page', 'limit'];
    removeFields.forEach((key) => delete queryCopy[key]);
    console.log('Query copy before processing:', queryCopy);

    // Handle nested query parameters like price[gte], price[lte], ratings[gte]
    const processedQuery = {};
    
    for (const [key, value] of Object.entries(queryCopy)) {
      if (key.includes('[') && key.includes(']')) {
        // Handle nested parameters like price[gte], ratings[gte]
        const [field, operator] = key.split(/[\[\]]/);
        if (!processedQuery[field]) {
          processedQuery[field] = {};
        }
        processedQuery[field][`$${operator}`] = Number(value);
      } else {
        // Handle regular parameters
        processedQuery[key] = value;
      }
    }

    console.log('Processed query:', processedQuery);

    // Apply the filter to the query
    this.query = this.query.find(processedQuery);
    return this;
  }

  // Pagination
  pagination(resultPerPage) {   
    const currentPage = Number(this.queryString.page) || 1; // Get the current page from query parameters or default to 1
    const skip = resultPerPage * (currentPage - 1); // Calculate the number of documents to skip

    this.query = this.query.limit(resultPerPage).skip(skip); // Apply limit and skip to the query
    return this;
  }
}

module.exports = ApiFeatures; // Exporting the ApiFeatures class for use in other files