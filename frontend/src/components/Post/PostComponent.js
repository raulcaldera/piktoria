import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const Post = () => {
    let { postId } = useParams();

    return (
        <p>This is post: {postId}</p>
    )    
}

export default Post;