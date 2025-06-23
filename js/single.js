!function () {
	const urlParams = new URLSearchParams(window.location.search);
	const document_id = urlParams.get('document_id');
	const folder_id = urlParams.get('folder_id');
	console.log('document_id', document_id);
	console.log('folder_id', folder_id);
    const supabaseUrl = 'https://ehtxrrxcaziwffiexzla.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHhycnhjYXppd2ZmaWV4emxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzQwNTksImV4cCI6MjA2NTMxMDA1OX0.o-Mp1UBGUL-2xExuYmjZ-ZxyXLtc82jQw7LUWwKKlUw';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
     async function fetchDataDocument() {
        const { data, error } = await supabase
            .from('document')
            .select('*');
        
        if (error) {
            console.error('Lỗi khi lấy dữ liệu document:', error);
            return [];
        }
        return data || [];
    }

    async function fetchDataFolder() {
        const { data, error } = await supabase
            .from('folder')
            .select('*');
        
        if (error) {
            console.error('Lỗi khi lấy dữ liệu folder:', error);
            return [];
        }
        return data || [];
    }

    async function fetchDataDocumentById(id) {
        const { data, error } = await supabase
            .from('document')
            .select('*')
            .eq('id', id);
        if (error) {
            return [];
        }
        return data || [];
    }

    async function fetchDataFolderById(id) {
        const { data, error } = await supabase
            .from('folder')
            .select('*')
            .eq('id', id);
        if (error) {
            return [];
        }
        return data || [];
    }

    async function fetchDataFileByFolder(id) {
        const { data, error } = await supabase
            .from('file')
            .select('*')
            .eq('parent', id);
        if (error) {
            console.error('Lỗi khi lấy dữ liệu folder:', error);
            return [];
        }
        return data || [];
    }
    function setElementDocument(carousel, doc, className, data, show, folderId){
        const li = document.createElement('li');
                li.title = `${name}`;
                li.className = className;
                li.innerHTML = `
                        <a href="list.html?id=${doc.id}">${doc.name}</a>
                        ${show ? `<ul>
                            ${data.map(folder => folder.parent == doc.id ? `
                                <li class="sidelist ${folderId == folder.id ? "sidelist parent active" : "" }">
                                    <a href="single.html?document_id=${doc.id}&&folder_id=${folder.id}">${folder.name}</a>
                                </li>
                            `: '').join('')}
                        </ul>` : ''}
                    `;
                
                if ($(carousel).data('owl.carousel')) {
                    $(carousel).trigger('add.owl.carousel', [li]).trigger('refresh.owl.carousel');
                } else {
                    carousel.appendChild(li);
                }
    }
 
    function setElementBody(documentData, folderData, fileData){
        const body = document.querySelector('.body-description')
        const div = document.createElement('div');
              div.innerHTML = `
                <h2 class="mb-4 font-weight-medium">${documentData.name}</h2>
                <div class="content">
                    <!-- heading -->
                    <h4 id="heading-example">${folderData.name}</h4>
                    <p>${folderData.desc}</p>
                    <hr>
                    <!-- emphasis -->
                    <h5 id="link">Link</h5>
                    <div class="body-link">
                        ${fileData.map(file => `<h6><a href="https://drive.google.com/file/d/1VyvzIgyWSq-bG6gyP1CR-9OQ994Q94Wx/preview">${file.name}</a></h6>
                                <embed src="https://drive.google.com/file/d/1VyvzIgyWSq-bG6gyP1CR-9OQ994Q94Wx/preview"
                                width="100%" height="600px" type="application/pdf">
                                <br/>`).join('')}
                    </div>
                    <hr>
                    <!-- youtube video -->
                    <h5 id="youtube-video">Youtube video</h5>
                    <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
                        <iframe src="https://www.youtube.com/embed/C0DPdy98e4c"
                        style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen
                        title="YouTube Video"></iframe>
                    </div>
                </div> `;
                
        if ($(body).data('owl.body-description')) {
            $(body).trigger('add.owl.body-description', [li]).trigger('refresh.owl.body-description');
        } else {
            body.appendChild(div);
        }
                
    }
    document.addEventListener('DOMContentLoaded', async function () {
           try {
            const [documentData, folderData, folderDataDetail, fileDataByFolder, folderDataDetailById] = await Promise.all([
                fetchDataDocument(),
                fetchDataFolder(),
                fetchDataDocumentById(document_id),
                fetchDataFileByFolder(folder_id),
                fetchDataFolderById(folder_id),
            ]);
            const carousel = document.querySelector('.sidenav')
            documentData.forEach(doc => {
                if(doc.id == document_id){
                    setElementDocument(carousel, doc, "sidelist parent", folderData, true, folder_id);
                }else{
                    setElementDocument(carousel, doc, "", folderData, false);
                }
              
            });
            setElementBody(folderDataDetail[0], folderDataDetailById[0], fileDataByFolder);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        }
    });
}();

{/* <ul class="sidenav">
    <li title="Basic Startup" class="sidelist parent">
        <a href="list.html">Basic Startup</a>
            <ul>
            <li class="sidelist parent active">
              <a href="single.html">Elements</a>
            <li class="sidelist">
              <a href="single.html">Installation</a>
            <li class="sidelist">
              <a href="single.html">Configuration</a>
            <li class="sidelist">
              <a href="single.html">Customization</a>
            <li class="sidelist">
              <a href="single.html">Requerments</a>
            </li>
        </ul>
        </li>
</ul> */}

//  <h2 class="mb-4 font-weight-medium">Bài 2</h2>
//             <div class="content">

//               <!-- heading -->
//               <h4 id="heading-example">Tập 1</h4>
//               <p>Here is example of hedings. You can use this heading by following markdownify rules. For example: use
//               </p>
//               <hr>
//               <!-- emphasis -->
//               <h5 id="link">Link</h5>
//               <div class="body-link">
//                 <p><a href="https://www.google.com">I&rsquo;m an inline-style link</a></p>
//                 <embed src="https://drive.google.com/file/d/1VyvzIgyWSq-bG6gyP1CR-9OQ994Q94Wx/view?usp=sharing"
//                   width="100%" height="600px" type="application/pdf">
//                 <iframe src="https://drive.google.com/file/d/1VyvzIgyWSq-bG6gyP1CR-9OQ994Q94Wx/view?usp=sharing"
//                   width="100%" height="600px" allow="autoplay">
//                 </iframe>
//               </div>
//               <hr>

//               <!-- youtube video -->
//               <h5 id="youtube-video">Youtube video</h5>
//               <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
//                 <iframe src="https://www.youtube.com/embed/C0DPdy98e4c"
//                   style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border:0;" allowfullscreen
//                   title="YouTube Video"></iframe>
//               </div>
//             </div>