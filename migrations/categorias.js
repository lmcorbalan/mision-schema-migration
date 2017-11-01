module.exports = async (mysql, mongoDB) => {
  const Categories = mongoDB.collection('categories');
  const categoriesLookup = {};

  try {
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
        const children = [...parentChildren, child.parent_id];
        parent.children = children;
      }
    }

    const categories = Object.keys(categoriesLookup).reduce((cats, id) => {
      return [...cats, categoriesLookup[id]];
    }, []);

    console.log(categories);

    const allIds = await Categories.insertMany(categories);
    const allCategories = await Categories.find().toArray();
    console.log(allIds);
    console.log(allCategories);
  } catch (e) {
    console.log(e);
    throw e;
  }
};
