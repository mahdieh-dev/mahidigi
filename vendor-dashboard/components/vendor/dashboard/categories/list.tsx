"use client"

import CategoryListItem from "./list.item"


const ListAllCategories = ({ categories, setCategories }) => {
    return (
        <div>
            <ul className="mt-4">
                {typeof categories !== "undefined" && categories?.map(category => (
                    <CategoryListItem
                        category={category}
                        key={category._id}
                        setCategories={setCategories}
                    />
                ))}
            </ul>
        </div>
    )
}

export default ListAllCategories