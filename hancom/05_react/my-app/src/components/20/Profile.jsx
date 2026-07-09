import '../18/Hello.css' 

const Profile = ({job = "개발자", name = "김해냄"}) => {
    return (
        <>
        <h2>{name}</h2>
        <p>{job}</p>
        </>
    )
}

export default Profile
