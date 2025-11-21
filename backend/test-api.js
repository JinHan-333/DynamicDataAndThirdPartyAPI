// Using built-in fetch

const BASE_URL = 'http://localhost:3001/api/recipes';

async function testApi() {
  console.log('Testing API...');

  // 1. Create a recipe
  console.log('\n1. Creating a recipe...');
  const newRecipe = {
    name: 'Test Cocktail',
    ingredients: [{ name: 'Rum', measure: '2 oz' }, { name: 'Coke', measure: '4 oz' }],
    instructions: 'Mix and serve.',
    glass: 'Highball',
    category: 'Cocktail'
  };
  
  let createdId;
  try {
    const createRes = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecipe)
    });
    const createData = await createRes.json();
    console.log('Created:', createData);
    createdId = createData._id;
  } catch (e) {
    console.error('Create failed:', e);
  }

  if (!createdId) return;

  // 2. Get all recipes
  console.log('\n2. Getting all recipes...');
  try {
    const getAllRes = await fetch(BASE_URL);
    const getAllData = await getAllRes.json();
    console.log('All recipes count:', getAllData.length);
  } catch (e) {
    console.error('Get All failed:', e);
  }

  // 3. Get one recipe
  console.log(`\n3. Getting recipe ${createdId}...`);
  try {
    const getOneRes = await fetch(`${BASE_URL}/${createdId}`);
    const getOneData = await getOneRes.json();
    console.log('Got recipe:', getOneData.name);
  } catch (e) {
    console.error('Get One failed:', e);
  }

  // 4. Delete recipe
  console.log(`\n4. Deleting recipe ${createdId}...`);
  try {
    const deleteRes = await fetch(`${BASE_URL}/${createdId}`, { method: 'DELETE' });
    const deleteData = await deleteRes.json();
    console.log('Delete result:', deleteData);
  } catch (e) {
    console.error('Delete failed:', e);
  }
}

// Wait for server to start then run test
setTimeout(testApi, 2000);
