/* eslint-disable no-script-url */
import Favorite from './Favorite';
import './Favorites.css';
  
function Favorites({path, data, goToFolder, dragHandler, dragInfo, dragging, appFunction, level, copied, rootId}) {

  const inner = <>
      <div data-dragging={dragging} className={`fav-favorites ${dragging?' fav-dragging':''}`}>
        {data.childOrder.map((favoriteId) => {
          return <Favorite rootId={rootId} copied={copied} level={level} appFunction={appFunction} dragInfo={dragInfo} dragHandler={dragHandler} key={favoriteId} goToFolder={goToFolder} data={data.children[favoriteId]}/>
        })}
      </div>
  </>;
/*onDragLeave={(evt)=>{console.log(evt.target, evt.currentTarget);if(!evt.currentTarget.contains(evt.target)){debugger}}}*/

  return (
    <div className={`fav-folder`} onDrop={dragHandler} onDragOver={(evt)=>{evt.preventDefault()}}>
      {path.length>0?<div className='fav-sub-folder'>{inner}</div>:inner}
    </div>
  );
}

export default Favorites;