!function () {
    const supabaseUrl = 'https://ehtxrrxcaziwffiexzla.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVodHhycnhjYXppd2ZmaWV4emxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3MzQwNTksImV4cCI6MjA2NTMxMDA1OX0.o-Mp1UBGUL-2xExuYmjZ-ZxyXLtc82jQw7LUWwKKlUw';
    const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
    const urlParams = new URLSearchParams(window.location.search);
	const document_id = urlParams.get('document_id');
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
 
    function setElementNav(doc, className){
        const body = document.querySelector('.navbar-nav')
        const li = document.createElement('li');
              li.className = 'nav-item';
              li.innerHTML = `
                    <a class="nav-link ${className}" style="font-weight:500" href="list.html?document_id=${doc.id}">${doc.chapterNumber}</a>
        `;
                
        if ($(body).data('owl.navbar-nav')) {
            $(body).trigger('add.owl.navbar-nav', [li]).trigger('refresh.owl.navbar-nav');
        } else {
            body.appendChild(li);
        }
                
    }
    document.addEventListener('DOMContentLoaded', async function () {
           try {
            const [documentData] = await Promise.all([
                fetchDataDocument(),
            ]);
            
            documentData.forEach(doc => {
                if(doc.id == 1){
                    const body = document.querySelector('.navbar-nav')
                    const li = document.createElement('li');
                    li.className = 'nav-item';
                    li.innerHTML = `<a class="nav-link ${document_id == null ? "active" : ""}" style="font-weight:500" href="index.html">Giới thiệu</a></li>` 
                    body.appendChild(li);
                }
                setElementNav(doc, document_id == doc.id ? "active" : "" );
            });
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        }
    });
}();

