import React from 'react'

const App = () => {
  const name='john';
  const x=10;
  const y=20;
  const names=['Brad','Mary','john']
  const loggedIn=false;
  return (
    <>
    <div className='text-3xl font-bold '>App</div>
    <p>Hello {name}</p>
    <p>sum of {x} and {y} is {x+y}</p>
    <ul>
      {
        names.map((name,index)=>(
          <li key={index}>{name}</li>
        ))
        
      }
    </ul>
    {loggedIn ? <h1>Hello world</h1>:<h1>hello Guyzzz</h1>}
    </>
  )
}

export default App