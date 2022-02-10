import 'regenerator-runtime';
import axios from 'axios';

(
    function(){
        const addClickEventListener = (element,isLeft)=>{
            element.forEach(v=>{
                v.addEventListener('click',(evt)=>onClick(evt,isLeft));
            })
        }

        const onClick = (evt,isLeft)=>{
            const thisElement = evt.target;
            const srcValue = thisElement.src;
            isLeft?inputImgSrc.content_image=srcValue:inputImgSrc.style_image=srcValue;
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
                if(inputImgSrc.content_image&&inputImgSrc.style_image){
                    const content_image_file=await convertIntoFile(inputImgSrc.content_image);
                    const style_image_file=await convertIntoFile(inputImgSrc.style_image);
                    const formData = new FormData();
                    formData.append('content_image',content_image_file);
                    formData.append('style_image',style_image_file);
                    console.log(formData);
                    const headers =  {'context-type':'multipart/form-data'};
                    const resp = await axios.post("/api",formData,headers);
                    const {output_key}=resp.data;
                    const output_Addr = `/static/logs/${output_key}_v1.png`;
                    const picture_area = document.querySelector('.picture_area');
                    console.log(picture_area);
                    console.log(`output_Addr : ${output_Addr}`);
                    changeResultImage(picture_area,output_Addr);
                }else{
                    alert("그림을 선택해 주세요!");
                    return false;
                }
            })
        }

        window.onload=()=>{
            const upDownLeftImgList = document.querySelectorAll('#updown_left .img_file');
            const scrollLeftImgList = document.querySelectorAll(`#scroll_left .img_file`);
            
            addClickEventListener(upDownLeftImgList,true);
            addClickEventListener(scrollLeftImgList,true);

            const upDownRightImgList = document.querySelectorAll('#updown_right .img_file');
            const scrollRightImgList = document.querySelectorAll(`#scroll_right .img_file`);
            
            addClickEventListener(upDownRightImgList,false);
            addClickEventListener(scrollRightImgList,false);
        
            const painting_btn = document.querySelectorAll('.painting_btn')[0];
            addPaintEventToBtn(painting_btn);
        }
    }
)()