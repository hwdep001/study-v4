import { Category } from './Category';
import { Lecture } from './Lecture';

export class WordSearch {
    cat: Category;
    lec: Lecture
    lecIds: Array<string>;
    levIds: Array<number>;
    count: number;
    isRandom: boolean;

    constructor(
        cat: Category, 
        lec: Lecture, 
        lecIds: Array<string>,
        levIds: Array<number>, 
        count: number,
        isRandom: boolean
    ) {
        this.cat = cat;
        this.lec = lec;
        this.lecIds = lecIds;
        this.levIds = levIds;
        this.count = count;
        this.isRandom = isRandom;
    }
}