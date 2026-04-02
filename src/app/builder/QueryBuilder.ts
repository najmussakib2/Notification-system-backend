import { Query, Document, Model } from "mongoose";

type QueryParams = {
  searchTerm?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  limit?: string;
  page?: string;
  fields?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

class QueryBuilder<T extends Document> {
  public modelQuery: Query<T[], T>;
  public query: QueryParams;

  constructor(modelQuery: Query<T[], T>, query: QueryParams) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  // 🔍 search
  search(searchableFields: string[]) {
    const { searchTerm } = this.query;

    if (searchTerm) {
      const searchRegex = new RegExp(searchTerm, "i");

      this.modelQuery = this.modelQuery.find({
        $or: searchableFields.map((field) => ({
          [field]: searchRegex,
        })),
      });
    }

    return this;
  }

  // 💰 price range
  priceRange() {
    const minPrice = Number(this.query.minPrice);
    const maxPrice = Number(this.query.maxPrice);

    if (minPrice && maxPrice) {
      this.modelQuery = this.modelQuery.find({
        price: { $gte: minPrice, $lte: maxPrice },
      });
    } else if (minPrice) {
      this.modelQuery = this.modelQuery.find({
        price: { $gte: minPrice },
      });
    } else if (maxPrice) {
      this.modelQuery = this.modelQuery.find({
        price: { $lte: maxPrice },
      });
    }

    return this;
  }

  // 🎯 filter
  filter() {
    const queryObject = { ...this.query };

    const excludeFields = [
      "searchTerm",
      "limit",
      "sort",
      "page",
      "fields",
      "minPrice",
      "maxPrice",
    ];

    excludeFields.forEach((field) => delete queryObject[field]);

    const fields = Object.entries(queryObject);
    if (!fields.length) return this;

    const andConditions = fields.map(([key, value]) => {
      const values = Array.isArray(value)
        ? value
        : String(value).split(",");

      return {
        $or: values.map((v) => ({
          [key]: v.trim(),
        })),
      };
    });

    this.modelQuery = this.modelQuery.find({
      $and: andConditions,
    });

    return this;
  }

  // 🔃 sort
  sort() {
    const sort =
      (this.query.sort || "").split(",").join(" ") || "-createdAt";

    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }

  // 🔢 limit
  limit() {
    const limit = this.query.limit
      ? Number(this.query.limit)
      : Infinity;

    this.modelQuery = this.modelQuery.limit(limit);
    return this;
  }

  // 📄 paginate
  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = this.query.limit
      ? Number(this.query.limit)
      : Infinity;

    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }

  // 🎯 field selection
  fields() {
    const fields =
      (this.query.fields || "").split(",").join(" ") || "-__v";

    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }

  // 📊 count total
  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();

    const total = await (this.modelQuery.model as Model<T>).countDocuments(
      totalQueries
    );

    const page = Number(this.query.page) || 1;
    const limit = this.query.limit
      ? Number(this.query.limit)
      : Infinity;

    const totalPages = Math.ceil(total / limit);

    return {
      total,
      page,
      limit,
      totalPages,
    };
  }
}

export default QueryBuilder;