!function () {
	const urlParams = new URLSearchParams(window.location.search);
	const document_id = urlParams.get('document_id');
	const folder_id = urlParams.get('folder_id');
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

    async function fetchDataFileByFolder(folder_id, document_id) {
        const { data, error } = await supabase
            .from('file')
            .select('*')
            .eq('parent', folder_id).eq('document_id', document_id);
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
                        ${show ? `<ul>
                            ${data.map(folder => folder.parent == doc.id ? `
                                <li class="sidelist ${folderId == folder.chapterNumber ? "sidelist parent active" : "" }">
                                    <a href="single.html?document_id=${doc.id}&&folder_id=${folder.chapterNumber}">${folder.name}</a>
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
                <h3 id="heading-example" style="font-weight:500">${folderData.name}. ${documentData.name}</h3>
                <div class="content">
                    <p>${folderData.desc != null ? folderData.desc: '' }</p>
                    <hr>
                    ${fileData.length != 0 ? 
                        `<div class="body-link">
                            ${fileData.map((file,index) => `
                            <h6 style="${file.parent_file != null ? 
                                 `margin-left: ${file.parent_file.split(".").length * 20}px`: ``}" id="link">${file.chapterNumber}. ${file.name} ${file.numberChildFiles != null ? 
                                 ``: `<a href="${file.link}" style="font-size: 14px">xem</a>
                            `}</h6>
                                 `).join('')}
                        </div>
                    <hr>` : "" }
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
                fetchDataFileByFolder(folder_id,document_id),
                fetchDataFolderById(folder_id),
            ]);
            const carousel = document.querySelector('.sidenav')
            documentData.forEach(doc => {
                if(doc.id == document_id){
                    setElementDocument(carousel, doc, "sidelist parent", folderData, true, folder_id);
                }
            });
            setElementBody(folderDataDetail[0], folderDataDetailById[0], fileDataByFolder);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        }
    });
}();
