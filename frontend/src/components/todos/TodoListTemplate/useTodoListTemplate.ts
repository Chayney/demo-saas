"use client";

import { useState } from "react";
import { Todo } from "@/types/todo";

export const useTodoList = (todos: Todo[]) => {
    const [searchText, setSearchText] = useState("");
    const [filteredTodos, setFilteredTodos] = useState(todos);

    const handleSearch = () => {
        const keyword = searchText.trim().toLowerCase();

        if (!keyword) {
            setFilteredTodos(todos);
            return;
        }

        setFilteredTodos(
            todos.filter((todo) =>
                todo.title.toLowerCase().includes(keyword)
            )
        );
    };

    return {
        searchText,
        setSearchText,
        filteredTodos,
        handleSearch,
    };
};