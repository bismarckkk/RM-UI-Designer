(self.webpackChunk=self.webpackChunk||[]).push([[858],{9553:function(U,M,r){"use strict";r.r(M),r.d(M,{default:function(){return pe}});var Y=r(21140),w=r.n(Y),G=r(63466),S=r.n(G),J=r(58853),I=r.n(J),X=r(38888),O=r.n(X),x=r(93236),H=r(57213),N=r.n(H),V=r(93525),Q=r.n(V),$=r(68608),f=r.n($),q=r(52510),m=r.n(q),_=r(71323),R=r(32491),ee=r(62851),W=r(88021),A=r(98557),E=r(75506),te=r(63450),z=r(81771),ae=r(26283),Z=r(22341),ie=r(18048),se=r(83823),ne=r(80681),L=r(17712),re=r(84859),le=r(38523),i=r(62086),oe=function(c){I()(h,c);var a=O()(h);function h(){var s;w()(this,h);for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return s=a.call.apply(a,[this].concat(t)),m()(f()(s),"state",{show:!1}),m()(f()(s),"data",{}),s}return S()(h,[{key:"gen",value:function(e){this.data=e,this.setState({show:!0})}},{key:"onClose",value:function(){this.setState({show:!1})}},{key:"render",value:function(){var e=this;return(0,i.jsx)("div",{children:(0,i.jsxs)(le.Z,{title:"C Code Generator",placement:"right",onClose:function(){return e.onClose()},open:this.state.show,size:"large",children:[(0,i.jsx)("h1",{children:"Not yet completed"}),(0,i.jsx)("p",{children:JSON.stringify(this.data)})]})})}}]),h}(x.Component),de=oe,D=r(138),T=document.createElement("a"),b={yellow:"rgb(255, 238, 70)",green:"rgb(168, 255, 45)",orange:"rgb(255, 163, 8)",purple:"rgb(240, 41, 246)",pink:"rgb(255, 100, 142)",cyan:"rgb(69, 255, 242)",white:"#fff",black:"#000",blue:"rgb(47, 168, 223)",red:"rgb(255, 69, 70)"};function he(c,a){var h=JSON.stringify(c);T.href="data:,".concat(h),T.download=a,T.click()}function ce(c){var a=null;return window.createObjcectURL!==void 0?a=window.createOjcectURL(c):window.URL!==void 0?a=window.URL.createObjectURL(c):window.webkitURL!==void 0&&(a=window.webkitURL.createObjectURL(c)),a}var ue=function(c){I()(h,c);var a=O()(h);function h(){return w()(this,h),a.apply(this,arguments)}return S()(h,[{key:"render",value:function(){return this.props.color==="Main"?(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{style:{border:"1px solid #aaa",height:16,width:16,borderRadius:"20%",display:"inline-flex"},children:[(0,i.jsx)("div",{style:{backgroundColor:"red",height:12,width:6,margin:"1px 0 1px 1px",borderTopLeftRadius:"20%",borderBottomLeftRadius:"20%",display:"inline-flex"}}),(0,i.jsx)("div",{style:{backgroundColor:"blue",height:12,width:6,margin:"1px 1px 1px 0",borderTopRightRadius:"20%",borderBottomRightRadius:"20%",display:"inline-flex"}})]}),"\xA0 Main"]}):(0,i.jsx)("div",{children:(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{style:{border:"1px solid #aaa",height:16,width:16,borderRadius:"20%",display:"inline-flex"},children:(0,i.jsx)("div",{style:{backgroundColor:b[this.props.color.toLowerCase()],height:12,width:12,margin:1,borderRadius:"20%",display:"inline-flex"}})}),"\xA0 ",this.props.color]})})}}]),h}(x.Component),g=ue,P={id:{title:"Id",key:"id",dataIndex:"id",valueType:"digit",editable:!1},name:{title:"Name",key:"name",dataIndex:"name"},group:{title:"Group",key:"group",dataIndex:"group"},kind:{title:"Kind",key:"kind",dataIndex:"kind",editable:!1},lineWidth:{title:"Line Width",key:"lineWidth",dataIndex:"lineWidth",valueType:"digit"},layer:{title:"Layer",key:"layer",dataIndex:"layer",valueType:"digit"},x:{title:"X",key:"x",dataIndex:"x",valueType:"digit"},y:{title:"Y",key:"y",dataIndex:"y",valueType:"digit"},width:{title:"Width",key:"width",dataIndex:"width",valueType:"digit"},height:{title:"Height",key:"height",dataIndex:"height",valueType:"digit"},rx:{title:"Rx",key:"rx",dataIndex:"rx",valueType:"digit"},ry:{title:"Ry",key:"ry",dataIndex:"ry",valueType:"digit"},r:{title:"R",key:"r",dataIndex:"r",valueType:"digit"},startAngle:{title:"Start Angle",key:"startAngle",dataIndex:"startAngle",valueType:"digit"},endAngle:{title:"End Angle",key:"endAngle",dataIndex:"endAngle",valueType:"digit"},fontSize:{title:"Font Size",key:"fontSize",dataIndex:"fontSize",valueType:"digit"},decimalPlaces:{title:"Decimal Places",key:"decimalPlaces",dataIndex:"decimalPlaces",valueType:"digit"},number:{title:"Number",key:"number",dataIndex:"number",valueType:"digit"},text:{title:"Text",key:"text",dataIndex:"text"},color:{title:"Color",key:"color",dataIndex:"color",valueType:"select",valueEnum:{main:(0,i.jsx)(g,{color:"Main"}),yellow:(0,i.jsx)(g,{color:"Yellow"}),green:(0,i.jsx)(g,{color:"Green"}),orange:(0,i.jsx)(g,{color:"Orange"}),purple:(0,i.jsx)(g,{color:"Purple"}),pink:(0,i.jsx)(g,{color:"Pink"}),cyan:(0,i.jsx)(g,{color:"Cyan"}),black:(0,i.jsx)(g,{color:"Black"}),white:(0,i.jsx)(g,{color:"White"})}},team:{title:"Team",key:"team",dataIndex:"team",valueType:"select",valueEnum:{red:(0,i.jsx)(g,{color:"Red"}),blue:(0,i.jsx)(g,{color:"Blue"})}},backgroundImage:{title:"Background Image",key:"backgroundImage",dataIndex:"backgroundImage",valueType:"switch"}};function ve(c){for(var a=Object.keys(c),h=[],s=0;s<a.length;s++)P[a[s]]&&h.push(P[a[s]]);return h}var K=D.fabric.util.createClass(D.fabric.Rect,{type:"UiRect",id:0,name:"",layer:0,groupName:"",ratio:1,_color:"",team:"red",initialize:function(a){a||(a={}),a.color||(a.color="main"),this.id=a.id,this.name=a.name,this.layer=a.layer,this.groupName=a.groupName,this.ratio=a.ratio,this._color=a.color,this.team=a.team,a.lockRotation=!0,a.lockScalingFlip=!0,a.hasRotatingPoint=!1,a.width||(a.width=50/this.ratio),a.height||(a.height=50/this.ratio),a.left||(a.left=50/this.ratio),a.top||(a.top=50/this.ratio),a.strokeWidth||(a.strokeWidth=1/this.ratio),this._color&&this._color!=="main"?a.stroke=b[this._color]:(a.stroke=b[a.team],this._color="main"),a.fill=null,this.callSuper("initialize",a),this.moveTo(a.layer),this.setControlVisible("mtr",!1),this.transparentCorners=!1},resizeScale:function(){this.set("width",Math.round(this.width*this.scaleX*this.ratio)/this.ratio),this.set("height",Math.round(this.height*this.scaleY*this.ratio)/this.ratio),this.set("left",Math.round(this.left*this.ratio)/this.ratio),this.set("top",Math.round(this.top*this.ratio)/this.ratio),this.set("scaleX",1),this.set("scaleY",1)},toObject:function(){return{type:this.type,id:this.id,name:this.name,layer:this.layer,group:this.groupName,width:this.width*this.ratio,height:this.height*this.ratio,x:this.left*this.ratio,y:this.top*this.ratio,color:this._color,lineWidth:this.strokeWidth*this.ratio,_team:this.team}},fromObject:function(a){this._color=a.color,this.id=a.id,this.name=a.name,this.layer=a.layer,this.groupName=a.group,this.team=a._team,this.set("width",a.width/this.ratio),this.set("height",a.height/this.ratio),this.set("left",a.x/this.ratio),this.set("top",a.y/this.ratio),this.set("strokeWidth",a.lineWidth/this.ratio),this._color==="main"?this.set("stroke",b[this.team]):this.set("stroke",b[this._color])},setRatio:function(a){this.set("width",this.width*this.ratio/a),this.set("height",this.height*this.ratio/a),this.set("left",this.left*this.ratio/a),this.set("top",this.top*this.ratio/a),this.set("strokeWidth",this.strokeWidth*this.ratio/a),this.ratio=a},setTeam:function(a){this.team=a,this._color==="main"&&this.set("stroke",b[this.team])}}),B=_.Z.Dragger,ge=function(c){I()(h,c);var a=O()(h);function h(){var s;w()(this,h);for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return s=a.call.apply(a,[this].concat(t)),m()(f()(s),"data",{}),m()(f()(s),"objects",{}),m()(f()(s),"state",{treeData:[],properties:null,groupKey:"layer",selectedId:-1,selectedKey:[],uiWindow:{height:1080,width:1920,ratio:1,team:"red",backgroundImage:!0},rightClickMenuOpen:!1,infoModalShow:!1,uploadModalShow:!1,imageUploadShow:!1}),m()(f()(s),"editable",!1),m()(f()(s),"canvas",null),m()(f()(s),"canvasRef",(0,x.createRef)()),m()(f()(s),"generatorRef",(0,x.createRef)()),m()(f()(s),"background",null),s}return S()(h,[{key:"getNewDataId",value:function(){return Object.keys(this.data).length===0?0:Math.max.apply(Math,Q()(Object.keys(this.data)))+1}},{key:"updateTree",value:function(){for(var e=this.state.groupKey,t=[],n=Object.keys(this.data),l=0;l<n.length;l++){for(var d=this.data[n[l]],o=-1,u=0;u<t.length;u++)if(t[u].key==="".concat(e,"-").concat(d[e])){o=u;break}o===-1&&(t.push({title:"".concat(e," ").concat(d[e]),key:"".concat(e,"-").concat(d[e]),children:[],isLeaf:!1}),o=t.length-1),t[o].children.push({title:d.name,key:"E-".concat(n[l])})}t=t.sort(function(p,j){return p.key.toString().localeCompare(j.key.toString())}),t.unshift({title:"UI Window",key:"window"}),this.setState({treeData:t})}},{key:"getNodeFromId",value:function(e){return e[0]==="E"?e.slice(2):-1}},{key:"onSelect",value:function(e){if(e.length!==0){if(e[0]==="window"){this.setState({properties:this.state.uiWindow,selectedId:-1,selectedKey:e}),this.canvas.discardActiveObject(),this.canvas.renderAll();return}var t=this.getNodeFromId(e[0]);this.select(t)}}},{key:"select",value:function(e){typeof e=="undefined"||e===-1?(this.setState({properties:null,selectedId:-1,selectedKey:[]}),this.canvas.discardActiveObject(),this.canvas.renderAll()):(this.setState({properties:this.data[e],selectedId:e,selectedKey:["E-".concat(e)]}),this.canvas.setActiveObject(this.objects[e]),this.canvas.renderAll())}},{key:"elementsMenuOnClick",value:function(e){var t=this,n=e.keyPath[e.keyPath.length-1];if(n==="D1-add"){var l=e.key.slice(7),d=this.getNewDataId();if(l==="rect"){var o=new K({id:d,name:"New Rect",layer:0,groupName:"Ungroup",ratio:this.state.uiWindow.ratio,team:this.state.uiWindow.team});this.objects[d]=o,this.canvas.add(o)}this.objectsToData(),this.updateTree()}else n==="D1-group"?this.setState({groupKey:e.key.slice(9)},function(){return t.updateTree()}):n==="D1-reset"?this.reset():n==="D1-save"?(this.objectsToData(),he(this.data,"ui.rmui")):n==="D1-open"?this.setState({uploadModalShow:!0}):n==="D1-generate"&&this.generatorRef.current.gen(this.data)}},{key:"reset",value:function(){this.canvas.clear(),this.canvas.backgroundColor="#fff",this.state.uiWindow.backgroundImage&&this.canvas.setBackgroundImage(this.background),this.objects={},this.data={},this.select(-1),this.updateTree(),this.resetCanvasSize(),localStorage.setItem("data","{}")}},{key:"resetCanvasSize",value:function(){var e,t=this.canvasRef.current.clientWidth-12,n=this.canvasRef.current.clientHeight,l=N()({},this.state.uiWindow);t/n<l.width/l.height?(n=t*l.height/l.width,l.ratio=l.width/t):(t=n*l.width/l.height,l.ratio=l.height/n),this.setState({uiWindow:l}),this.canvas.setHeight(n),this.canvas.setWidth(t);for(var d=0,o=Object.keys(this.objects);d<o.length;d++){var u=o[d];this.objects[u].setRatio(l.ratio)}(e=this.background)===null||e===void 0||e.set({scaleX:1/l.ratio,scaleY:1/l.ratio}),this.canvas.renderAll(),this.objectsToData(),this.setState({infoModalShow:!1})}},{key:"onReSize",value:function(){var e=this;this.state.infoModalShow||(this.canvas.setHeight(10),this.canvas.setWidth(10),this.canvas.renderAll(),this.setState({infoModalShow:!0},function(){R.Z.info({title:"Reset UI Window Size",content:"Must reset UI window size after resize browser window.",onOk:function(){return e.resetCanvasSize()},okText:"Reset"})}))}},{key:"onPropertiesChange",value:function(e,t){var n=this;if(this.state.selectedKey[0]==="window"){if(t.team!==this.state.uiWindow.team){for(var l=0,d=Object.keys(this.objects);l<d.length;l++){var o=d[l];this.objects[o].setTeam(t.team)}this.canvas.renderAll(),this.objectsToData()}if(this.setState({uiWindow:t,properties:t},function(){n.resetCanvasSize()}),t.backgroundImage!==this.state.uiWindow.backgroundImage)if(t.backgroundImage){var u,p=this.state.uiWindow.ratio;(u=this.background)===null||u===void 0||u.set({scaleX:1/p,scaleY:1/p}),this.canvas.setBackgroundImage(this.background),this.canvas.renderAll()}else this.canvas.setBackgroundImage(null),this.canvas.renderAll();(t.width!==this.state.uiWindow.width||t.height!==this.state.uiWindow.height)&&R.Z.warning({title:"Warning",content:"Modify UI window width and height may cause unknown error."})}else this.state.selectedId!==-1&&(this.objects[this.state.selectedId].fromObject(t),this.canvas.renderAll(),this.objectsToData(),this.updateTree())}},{key:"componentDidMount",value:function(){var e=this,t=this;this.canvas=new D.fabric.Canvas("ui"),D.fabric.Image.fromURL(r(56133),function(v,y){var k;t.background=v;var C=t.state.uiWindow.ratio;(k=t.background)===null||k===void 0||k.set({scaleX:1/C,scaleY:1/C}),t.state.uiWindow.backgroundImage&&(t.canvas.setBackgroundImage(t.background),t.canvas.renderAll())}),this.canvas.backgroundColor="#fff",this.updateTree(),window.addEventListener("resize",function(){e.onReSize()},!1),window.addEventListener("copy",function(v){v.preventDefault();var y=null;v.target.localName==="input"?y=v.target.ariaValueNow:t.state.selectedId!==-1&&(y=JSON.stringify(t.data[t.state.selectedId])),v.clipboardData.setData("text",y)}),window.addEventListener("paste",function(v){if(v.preventDefault(),v.target.localName==="input")v.target.value=v.clipboardData.getData("text");else try{var y=v.clipboardData.getData("text"),k=JSON.parse(y);k.id=t.getNewDataId(),t.updateObject(k),t.select(k.id)}catch(C){}}),window.addEventListener("keyup",function(v){v.key==="Delete"&&t.state.selectedId!==-1&&t.removeObject(t.state.selectedId)}),this.canvas.on({"mouse:up":function(){for(var y=0,k=Object.keys(t.objects);y<k.length;y++){var C=k[y];t.objects[C].resizeScale()}t.canvas.renderAll(),t.objectsToData();var F=t.canvas.getActiveObject();F?t.select(F.id):t.select(-1)}}),this.canvas.selection=!1;var n=localStorage.getItem("data");if(n){n=JSON.parse(n);for(var l=0,d=Object.keys(n);l<d.length;l++){var o=d[l];this.updateObject(n[o])}}if(this.resetCanvasSize(),this.canvas.renderAll(),n){for(var u=0,p=Object.keys(n);u<p.length;u++){var j=p[u];this.select(j)}this.select(-1)}}},{key:"objectsToData",value:function(){this.data={};for(var e=0,t=Object.keys(this.objects);e<t.length;e++){var n=t[e],l=this.objects[n].toObject();this.data[l.id]=l}this.state.selectedId!==-1&&this.setState({properties:this.data[this.state.selectedId]}),Object.keys(this.data).length!==0&&localStorage.setItem("data",JSON.stringify(this.data))}},{key:"updateObject",value:function(e){if(this.objects[e.id])this.objects[e.id].fromObject(e);else if(e.type==="UiRect"){var t=new K({id:e.id,name:e.name,layer:e.layer,groupName:e.group,ratio:this.state.uiWindow.ratio});this.objects[e.id]=t,t.fromObject(e),t.setRatio(this.state.uiWindow.ratio),this.canvas.add(t)}this.objectsToData(),this.updateTree()}},{key:"removeObject",value:function(e){this.objects[e]&&(this.select(-1),this.canvas.remove(this.objects[e]),this.canvas.renderAll(),delete this.objects[e],this.objectsToData(),this.updateTree())}},{key:"onElementRightClick",value:function(e){e.node.key[0]==="E"?this.select(e.node.key.slice(2)):this.select(-1)}},{key:"onElementMenuClick",value:function(e){if(this.setState({rightClickMenuOpen:!1}),e.key==="D2-copy"){var t=N()({},this.data[this.state.selectedId]);t.id=this.getNewDataId(),this.updateObject(t)}else e.key==="D2-delete"&&this.removeObject(this.state.selectedId)}},{key:"onMenuOpenChange",value:function(e){if(e){var t=this;setTimeout(function(){t.state.selectedId!==-1?t.setState({rightClickMenuOpen:!0}):t.setState({rightClickMenuOpen:!1})},100)}else this.setState({rightClickMenuOpen:!1})}},{key:"onElementMenuContainerClick",value:function(e){e.target.localName==="div"&&(this.setState({rightClickMenuOpen:!1,properties:null,selectedId:-1,selectedKey:[]}),this.select(-1))}},{key:"onUploadModalCancel",value:function(){this.setState({uploadModalShow:!1})}},{key:"onImageUploadModalCancel",value:function(){this.setState({imageUploadShow:!1})}},{key:"onUploadFile",value:function(e){var t=this,n=new FileReader;return n.onload=function(l){var d=l.target.result,o=JSON.parse(d);t.reset(),t.setState({uploadModalShow:!1});for(var u=0,p=Object.keys(o);u<p.length;u++){var j=p[u];t.updateObject(o[j])}},n.readAsText(e),!0}},{key:"onUploadImage",value:function(e){var t=this;this.setState({imageUploadShow:!1}),this.background.setSrc(ce(e),function(){t.canvas.renderAll()})}},{key:"render",value:function(){var e=this,t=0,n=[{key:"D1-group",label:"Group by",children:[{key:"D1-group-layer",label:"layer"},{key:"D1-group-group",label:"group"}]},{key:"D1-reset",label:"Reset Designer"}];this.props.editable&&(n.unshift({key:"D1-add",label:"Add Element",children:[{key:"D1-add-rect",label:"Rect"}]}),n.push({type:"divider"},{key:"D1-open",label:"Open .rmui"},{key:"D1-save",label:"Save as .rmui"},{type:"divider"},{key:"D1-generate",label:"Generate Code",icon:(0,i.jsx)(ie.Z,{})}),t++);for(var l=0;l<n[t].children.length;l++)n[t].children[l].label===this.state.groupKey&&(n[t].children[l].icon=(0,i.jsx)(se.Z,{}));return(0,i.jsxs)("div",{className:"full",children:[(0,i.jsxs)(ee.Z,{warp:!1,className:"container",gutter:12,children:[(0,i.jsxs)(W.Z,{flex:"300px",children:[(0,i.jsx)("div",{style:{height:"50%",paddingBottom:12},children:(0,i.jsx)(A.Z,{size:"small",title:"Elements",style:{height:"100%"},extra:(0,i.jsx)(E.Z,{menu:{items:n,onClick:function(o){return e.elementsMenuOnClick(o)}},children:(0,i.jsx)(ne.Z,{})}),children:(0,i.jsx)("div",{className:"card-body",onMouseUp:function(o){return e.onElementMenuContainerClick(o)},children:(0,i.jsx)(E.Z,{menu:{items:[{key:"D2-copy",label:"Copy"},{key:"D2-delete",label:"Delete",danger:!0}],onClick:function(o){e.onElementMenuClick(o)}},trigger:["contextMenu"],open:this.state.rightClickMenuOpen,onOpenChange:function(o){e.onMenuOpenChange(o)},children:(0,i.jsx)(te.Z,{className:"full",treeData:this.state.treeData,onSelect:function(o){return e.onSelect(o)},selectedKeys:this.state.selectedKey,onRightClick:function(o){return e.onElementRightClick(o)},defaultExpandParent:!0})})})})}),(0,i.jsx)(A.Z,{size:"small",title:"Properties",style:{height:"50%"},children:(0,i.jsxs)("div",{className:"card-body",children:[this.state.properties?(0,i.jsx)(re.vY,{dataSource:this.state.properties,columns:ve(this.state.properties),editable:this.props.editable?{onSave:function(o,u){return e.onPropertiesChange(o,u)}}:null,column:1,style:{marginTop:4}}):(0,i.jsx)(z.Z,{image:z.Z.PRESENTED_IMAGE_SIMPLE}),this.state.selectedKey[0]==="window"?(0,i.jsx)(ae.ZP,{onClick:function(){return e.setState({imageUploadShow:!0})},children:"Upload Background"}):(0,i.jsx)("div",{})]})})]}),(0,i.jsx)(W.Z,{flex:"auto",ref:this.canvasRef,children:(0,i.jsx)("canvas",{className:"full",id:"ui"})})]}),(0,i.jsxs)(R.Z,{title:"Upload Your .rmui File",open:this.state.uploadModalShow,onCancel:function(){return e.onUploadModalCancel()},footer:null,destroyOnClose:!0,children:[(0,i.jsx)(Z.Z,{}),(0,i.jsxs)(B,{showUploadList:!1,beforeUpload:function(o){return e.onUploadFile(o)},accept:".rmui",children:[(0,i.jsx)("p",{className:"ant-upload-drag-icon",children:(0,i.jsx)(L.Z,{})}),(0,i.jsx)("p",{className:"ant-upload-text",children:"Click or drag file to this area to upload"})]})]}),(0,i.jsxs)(R.Z,{title:"Upload Your Background Image",open:this.state.imageUploadShow,onCancel:function(){return e.onImageUploadModalCancel()},footer:null,destroyOnClose:!0,children:[(0,i.jsx)(Z.Z,{}),(0,i.jsxs)(B,{showUploadList:!1,beforeUpload:function(o){return e.onUploadImage(o)},accept:"image/*",children:[(0,i.jsx)("p",{className:"ant-upload-drag-icon",children:(0,i.jsx)(L.Z,{})}),(0,i.jsx)("p",{className:"ant-upload-text",children:"Click or drag file to this area to upload"})]})]}),(0,i.jsx)(de,{ref:this.generatorRef})]})}}]),h}(x.Component),fe=ge,me=function(c){I()(h,c);var a=O()(h);function h(){return w()(this,h),a.apply(this,arguments)}return S()(h,[{key:"render",value:function(){return(0,i.jsx)("div",{className:"container",children:(0,i.jsx)(fe,{className:"full",editable:!0})})}}]),h}(x.Component),pe=me},56133:function(U,M,r){"use strict";U.exports=r.p+"static/background.d741a18b.png"},41001:function(){},35287:function(){},7396:function(){}}]);
