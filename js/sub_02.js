import axios from 'axios';

(
    function(){
        const onClickPaintingBtn = (evt)=>{
            evt.preventDefault();
            const headers = {'context-type':'multipart/form-data'};
            const imageComponent = document.querySelector(".image_component");
            const loadingComponent = document.querySelector("#loading");
            loadingComponent.style.display="flex";
            console.log(imageComponent);
            axios.post('/generate_art',{},headers).then(resp=>{
                const outputData = resp.data.output;
                console.log(imageComponent);
                
                if(outputData==='overflow'){throw new Error('하루에 5번 까지만 호출이 가능합니다..');}
                imageComponent.src = `/${outputData}`;

                setTimeout(()=>{loadingComponent.style.display="none";},1000);
            }).catch(err=>{
                console.error(err);
                loadingComponent.style.display="none";
                if(err.response){
                    const status = err.response.status;
                    switch (status){
                        case status>=400&&status<500:{
                            alert("data 전송 오류");
                            break;
                        }
                        case status>=500:{
                            alert("server 오류");
                            break;
                        }
                    }
                }else{
                    alert(err.message);
                }
                
            });
        }
        window.onload=()=>{
            const painting_btn = document.querySelector('.painting_btn');
            console.log(painting_btn);
            painting_btn.addEventListener("click",onClickPaintingBtn);
        }
    }
)()