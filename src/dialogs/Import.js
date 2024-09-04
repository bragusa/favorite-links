import './Import.css';
import { useRef } from 'react';

function Import({customFunction, appFunction}) {

  const fileInput = useRef();

  
  const preventDefaults = (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
  }

  const dropFiles = async (evt)=>{
    preventDefaults(evt);
    var dt = evt.dataTransfer;
    var files = dt.files;


    if(files.length>1){
      appFunction('error', {actions: null, message: 'Only 1 file can be imported'});
      return;
    }

    fileInput.current.files = evt.dataTransfer.files;
    const file = fileInput.current.files.item(0)
    const text = await file.text();
    return customFunction(text);
  }

  return <div className='import-dialog'>

    <div id="drop-area" onDrop={dropFiles} onDragEnter={preventDefaults} onDragOver={preventDefaults} onDragLeave={preventDefaults}>
      Drag here import
    </div>
    <input ref={fileInput} type="file" id="file-input" multiple hidden/>
  </div>;
}

export default Import;