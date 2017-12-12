import { Category } from './Category';

export class WordSearch {
    cat: Category;
    levIds: Array<number>;
    count: number;
    lecIds: Array<string>;

    constructor(cat: Category, levIds: Array<number>, count: number, lecIds: Array<string>) {
        this.cat = cat;
        this.levIds = levIds;
        this.count = count;
        this.lecIds = lecIds;
    }
}