import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { decrement, increment, incrementByAmount } from './features/counter/counterSlice';

const Home = () => {
    const count = useSelector((state) => state.counter.value);
    const dispatch = useDispatch();
  return (
    <div>
        <h1 className='text-3xl'>count: {count}</h1>
        <button className='btn bg-green-400 ml-1 py-1 px-2 rounded-md' onClick={() => dispatch(increment())}>increment</button>
        <button className='btn bg-green-400 ml-1 py-1 px-2 rounded-md' onClick={() => dispatch(decrement())}>decrement</button>
        <button className='btn bg-green-400 ml-1 py-1 px-2 rounded-md' onClick={() => dispatch(incrementByAmount(5))}>incrementByAmount 5</button>

    </div>
  )
}

export default Home