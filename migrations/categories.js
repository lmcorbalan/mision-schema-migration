module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Categories=============')
  console.time('accountsCategories');

  const mongoCategories = mongoDB.collection('categories');

  const results = await mysql.query('select * from categorias');

  const categoriesLookup = results.reduce((lookup, item) => {
    const cat = {...item}
    lookup[cat.id] = cat;
    return lookup;
  }, {});

  for (let id of Object.keys(categoriesLookup)) {
    const child = categoriesLookup[id];
    if (child.parent_id) {
      const parent = categoriesLookup[child.parent_id];
      if (parent) {
        const parentChildren = parent.children || [];
        const children = [...parentChildren, child.id];
        parent.children = children;
      }
    }
  }

  const categories = Object.keys(categoriesLookup).reduce((cats, id) => {
    return [...cats, categoriesLookup[id]];
  }, []);

  if (categories.length) {
    const allIds = await mongoCategories.insertMany(categories);
  }
  const allCategories = await mongoCategories.find().toArray();
  for (let category of allCategories) {
    let update = false;

    if (category.parent_id) {
      update = true;
      const parent = await mongoCategories.findOne({
        id: category.parent_id
      }, {_id: 1});

      if (parent) {
        category.parent_id = parent._id;
      }
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

  console.timeEnd('accountsCategories');
};
