/* eslint-disable no-script-url */
import './FolderImage.css';
  
function FolderImage({open, color}) {

const folderSVG = <svg className='folder-svg' version="1.1" width="256" height="256" viewBox="0 0 256 256">
<g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
  <path style={{fill: color}} d="M 0 68.798 v 11.914 c 0 1.713 1.401 3.114 3.114 3.114 h 0 c 3.344 0 4.805 -2.642 4.805 -2.642 L 8.14 29.281 l 2.739 -2.827 l 72.894 -2.977 v -1.482 c 0 -2.396 -1.942 -4.338 -4.338 -4.338 H 50.236 c -1.15 0 -2.254 -0.457 -3.067 -1.27 l -8.943 -8.943 c -0.813 -0.813 -1.917 -1.27 -3.067 -1.27 H 4.338 C 1.942 6.174 0 8.116 0 10.512 v 7.146 v 2.332 V 68.798" transform=" matrix(1 0 0 1 0 0) " />
  <path style={{fill: color}} d="M 3.114 83.826 L 3.114 83.826 c 1.713 0 3.114 -1.401 3.114 -3.114 V 27.81 c 0 -2.393 1.94 -4.333 4.333 -4.333 h 75.107 c 2.393 0 4.333 1.94 4.333 4.333 v 51.684 c 0 2.393 -1.94 4.333 -4.333 4.333 C 85.667 83.826 3.114 83.826 3.114 83.826 z" transform=" matrix(1 0 0 1 0 0) "  />
</g>
</svg>;

const folderOpenSVG = <svg className='folder-svg-open' version="1.1" width="256" height="256" viewBox="0 0 256 256">
  <g transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
    <path style={{fill: color}} d="M 73.538 35.162 l -52.548 1.952 c -1.739 0 -2.753 0.651 -3.232 2.323 L 6.85 76.754 c -0.451 1.586 -2.613 2.328 -4.117 2.328 h 0 C 1.23 79.082 0 77.852 0 76.349 l 0 -10.458 V 23.046 v -2.047 v -6.273 c 0 -2.103 1.705 -3.808 3.808 -3.808 h 27.056 c 1.01 0 1.978 0.401 2.692 1.115 l 7.85 7.85 c 0.714 0.714 1.683 1.115 2.692 1.115 H 69.73 c 2.103 0 3.808 1.705 3.808 3.808 v 1.301 C 73.538 26.106 73.538 35.162 73.538 35.162 z" transform=" matrix(1 0 0 1 0 0) " />
    <path style={{fill: color}} d="M 2.733 79.082 L 2.733 79.082 c 1.503 0 2.282 -1.147 2.733 -2.733 l 10.996 -38.362 c 0.479 -1.672 2.008 -2.824 3.748 -2.824 h 67.379 c 1.609 0 2.765 1.546 2.311 3.09 L 79.004 75.279 c -0.492 1.751 -1.571 3.818 -3.803 3.803 C 75.201 79.082 2.733 79.082 2.733 79.082 z" transform=" matrix(1 0 0 1 0 0) " />
  </g>
</svg>;

  return open?folderOpenSVG:folderSVG;

}

export default FolderImage;