export const recipesToIngredients = (recipes) => {

    if (!recipes || recipes.length === 0) return [];

    let ingredientsArray = recipes.map(elem => elem = elem.ingredients);

    let concat = [];

    ingredientsArray.forEach(elem => { 
        elem.forEach(item => {
            concat.push(item);
        })
    })

    let namesArray = [];
    concat.forEach(elem => namesArray.push(Object.values(elem)[0]));

    let uniqueNames = [...new Set(namesArray)].sort(); 

    let ingredients = uniqueNames.map(elem => {
        let array = concat.filter(item => item.ingredientName === elem);
        let quantity = array.map(item => item = parseInt(item.ingredientQuantity, 10)).reduce((sum, obj) => sum + obj);
        let units = array[0].ingredientUnits;

        return elem = {name: elem, quantity: quantity, units: units, checked: false};
    });

    return ingredients;
}
