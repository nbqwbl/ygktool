import React from 'react';
import mdui from 'mdui'

//读取文件组件
class FileRead extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			file:'选择文件'
		}
	}
	readFile(e) {
		const maxSize = this.props.maxSize || 99999999999;
		for (var i = 0; i < e.target.files.length; i++) {
			var file = e.target.files[i];
			if(file.size > maxSize){
                mdui.snackbar({message:'文件大小不能超过' + maxSize/1024/1024 + 'MB'})
            }else{
	            console.log(file);
				this.setState({file:file.name})
				var freader = new FileReader();
				freader.readAsDataURL(file);
				freader.onload = e => {
					console.log(e.target.result);
					this.props.onFileChange(e.target.result, file)
				}
            }			
		}
	}
	handleClick() {
		this.refs.myInput.click();
	}
	render(){
		switch(/^(\S+)\/\S+$/.exec(this.props.fileType)[1]){
			case'image':
				var icon = 'image';break
			case'video':
				var icon = 'videocam';break
			default:
				var icon = 'file_upload';break
		}
		return(
		    <React.Fragment>
				<button 
					style={{maxWidth:(this.props.maxWidth)?'120px':'9999px'}}
					className="mdui-btn mdui-btn-raised mdui-ripple mdui-color-theme"
					onClick={this.handleClick.bind(this)}>
					<i class="mdui-icon-left mdui-icon material-icons">{icon}</i>
					{this.state.file}
				</button>
				<input 
					accept={this.props.fileType} type="file" 
					style={{display:'none'}} ref="myInput"
					multiple={this.props.multiple}
					onChange={e=>{
						this.readFile(e)
					}} 
				/>
			</React.Fragment>
		)
	}
}

export default FileRead