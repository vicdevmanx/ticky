import './loader.css'

const Loader = ({size}) => {
    return (
        <div className='loader border-3 rounded-full border-[#c0c0c090] border-t-[#fff] border-r-[#fff]' style={{height: size, width: size}}>

        </div>
    )
}

export default Loader