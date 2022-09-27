import 'regenerator-runtime';
import axios from 'axios';

(
    function () {
        let leftNumber = -1;
        let rightNumber = -1;
        let isSample = true;
        let isLeftSample = true;
        const addClickEventListener = (element, isLeft) => {
            element.forEach(v => {
                v.addEventListener('click', (evt) => onClick(evt, isLeft));
            })
        };

        /* const removeClickEventListener = (element,isLeft)=>{
            element.forEach(v=>{
                v.removeEventlistener("click",)
            })
        } */

        const onClick = (evt, isLeft) => {
            const thisElement = evt.target;
            const srcValue = thisElement.src;
            if (!isLeft) {
                const isSampleStr = thisElement.dataset.issample;
                isSample = isSampleStr === '1' ? true : false;
                if (isSampleStr === '1') {
                    const rightNumberStr = thisElement.dataset.rightnumber;

                    rightNumber = parseInt(rightNumberStr);
                }
            } else {
                const isSampleStr = thisElement.dataset.issample;
                isLeftSample = isSampleStr === '1' ? true : false;
                if (isSampleStr) {
                    const leftNumberStr = thisElement.dataset.leftnumber;
                    leftNumber = parseInt(leftNumberStr);
                }
            }
            isLeft ? inputImgSrc.style_image = srcValue : inputImgSrc.content_image = srcValue;
            isLeft ?
                clicked_img_element.clicked_input_img_now = thisElement
                : clicked_img_element.clicked_styled_img_now = thisElement;
            document.body.dispatchEvent(new CustomEvent("onChangeTargetImgEvent", {
                bubbles: true,
                cancelable: true,
                detail: {
                    isLeft
                }
            }))
        }

        const gettingFileBase64Val = (srcVal) => {
            return new Promise((resolve, reject) => {
                try {
                    const tempImg = new Image();
                    tempImg.src = srcVal;
                    tempImg.onload = () => {
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = tempImg.width;
                        tempCanvas.height = tempImg.height;
                        tempCanvas.getContext('2d').drawImage(tempImg, 0, 0, tempCanvas.width, tempCanvas.height);
                        resolve(tempCanvas.toDataURL('image/png'));
                    }
                } catch (err) {
                    console.error(err);
                    reject(err);
                }

            })
        }

        const convertBase64IntoBinary = (base64) => {
            const [str, dataType, realData] = base64.split(/[:,]+/);
            const realDataType = dataType.split(';')[0];
            const byteData = window.atob(realData);
            const binaryArr = [];
            for (let i = 0; i < byteData.length; i++) {
                binaryArr.push(byteData.charCodeAt(i));
            }
            return { binaryArr, realDataType };
        }

        const convertIntoFile = async (srcVal) => {
            try {
                const base64 = await gettingFileBase64Val(srcVal);
                const { binaryArr, realDataType } = convertBase64IntoBinary(base64);
                const blob = new Blob([new Uint8Array(binaryArr)], { 'type': realDataType });
                return { blob, realDataType };
            } catch (err) {
                throw err;
            }

        }

        const changeResultImage = (picture_area, output_Addr) => {
            picture_area.style.backgroundImage = `url(\"${output_Addr}\")`;
        }

        const saveFile =  (blob, fileName, ext) => {
            const fileURL = window.URL.createObjectURL(blob);
            const aTag = document.createElement('a');
            aTag.href = fileURL;
            aTag.download = fileName;
            aTag.click();
            window.URL.revokeObjectURL(fileURL);
            /* if (window.showSaveFilePicker) {
                const opts = {
                    types: [{
                        description: 'Image file',
                        accept: { 'image/*': [`.${ext}`] }
                    }],
                }
                const fileHandle = await window.showSaveFilePicker(opts);
                const fileStream = await fileHandle.createWritable();
                await fileStream.write(blob);
                await fileStream.close();
            } else {
                const fileURL = window.URL.createObjectURL(blob);
                const aTag = document.createElement('a');
                aTag.href = fileURL;
                aTag.download = fileName;
                aTag.click();
                window.URL.revokeObjectURL(fileURL);
            } */
        }

        const addDownloadEvent = (element) => {
            element.addEventListener("click", async (evt) => {
                try {
                    const pictureArea = document.querySelectorAll('.picture_area')[0];
                    let src = pictureArea.style.backgroundImage;
                    src = src.slice(src.indexOf('"') + 1, src.lastIndexOf('"'));
                    console.log(src);
                    const { blob, realDataType } = await convertIntoFile(src);
                    saveFile(blob, `${Date.now()}.${realDataType.split('/')[1]}`, realDataType.split('/')[1]);
                    /* console.log(blob);
                    console.log(realDataType.split('/')[1]) */
                } catch (err) {
                    console.error(err);
                    alert("양쪽에서 이미지들을 하나씩 선택후 Paint 해주세요!");
                }
            })
        }

        const addPaintEventToBtn = (element) => {
            element.addEventListener("click", async (evt) => {
                evt.preventDefault();
                console.log(isSample);
                console.log(isLeftSample);
                if (isSample && isLeftSample) {
                    const outputStr = `/img/3_style_transfer/content${rightNumber}_style${leftNumber}.jpg`;
                    const picture_area = document.querySelector('.picture_area');
                    changeResultImage(picture_area, outputStr);
                    return false;
                }
                if (inputImgSrc.content_image && inputImgSrc.style_image) {
                    try {
                        const { blob: content_image_file } = await convertIntoFile(inputImgSrc.content_image);
                        const { blob: style_image_file } = await convertIntoFile(inputImgSrc.style_image);
                        const formData = new FormData();
                        formData.append('content_image', content_image_file);
                        formData.append('style_image', style_image_file);
                        console.log(formData);
                        const headers = { 'context-type': 'multipart/form-data' };
                        document.querySelector("#loading").style.display = "flex";
                        const resp = await axios.post("/api", formData, headers);
                        document.querySelector("#loading").style.display = "none";
                        const { output_key } = resp.data;
                        const output_Addr = `/static/logs/${output_key}_v1.png`;
                        const picture_area = document.querySelector('.picture_area');
                        changeResultImage(picture_area, output_Addr);
                    } catch (err) {
                        alert("그림을 선택해 주세요!");
                        return false;
                    }

                } else {
                    alert("그림을 선택해 주세요!");
                    return false;
                }
            })
        }



        const onChangeTargetImgElement = (evt) => {
            evt.preventDefault();
            const isLeft = evt.detail.isLeft;
            console.log(`is Left: ${isLeft}`);
            switch (isLeft) {
                case true: {
                    if (clicked_img_element.clicked_input_img_now !== clicked_img_element.clicked_input_img_prev) {
                        if (clicked_img_element.clicked_input_img_prev) {
                            clicked_img_element.clicked_input_img_prev.classList.remove('clicked');
                        }
                        clicked_img_element.clicked_input_img_now.classList.add('clicked');
                        clicked_img_element.clicked_input_img_prev = clicked_img_element.clicked_input_img_now;
                    }
                    break;
                }
                case false: {
                    if (clicked_img_element.clicked_styled_img_now !== clicked_img_element.clicked_styled_img_prev) {
                        if (clicked_img_element.clicked_styled_img_prev) {
                            clicked_img_element.clicked_styled_img_prev.classList.remove('clicked');
                        }
                        clicked_img_element.clicked_styled_img_now.classList.add('clicked');
                        clicked_img_element.clicked_styled_img_prev = clicked_img_element.clicked_styled_img_now;
                    }
                    break;
                }

                default: break;
            }
        }

        const onChangeLeftFileCallback = (evt) => {
            const file = evt.target.files[0];
            const fileType = file.type;
            if (fileType.match("image/*")) {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    const base64 = e.target.result;
                    const img = document.createElement('img');
                    img.src = base64;
                    img.style.width = "100%";

                    const div = document.createElement('div');
                    div.classList.add('img_file');
                    div.appendChild(img);
                    div.addEventListener("click", (evt) => onClick(evt, true), true);

                    const div_cloned = div.cloneNode(true);
                    div_cloned.addEventListener("click", (evt) => onClick(evt, true), true);

                    const img_list_container = document.querySelectorAll("#updown_left .updown_area")[0];
                    const img_list_container_scroll = document.querySelectorAll("#scroll_left .scroll_area")[0];

                    img_list_container.prepend(div);
                    img_list_container_scroll.prepend(div_cloned);
                }
                fileReader.readAsDataURL(file);
            }
        }

        const onChangeFileCallback = (evt) => {
            const file = evt.target.files[0];
            const fileType = file.type;
            if (fileType.match("image/*")) {
                const fileReader = new FileReader();
                fileReader.onload = (e) => {
                    const base64 = e.target.result;
                    const img = document.createElement('img');
                    img.src = base64;
                    img.style.width = "100%";

                    const div = document.createElement('div');
                    div.classList.add('img_file');
                    div.appendChild(img);
                    div.addEventListener("click", (evt) => onClick(evt, false), true);

                    const div_cloned = div.cloneNode(true);
                    div_cloned.addEventListener("click", (evt) => onClick(evt, false), true);

                    const img_list_container = document.querySelectorAll("#updown_right .updown_area")[0];
                    const img_list_container_scroll = document.querySelectorAll("#scroll_right .scroll_area")[0];

                    img_list_container.prepend(div);
                    img_list_container_scroll.prepend(div_cloned);

                }
                fileReader.readAsDataURL(file);
            }
        }

        window.onload = () => {

            const upDownLeftImgList = document.querySelectorAll('#updown_left .img_file');
            const scrollLeftImgList = document.querySelectorAll(`#scroll_left .scroll_area .img_file`);
            const upDownRightImgList = document.querySelectorAll('#updown_right .img_file');
            const scrollRightImgList = document.querySelectorAll(`#scroll_right .scroll_area .img_file`);
            const painting_btn = document.querySelectorAll('.painting_btn')[0];
            const fileElem = document.querySelector("#file");
            const leftFileElem = document.querySelector("#left-file");
            const downloadBtn = document.querySelectorAll(".download-btn")[0];

            addClickEventListener(upDownLeftImgList, true);
            addClickEventListener(scrollLeftImgList, true);
            addClickEventListener(upDownRightImgList, false);
            addClickEventListener(scrollRightImgList, false);
            addPaintEventToBtn(painting_btn);
            addDownloadEvent(downloadBtn);
            leftFileElem.addEventListener("change", onChangeLeftFileCallback);
            fileElem.addEventListener("change", onChangeFileCallback);
            document.body.addEventListener("onChangeTargetImgEvent", onChangeTargetImgElement);

        }

        window.onbeforeunload = () => {
            document.body.removeEventListener("onChangeTargetImgEvent", onChangeTargetImgElement);
            clicked_img_element.clicked_input_img_now = null;
            clicked_img_element.clicked_input_img_prev = null;
            clicked_img_element.clicked_styled_img_now = null;
            clicked_img_element.clicked_styled_img_prev = null;
            /* const upDownLeftImgList = document.querySelectorAll('#updown_left .img_file');
            const scrollLeftImgList = document.querySelectorAll(`#scroll_left .scroll_area .img_file`);
            const upDownRightImgList = document.querySelectorAll('#updown_right .img_file');
            const scrollRightImgList = document.querySelectorAll(`#scroll_right .scroll_area .img_file`);
            const painting_btn = document.querySelectorAll('.painting_btn')[0];
            const fileElem = document.querySelector("#file"); */


        }
    }
)()