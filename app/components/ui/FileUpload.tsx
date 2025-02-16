export default function FileUpload({ children, fileLoadedHandler, accept, id, name }) {

    function dropHandler(e) {
        console.log("ondrop")
        e.preventDefault();
        fileLoadedHandler(e.dataTransfer.files);

    }

    function changeHandler(e) {
        fileLoadedHandler(e.target.files);
    }

    return (<div onDragEnter={(e) => e.preventDefault()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={dropHandler}
        onChange={changeHandler}>
        <input className="hidden" type="file" accept={accept} id={id} name={name} />
        {children}
    </div>);
}