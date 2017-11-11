module.exports = async (mysql, mongoDB) => {
  console.log('=============Migrating Categories=============')
  console.time('accountsCategories');

  const mongoCategories = mongoDB.collection('categories');

  const categories = await mysql.query('select * from categorias')
    .reduce((categories, item) => {
      const cat = {
        id: item.id,
        name: item.nombre,
        description: item.descripcion,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      };

      if (item.parent_id) {
        cat.parent = item.parent_id;
      }

      return [...categories, cat];
    }, []);

  if (categories.length) {
    await mongoCategories.insertMany(categories);
  }

  const categoriesLookup = (await mongoCategories.find().toArray())
    .reduce((lookup, item) => {
      lookup[item.id] = item;
      return lookup;
    }, {});

  for (let id of Object.keys(categoriesLookup)) {
    const child = categoriesLookup[id];

    if (child.parent) {
      const parent = categoriesLookup[child.parent];
      if (parent) {
        parent.children = parent.children || [];
        parent.children = [...parent.children, child._id];
        child.parent = parent._id;
      } else {
        delete child.parent;
      }
    }
  }

  for (let id of Object.keys(categoriesLookup)) {
    const cat = categoriesLookup[id];
    mongoCategories.updateOne({_id: cat._id}, cat);
  }

  console.timeEnd('accountsCategories');
};
