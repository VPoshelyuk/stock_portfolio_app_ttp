import React from "react";

const Search = props => {
    return (
        <div className="search">
            <form>
                <input id={props.searchType === "name" ? "name-input":"tag-input"} onChange={props.search} value={props.searchTerm} type="text" placeholder={props.searchType === "name" ? "Search by name" : "Search by tag"} />
            </form>
        </div>
    );

};

export default Search;