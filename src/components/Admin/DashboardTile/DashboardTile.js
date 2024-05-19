const DashboardTile = ({ title, children, style }) => (
    <div className="m-2 min-h-36 p-5 rounded-3xl min-w-fit cshadow justify-between dark:bg-lightBlack items-start flex flex-col" style={style}>
        <h3 className='text-2xl font-bold'>{title}</h3>
        {children}
    </div>
);

export default DashboardTile;