export type Todo = {
    id: number;
    title: string;
    content: string;
    createdAt?: Date;
    updatedAt?: Date;
    userId: number;
}