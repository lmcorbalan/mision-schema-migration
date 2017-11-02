module.exports = async (mysql, mongoDB) => {
  const mongoCategories = mongoDB.collection('categories');

  const categoriesLookup = {};
  const results = await mysql.query('select * from categorias');

  for (let row of results) {
    categoria = Object.assign({}, row)
    categoriesLookup[categoria.id] = categoria;
  }

  for (let id of Object.keys(categoriesLookup)) {
    const child = categoriesLookup[id];
    if (child.parent_id) {
      const parent = categoriesLookup[child.parent_id];
      const parentChildren = parent.children || [];
      const children = [...parentChildren, child.id];
      parent.children = children;
    }
  }

  const categories = Object.keys(categoriesLookup).reduce((cats, id) => {
    return [...cats, categoriesLookup[id]];
  }, []);

  const allIds = await mongoCategories.insertMany(categories);
  const allCategories = await mongoCategories.find().toArray();
  for (let category of allCategories) {
    let update = false;

    if (category.parent_id) {
      update = true;
      const parent = await mongoCategories.findOne({
        id: category.parent_id
      }, {_id: 1});
      category.parent_id = parent._id;

    }

    if (category.children && category.children.length) {
      update = true;
      const children = await mongoCategories.find({
        id: {
          $in: category.children
        }
      }, {_id: 1}).toArray();

      category.children = children.reduce((children, item) => (
        children.concat(item._id)
      ),[]);
    }

    if (update) {
      await mongoCategories.updateOne({_id: category._id}, category);
    }
  }
};
