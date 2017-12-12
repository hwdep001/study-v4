import { Category } from './Category';
import { Lecture } from './Lecture';

export class WordSearch {
    cat: Category;
    lec: Lecture
    levIds: Array<number>;
    count: number;
    lecIds: Array<string>;

    constructor(
        cat: Category, lec: Lecture, levIds: Array<number>, 
        count: number, lecIds: Array<string>) {

        this.cat = cat;
        this.lec = lec;
        this.levIds = levIds;
        this.count = count;
        this.lecIds = lecIds;
    }
}