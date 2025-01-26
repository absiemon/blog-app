import Category from '../schema/category.js';
import categories from '../assets/seedData/category.json' assert { type: 'json' };

/**
 * Seed categories into the database if the collection is empty.
 */
export const seedCategories = async () => {
    try {
        const count = await Category.countDocuments();
        if (count === 0) {
            await Category.insertMany(categories);
            console.log('Categories seeded successfully!');
        } 
        else {
            console.log('Categories already exist. Skipping seeding.');
        }
    } 
    catch (error) {
        console.error('Error seeding categories:', error);
    }
};