import { Category } from './Category';

export class Subject {
    id?: string;
    name?: string;
    num?: number;

    cats?: Array<Category>

    //
    catId?: string;
    catName?: string;
    catNum?: number;
    catVersion?: number;
}