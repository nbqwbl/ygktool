import React from 'react';
import mdui from 'mdui';

/**
  *2020-2-7 耗时约1小时 江村暮
  */

//输入框&清空按钮
function Input(props) {
    return(
        <React.Fragment> 
            <button 
                className="mdui-float-right mdui-btn mdui-btn-icon"
                onClick={e=>{
                    props.onItemChange('')
                }} 
                mdui-tooltip="{content: '清空'}">
            <i className="mdui-icon material-icons clear">close</i>
            </button>
            <div className="mdui-clearfix"></div>
            <div className="mdui-textfield">
                <textarea value={props.items} onChange={e=>{
                    props.onItemChange(e.target.value)
                }} rows="4" className="mdui-textfield-input"type="text"></textarea>
                <div className="mdui-textfield-helper">输入待选物品，空格间隔</div>
            </div>
        </React.Fragment> 
    )
}

//读取本地列表
function ReadLocal(props){
  var cacheList = [];
  var cache = props.local;
  for(let i in cache){
    cacheList.push(
      <li onClick={e=>{
        console.log(i);
        props.onClickLi(i)
      }} key={i} className="mdui-col mdui-list-item mdui-ripple">
        <div className="mdui-list-item-content">
          <span className="mdui-text-color-theme">{cache[i]}</span>
        </div>
        <i onClick={e=>{
          props.edit(i)
        }} className="mdui-list-item-icon mdui-icon material-icons">edit</i>
      </li>       
    )
  }
  return cacheList
}

//添加组合组件
function AddLocal(props){  
  return(
    <li onClick={e=>{
      if(!localStorage.getItem('decision')){
        localStorage.setItem('decision',JSON.stringify([]))
      }
      var cache = JSON.parse(localStorage.getItem('decision'));
      mdui.prompt('使用空格分隔',
        value => {
          cache.push(value);
          localStorage.setItem('decision',JSON.stringify(cache));
          props.onLocalChange()          
        },
        value=> {/*取消事件*/}, {
          type: 'textarea',
          confirmText:'保存',
          cancelText:'取消'
        }
      );
    }} className="mdui-col mdui-list-item mdui-ripple">
      <div className="mdui-list-item-content">
        <span className="mdui-text-color-theme">新增一个组合</span>
      </div>
      <i className="mdui-list-item-icon mdui-icon material-icons">add</i>
    </li>
  )
}

//开始随机组件
class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            statu:props.statu,
            onetime:'点击按钮开始',
            items:props.items,
            timer:null
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({ 
          statu: nextProps.statu,
          items: nextProps.items
        })
    }
    componentDidMount(){    
        this.state.timer = setInterval(() => {
            var arr = this.state.items.split(' '); //将待选项目拆分成数组
            var maxNum = arr.length - 1; //设定随机数最大值
            var index = parseInt(Math.random() * (maxNum - 0 + 1) + 0, 10); //随机选取0到最大值之间的整数
            var onetime = arr[index];
            if (this.state.statu == 'start') {
                this.setState({
                    onetime: onetime
                })
            }
        }, 100)
    }
    render(){
        return(
            <div className="mdui-text-center">
                <h1>{this.state.onetime}</h1>
            </div>     
        )
  }
}

class Ui extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      local:JSON.parse(localStorage.getItem('decision'))||[],
      statu:'stop',
      items:'糖醋排骨 红烧肉 酸菜鱼 坤徐菜 酸豇豆 炸鸡 烧仙草 汉堡 薯条 可乐 牛肉面 作者'
    }
  }
  render(){
    return(
    <React.Fragment> 
      <Input 
        items={this.state.items}
        onItemChange={newItems=>{
          this.setState({items:newItems})
        }}
      />
      <ReadLocal
        local={this.state.local}
        onClickLi={key=>{
          this.setState({items:this.state.local[key]})
        }}
        edit={key=>{
          mdui.prompt('使用空格分隔',
            value => {
              var local = this.state.local;
              local.splice(key,1,value);
              localStorage.setItem('decision',JSON.stringify(local))
            },
            value => {
              //删除组合
              var local = this.state.local
              local.splice(key,1);
              localStorage.setItem('decision',JSON.stringify(local))             
            }, {
              type: 'textarea',
              defaultValue:this.state.local[key],
              confirmText: '保存',
              cancelText: '删除'
            }
          );
        }}
      />
      <AddLocal
        onLocalChange={()=>{
          this.setState({local:localStorage.getItem('item')})
        }} />
      <button 
          disabled={(this.state.statu === 'stop')?false:true}
          className="mdui-btn mdui-color-theme" 
        onClick={e=>{
          this.setState({statu:'start'})
          setTimeout(()=>{this.setState({statu:'stop'})},3000)
        }}>开始
      </button>
      <Start
        statu={this.state.statu}
        items={this.state.items}
      />
    </React.Fragment>
    )
  }
}

export default ()=><Ui />;