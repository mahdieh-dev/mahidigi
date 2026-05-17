import TopBarListItem from './list.item'

function ListAllTopBars({ topBars, setTopBars }: { topBars: any, setTopBars: any }) {
    return (
        <div>
            <ul className='mt-4'>
                {topBars?.map(topBar => (
                    <TopBarListItem topBar={topBar} key={topBar._id} setTopBars={setTopBars} />
                ))}
            </ul>
        </div>
    )
}

export default ListAllTopBars
