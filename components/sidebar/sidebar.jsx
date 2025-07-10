"use client";

import { useState } from "react";
import { SidebarNavigation } from "./sidebar-navigation";
import { SearchSheet } from "./search-sheet";
import { CreatePostDialog } from "../posts/create-post-dialog";

export function Sidebar() {
    const [searchOpen, setSearchOpen] = useState(false);
    const [createOpen, setCreateOpen] = useState(false);

    const handleSearchClick = () => {
        setSearchOpen(true);
    };

    const handleCreateClick = () => {
        setCreateOpen(true);
    };

    return (
        <>
            <SidebarNavigation
                onSearchClick={handleSearchClick}
                onCreateClick={handleCreateClick}
            />
            <SearchSheet open={searchOpen} onOpenChange={setSearchOpen} />
            <CreatePostDialog open={createOpen} onOpenChange={setCreateOpen} />
        </>
    );
}
