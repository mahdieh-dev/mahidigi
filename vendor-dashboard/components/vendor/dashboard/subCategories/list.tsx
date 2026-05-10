import SubCategoryListItem from './list.item'

const ListAllSubCategories = ({
    subCategories,
    categories,
    setSubCategories
}: {
    categories: any,
    subCategories: any,
    setSubCategories: any
}) => {
    return (
        <div>
            <ul className='mt-4'>
                {
                    typeof categories !== "undefined" && subCategories?.map((subCategory: any) => (
                        <SubCategoryListItem categories={categories} subCategory={subCategory} key={subCategory._id} setSubCategories={setSubCategories} />
                    ))
                }
            </ul>
        </div>
    )
}

export default ListAllSubCategories