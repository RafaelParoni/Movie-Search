import './style.css';


function Social(){
    function click() {
        alert('click')
    }

    return(
        <div className='social'>
            <a href = "https://github.com/RafaelParoni" target = "_blank" >
                <div className='icon github'>
                    
                </div>
            </a>
            <a href = "https://rafaelparoni.netlify.app/" target = "_blank" >
                <div className='icon site'>
                    
                </div>
            </a>
        </div>
    )
}
export default Social;