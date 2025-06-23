!function () {
	const urlParams = new URLSearchParams(window.location.search);
	const id = urlParams.get('document_id');
	console.log(id);
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
    function setElementDocument(carousel, doc, className, data, show){
        const li = document.createElement('li');
                li.title = `${name}`;
                li.className = className;
                li.innerHTML = `
                        <a href="list.html?document_id=${doc.id}">${doc.name}</a>
                        ${show ? `<ul>
                            ${data.map(folder => folder.parent == doc.id ? `
                                <li class="sidelist">
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
 
    function setElementBody(data){
        const body = document.querySelector('.body-description')
        const div = document.createElement('div');
              div.innerHTML = `
                    <h2 class="mb-4 font-weight-medium">${data.name}</h2>
                    <div class="content">
                    <p>${data.desc}</p>
                    `;
                
        if ($(body).data('owl.body-description')) {
            $(body).trigger('add.owl.body-description', [li]).trigger('refresh.owl.body-description');
        } else {
            body.appendChild(div);
        }
                
    }
    document.addEventListener('DOMContentLoaded', async function () {
           try {
            const [documentData, folderData, folderDataDetail] = await Promise.all([
                fetchDataDocument(),
                fetchDataFolder(),
                fetchDataDocumentById(id)
            ]);
            console.log("folderData", folderDataDetail);
            
            const carousel = document.querySelector('.sidenav')
            documentData.forEach(doc => {
                if(doc.id == id){
                    setElementDocument(carousel, doc, "sidelist parent active", folderData, true);
                }else{
                    setElementDocument(carousel, doc, "", folderData, false);
                }
              
            });
            setElementBody(folderDataDetail[0]);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        }
    });
}();

