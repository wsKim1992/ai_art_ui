import 'regenerator-runtime';
import axios from 'axios';

(
    function(){
        let leftNumber = -1;
        let rightNumber = -1;
        let isSample = true;

        const addClickEventListener = (element,isLeft)=>{
            element.forEach(v=>{
                v.addEventListener('click',(evt)=>onClick(evt,isLeft));
            })
        };

        /* const removeClickEventListener = (element,isLeft)=>{
            element.forEach(v=>{
                v.removeEventlistener("click",)
            })
        } */

        const onClick = (evt,isLeft)=>{
            const thisElement = evt.target;
            const srcValue = thisElement.src;
            if(!isLeft){
                const isSampleStr = thisElement.dataset.issample;
                isSample=isSampleStr==='1'?true:false; 
                if(isSampleStr==='1'){
                    const rightNumberStr = thisElement.dataset.rightnumber;
                    
                    rightNumber=parseInt(rightNumberStr);
                }
            }else{
                const leftNumberStr = thisElement.dataset.leftnumber;
                leftNumber=parseInt(leftNumberStr);
            }
            isLeft?inputImgSrc.style_image=srcValue:inputImgSrc.content_image=srcValue;
            isLeft?
                clicked_img_element.clicked_input_img_now=thisElement
                :clicked_img_element.clicked_styled_img_now=thisElement;
            document.body.dispatchEvent(new CustomEvent("onChangeTargetImgEvent",{
                bubbles:true,
                cancelable:true,
                detail:{
                    isLeft
                }
            }))
        }

        const gettingFileBase64Val = (srcVal)=>{
            return new Promise((resolve,reject)=>{
                const tempImg = new Image();
                tempImg.src = srcVal;
                tempImg.onload = ()=>{
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = tempImg.width;
                    tempCanvas.height = tempImg.height;
                    tempCanvas.getContext('2d').drawImage(tempImg,0,0,tempCanvas.width,tempCanvas.height);
                    resolve(tempCanvas.toDataURL('image/png'));
                }
            })
        }

        const convertBase64IntoBinary=(base64)=>{
            const [str,dataType,realData]=base64.split(/[:,]+/);
            const realDataType = dataType.split(';')[0];
            const byteData = window.atob(realData);
            const binaryArr = [];
            for(let i = 0;i<byteData.length;i++){
                binaryArr.push(byteData.charCodeAt(i));
            }
            return {binaryArr,realDataType};
        }

        const convertIntoFile = async (srcVal)=>{
            const base64=await gettingFileBase64Val(srcVal);
            const {binaryArr,realDataType}=convertBase64IntoBinary(base64);
            const blob = new Blob([new Uint8Array(binaryArr)],{'type':realDataType});
            return blob;
        }

        const changeResultImage=(picture_area,output_Addr)=>{
            picture_area.style.backgroundImage=`url(\"${output_Addr}\")`;
        }

        const addPaintEventToBtn = (element)=>{
            element.addEventListener("click",async(evt)=>{
                evt.preventDefault();
                console.log(isSample);
                if(isSample){
                    const outputStr = `/img/3_style_transfer/content${rightNumber}_style${leftNumber}.jpg`;
                    const picture_area = document.querySelector('.picture_area');
                    changeResultImage(picture_area,outputStr);
                    return false;
                }
                if(inputImgSrc.content_image&&inputImgSrc.style_image){
                    const content_image_file=await convertIntoFile(inputImgSrc.content_image);
                    const style_image_file=await convertIntoFile(inputImgSrc.style_image);
                    const formData = new FormData();
                    formData.append('content_image',content_image_file);
                    formData.append('style_image',style_image_file);
                    console.log(formData);
                    const headers =  {'context-type':'multipart/form-data'};
                    document.querySelector("#loading").style.display="flex";
                    const resp = await axios.post("/api",formData,headers);
                    document.querySelector("#loading").style.display="none";
                    const {output_key}=resp.data;
                    const output_Addr = `/static/logs/${output_key}_v1.png`;
                    const picture_area = document.querySelector('.picture_area');
                    changeResultImage(picture_area,output_Addr);
                }else{
                    alert("그림을 선택해 주세요!");
                    return false;
                }
            })
        }



        const onChangeTargetImgElement = (evt)=>{
            evt.preventDefault();
            const isLeft = evt.detail.isLeft;
            switch(isLeft){
                case true:{
                    if(clicked_img_element.clicked_input_img_now!==clicked_img_element.clicked_input_img_prev){
                        if(clicked_img_element.clicked_input_img_prev){
                            clicked_img_element.clicked_input_img_prev.classList.remove('clicked');
                        }
                        clicked_img_element.clicked_input_img_now.classList.add('clicked');
                        clicked_img_element.clicked_input_img_prev=clicked_img_element.clicked_input_img_now;
                    }
                    break;
                }
                case false:{
                    if(clicked_img_element.clicked_styled_img_now!==clicked_img_element.clicked_styled_img_prev){
                        if(clicked_img_element.clicked_styled_img_prev){
                            clicked_img_element.clicked_styled_img_prev.classList.remove('clicked');
                        }
                        clicked_img_element.clicked_styled_img_now.classList.add('clicked');
                        clicked_img_element.clicked_styled_img_prev=clicked_img_element.clicked_styled_img_now;
                    }
                    break;
                }
                
                default : break;
            }
        }

        const onChangeFileCallback = (evt)=>{
            const file = evt.target.files[0];
            const fileType = file.type;
            if(fileType.match("image/*")){
                const fileReader = new FileReader();
                fileReader.onload=(e)=>{
                    const base64 = e.target.result;
                    const img = document.createElement('img');
                    img.src=base64;
                    img.style.width="100%";
                    
                    const div = document.createElement('div');
                    div.classList.add('img_file');
                    div.appendChild(img);
                    div.addEventListener("click",(evt)=>onClick(evt,false),true);

                    const div_cloned = div.cloneNode(true);
                    div_cloned.addEventListener("click",(evt)=>onClick(evt,false),true);

                    const img_list_container = document.querySelectorAll("#updown_right .updown_area")[0];
                    const img_list_container_scroll = document.querySelectorAll("#scroll_right .scroll_area")[0];
                    
                    img_list_container.prepend(div);
                    img_list_container_scroll.prepend(div_cloned);
                    
                }
                fileReader.readAsDataURL(file);
            }
        }

        window.onload=()=>{

            const upDownLeftImgList = document.querySelectorAll('#updown_left .img_file');
            const scrollLeftImgList = document.querySelectorAll(`#scroll_left .scroll_area .img_file`);
            const upDownRightImgList = document.querySelectorAll('#updown_right .img_file');
            const scrollRightImgList = document.querySelectorAll(`#scroll_right .scroll_area .img_file`);
            const painting_btn = document.querySelectorAll('.painting_btn')[0];
            const fileElem = document.querySelector("#file");

            addClickEventListener(upDownLeftImgList,true);
            addClickEventListener(scrollLeftImgList,true);
            addClickEventListener(upDownRightImgList,false);
            addClickEventListener(scrollRightImgList,false);
            addPaintEventToBtn(painting_btn);

            fileElem.addEventListener("change",onChangeFileCallback)
            document.body.addEventListener("onChangeTargetImgEvent",onChangeTargetImgElement);

        }

        window.onbeforeunload=()=>{
            document.body.removeEventListener("onChangeTargetImgEvent",onChangeTargetImgElement);
            clicked_img_element.clicked_input_img_now=null;
            clicked_img_element.clicked_input_img_prev=null;
            clicked_img_element.clicked_styled_img_now=null;
            clicked_img_element.clicked_styled_img_prev=null;
            /* const upDownLeftImgList = document.querySelectorAll('#updown_left .img_file');
            const scrollLeftImgList = document.querySelectorAll(`#scroll_left .scroll_area .img_file`);
            const upDownRightImgList = document.querySelectorAll('#updown_right .img_file');
            const scrollRightImgList = document.querySelectorAll(`#scroll_right .scroll_area .img_file`);
            const painting_btn = document.querySelectorAll('.painting_btn')[0];
            const fileElem = document.querySelector("#file"); */


        }
    }
)()