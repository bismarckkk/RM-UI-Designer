(self.webpackChunk=self.webpackChunk||[]).push([[858],{6063:function(ne,T,n){"use strict";n.r(T),n.d(T,{default:function(){return le}});var z=n(21140),x=n.n(z),E=n(63466),k=n.n(E),P=n(58853),j=n.n(P),U=n(38888),C=n.n(U),m=n(93236),Z=n(57213),O=n.n(Z),K=n(93525),F=n.n(K),L=n(68608),f=n.n(L),Y=n(52510),g=n.n(Y),B=n(71323),w=n(32491),G=n(62851),D=n(88021),M=n(98557),R=n(75506),H=n(63450),N=n(81771),X=n(22341),J=n(83823),V=n(80681),Q=n(17712),$=n(84859),b=n(138),S=document.createElement("a"),y={yellow:"rgb(255, 238, 70)",green:"rgb(168, 255, 45)",orange:"rgb(255, 163, 8)",purple:"rgb(240, 41, 246)",pink:"rgb(255, 100, 142)",cyan:"rgb(69, 255, 242)",white:"#fff",black:"#000",blue:"rgb(47, 168, 223)",red:"rgb(255, 69, 70)"};function q(c,t){var d=JSON.stringify(c);S.href="data:,".concat(d),S.download=t,S.click()}var i=n(62086),_=function(c){j()(d,c);var t=C()(d);function d(){return x()(this,d),t.apply(this,arguments)}return k()(d,[{key:"render",value:function(){return this.props.color==="Main"?(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{style:{border:"1px solid #aaa",height:16,width:16,borderRadius:"20%",display:"inline-flex"},children:[(0,i.jsx)("div",{style:{backgroundColor:"red",height:12,width:6,margin:"1px 0 1px 1px",borderTopLeftRadius:"20%",borderBottomLeftRadius:"20%",display:"inline-flex"}}),(0,i.jsx)("div",{style:{backgroundColor:"blue",height:12,width:6,margin:"1px 1px 1px 0",borderTopRightRadius:"20%",borderBottomRightRadius:"20%",display:"inline-flex"}})]}),"\xA0 Main"]}):(0,i.jsx)("div",{children:(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{style:{border:"1px solid #aaa",height:16,width:16,borderRadius:"20%",display:"inline-flex"},children:(0,i.jsx)("div",{style:{backgroundColor:y[this.props.color.toLowerCase()],height:12,width:12,margin:1,borderRadius:"20%",display:"inline-flex"}})}),"\xA0 ",this.props.color]})})}}]),d}(m.Component),v=_,A={id:{title:"Id",key:"id",dataIndex:"id",valueType:"digit",editable:!1},name:{title:"Name",key:"name",dataIndex:"name"},group:{title:"Group",key:"group",dataIndex:"group"},kind:{title:"Kind",key:"kind",dataIndex:"kind",editable:!1},lineWidth:{title:"Line Width",key:"lineWidth",dataIndex:"lineWidth",valueType:"digit"},layer:{title:"Layer",key:"layer",dataIndex:"layer",valueType:"digit"},x:{title:"X",key:"x",dataIndex:"x",valueType:"digit"},y:{title:"Y",key:"y",dataIndex:"y",valueType:"digit"},width:{title:"Width",key:"width",dataIndex:"width",valueType:"digit"},height:{title:"Height",key:"height",dataIndex:"height",valueType:"digit"},rx:{title:"Rx",key:"rx",dataIndex:"rx",valueType:"digit"},ry:{title:"Ry",key:"ry",dataIndex:"ry",valueType:"digit"},r:{title:"R",key:"r",dataIndex:"r",valueType:"digit"},startAngle:{title:"Start Angle",key:"startAngle",dataIndex:"startAngle",valueType:"digit"},endAngle:{title:"End Angle",key:"endAngle",dataIndex:"endAngle",valueType:"digit"},fontSize:{title:"Font Size",key:"fontSize",dataIndex:"fontSize",valueType:"digit"},decimalPlaces:{title:"Decimal Places",key:"decimalPlaces",dataIndex:"decimalPlaces",valueType:"digit"},number:{title:"Number",key:"number",dataIndex:"number",valueType:"digit"},text:{title:"Text",key:"text",dataIndex:"text"},color:{title:"Color",key:"color",dataIndex:"color",valueType:"select",valueEnum:{main:(0,i.jsx)(v,{color:"Main"}),yellow:(0,i.jsx)(v,{color:"Yellow"}),green:(0,i.jsx)(v,{color:"Green"}),orange:(0,i.jsx)(v,{color:"Orange"}),purple:(0,i.jsx)(v,{color:"Purple"}),pink:(0,i.jsx)(v,{color:"Pink"}),cyan:(0,i.jsx)(v,{color:"Cyan"}),black:(0,i.jsx)(v,{color:"Black"}),white:(0,i.jsx)(v,{color:"White"})}},team:{title:"Team",key:"team",dataIndex:"team",valueType:"select",valueEnum:{red:(0,i.jsx)(v,{color:"Red"}),blue:(0,i.jsx)(v,{color:"Blue"})}}};function ee(c){for(var t=Object.keys(c),d=[],l=0;l<t.length;l++)A[t[l]]&&d.push(A[t[l]]);return d}var W=b.fabric.util.createClass(b.fabric.Rect,{type:"UiRect",id:0,name:"",layer:0,groupName:"",ratio:1,_color:"",team:"red",initialize:function(t){t||(t={}),t.color||(t.color="main"),this.id=t.id,this.name=t.name,this.layer=t.layer,this.groupName=t.groupName,this.ratio=t.ratio,this._color=t.color,this.team=t.team,t.lockRotation=!0,t.lockScalingFlip=!0,t.hasRotatingPoint=!1,t.width||(t.width=50/this.ratio),t.height||(t.height=50/this.ratio),t.left||(t.left=50/this.ratio),t.top||(t.top=50/this.ratio),t.strokeWidth||(t.strokeWidth=1/this.ratio),this._color&&this._color!=="main"?t.stroke=y[this._color]:(t.stroke=y[t.team],this._color="main"),t.fill=null,this.callSuper("initialize",t),this.moveTo(t.layer),this.setControlVisible("mtr",!1),this.transparentCorners=!1,console.log(t)},resizeScale:function(){this.set("width",this.width*this.scaleX),this.set("height",this.height*this.scaleY),this.set("scaleX",1),this.set("scaleY",1)},toObject:function(){return{type:this.type,id:this.id,name:this.name,layer:this.layer,group:this.groupName,width:this.width*this.ratio,height:this.height*this.ratio,x:this.left*this.ratio,y:this.top*this.ratio,color:this._color,lineWidth:this.strokeWidth*this.ratio,_team:this.team}},fromObject:function(t){this._color=t.color,this.id=t.id,this.name=t.name,this.layer=t.layer,this.groupName=t.group,this.team=t._team,this.set("width",t.width/this.ratio),this.set("height",t.height/this.ratio),this.set("left",t.x/this.ratio),this.set("top",t.y/this.ratio),this.set("strokeWidth",t.lineWidth/this.ratio),console.log(t),this._color==="main"?this.set("stroke",y[this.team]):this.set("stroke",y[this._color])},setRatio:function(t){this.set("width",this.width*this.ratio/t),this.set("height",this.height*this.ratio/t),this.set("left",this.left*this.ratio/t),this.set("top",this.top*this.ratio/t),this.set("strokeWidth",this.strokeWidth*this.ratio/t),this.ratio=t},setTeam:function(t){this.team=t,this._color==="main"&&this.set("stroke",y[this.team])}}),te=B.Z.Dragger,ae=function(c){j()(d,c);var t=C()(d);function d(){var l;x()(this,d);for(var e=arguments.length,a=new Array(e),s=0;s<e;s++)a[s]=arguments[s];return l=t.call.apply(t,[this].concat(a)),g()(f()(l),"data",{}),g()(f()(l),"objects",{}),g()(f()(l),"state",{treeData:[],properties:null,groupKey:"layer",selectedId:-1,selectedKey:[],uiWindow:{height:1080,width:1920,ratio:1,team:"red"},rightClickMenuOpen:!1,infoModalShow:!1,uploadModalShow:!1}),g()(f()(l),"editable",!1),g()(f()(l),"canvas",null),g()(f()(l),"canvasRef",(0,m.createRef)()),l}return k()(d,[{key:"getNewDataId",value:function(){return Object.keys(this.data).length===0?0:Math.max.apply(Math,F()(Object.keys(this.data)))+1}},{key:"updateTree",value:function(){for(var e=this.state.groupKey,a=[],s=Object.keys(this.data),o=0;o<s.length;o++){for(var h=this.data[s[o]],r=-1,u=0;u<a.length;u++)if(a[u].key==="".concat(e,"-").concat(h[e])){r=u;break}r===-1&&(a.push({title:"".concat(e," ").concat(h[e]),key:"".concat(e,"-").concat(h[e]),children:[],isLeaf:!1}),r=a.length-1),a[r].children.push({title:h.name,key:"E-".concat(s[o])})}a=a.sort(function(p,I){return p.key.toString().localeCompare(I.key.toString())}),a.unshift({title:"UI Window",key:"window"}),this.setState({treeData:a})}},{key:"getNodeFromId",value:function(e){return e[0]==="E"?e.slice(2):-1}},{key:"onSelect",value:function(e){if(e.length!==0){if(e[0]==="window"){this.setState({properties:this.state.uiWindow,selectedId:-1,selectedKey:e}),this.canvas.discardActiveObject(),this.canvas.renderAll();return}var a=this.getNodeFromId(e[0]);this.select(a)}}},{key:"select",value:function(e){e===-1?(this.setState({properties:null,selectedId:-1,selectedKey:[]}),this.canvas.discardActiveObject(),this.canvas.renderAll()):(this.setState({properties:this.data[e],selectedId:e,selectedKey:["E-".concat(e)]}),this.canvas.setActiveObject(this.objects[e]),this.canvas.renderAll())}},{key:"elementsMenuOnClick",value:function(e){var a=this,s=e.keyPath[e.keyPath.length-1];if(s==="D1-add"){var o=e.key.slice(7),h=this.getNewDataId();if(o==="rect"){var r=new W({id:h,name:"New Rect",layer:0,groupName:"Ungroup",ratio:this.state.uiWindow.ratio,team:this.state.uiWindow.team});this.objects[h]=r,this.canvas.add(r)}this.objectsToData(),this.updateTree()}else s==="D1-group"?this.setState({groupKey:e.key.slice(9)},function(){return a.updateTree()}):s==="D1-reset"?(this.canvas.clear(),this.canvas.backgroundColor="#fff",this.objects={},this.data={},this.select(-1),this.updateTree(),this.resetCanvasSize()):s==="D1-save"?(this.objectsToData(),q(this.data,"ui.rmui")):s==="D1-open"&&this.setState({uploadModalShow:!0})}},{key:"resetCanvasSize",value:function(){var e=this.canvasRef.current.clientWidth-12,a=this.canvasRef.current.clientHeight,s=O()({},this.state.uiWindow);e/a<s.width/s.height?(a=e*s.height/s.width,s.ratio=s.width/e):(e=a*s.width/s.height,s.ratio=s.height/a),this.setState({uiWindow:s}),this.canvas.setHeight(a),this.canvas.setWidth(e);for(var o=0,h=Object.keys(this.objects);o<h.length;o++){var r=h[o];this.objects[r].setRatio(s.ratio)}this.canvas.renderAll(),this.objectsToData(),this.setState({infoModalShow:!1})}},{key:"onReSize",value:function(){var e=this;this.state.infoModalShow||(this.canvas.setHeight(10),this.canvas.setWidth(10),this.canvas.renderAll(),this.setState({infoModalShow:!0},function(){w.Z.info({title:"Reset UI Window Size",content:"Must reset UI window size after resize browser window.",onOk:function(){return e.resetCanvasSize()},okText:"Reset"})}))}},{key:"onPropertiesChange",value:function(e,a){var s=this;if(this.state.selectedKey[0]==="window"){if(a.team!==this.state.uiWindow.team){for(var o=0,h=Object.keys(this.objects);o<h.length;o++){var r=h[o];this.objects[r].setTeam(a.team)}this.canvas.renderAll(),this.objectsToData()}this.setState({uiWindow:a,properties:a},function(){s.resetCanvasSize()})}else this.state.selectedId!==-1&&(this.objects[this.state.selectedId].fromObject(a),this.canvas.renderAll(),this.objectsToData(),this.updateTree())}},{key:"componentDidMount",value:function(){var e=this,a=this;this.canvas=new b.fabric.Canvas("ui"),this.canvas.backgroundColor="#fff",this.resetCanvasSize(),this.canvas.renderAll(),this.updateTree(),window.addEventListener("resize",function(){e.onReSize()},!1),this.canvas.on({"mouse:up":function(){for(var o=0,h=Object.keys(a.objects);o<h.length;o++){var r=h[o];a.objects[r].resizeScale()}a.canvas.renderAll(),a.objectsToData();var u=a.canvas.getActiveObject();u?a.select(u.id):a.select(-1)}})}},{key:"objectsToData",value:function(){this.data={};for(var e=0,a=Object.keys(this.objects);e<a.length;e++){var s=a[e],o=this.objects[s].toObject();this.data[o.id]=o}this.state.selectedId!==-1&&this.setState({properties:this.data[this.state.selectedId]})}},{key:"updateObject",value:function(e){if(this.objects[e.id])this.objects[e.id].fromObject(e);else if(e.type==="UiRect"){var a=new W({id:e.id,name:e.name,layer:e.layer,groupName:e.group,ratio:this.state.uiWindow.ratio});this.objects[e.id]=a,a.fromObject(e),this.canvas.add(a)}this.objectsToData(),this.updateTree()}},{key:"removeObject",value:function(e){this.objects[e]&&(this.select(-1),this.canvas.remove(this.objects[e]),this.canvas.renderAll(),delete this.objects[e],this.objectsToData(),this.updateTree())}},{key:"onElementRightClick",value:function(e){e.node.key[0]==="E"?this.select(e.node.key.slice(2)):this.select(-1)}},{key:"onElementMenuClick",value:function(e){if(this.setState({rightClickMenuOpen:!1}),e.key==="D2-copy"){var a=O()({},this.data[this.state.selectedId]);a.id=this.getNewDataId(),this.updateObject(a)}else e.key==="D2-delete"&&this.removeObject(this.state.selectedId)}},{key:"onMenuOpenChange",value:function(e){if(e){var a=this;setTimeout(function(){a.state.selectedId!==-1?a.setState({rightClickMenuOpen:!0}):a.setState({rightClickMenuOpen:!1})},100)}else this.setState({rightClickMenuOpen:!1})}},{key:"onElementMenuContainerClick",value:function(e){e.target.localName==="div"&&(this.setState({rightClickMenuOpen:!1,properties:null,selectedId:-1,selectedKey:[]}),this.select(-1))}},{key:"onUploadModalCancel",value:function(){this.setState({uploadModalShow:!1})}},{key:"onUploadFile",value:function(e){var a=this,s=new FileReader;return s.onload=function(o){var h=o.target.result,r=JSON.parse(h);a.setState({uploadModalShow:!1});for(var u=0,p=Object.keys(r);u<p.length;u++){var I=p[u];a.updateObject(r[I])}},s.readAsText(e),!0}},{key:"render",value:function(){var e=this,a=0,s=[{key:"D1-group",label:"Group by",children:[{key:"D1-group-layer",label:"layer"},{key:"D1-group-group",label:"group"}]},{key:"D1-reset",label:"Reset Designer"}];this.props.editable&&(s.unshift({key:"D1-add",label:"Add Element",children:[{key:"D1-add-rect",label:"Rect"}]}),s.push({type:"divider"},{key:"D1-open",label:"Open .rmui"},{key:"D1-save",label:"Save as .rmui"}),a++);for(var o=0;o<s[a].children.length;o++)s[a].children[o].label===this.state.groupKey&&(s[a].children[o].icon=(0,i.jsx)(J.Z,{}));return(0,i.jsxs)("div",{className:"full",children:[(0,i.jsxs)(G.Z,{warp:!1,className:"container",gutter:12,children:[(0,i.jsxs)(D.Z,{flex:"300px",children:[(0,i.jsx)("div",{style:{height:"50%",paddingBottom:12},children:(0,i.jsx)(M.Z,{size:"small",title:"Elements",style:{height:"100%"},extra:(0,i.jsx)(R.Z,{menu:{items:s,onClick:function(r){return e.elementsMenuOnClick(r)}},children:(0,i.jsx)(V.Z,{})}),children:(0,i.jsx)("div",{className:"card-body",onMouseUp:function(r){return e.onElementMenuContainerClick(r)},children:(0,i.jsx)(R.Z,{menu:{items:[{key:"D2-copy",label:"Copy"},{key:"D2-delete",label:"Delete",danger:!0}],onClick:function(r){e.onElementMenuClick(r)}},trigger:["contextMenu"],open:this.state.rightClickMenuOpen,onOpenChange:function(r){e.onMenuOpenChange(r)},children:(0,i.jsx)(H.Z,{className:"full",treeData:this.state.treeData,onSelect:function(r){return e.onSelect(r)},selectedKeys:this.state.selectedKey,onRightClick:function(r){return e.onElementRightClick(r)},defaultExpandParent:!0})})})})}),(0,i.jsx)(M.Z,{size:"small",title:"Properties",style:{height:"50%"},children:(0,i.jsx)("div",{className:"card-body",children:this.state.properties?(0,i.jsx)($.vY,{dataSource:this.state.properties,columns:ee(this.state.properties),editable:this.props.editable?{onSave:function(r,u){return e.onPropertiesChange(r,u)}}:null,column:1,style:{marginTop:4}}):(0,i.jsx)(N.Z,{image:N.Z.PRESENTED_IMAGE_SIMPLE})})})]}),(0,i.jsx)(D.Z,{flex:"auto",ref:this.canvasRef,children:(0,i.jsx)("canvas",{className:"full",id:"ui"})})]}),(0,i.jsxs)(w.Z,{title:"Upload Your .rmui File",open:this.state.uploadModalShow,onCancel:function(){return e.onUploadModalCancel()},footer:null,destroyOnClose:!0,children:[(0,i.jsx)(X.Z,{}),(0,i.jsxs)(te,{showUploadList:!1,beforeUpload:function(r){return e.onUploadFile(r)},accept:".rmui",children:[(0,i.jsx)("p",{className:"ant-upload-drag-icon",children:(0,i.jsx)(Q.Z,{})}),(0,i.jsx)("p",{className:"ant-upload-text",children:"Click or drag file to this area to upload"})]})]})]})}}]),d}(m.Component),ie=ae,se=function(c){j()(d,c);var t=C()(d);function d(){return x()(this,d),t.apply(this,arguments)}return k()(d,[{key:"render",value:function(){return(0,i.jsx)("div",{className:"container",children:(0,i.jsx)(ie,{className:"full",editable:!0})})}}]),d}(m.Component),le=se},41001:function(){},35287:function(){},7396:function(){}}]);