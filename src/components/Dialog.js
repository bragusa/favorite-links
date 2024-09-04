import './Dialog.css';
import { useEffect, useRef, useState } from 'react';
import Edit from '../dialogs/Edit';
import Import from '../dialogs/Import';
import { getIcon } from './../resources/Icons'


function Dialog({type, id, title, content, message, subMessage, actions, data, closeDialog, updateData, appFunction, top, customFunction}) {
  const dialog = useRef();
  const first = useRef();
  const last = useRef();
  const [dialogData, setDialogData] = useState(data);
  
  useEffect(()=>{
    const currentDialog = dialog.current;
    if(!currentDialog.hasAttribute('data-height')){
      currentDialog.setAttribute('data-height', currentDialog.getBoundingClientRect().height);
      currentDialog.setAttribute('data-width', currentDialog.getBoundingClientRect().width);
      Object.assign(currentDialog.style, {
        height:'0',
        width:'0',
        opacity: '0',
        transition:'height .2s, width .2s, opacity .6s'
      });
    }
    setTimeout(()=>{
      Object.assign(currentDialog.style, {
        height:`${currentDialog.getAttribute('data-height')}px`,
        width:`${currentDialog.getAttribute('data-width')}px`,
        opacity: '1'
      });
    });
  }, [])

  let Component;
  // eslint-disable-next-line default-case
  switch(content){
    case 'Edit':
      Component = Edit;
      break;
    case 'Import':
      Component = Import;
      break;
  }
  let currentDialogData = {...dialogData};
  
  
  return <>
    <div className='fav-dialog-underlay' style={{backgroundColor: top?'#000000':'transparent'}}></div>
      <div ref={dialog} id={id} className='fav-dialog' onKeyUp={(evt)=>{
        if(evt.key==='Escape'){
          closeDialog();
        }
        else if(evt.key==='Enter'){
          if(actions[actions.length-1].callback(evt, dialogData)){
            closeDialog()
          }
        }
      }}>
        <input ref={first} type='text' className='trap-field'/>
        <header className='dialog-header'>
          <div className='title'>{title}</div><div><button onBlur={(evt)=>{
            if(evt.nativeEvent.relatedTarget===first.current){
              Array.from(dialog.current.querySelectorAll('button')).pop().focus();
            }
          }} onClick={()=>{
            closeDialog();
          }}>{getIcon('close')}</button></div>
        </header>
        <div className='dialog-content'>
          {message?<div className='message'>{message}</div>:null}
          {Component? <Component customFunction={customFunction} appFunction={appFunction} setDialogData={setDialogData} data={currentDialogData} updateData={updateData}/> : (!message?'Error - no content or message':null)}
          {subMessage?<div className='sub-message'>{subMessage}</div>:null}
        </div>
        <footer>
        {/* {actions !== null && type!=='error' && actions.length<2 && actions.length>0?<button onClick={closeDialog}>{actions.length>0?'Cancel':'Ok'}</button>:null} */}
        {actions !== null && actions.map((action, index)=>{
          return <button key={index} onBlur={(evt)=>{
            if(index===actions.length-1){
              if(evt.nativeEvent.relatedTarget===last.current){
                Array.from(dialog.current.querySelectorAll('button')).shift().focus();
              }
            }
          }} onClick={(evt)=>{ if(action.callback(action['event'] || evt, dialogData)){closeDialog()}}}>{action.label}</button>
        })} <input ref={last} type='text' className='trap-field'/></footer>
      </div>
    </>;
}

export default Dialog;
