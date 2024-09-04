import { useEffect, useState } from 'react';

function DataAdapter() {
  const [data, setData] = useState()
  const storageKey = 'my-favorite-links';

  useEffect(()=>{
  
    const fetchedData =  localStorage.getItem(storageKey);
    writeData(fetchedData || {childOrder: [], children:{}});
  
  }, [])
  
  const writeData = (data)=> {

    setData(data);
    localStorage.setItem(storageKey, data);
    
  }
}

export default DataAdapter;