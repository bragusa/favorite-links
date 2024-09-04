import './FolderColor.css';

function FolderColor({data, setDialogData, appFunction, customFunction}) {
  const folderColors = [
    {name: 'red', label:'Red', code: '#FF0000'},
    {name: 'green', label:'Green', code: '#008000'},
    {name: 'blue', label:'Blue', code: '#0000FF'},
    {name: 'pink', label:'Pink', code: '#FFC0CB'},
    {name: 'lightblue', label:'Light Blue', code: '#ADD8E6'},
    {name: 'gray', label:'Gray', code: '#D3D3D3'},
    {name: 'darkgray', label:'Dark Gray', code: '#A9A9A9'},
    {name: 'purple', label:'Purple', code: '#800080'},
    {name: 'brown', label:'Brown', code: '#A52A2A'}
  ];

  return <div className='folder-color-dialog'>
    <input type='color' style={{width: '3rem', height: '3rem'}}/>
    {/* <ul>
      <li data-current={!data.folderColor} className='fav-folder-link-color' onClick={()=>{customFunction(null); appFunction('close-top-dialog');}}><input type='radio' hidden/><span>📁</span> Default</li>
      {folderColors.map(mappedColor=>{
        return <li key={mappedColor.name} data-folder-color={mappedColor.name} data-current={data.folderColor===mappedColor.name} className='fav-folder-link-color' onClick={()=>{customFunction(mappedColor.code); appFunction('close-top-dialog');}}><input type='radio' hidden/><span>📁</span> {mappedColor.label}</li>
      })}
    </ul> */}
  </div>;
}

export default FolderColor;