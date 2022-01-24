import './ContentContainer.css';

function ContentContainer(props) {
    return (
        <div className="container">
            <div className="col-filler" />
            <div className="content">
                {props.children}
            </div>
            <div className="col-filler" />
        </div>
    );
}

export default ContentContainer;
