//import { useEffect, useState } from 'react';
import { useEffect, useRef, useState } from 'react';
import './Favorite.css';
import { Icon } from '../resources/Icons';
import FolderImage from './FolderImage';

function Favorite({goToFolder, data, dragHandler, dragInfo, appFunction, level, copied}) {
  const [showMenu, setShowMenu] = useState(false);
  const image = data.imageSrc && data.imageSrc.length<5?data.imageSrc:<img alt='' data-invert={data.invertImage} src={data.imageSrc}/>
  const setURLPath = (index)=>{
    window.location.pathname += `${window.location.pathname.endsWith('/')?'':'/'}${data.label.toLowerCase()}`;
  }
  const inner = <><div className='fav-image' data-invert={data.invertImage}>{data.imageSrc?image:null}</div><div className='fav-title'><span>{data.label}</span></div></>;
  // eslint-disable-next-line jsx-a11y/anchor-is-valid
  const content =  !data.isFolder?<a onClick={()=>{window.open(data.url,data.id)}} target={data.id} rel="noreferrer">{inner}</a>:data.isFolder?<a onClick={()=>{setURLPath(data)}}>{inner}</a>:inner;

  const reference = useRef();

  useEffect(()=>{
    if(reference.current){
      reference.current.style.opacity = '1';
    }
  }, []);

  const toggleEdit = (evt) => {
    evt.preventDefault();

    setTimeout(()=>{
      setShowMenu(!showMenu);
    }, 100)
  }

  const menuEdit = (evt)=>{
    appFunction('show-dialog', {title: 'Edit Favorite', name: 'Edit', favoriteId: data.id});
  }

  // const menuDuplicate = (evt)=>{
  //   appFunction('duplicate',{favoriteId: data.id});
  // }
  
  const menuDelete = (evt)=>{
    appFunction('delete',{favoriteId: data.id});
  }

  const menuMoveUp = (evt) =>{
    appFunction('move-to-parent',{favoriteId: data.id}, evt);
  }

  const myDragHandler = (evt) =>{
    if(showMenu){
      setShowMenu(false);
    }
    dragHandler(evt);
  }

  const menuCopy = (evt)=>{
    appFunction('copy',{copied: [data]}, evt);
  };

  const menuPaste = (evt)=>{
    appFunction('paste',{favoriteId: data.id}, evt);
  };

  return (
    <div ref={reference} id={data.id} data-show-menu={showMenu} /*onMouseLeave={showMenu?toggleEdit:null}*/ onClick={(evt)=>{evt.stopPropagation();evt.preventDefault()}} draggable='true' className={`fav-favorite ${data.isFolder?'fav-folder-link':'fav-link'}`} data-drag-over={dragInfo.dragId===data.id} 
    onDragOver={myDragHandler} onDrop={myDragHandler} onDragLeave={myDragHandler} onDragStart={myDragHandler} onDragEnd={myDragHandler} onContextMenu={toggleEdit} >
      {data.isFolder?<div className='folder-image'><FolderImage open={false} color={data.folderColor}/></div>:null}
      {data.isFolder?<div className='folder-open-image'><FolderImage open={true} color={data.folderColor}/></div>:null}
      {content}
      <ul className='fav-menu' onClick={()=>setShowMenu(false)} onMouseLeave={()=>setShowMenu(false)}>
      <li onClick={menuEdit}><Icon name='edit'/><span>Edit</span></li>
        {/* <li  onClick={menuDuplicate}><svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:copy" description="Carbon:copy" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><path d="M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z"></path><path d="M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z"></path></svg><span>Duplicate</span></li> */}
        {level>0?<>
          <li className='menu-sep'></li>
          <li onClick={menuMoveUp}><Icon name='up'/><span>Move up</span></li>
          <li className='menu-sep'></li>
        </>:null}
        <li onClick={menuCopy}><Icon name='copy'/><span>Copy</span></li>
        {copied.length>0?<li onClick={menuPaste}><Icon name='paste'/><span>Paste</span></li>:null}
        <li className='menu-sep'></li>
        <li onClick={menuDelete}><Icon name='delete' color='red'/><span>Delete</span></li>
      </ul>
    </div>
  );
}

export default Favorite;