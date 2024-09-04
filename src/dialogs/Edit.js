import './Edit.css';
import { useEffect, useRef, useState } from 'react';
import FolderImage from '../components/FolderImage';

function Edit({data, setDialogData, appFunction}) {
  const content = useRef();
  const [image, setImage] = useState(data.imageSrc);
  const [invertImage, setInvertImage] = useState(data.invertImage)

  const focusHandler = (evt) =>{
    evt.currentTarget.select();
  }

  useEffect(()=>{
    content.current.querySelectorAll('input').forEach((input) =>{
      input.addEventListener('focus', focusHandler);
    });
    content.current.querySelector('input').focus();

    let myContent = content.current;
    return ()=>{
      myContent.querySelectorAll('input').forEach((input) => {
        input.removeEventListener('focus', focusHandler);
      });
    }
  }, []);

  const updateRecord = (attribute, value) => {
    let tempData = {...data};
    tempData[attribute] = value;
    setDialogData(tempData);
    if(attribute==='imageSrc'){
      setImage(value);
    }
    if(attribute==='invertImage'){
      setInvertImage(value);
    }
  }

  const border = data.imageSrc?'0':'1px dotted #999';

  const validateValue = (attribute, value)=>{
    let valid = true;
    if( ['label'].includes(attribute) && value.includes('%')){
      valid = false;
    }
    if(['label'].includes(attribute) && value.includes('=')){
      valid = false;
    }
    if(valid){
      updateRecord(attribute, value);
    }
  }

  return <div className='edit-dialog' ref={content}>
    <label htmlFor='label'>Label</label>
    <input id='label' value={data.label} autoComplete='off' onChange={(evt)=>{validateValue('label', evt.currentTarget.value)}}/>

    {!data.hasOwnProperty('isFolder') || data.isFolder===false?<>
      <label htmlFor='url'>URL</label>
      <input id='url' type='url' value={data.url} autoComplete='off' onChange={(evt)=>{ updateRecord('url',evt.currentTarget.value)}} />
    </>:<><label >Choose Folder Color</label>
    <button className='default' onClick={evt=>updateRecord('folderColor', '')}>Default</button>
    <div className='fav-folder-link' style={{position: 'relative', height: '6rem', left: '0'}}>
        <button onKeyUp={evt=>evt.stopPropagation()} onClick={evt=>{evt.currentTarget.querySelector('input[type="color"]').click()}}  tabIndex={0} className='folder-image'><input onChange={evt=>{updateRecord('folderColor',evt.currentTarget.value)}} type='color' onKeyUp={evt=>{evt.preventDefault();evt.stopPropagation()}} tabIndex={-1} className='color-input'/><FolderImage open={false} color={data.folderColor}/></button>
      </div></>}

    <label htmlFor='image'>Image</label>
    <input id='image' value={data.imageSrc} autoComplete='off' onChange={(evt)=>{updateRecord('imageSrc',evt.currentTarget.value)}} />

    <div className='edit-image-div'><div style={{border: border, width: '2rem', height: '2rem'}}>{image?(image.length>4?<img data-invert={invertImage} alt='data' src={image}/>:<input data-invert={invertImage} type='text' value={image} onChange={()=>{}}/>):null}</div>{data.imageSrc?<label htmlFor='invert'>Invert Image<input id='invert' type='checkbox' checked={invertImage} onChange={(evt)=>{updateRecord('invertImage',evt.currentTarget.checked)}}/></label>:null}</div>
  </div>;
}

export default Edit;