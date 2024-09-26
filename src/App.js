import './App.css';
import { useEffect, useRef, useState } from 'react';
import Favorites from './components/Favorites';
import Dialog from './components/Dialog';
import {getIcon} from './resources/Icons';

const storageKey = 'my-favorite-links';
const copyKey = 'my-favorite-copied';
const rootPath = 'favorites';
const rootIdName = 'id';

const getURLPath = ()=>{
  let simplepath = window.location.hash.substring(2);
  if(simplepath.endsWith('/')){
    simplepath = simplepath.substring(0,simplepath.length-1);
  }
  if(simplepath.length>0 && simplepath!==rootPath){
    let pathArray = simplepath.split('/');
    if(pathArray[0]===rootPath){
      pathArray.splice(0,1);
    }

    let decoded = [];

    pathArray.forEach(path=>{
      decoded.push(decodeURIComponent(path));
    })
    
    return decoded;
  }
  return [];
}

// const getURLPath = ()=>{
//   let simplepath = decodeURI(window.location.pathname.substring(1));
//   const hash = window.location.hash;
//   if(simplepath.endsWith('/')){
//     simplepath = simplepath.substring(0,simplepath.length-1);
//   }
//   if(simplepath.length>0 && simplepath!==rootPath){
//     let pathArray = simplepath.split('/');
//     if(pathArray[0]===rootPath){
//       pathArray.splice(0,1);
//     }
//     return pathArray;
//   }
//   return [];
// }

