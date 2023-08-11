import ReactDOM from 'react-dom'
const PhotoPicker = ({ onChange }) => {
  const component = (
    <input
      type='file'
      hidden
      id='photo-picker'
      onChange={onChange}
      accept='image/*'
    />
  )
  return ReactDOM.createPortal(
    component,
    document.getElementById('photo-picker-element')
  )
}

export default PhotoPicker
