import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {

    const dispatch = useDispatch();

    const user = useSelector((state)=>state.auth.user);
  return (
    <>
    <h1>
        Navbar
    </h1>
    </>
  )
}

export default Navbar