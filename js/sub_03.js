(
    function(){
        let leftIndex = -1;
        let rightIndex = -1;
        let isSample = true;

        const onClickImageComponent = (evt)=>{
            const {target:thisElement} = evt;
            const thisTagName = thisElement.tagName;
            if(thisTagName==='IMG'){
                const {isleft,contentindex} = thisElement.dataset;
                isleft==='1'?leftIndex=parseInt(contentindex):rightIndex=parseInt(contentindex);
                if(isleft==='0'){
                    const {issample} = thisElement.dataset;
                    issample==="1"?isSample=true:isSample=false;
                    if(clicked_img_element.clicked_input_img_now)clicked_img_element.clicked_input_img_now.classList.remove('clicked');
                    clicked_img_element.clicked_input_img_prev= clicked_img_element.clicked_input_img_now;
                    clicked_img_element.clicked_input_img_now=thisElement;
                    clicked_img_element.clicked_input_img_now.classList.add("clicked");
                }else{
                    if(clicked_img_element.clicked_styled_img_now)clicked_img_element.clicked_styled_img_now.classList.remove('clicked');
                    clicked_img_element.clicked_styled_img_prev= clicked_img_element.clicked_styled_img_now;
                    clicked_img_element.clicked_styled_img_now=thisElement;
                    clicked_img_element.clicked_styled_img_now.classList.add("clicked");
                }
            }else{
                return false;
            }
        }

        const onCallingAdoptStyleAPI = (evt)=>{
            evt.preventDefault();
            if(!clicked_img_element.clicked_input_img_now||!clicked_img_element.clicked_styled_img_now){
                return false;
            }
            if(isSample){
                const imageFileName = `content${rightIndex}_stylized.jpg`
                const styledImgSrc = clicked_img_element.clicked_styled_img_now.src;
                const styleName = styledImgSrc.slice(styledImgSrc.lastIndexOf("/")+1,styledImgSrc.lastIndexOf("."));
                
                const outputSrc = `/img/2_adaptive_style/${styleName}/${imageFileName}`;
                
                document.querySelector(".picture_area").style.backgroundImage=`url(${outputSrc})`;
            }
        }

        window.onload=()=>{
            const upDownRightComponent=document.querySelector("#updown_right");
            const scrollRightComponent=document.querySelector("#scroll_right");
            const upDownLeftComponent=document.querySelector("#updown_left");
            const scrollLeftComponent=document.querySelector("#scroll_left");
            
            upDownRightComponent.addEventListener("click",onClickImageComponent);
            scrollRightComponent.addEventListener("click",onClickImageComponent);
            upDownLeftComponent.addEventListener("click",onClickImageComponent);
            scrollLeftComponent.addEventListener("click",onClickImageComponent);
        
            const Painting_Btn = document.querySelector(".painting_btn");
            Painting_Btn.addEventListener("click",onCallingAdoptStyleAPI)
        }

        window.onbeforeunload=()=>{
            const upDownRightComponent=document.querySelector("#updown_right");
            const scrollRightComponent=document.querySelector("#scroll_right");
            const upDownLeftComponent=document.querySelector("#updown_left");
            const scrollLeftComponent=document.querySelector("#scroll_left");
            const Painting_Btn = document.querySelector(".painting_btn");
            upDownRightComponent.removeEventListener("click",onClickImageComponent);
            scrollRightComponent.removeEventListener("click",onClickImageComponent);
            upDownLeftComponent.removeEventListener("click",onClickImageComponent);
            scrollLeftComponent.removeEventListener("click",onClickImageComponent);
            Painting_Btn.removeEventListener("click",onCallingAdoptStyleAPI);

            clicked_img_element.clicked_input_img_now=null;
            clicked_img_element.clicked_input_img_prev=null;
            clicked_img_element.clicked_styled_img_now=null;
            clicked_img_element.clicked_styled_img_prev=null;
        }
    }
)()