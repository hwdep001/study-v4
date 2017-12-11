export class Word {
    id?: string;
    head1?: string;
    head2?: string;
    body1?: string;
    body2?: string;
    num?: number;

    lectureId?: string;
    levelId?: number;

    static equals(a: any, b: any) {
        if(a == null || b == null) return false;
        if(a.id != b.id) return false;
        if(a.head1 != b.head2) return false;
        if(a.head2 != b.head2) return false;
        if(a.body1 != b.body1) return false;
        if(a.body2 != b.body2) return false;
        if(a.num != b.num) return false;
        return true;
    }
}