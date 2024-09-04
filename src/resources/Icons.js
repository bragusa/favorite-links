import { useEffect, useRef } from "react";

const icons = {
  add: '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:add" description="Carbon:add" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><path d="M17 15L17 8 15 8 15 15 8 15 8 17 15 17 15 24 17 24 17 17 24 17 24 15z"></path></svg>',
  blank:
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:add" description="Carbon:add" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"></svg>',
  checkmark:
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M13 24L4 15 5.414 13.586 13 21.171 26.586 7.586 28 9 13 24z"></path></svg>',
  checkdone:
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M22 27.18L19.41 24.59 18 26 22 30 30 22 28.59 20.59 22 27.18z"></path><path d="M25,5H22V4a2.0058,2.0058,0,0,0-2-2H12a2.0058,2.0058,0,0,0-2,2V5H7A2.0058,2.0058,0,0,0,5,7V28a2.0058,2.0058,0,0,0,2,2h9V28H7V7h3v3H22V7h3V18h2V7A2.0058,2.0058,0,0,0,25,5ZM20,8H12V4h8Z"></path></svg>',
  chevron: {
    left: '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M10 16L20 6 21.4 7.4 12.8 16 21.4 24.6 20 26z"></path></svg>',
    up: '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M16 10L26 20 24.6 21.4 16 12.8 7.4 21.4 6 20z"></path></svg>'
  },
  close:
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:close" description="Carbon:close" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z"></path></svg>',
  copy:
  '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:copy" description="Carbon:copy" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><path d="M28,10V28H10V10H28m0-2H10a2,2,0,0,0-2,2V28a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2Z"></path><path d="M4,18H2V4A2,2,0,0,1,4,2H18V4H4Z"></path></svg>',
  delete: 
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:delete" description="Carbon:delete" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><path d="M12 12H14V24H12zM18 12H20V24H18z"></path><path d="M4 6V8H6V28a2 2 0 002 2H24a2 2 0 002-2V8h2V6zM8 28V8H24V28zM12 2H20V4H12z"></path></svg>',
  edit: 
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:edit" description="Carbon:edit" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><path d="M2 26H30V28H2zM25.4 9c.8-.8.8-2 0-2.8 0 0 0 0 0 0l-3.6-3.6c-.8-.8-2-.8-2.8 0 0 0 0 0 0 0l-15 15V24h6.4L25.4 9zM20.4 4L24 7.6l-3 3L17.4 7 20.4 4zM6 22v-3.6l10-10 3.6 3.6-10 10H6z"></path></svg>',
  'export': '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M30 25L28.586 23.586 26 26.172 26 18 24 18 24 26.172 21.414 23.586 20 25 25 30 30 25z"></path><path d="M18,28H8V4h8v6a2.0058,2.0058,0,0,0,2,2h6v3l2,0V10a.9092.9092,0,0,0-.3-.7l-7-7A.9087.9087,0,0,0,18,2H8A2.0058,2.0058,0,0,0,6,4V28a2.0058,2.0058,0,0,0,2,2H18ZM18,4.4,23.6,10H18Z"></path></svg>',
  folder: 
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M11.17,6l3.42,3.41.58.59H28V26H4V6h7.17m0-2H4A2,2,0,0,0,2,6V26a2,2,0,0,0,2,2H28a2,2,0,0,0,2-2V10a2,2,0,0,0-2-2H16L12.59,4.59A2,2,0,0,0,11.17,4Z"></path></svg>',
  'folder-add':
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M26 20L24 20 24 24 20 24 20 26 24 26 24 30 26 30 26 26 30 26 30 24 26 24z"></path><path d="M28,8H16l-3.4-3.4C12.2,4.2,11.7,4,11.2,4H4C2.9,4,2,4.9,2,6v20c0,1.1,0.9,2,2,2h14v-2H4V6h7.2l3.4,3.4l0.6,0.6H28v8h2v-8 C30,8.9,29.1,8,28,8z"></path></svg>',
  'image-search':
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M24 14a5.99 5.99 0 00-4.885 9.4712L14 28.5859 15.4141 30l5.1147-5.1147A5.9971 5.9971 0 1024 14zm0 10a4 4 0 114-4A4.0045 4.0045 0 0124 24zM17 12a3 3 0 10-3-3A3.0033 3.0033 0 0017 12zm0-4a1 1 0 11-1 1A1.0009 1.0009 0 0117 8z"></path><path d="M12,24H4V17.9966L9,13l5.5859,5.5859L16,17.168l-5.5859-5.5855a2,2,0,0,0-2.8282,0L4,15.168V4H24v6h2V4a2.0023,2.0023,0,0,0-2-2H4A2.002,2.002,0,0,0,2,4V24a2.0023,2.0023,0,0,0,2,2h8Z"></path></svg>',
  import: '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M28 19L14.83 19 17.41 16.41 16 15 11 20 16 25 17.41 23.59 14.83 21 28 21 28 19z"></path><path d="M24,14V10a1,1,0,0,0-.29-.71l-7-7A1,1,0,0,0,16,2H6A2,2,0,0,0,4,4V28a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2V26H22v2H6V4h8v6a2,2,0,0,0,2,2h6v2Zm-8-4V4.41L21.59,10Z"></path></svg>',
  'import-export': '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width=20" height="20" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M28 24v4H4V24H2v4l.0076-.0049A1.9977 1.9977 0 004 30H28a2 2 0 002-2h0V24zM27.6 14.6L24 18.2 24 4 22 4 22 18.2 18.4 14.6 17 16 23 22 29 16 27.6 14.6zM9 4L3 10 4.4 11.4 8 7.8 8 22 10 22 10 7.8 13.6 11.4 15 10 9 4z"></path></svg>',
  link: '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:link" description="Carbon:link" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><path d="M29.25,6.76a6,6,0,0,0-8.5,0l1.42,1.42a4,4,0,1,1,5.67,5.67l-8,8a4,4,0,1,1-5.67-5.66l1.41-1.42-1.41-1.42-1.42,1.42a6,6,0,0,0,0,8.5A6,6,0,0,0,17,25a6,6,0,0,0,4.27-1.76l8-8A6,6,0,0,0,29.25,6.76Z"></path><path d="M4.19,24.82a4,4,0,0,1,0-5.67l8-8a4,4,0,0,1,5.67,0A3.94,3.94,0,0,1,19,14a4,4,0,0,1-1.17,2.85L15.71,19l1.42,1.42,2.12-2.12a6,6,0,0,0-8.51-8.51l-8,8a6,6,0,0,0,0,8.51A6,6,0,0,0,7,28a6.07,6.07,0,0,0,4.28-1.76L9.86,24.82A4,4,0,0,1,4.19,24.82Z"></path></svg>',
  menu: 
    '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:overflow-menu--vertical" description="Carbon:overflow-menu--vertical" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><circle cx="16" cy="8" r="2"></circle><circle cx="16" cy="16" r="2"></circle><circle cx="16" cy="24" r="2"></circle></svg>',
  overflow: {
    horizontal: '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:overflow-menu--horizontal" description="Carbon:overflow-menu--horizontal" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><circle cx="8" cy="16" r="2"></circle><circle cx="16" cy="16" r="2"></circle><circle cx="24" cy="16" r="2"></circle></svg>',
    vertical: '<svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" id="Carbon:overflow-menu--vertical" description="Carbon:overflow-menu--vertical" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" className=" mx--rotatable-icon"><circle cx="16" cy="8" r="2"></circle><circle cx="16" cy="16" r="2"></circle><circle cx="16" cy="24" r="2"></circle></svg>',
  },
  paste: 
  '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M26,20H17.83l2.58-2.59L19,16l-5,5,5,5,1.41-1.41L17.83,22H26v8h2V22A2,2,0,0,0,26,20Z"></path><path d="M23.71,9.29l-7-7A1,1,0,0,0,16,2H6A2,2,0,0,0,4,4V28a2,2,0,0,0,2,2h8V28H6V4h8v6a2,2,0,0,0,2,2h6v2h2V10A1,1,0,0,0,23.71,9.29ZM16,4.41,21.59,10H16Z"></path><title>Paste</title></svg>',
  up: '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="20" height="20" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M16 4L6 14 7.41 15.41 15 7.83 15 28 17 28 17 7.83 24.59 15.41 26 14 16 4z"></path></svg>',
  upload: '<svg focusable="false" preserveAspectRatio="xMidYMid meet" fill="currentColor" width="32" height="32" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><path d="M6 18L7.41 19.41 15 11.83 15 30 17 30 17 11.83 24.59 19.41 26 18 16 8 6 18zM6 8V4H26V8h2V4a2 2 0 00-2-2H6A2 2 0 004 4V8z"></path></svg>'
};

const getIcon = (name, alt, style)=>{
  let names = name.split('.').reverse();
  let icon = icons;
  while(names.length>0){
    icon = icon[names.pop()];
  }
  
  return <img alt={alt || name} style={style} src={`data:image/svg+xml;utf8,${encodeURIComponent(icon)}`} />
}

export {
  getIcon,
  Icon
}

function Icon({name, color}) {
  const svgWrapper = useRef();
  
  useEffect(()=>{
    svgWrapper.current.querySelector('svg').style.fill = color;
  }, [color])

  const icon = {__html: icons[name]};
  return <span ref={svgWrapper} dangerouslySetInnerHTML={icon}/>
}

export default icons;