function App() {
  const [copied, setCopied] = useState(JSON.parse(localStorage.getItem(copyKey) || '[]'));
  const [allData, setAllData] = useState();
  const [path, setPath] = useState([]);
  const [pathTitles, setPathTitles] = useState([]);
  const [pathData, setPathData] = useState();
  const [pathDataKey, setPathDataKey] = useState(new Date().getTime());
  const [dragging, setDragging] = useState(false);
  const [dragInfo, setDragInfo] = useState({
    dragId: null
  });
  const [dialogStack, setDialogStack] = useState([]);
  const dragGhost = useRef();
  const urlParams = new URLSearchParams(window.location.search);
  const [rootId] = useState(urlParams.get(rootIdName)?`_${urlParams.get(rootIdName)}`:'');
  const [hash, setHash] = useState('');

  const file = useRef();
  const getNewId = () => `FAV_${new Date().getTime()}`;

  useEffect(()=>{
    const fetchedData =  localStorage.getItem(`${storageKey}${rootId}`);
    if(fetchedData === null){
      writeData({childOrder: [], children:{}});
      return;
    }
    setAllData(JSON.parse(fetchedData));
    window.addEventListener("hashchange", (evt) => {
      const url = new URL(evt.newURL);
      let newHash = url.hash.substring(2);
      debugger;
      setHash(newHash);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(()=>{
    console.log('dragging='+dragging);
    if(!dragging){
      const dragNode = document.querySelector('[fav-dragNode]');
      if(dragNode){
        setTimeout(()=>{
          dragNode.remove();
        },10);
      }
    }
  }, [dragging]);

  const moveToCurrentPath = () => {
    setPath([...path]);
  }

  useEffect(()=>{
    if(path.length>0){
      let tempPathData = allData;
      let tempPath = [...path];
      let tempPathTitles = [];
      while(tempPath.length>0){
        const currentPathLevel = tempPath.shift();
        tempPathTitles.push(tempPathData.children[currentPathLevel].label);
        tempPathData = tempPathData.children[currentPathLevel];
      }
      setPathData(tempPathData);
      setPathTitles(tempPathTitles);
    }
    else {
      setPathData(allData);
      setPathTitles([]);
    }
    setPathDataKey(new Date().getTime());

  }, [allData, path]);

  const writeData = (allData) => {
    localStorage.setItem(`${storageKey}${rootId}`, JSON.stringify(allData));
    setAllData({...allData});
    setTimeout(()=>{
      moveToCurrentPath();
    })
  }

  useEffect(()=>{

    const getPathPointer = (path) => {
      let tempData = {...allData};
      let tempPath = [...path].reverse();
      while(tempPath.length>0){
        const currentPath = tempPath.pop();
        tempData = tempData.children[currentPath];
      }
      return tempData.children?tempData:allData;
    }

    const convertPathLabelsToPath = (pathLabels) => {
      //let tempData = {...allData};
      let tempPathLabels = [...pathLabels].reverse();
      let newPath = [];
      let pathPointer = getPathPointer(newPath); //top level
      while(tempPathLabels.length>0){
        const currentPathLabel = tempPathLabels.pop();
        let pathId = null;
        // eslint-disable-next-line no-loop-func
        Object.keys(pathPointer.children).some(key=>{
          const child = pathPointer.children[key];
          if(child.label.toLowerCase()===currentPathLabel){
            pathId = child.id;
            return true;
          }
          return false;
        });
  
        newPath.push(pathId);
  
        pathPointer = getPathPointer(newPath);
      }
      return newPath;
    }

    setPathData(allData);
    if(allData){
      const urlPath = getURLPath();
      if(urlPath.length>0){
        const pathFromURL = convertPathLabelsToPath(urlPath);
        setPath(pathFromURL);
      }
    }
  }, [allData, hash]);

  const newFolder = {
    children: {}, 
    childOrder: [], 
    isFolder: true,
    label: ''
  }

  const createFolder = ()=>{
    createElement(newFolder,'Create Folder');
  }

  const importFavorites = (text)=>{
    let data;
    try{
      data = JSON.parse(text);
    }catch(error){
      appFunction('error', {actions: null, message: error.message});
      return false;
    } 

    const filename = download();
    if(filename){
      setTimeout(()=>{
        alert('Favorites backup downloaded: '+ filename);
      }, 200);
    }

    writeData(data);

    window.location.pathname = '';
    return true;
  }

  const newFavorite = {
    label: '',
    isFolder: false,
    url: ''
  }

  const createElement = (element, title, additional)=>{
    const newId = `FAV_${new Date().getTime()}`;
    let newData = {...element, ...{id: newId}};
    setDialogStack([...dialogStack,...[{
      name: 'Edit', 
      title: title,
      favoriteId: newId, 
      data: newData,
      actions: [{label: 'Save', callback: (evt,data) => { return updateCurrentFavorite(evt,data)}}]
    }]]);
  }

  const createFavorite = ()=>{
    createElement(newFavorite,'Create Link');
  }

  const moveFavorite =  (evt, dragId) => {
    let pathPointer = getPathPointer(path);
    if(evt.currentTarget.classList.contains('fav-folder-link')){
      const favoriteToMove = {...pathPointer.children[dragId]};
      delete pathPointer.children[dragId];

      const fromOrderIndex = pathPointer.childOrder.findIndex((childId)=>(childId===dragId));
      pathPointer.childOrder.splice(fromOrderIndex, 1);
      const toPathPointer = pathPointer.children[evt.currentTarget.id];
      toPathPointer.children[favoriteToMove.id] = favoriteToMove;
      toPathPointer.childOrder.push(favoriteToMove.id);
    }
    else {
      if(evt.currentTarget.classList.contains('fav-ghost')){
        const moveToIndex = Array.from(evt.currentTarget.parentElement.childNodes).indexOf(evt.currentTarget)
        const tempPathDataChildOrder = [...pathData.childOrder];
        const fromIndex = tempPathDataChildOrder.findIndex((childId)=>(childId===dragId));
        pathPointer.childOrder.splice(moveToIndex>fromIndex?moveToIndex-1:moveToIndex, 0, pathPointer.childOrder.splice(fromIndex, 1)[0]);
        writeData(allData);
        return true;
      }
      else { //drop onto another link
        // confirmation dialog to create a new folder or insert before
        const insertDropped = (evt, index)=>{

          const eventTarget = (evt.currentTarget || evt.target).closest('.fav-favorite.fav-link');
          
          const moveToIndex = Array.from(eventTarget.parentElement.childNodes).indexOf(eventTarget) + index;
          const tempPathDataChildOrder = [...pathData.childOrder];
          const fromIndex = tempPathDataChildOrder.findIndex((childId)=>(childId===dragId));
          pathPointer.childOrder.splice(moveToIndex, 0, pathPointer.childOrder.splice(fromIndex, 1)[0]);
          writeData(allData);
          return true;
        }

        const convertToFolder = (evt) =>{
          
          const eventTarget = (evt.currentTarget || evt.target).closest('.fav-favorite.fav-link');
          //put new copy of drop target in folder
          const droppedOnCopy = {...pathPointer.children[eventTarget.id]};

          //make drop target a folder
          pathPointer.children[eventTarget.id].isFolder = true;
          pathPointer.children[eventTarget.id].label = 'New Folder';

          const newId = getNewId();
          droppedOnCopy.id = newId;
          pathPointer.children[eventTarget.id].children = {};
          pathPointer.children[eventTarget.id].children[newId] = droppedOnCopy;
          pathPointer.children[eventTarget.id].childOrder = [newId];

          const fromOrderIndex = pathPointer.childOrder.findIndex((childId)=>(childId===dragId));
          pathPointer.childOrder.splice(fromOrderIndex, 1);
          const draggedToMove = {...pathPointer.children[dragId]};
          delete pathPointer.children[dragId];
          pathPointer.children[eventTarget.id].children[dragId] = draggedToMove;
          pathPointer.children[eventTarget.id].childOrder.push(dragId);

          writeData(allData);
          return true;
        }

        appFunction('confirm', {actions: [{label: 'Insert Before', callback: (evt)=>{return insertDropped(evt, 0)}},{label: 'Insert After', callback: (evt)=>{return insertDropped(evt,1)}},{label: 'Create Folder', callback: convertToFolder}]}, evt);
        //moveBefore();
      }
    }

    writeData(allData);
  }

  const goToFolder = (newPath) => {

    if(Number.isInteger(newPath)){

      if(newPath===-1){
        setPath([]);
        return;
      }
      setPath([...path].slice(0, newPath));
      return;
    }

    //use path to open a folder. If path is empty we do top level.
    setPath([...path, ...[newPath]])
  }

  const buildBreadCrumbURLPath = (index) =>{
    const newPath = pathTitles.slice(0,index);
    return '/'+newPath.join('/').toLowerCase();
  }

  const breadcrumbs = <ul onClick={(evt)=>{evt.stopPropagation();evt.preventDefault();}}>
    <li key='_root_' data-path-index={0} /* onDragOver={(evt)=>{evt.preventDefault();}} onDrop={droppedOnBreadcrumb}*/><button disabled={path.length===0} title='Go to Root' onClick={()=>{document.location.hash='';setPath([]);}/*()=>goToFolder(-1)*/}>Favorites</button>{path.length>0?'/':''}</li>
    {pathTitles.map((pathTitle, index) => {
      const internal = <><button disabled={index===path.length-1} title={`Go to ${pathTitle}`} onClick={()=>{
        document.location.hash=buildBreadCrumbURLPath(index+1)
        // document.location.pathname = buildBreadCrumbURLPath(index+1);
      }/*()=>{goToFolder(index+1)}*/}>{pathTitle}</button>{index<path.length-1?'/':''}</>;
      return <li data-path-index={index+1} onDragOver={(evt)=>{if(index<path.length-1){evt.preventDefault()}}} key={pathTitle}>{internal}</li>
    })}
  </ul>;


  const toggleGhost = (visible) => {
    if(visible){
      dragGhost?.current?.setAttribute('data-visible', 'true');
    }
    else {
      dragGhost?.current?.removeAttribute('data-visible');
    }
  }

  const dragHandler = (evt) =>{

    // eslint-disable-next-line default-case
    switch(evt.nativeEvent.type){
      case 'dragstart':
          const dragNode = evt.currentTarget.cloneNode(true);
          dragNode.setAttribute('fav-dragNode', 'true');
          dragNode.style.opacity = '.25';
          document.body.appendChild(dragNode);
          evt.dataTransfer.setDragImage(dragNode, 56, 56);
          evt.currentTarget.setAttribute('data-dragging', true);
          setDragging(true);
          setDragInfo({...dragInfo, ...{dragId : evt.currentTarget.id}});
        break;
      case 'dragover':
        evt.preventDefault();
        if(evt.currentTarget.id !== dragInfo.dragId){
          const fav = evt.currentTarget;
          fav.setAttribute('data-drag-over', 'true');
          const box = fav.getBoundingClientRect();
          const offsetX = evt.nativeEvent.offsetX;
          if(offsetX < 20){
            fav.parentElement.insertBefore(dragGhost.current, fav);
            toggleGhost(true);
            setDragInfo({...dragInfo, ...{dragOverId : fav.id}});
          }
          else if(offsetX > box.width - 20){
            if(fav.nextElementSibling){
              fav.parentElement.insertBefore(dragGhost.current, fav.nextElementSibling);
              setDragInfo({...dragInfo, ...{dragOverId : fav.nextElementSibling.id}});
            }
            else {
              fav.parentElement.appendChild(dragGhost.current);
              setDragInfo({...dragInfo, ...{dragOverId : 'END'}});
            }
            toggleGhost(true);
          }
          else {
            //middle
            //fav.setAttribute('data-drag-over', 'true');
            toggleGhost(false);
          }
        }
        break;
      case 'dragleave':
        evt.currentTarget.removeAttribute('data-drag-over');
        if(evt.currentTarget.id !== dragInfo.dragId){
          evt.currentTarget.removeAttribute('data-dragging');
        }
        //setDragInfo({...dragInfo, ...{dragId: null}})
        break;
      case 'drop':

        // if(evt.currentTarget.id==='import'){
        //   evt.nativeEvent.stopImmediatePropagation();
        //   evt.nativeEvent.preventDefault();
          
        //   file.current.files = evt.dataTransfer.files;
        //   readText();  
        // }
        // else {
        setDragging(false);
        evt.currentTarget.removeAttribute('data-drag-over');
        if(evt.dataTransfer.getData('Text') !== ''){
          //appFunction('show-dialog', {title: 'Add Favorite', name: 'Edit', favoriteId: data.id});
          const url = evt.dataTransfer.getData('Text');
          createElement({...newFavorite,...{url: url}},'Create Link');
          evt.preventDefault();
        }
        else {
          moveFavorite(evt, dragInfo.dragId);
        }
        //}
      // eslint-disable-next-line no-fallthrough
      case 'dragend':
        setDragging(false);
        evt.currentTarget.removeAttribute('data-dragging');
        toggleGhost(false);
        break;
    }
  }
  
  const getPathPointer = (path) => {
    let tempData = {...allData};
    let tempPath = [...path].reverse();
    while(tempPath.length>0){
      const currentPath = tempPath.pop();
      tempData = tempData.children[currentPath];
    }
    return tempData.children?tempData:allData;
  }

  const updateCurrentFavorite = (evt, newData) => {
    evt.nativeEvent.stopImmediatePropagation()
    let pointer = getPathPointer(path).children[newData.id];
    if(!pointer){
      pointer = getPathPointer(path);
      pointer.children[newData.id] = newData;
      pointer.childOrder.push(newData.id);
      writeData(allData);
      return true;// only if successful
    }
    getPathPointer(path).children[newData.id] = newData;
    writeData(allData);
    return true;// only if successful
  }

  const deleteCurrentFavorite = (evt, data) => {
    evt.nativeEvent.stopImmediatePropagation()
    let currentPathPointer = getPathPointer(path);
    const idToDelete = data.id;
    delete currentPathPointer.children[idToDelete];
    const fromIndex = currentPathPointer.childOrder.findIndex((childId)=>(childId===idToDelete));
    currentPathPointer.childOrder.splice(fromIndex, 1);
    
    writeData(allData);
    return true;// only if successful
  }

  const duplicateCurrentFavorite = (evt, newData) => {
    evt.nativeEvent.stopImmediatePropagation()


    writeData(allData);
    return true;// only if successful
  }

  const removeSpaces = (str) => {
    if(!str){
      return '';
    }
    return str.replace(/ /g, '_');
  }

  const closeTopDialog = () => {
    const dialogIndex = dialogStack.length-1;
    const topDialog = dialogStack[dialogIndex];
    const currentDialog = document.querySelector(`#${removeSpaces(topDialog.title)}_${dialogIndex}`);
    if(currentDialog){
      Object.assign(currentDialog.style, {
        height:'0px',
        width:'0px',
        opacity: '0'
      });
      setTimeout(()=>{
        setDialogStack([...dialogStack].slice(0,dialogStack.length-1));
      }, 200);
    }
  }

  const moveToParent = (evt, favoriteId) =>{
    const currentPathPointer = getPathPointer(path);
    const favorite = {...currentPathPointer.children[favoriteId]};
    delete currentPathPointer.children[favoriteId];
    const fromIndex = currentPathPointer.childOrder.findIndex((childId)=>(childId===favoriteId));
    currentPathPointer.childOrder.splice(fromIndex, 1);

    const parentPath = [...path].splice(0,path.length-1);
    const parentPathPointer = getPathPointer(parentPath);
    parentPathPointer.children[favoriteId] = favorite;
    parentPathPointer.childOrder.push(favoriteId);
    writeData(allData);
    return true;
  }

  const appFunction = (name, params, originalEvent) => {
    // eslint-disable-next-line default-case
    switch(name){
      case 'copy':
        setCopied(params.copied);
        localStorage.setItem(copyKey, JSON.stringify(params.copied));
        return;
      case 'paste':
          let pathPointer = getPathPointer(path);

        const pasteAsChild = (evt)=>{
          // const eventTarget = (evt.currentTarget || evt.target).closest('.fav-favorite.fav-link');
          // debugger;
          // const moveToIndex = Array.from(eventTarget.parentElement.childNodes).indexOf(eventTarget) + index;
          // const tempPathDataChildOrder = [...pathData.childOrder];
          // const fromIndex = tempPathDataChildOrder.findIndex((childId)=>(childId===dragId));
          // pathPointer.childOrder.splice(moveToIndex, 0, pathPointer.childOrder.splice(fromIndex, 1)[0]);
          const newId = getNewId();
          let copyItem = JSON.parse(localStorage.getItem(copyKey))[0]; //only one at a time
          copyItem.id = newId;
          pathPointer.children[params.favoriteId].children[newId] = copyItem;
          pathPointer.children[params.favoriteId].childOrder.push(newId);
          localStorage.removeItem(copyKey);
          setCopied([]);
          writeData(allData);
          return true;
        }

        const pasteAsSibling = (evt, indexOffset) =>{
        
          const newId = getNewId();
          let copyItem = JSON.parse(localStorage.getItem(copyKey))[0]; //only one at a time
          copyItem.id = newId;
          const toIndex = pathPointer.childOrder.findIndex((childId)=>(childId===params.favoriteId));
          pathPointer.childOrder.splice(toIndex + indexOffset, 0, copyItem.id);
          pathPointer.children[newId] = copyItem;
          localStorage.removeItem(copyKey);
          setCopied([]);
          writeData(allData);
          return true;
        }

        let actions = [{label: 'Insert Before', callback: (evt)=>{return pasteAsSibling(evt, 0)}},{label: 'Insert After', callback: (evt)=>{return pasteAsSibling(evt,1)}}];
        if(true===pathPointer.children[params.favoriteId]['isFolder']){
          actions.push({label: 'Add child', callback: (evt)=>pasteAsChild(evt)});
        }
        appFunction('confirm', {actions: actions}, originalEvent);
        return;
      case 'close-top-dialog':
        closeTopDialog();
        return;
      case 'show-dialog':
        //show dialog and set current item to favoriteId
        params = {...params, ...{data: params.data || pathData.children[params.favoriteId], actions: [{label: 'Cancel', callback: ()=>{return true;}},{label: 'Save', callback: (evt,data) => { return updateCurrentFavorite(evt,data)}}]}};
        break;
    case 'import':
      //show dialog and set current item to favoriteId
      params = {...params, ...{data: params.data || pathData.children[params.favoriteId], actions: [
        {label: 'Cancel', callback: ()=>true}
      ]}};
      break;
      case 'duplicate':
        params = {...params, ...{title: 'Confirm', data: params.data || pathData.children[params.favoriteId], message: 'Would you like to duplicate?', actions: [{label: 'Yes', callback: (evt,data) => { return duplicateCurrentFavorite(evt, data)}}]}};
        break;
      case 'delete':
        //show cofirmation dialog and set current item to favoriteId
        params = {...params, ...{title: 'Confirm', data: params.data || pathData.children[params.favoriteId], message: 'Would you like to delete this item?', subMessage: '(This is permanent and will delete any child/related data)', actions: [{label: 'Yes', callback: (evt,data) => { return deleteCurrentFavorite(evt, data)}}]}};
        break;
      case 'choose-folder-color':
        params = {...params, ...{title: 'Choose Folder Color', data: params.data /*|| pathData.children[params.favoriteId]*/, name: 'FolderColor'}};
      
        break;
      case 'confirm':
        params = {...params, ...{title: 'Confirm', message: 'What would you like to do?'}};
        params.actions.unshift({label: 'Cancel', callback: ()=>{ writeData(allData); return true}});
        params.actions.forEach(action=>{action.event = originalEvent});
        //params must come from external call
        break;
      case 'move-to-parent':
        params = {...params, ...{title: 'Confirm', message: 'Move to parent?', 
          actions: [
            {label: 'Cancel', callback: ()=>{ return true}},
            {label: 'Ok', callback: ()=>{ return moveToParent(originalEvent, params.favoriteId)}}
          ]}};
        
        break;
      case 'error':
        params = {...params, ...{type: 'error', data: params.data || pathData.children[params.favoriteId], actions: [
          {label: 'Ok', callback: ()=>true}
        ]}};
        break;
    }
    params.data = params.data?{...params.data}:{...pathData.children[params.favoriteId]};
    setDialogStack([...dialogStack, ...[params]]);
  }

  const download = ()=>{
    var a = window.document.createElement('a');
    a.href = window.URL.createObjectURL(new Blob([JSON.stringify(allData)], {type: 'text'}));
    const dt = (new Date()).toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"})+(new Date()).toLocaleTimeString('en-US');
    const filename = a.download = `favorites_${dt.replaceAll(',','')}.fav.json`;
  
    // Append anchor to body.
    document.body.appendChild(a);
    a.click();
  
    // Remove anchor from body
    document.body.removeChild(a);
    return filename;
  }

  const readText = async  () => {
    const fileInput = file.current.files.item(0)
    const text = await fileInput.text();
    localStorage.setItem(`${storageKey}${rootId}`, text);
    window.location.reload();
  }

  return <>{pathData?<>
      <header className="App-header">
        <div>
          <div>{breadcrumbs}</div>
          <div>
            <button onClick={createFolder} title='Create Folder'>{getIcon('folder-add')}</button>
            <button onClick={createFavorite} title='Create Link'>{getIcon('link')}</button>
            <button onClick={(evt)=>{; appFunction('import', {customFunction: importFavorites, title: 'Import Favorites', name: 'Import', actions: null}, evt)}} title='Import new favorites definition'>{getIcon('upload')}</button>
            <button onClick={download} title='Export'>{getIcon('export')}</button>
            <input ref={file} style={{display: 'none'}} onChange={readText} type='file' />
            </div>
          </div>
      </header>
      <div ref={dragGhost} data-drag-over={'ghost'===dragInfo.id} id='ghost' onDrop={dragHandler} onDragOver={(evt)=>{evt.preventDefault()}} className='fav-favorite fav-ghost'></div>
      <Favorites rootId={rootId?`${rootIdName}=${rootId.substring(1)}`:''} copied={copied} level={path.length} appFunction={appFunction} dragging={dragging} dragInfo={dragInfo} dragHandler={dragHandler} path={path} data={pathData} goToFolder={goToFolder} />
    </>:null}
    {dialogStack.map((dialog, index) => {
      return <Dialog type={dialog.type} top={index===dialogStack.length-1} customFunction={dialog.customFunction} pathDataKey={pathDataKey} appFunction={appFunction} closeDialog={closeTopDialog} key={`${removeSpaces(dialog.title)}_${index}`} id={`${removeSpaces(dialog.title)}_${index}`} title={dialog.title || 'Confirmation'} content={dialog.name} message={dialog.message} subMessage={dialog.subMessage} actions={dialog.actions || []} data={dialog.data} favoriteId={dialog.favoriteId} />
    })}
  </>

}

export default App;
