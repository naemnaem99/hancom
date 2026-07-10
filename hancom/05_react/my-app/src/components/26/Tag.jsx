const Tag = ({tags}) => {
    return (
        <div>
            {tags.map((Tag) => (
                <span key={Tag}>{"#"+ Tag}</span>
            ))}
        </div>
    )
}

export default Tag
