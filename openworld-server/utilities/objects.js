const filterKeys = (object, keys) => {
    const objectKeys = Object.keys(object);
    const filteredKeys = objectKeys.filter(key => keys.includes(key));
    return filteredKeys.reduce((previous, current) => ({...previous, [current]: object[current]}), {});
};

module.exports = {filterKeys};
