import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const User = () => {
    let { userId } = useParams();

    return (
        <p>This is user: {userId}</p>
    )    
}

export default User;