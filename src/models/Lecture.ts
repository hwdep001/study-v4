export class Lecture {
    id?: string;
    name?: string;
    num?: number;
    version?: number;
    categoryId?: string;

    static equals(a: any, b: any) {
        if(a == null || b == null) return false;
        if(a.id != b.id) return false;
        if(a.name != b.name) return false;
        if(a.num != b.num) return false;
        return true;
    }
}