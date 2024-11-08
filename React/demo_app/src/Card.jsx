import { useState } from "react";

const Card=({customClasses})=>{
    const [likes,setLikes]=useState(0);
    const [titlecolor,setTitleColor]=useState('text-black');
    //to change title color  
    const toggleTitleColor=()=>{
        setTitleColor((prevColor)=>
            prevColor==='text-black'?'text-purple-500':'text-black'
        );
    };
    return(
        <div className={`max-w-sm h-28 rounded overflow-hidden shadow-lg p6-white ml-96 ${customClasses}`}>
            <h2 className={`font-bold text-xl mb-2 ${titlecolor}`}>
            Hello World!
            </h2>
            <p className="text-gray-700 text-base">This is some example text in the card</p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 mb-10" onClick={()=>setLikes(likes+1)}>likes:{likes}</button>
            <button className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"onClick={toggleTitleColor}>Toggle Title Color</button>
        </div>

    );
};

export default Card;